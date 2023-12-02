"use client";
// Library imports
import axios from 'axios';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { loader } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
// Custom imports
import PreferenceNavBar from "@/components/workspace/PreferenceNavBar";
import EditorFooter from "@/components/workspace/EditorFooter";
import TextCopyButton from "@/components/TextCopyButton";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { validateFunction } from "@/util/FunctionValidator";
import { showError, showSuccess } from "@/util/UIUtil";
import { SET_ATTEMPTED_PROBLEM_URL } from "@/constants";
import { DBUser, EditorTheme, LocalProblem, OutputInfo, ProgrammingLanguage, UserSettings } from "@/types";
import { DEFAULT_EDITOR_THEME,
         EDITOR_THEME,
         FONT_SIZE,
         LANGUAGE_ID,
         MONACO_THEME_MAP,
         PROGRAMMING_LANGUAGES,
         REACT_APP_RAPID_API_HOST,
         REACT_APP_RAPID_API_URL } from "@/components/workspace/constants";

type PlaygroundProps = {
    user: DBUser | null;
    localProblem: LocalProblem;
    savedCode: string | null; // Saved code from past attempted problem
    rapidApiKey: string | null;
    setConfetti: React.Dispatch<React.SetStateAction<boolean>>;
    setCorrect: React.Dispatch<React.SetStateAction<boolean>>;
};


