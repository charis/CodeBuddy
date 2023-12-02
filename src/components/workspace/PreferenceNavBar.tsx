"use client";
// Library imports
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';
// Custom imports
import SettingsModal from "@/components/modal/SettingsModal";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { selectionMenuStyles } from "@/styles/selectionMenuStyles";
import { EditorTheme, ProgrammingLanguage, UserSettings } from "@/types";
import { EDITOR_THEME, DEFAULT_EDITOR_THEME, LANGUAGE_ID, MONACO_THEME_MAP, PROGRAMMING_LANGUAGES } from "@/components/workspace/constants";

type PreferenceNavBarProps = {
    settings: UserSettings;
    setSettings: Dispatch<SetStateAction<UserSettings>>;
    setTheme: (theme: EditorTheme) => void;
};

const PreferenceNavBar:React.FC<PreferenceNavBarProps> = ({ settings,
                                                            setSettings,
                                                            setTheme
                                                         }) => {
    /** Keep track if we are in full screen mode or not */
    const [isFullScreen, setIsFullScreen] = useState(false);
    /** Remembers of the user selection for the programming language */
    const [languageId, setLanguageId] = useLocalStorage(LANGUAGE_ID.key, LANGUAGE_ID.default);
    /** Remembers of the user selection for the editor theme */
    const [editorTheme, setEditorTheme] = useLocalStorage(EDITOR_THEME.key, EDITOR_THEME.default);

    const editorThemes: EditorTheme[] = Object.entries(MONACO_THEME_MAP).map(
        ([themeKey, themeName]) => ({
            value: themeKey,
            label: themeName
        })
    );

    /** Show full screen */
    const handleFullScreen = () => {
        if (isFullScreen) {
            document.exitFullscreen();
        }
        else {
            document.documentElement.requestFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };
    
    /** Update the isFullScreen if we exit full screen via 'Esc' */
    useEffect(() => {
        function exitHandler(e: any) {
            if (!document.fullscreenElement) {
                setIsFullScreen(false);
                return;
            }
            setIsFullScreen(true);
        }

        document.addEventListener("fullscreenchange", exitHandler);
        document.addEventListener("webkitfullscreenchange", exitHandler);
        document.addEventListener("mozfullscreenchange", exitHandler);
        document.addEventListener("msfullscreenchange", exitHandler);
    }, [isFullScreen]);

    /** Called every time the user selects a programming language from the dropdown menu */
    const handleLanguageSelection = (selectedLanguage: SingleValue<ProgrammingLanguage>) => {
        if (selectedLanguage) {
            setLanguageId(selectedLanguage.id.toString());
            setSettings({ ...settings,
                          language: selectedLanguage});
        }
    }

    /** Called every time the user selects an editor theme from the dropdown menu */
    function handleThemeSelection(selectedTheme: SingleValue<EditorTheme>) {
        if (selectedTheme) {
            setEditorTheme(selectedTheme.value);
            setTheme(selectedTheme);
            setSettings({ ...settings,
                          editorTheme: selectedTheme});
        }
    }

    return (
      <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full">
        <div className="flex items-center px-1">
          {/*   P r o g r a m m i n g   L a n g u a g e   D r o p d o w n   M e n u   */}
          <div title="Programming language">
            <Select placeholder={'Select language'}
                    options={PROGRAMMING_LANGUAGES}
                    styles={selectionMenuStyles}
                    defaultValue={settings.language}                    
                    onChange={handleLanguageSelection}
            />
          </div>

          {/*   E d i t o r    T h e m e   D r o p d o w n   M e n u   */}
          <div title="Editor theme">
            <Select placeholder={'Select theme'}
                    options={editorThemes}
                    styles={selectionMenuStyles}
                    defaultValue={editorTheme.label? editorTheme : DEFAULT_EDITOR_THEME}
                    onChange={handleThemeSelection}
            />
          </div>
        </div>


        <div className="flex items-center m-2">
          {/*   S e t t i n g s   B u t t o n   */}
          <button className="preferenceButton group"
                  onClick={() => setSettings({ ...settings, modalIsOpen:true })}
          >
            <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
              <AiOutlineSetting />
            </div>
            <div className="preferenceButton-tooltip">
              Settings
            </div>
          </button>
            
          {/*   F u l l - S c r e e n   B u t t o n   */}
          <button className="preferenceButton group"
                  onClick={handleFullScreen}
          >
            <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
              {!isFullScreen ?  <AiOutlineFullscreen /> : <AiOutlineFullscreenExit /> }
            </div>
            <div className="preferenceButton-tooltip">
              Full Screen
            </div>
          </button>
        </div>
        {settings.modalIsOpen && <SettingsModal settings={settings} setSettings={setSettings}/>}
      </div>
    );
}
export default PreferenceNavBar;