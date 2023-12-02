"use client";
// Library imports
import Split from 'react-split';
import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
// Custom imports
import TextCopyButton from "@/components/TextCopyButton";
import { OutputInfo } from "@/types";

type EditorFooterProps = {
    outputInfo: OutputInfo | null;
    executeCode(userInput: string): void;
    saveSubmitCode(submit: boolean): void;
};

const EditorFooter:React.FC<EditorFooterProps> = ({ outputInfo,
                                                    executeCode,
                                                    saveSubmitCode }) => {
    // Keeps track of the console visibility state (i.e., visible or hidden)
    const [consoleVisible, setConsoleVisible] = useState(false);
    /** The label for the button to execute the code */
    const [runButtonLabel, setRunButtonLabel] = useState('Run');
    /** The label for the button to save the code */
    const [saveButtonLabel, setSaveButtonLabel] = useState('Save');
    /** The label for the button to validate the code */
    const [submitButtonLabel, setSubmitButtonLabel] = useState('Submit');
    /** {@code true} to disable the buttons or {@code false} to enable them */
    const [disabled, setDisabled] = useState(false);

    /** Returns the text in the output console */
    function getConsoleOutputText() {
        const textarea = document.getElementById('consoleOutput') as HTMLTextAreaElement;
        return textarea.value;
    }
    
    /**
     * Captures the user input and submits the code for compilation and execution
     */
    const handleCodeExecution = async () => {
        // Do not accept another run till we hear from the server
        if (disabled) {
            return;
        }

        setDisabled(true);
        setRunButtonLabel("Running...");
        const textarea = document.getElementById('consoleInput') as HTMLTextAreaElement;
        const userInput = textarea?.value ?? '';

        try {
            // The await is needed to show 'Running' as
            // the button label while the code executs
            await executeCode(userInput);
        }
        finally {
            // Now allow another run
            setRunButtonLabel("Run");
            setDisabled(false);
          }
    }


    const handleSaveSubmit = async (submit: boolean) => {
        // Do not accept another submission till we hear from the server
        if (disabled) {
            return;
        }

        setDisabled(true);
        submit ? setSubmitButtonLabel('Submitting...') : setSaveButtonLabel('Saving...');

        try {
            // The await is needed to show 'Submiting...'/'Saving...'
            // as the button label while the code executs
            await saveSubmitCode(submit);
        }
        finally {
            // Now can accept another submission
            submit ? setSubmitButtonLabel('Submit') : setSaveButtonLabel('Save');
            setDisabled(false);
        }
    }

    /**
     * Processes the output information and returns the text to display
     * in the output console.
     * 
     * @return the text to display in the output console
     */
    function getOutputText():string {
      if (!outputInfo) {
          return '';
      }

      const statusId = outputInfo?.status?.id;
  
      if (statusId === 6) { // Compilation Error
          return atob(outputInfo!.compile_output);
      }
      if (statusId === 3) { // Accepted (i.e., success)
          return atob(outputInfo!.stdout) !== null ? atob(outputInfo!.stdout) : ''
      }
      if (statusId === 5) { // Time Limit Exceeded
          return 'Time Limit Exceeded';
      }
      // In any other case return the error
      return atob(outputInfo!.stderr)
  };    

    return (
      <div className="flex bg-dark-layer-1 absolute bottom-0 z-10 w-full">
        <div className="mx-5 justify-between w-full">
          {/*     B   U   T   T   O   N   S     */}
          <div className="flex justify-between w-full">
            <div className="mr-2 flex flex-1 flex-nowrap items-center space-x-4">
              <button className="px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2">
                Console
                <div className="ml-1 transform transition flex items-center">
                  {!consoleVisible &&
                     <BsChevronUp className="fill-gray-6 mx-1 fill-dark-gray-6"
                                  onClick={() => setConsoleVisible(true)}
                     />
                  }
                  {consoleVisible &&
                     <BsChevronDown className="fill-gray-6 mx-1 fill-dark-gray-6"
                                    onClick={() => setConsoleVisible(false)}
                     />
                  }
                </div>
              </button>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              {consoleVisible &&
                 <button className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg"
                         onClick={handleCodeExecution}
                 >
                   {runButtonLabel}
                 </button>
              }
              <button className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg"
                      onClick={() => handleSaveSubmit(false)}
              >
                {saveButtonLabel}
              </button>
              <button className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg"
                      onClick={() => handleSaveSubmit(true)}
              >
                {submitButtonLabel}
              </button>
            </div>
          </div>
          {/*     C   O   N   S   O   L   E     */}
          {consoleVisible &&
             <Split className="split"
                    direction="horizontal" // Vertical bar that splits horizontally
                    sizes={[60, 40]}
                    minSize={0}>
               {/*   L e f t   s i d e :   C o d e   E d i t o r   */}
               <div className="flex justify-between w-full">
                 <textarea id="consoleOutput"
                           className="w-full h-40 mt-2 mb-2 bg-dark-fill-3 text-white rounded overflow-auto"
                           value={getOutputText()}
                           placeholder='Program Output'
                           readOnly
                         
                 />
                 <TextCopyButton getText={() => getConsoleOutputText()}
                                 className="relative top-5 right-7 hover:scale-100"
                 />
              </div>
               {/*   T o p   s i d e :   C o d e   E d i t o r   */}
               <div className="flex justify-between w-full">
                 <textarea id="consoleInput"
                           className="w-full h-40 mt-2 mb-2 bg-dark-fill-3 text-white rounded overflow-auto"
                           placeholder='User Input'
                 />
              </div>
            </Split>
          }
        </div>
      </div>
    );
}
export default EditorFooter;