const Playground:React.FC<PlaygroundProps> = ({user,
                                               localProblem,
                                               savedCode,
                                               rapidApiKey,
                                               setConfetti,
                                               setCorrect}) => {
    // Keep track of the test case that the user has selected
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
    // Keep track of the execution output
    const [outputInfo, setOutputInfo] = useState<OutputInfo | null>(null);
    /** Remembers of the user selection for the font size */
    const [fontSize] = useLocalStorage(FONT_SIZE.key, FONT_SIZE.default);
    /** Remembers of the user selection for the programming language */
    const [languageId, setLanguageId] = useLocalStorage(LANGUAGE_ID.key, LANGUAGE_ID.default);
    /** Remembers of the user selection for the editor theme */
    const [editorTheme, setEditorTheme] = useLocalStorage(EDITOR_THEME.key, EDITOR_THEME.default);
    /** Saves the user settings */
    const [settings, setSettings] = useState<UserSettings>( {
        modalIsOpen: false,
        dropdownIsOpen: false,
        fontSize: fontSize,
        language: getLanguageById(parseInt(languageId)),
        editorTheme: editorTheme
    });

    // Need a reference to get the source code editor
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    // Need a reference to the web worker (needed to terminate it in case of timeout)
    const workerRef = useRef<Worker>(null);
    // Keep track of the code processing (compile + run) task
    const [processing, setProcessing] = useState<boolean>(false);

    /**
     * Checks if the theme is light or dark. These themes are by default
     * available on the MonacoEditor component. Otherwise, it calls the
     * defineTheme() component and set the selected theme state.
     * 
     * @param selectedTheme The selected theme
     */
    function setTheme(theme: EditorTheme) {
        if (["light", "vs-dark"].includes(theme.value)) {
            setEditorTheme(theme);
        }
        else {
            defineTheme(theme.value).then((_) => setEditorTheme(theme));
        }
    }

    /** 
     * @return the user code from the editor
     */
    function getUserCode() {
        let userCode = editorRef.current?.getValue() ?? ""
        return userCode;
    }

    /**
     * Handles the code compilation and execution of the code
     * by calling the Judge0 RapidAPI.
     * 
     * @param userInput The user input or an empty string if
     *                  there is no user input
     */
    async function executeCode(userInput:string) {
        if (!rapidApiKey) {
            showError('Internal Error: No Rapid API key');
            return;
        }

        setProcessing(true); // Just started processing
        let userCode = getUserCode();

        const options = {
            method: 'POST',
            url: REACT_APP_RAPID_API_URL,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
                "X-RapidAPI-Key": rapidApiKey
            },
            data: {
                language_id: settings.language?.id,
                source_code: btoa(userCode),
                stdin: btoa(userInput)
            }
        };
      
        try {
            const response = await axios.request(options);
            await checkStatus(response.data.token);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setProcessing(false);
        }
    };

    /**
     * Given the response token after we recieve the response from the server,
     * it checks the status to find the outcome of the operation.
     * 
     * @param token The server response token
     */
    const checkStatus = async (token: string) => {
        const statusURL = REACT_APP_RAPID_API_URL + '/' + token;
        const options = {
            method: "GET",
            url: statusURL,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
                "X-RapidAPI-Key": rapidApiKey,
            },
        };
        
        try {
            let response = await axios.request(options);
            let statusId = response.data.status?.id;
            
            if (statusId === 1 || statusId === 2) {
                // Either 'In Queue' (id=1) or 'Processing' (id=2)
                setTimeout(() => {
                    checkStatus(token);
                }, 2000) // Check again after 2 seconds
            }
            else { // We heard back from the server
                setOutputInfo(response.data);
                //showSuccess('Compiled Successfully');
                setProcessing(false);
            }
        }
        catch (error: any) {
            const errorMsg = error.message ?? error;
            showError(errorMsg);
            setProcessing(false);
        }
    };

    /**
     * Called whenever the user wants to save or submit the code
     * 
     * @param submit {@code true} if the user submits the code or
     *               {@code false} just to save the code without
     *               submitting it
     */
    async function saveSubmitCode(submit: boolean) {
        let userCode = getUserCode();
        
        let correct = false;
        if (submit) {
            // The following works for Javascript programming language
            const startIndex = userCode.indexOf(localProblem.starterFunctionName);
            if (startIndex === -1) { // The expected function name is missing
                showError(localProblem.starterFunctionName + "... is missing");
            }
            userCode = userCode.substring(startIndex);
            
            const serializedValidatorFunction = localProblem.handlerFunction.toString();
            
            try {
                await validateFunction(workerRef, 
                                       serializedValidatorFunction,
                                       userCode);
                showSuccess("All tests passed!");
                setConfetti(true);
                correct = true;
                
                // The following line gives an error (NextJS will probably fix this in the future)
                // Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.
                //addAttemptedProblem(user!, localProblem.problem_id, userCode, true);
                // Alternative way to do this:
                
                setTimeout(function () {
                    setConfetti(false); // Stop throwing the confetti after 5 seconds
                }, 5000);
            }
            catch (error: any) { // Either incorrect code or unknown error
                showError(error.toString());
                
                // The following line gives an error (NextJS will probably fix this in the future)
                // Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.
                //addAttemptedProblem(user!, localProblem.problem_id, userCode, false);
            }
        }

        try {
            const response = await fetch(SET_ATTEMPTED_PROBLEM_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    problem_id: localProblem.problem_id,
                    email: user!.email,
                    code: userCode,
                    correct: correct 
                }),
            });
    
            if (response.ok) {
                 // Set the checkmart immediately to reflect the DB value
                 // without having to refresh the page
                 setCorrect(correct);
            }
            else {
                const errorMessage = await response.text();
                console.log(errorMessage);
            }
        }
        catch (error) {
            console.log("Internal error", error);
        }
    };

    // Set the saved theme when the page loads (or the default if it loads for the fitst time)
    useEffect(() => {
        
        if (!settings.editorTheme?.value || !settings.editorTheme?.label) {
            setSettings({ ...settings, editorTheme: DEFAULT_EDITOR_THEME});
            setTheme(DEFAULT_EDITOR_THEME);
        }
        else {
            setTheme(settings.editorTheme);
        }
    }, [setTheme, settings]);

    return (
      <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
        <PreferenceNavBar settings={settings}
                          setSettings={setSettings}
                          setTheme={setTheme} />

        <Split className="h-[calc(100vh-94px)]"
               direction="vertical"
               sizes={[60, 40]}
               minSize={60}>
          
          {/*   T o p   s i d e :   C o d e   E d i t o r   */}
          <div className="w-full overflow-auto">
            <Editor height="90vh"
                    width={"100%"}
                    defaultValue={savedCode? savedCode : localProblem.starterCode}
                    language={settings.language?.value}
                    options={{
                      fontSize: parseInt(settings.fontSize),
                    }}
                    theme={editorTheme.value}
                    onMount={(editor) => {
                        editorRef.current = editor;
                    }}
            />

            <TextCopyButton getText={() => getUserCode()}
                            className= "absolute top-12 right-7"
            />
          </div>
          
          {/*   B o t t o m   s i d e :   T e s t   C a s e s   */}
          <div className="w-full px-5 overflow-auto">
            <div className="flex h-10 items-center space-x-6">
              <div className="relative flex h-full flex-col justify-center cursor-pointer">
                <div className="text-sm font-medium leading-5 text-white">
                  Test Cases
                </div>
                <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white"/>
              </div>
            </div>

            {/*   T e s t   C a s e s   ( Note: each example serves as a test case) */}
            <div className="flex">
              {localProblem.examples.map((example, index) => (
                <div className="mr-2 items-start mt-2"
                     key={example.id}
                     onClick={() => setActiveTestCaseId(index)}
                >
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 
                                     hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                     ${activeTestCaseId === index ? 'text-white' : 'text-gray-500'}`}
                    >
                      Case {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/*   I n p u t  /  O u t p u t   */}
            <div className="font-semibold my-4">
              <p className="text-sm font-medium mt-4 text-white">Input:</p>
              <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                {localProblem.examples[activeTestCaseId].inputText}
              </div>
              <p className="text-sm font-medium mt-4 text-white">Output:</p>
              <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                {localProblem.examples[activeTestCaseId].outputText}
              </div>
            </div>
          </div>
        </Split>
        <EditorFooter outputInfo={outputInfo}
                      executeCode={executeCode}
                      saveSubmitCode={saveSubmitCode} />
      </div>
    );
}
export default Playground;

// -------------------------------------------------------- //
//      H  E  L  P  E  R     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Given a language ID it returns the value for that language.
 * It does so by searching for the language with that ID in the
 * PROGRAMMING_LANGUAGES and then returning its value.
 * 
 * @param id The ID of the language to retrieve the value for
 * 
 * @returns the value for that language
 */
function getLanguageById(id: number): ProgrammingLanguage {
    const language = PROGRAMMING_LANGUAGES.find(lang => lang.id === id);
    if (language) {
        return language;
    }
    else {
        throw new Error(`Programming language with id ${id} not found`);
    }
}

/**
 * Sets the editor theme that matches the given name.
 * 
 * @param theme The theme name
 */
function defineTheme(theme: string): Promise<void> {
    return new Promise((resolve) => {
        Promise.all([
            loader.init(),
            import(`monaco-themes/themes/${MONACO_THEME_MAP[theme]}.json`),
        ]).then(([monaco, themeData]) => {
            // The following line of code is responsible for actually
            // changing the themes inside a Monaco Editor
            monaco.editor.defineTheme(theme, themeData);
            resolve();
        });
    });
};