"use client";
// Linrary imports
import { BsCheckLg, BsChevronDown } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
// Custom imports
import EscapeHandler from "@/app/hooks/useEscape";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { UserSettings } from "@/types";
import { FONT_SIZE } from "@/components/workspace/constants";

const EDITOR_FONT_SIZES = ['12px', '13px', '14px', '15px', '16px', '17px', '18px'];

type SettingsModalProps = {
    settings: UserSettings;
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

const SettingsModal:React.FC<SettingsModalProps> = ({settings, setSettings}) => {
    /** Remembers of the user selection for the font size */ 
    const [fontSize, setFontSize] = useLocalStorage(FONT_SIZE.key, FONT_SIZE.default);


    /** Handles the font selection dropdown menu when the user clicks on it */
    const handleClickDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Stop the event from propagating further up the tree
        // (i.e., prevent the event from being handled by the parent component)
        e.stopPropagation();
        setSettings({ ...settings, dropdownIsOpen: !settings.dropdownIsOpen });
    };
    
    /**
     * Closes the Settings Modal
     */
    const closeModal = () => {
        setSettings({ ...settings, modalIsOpen: false });
    }

    /**
     * Closes the Settings Modal when the user presses the ESC key
     */
    EscapeHandler(closeModal);

    return (
        <div className="text-white z-40">
          <div className="fixed inset-0 overflow-y-auto z-modal"
               aria-modal="true"
               role="dialog"
          >
            {/* Overlay at the center of the screen */}
            <div className="flex min-h-screen items-center justify-center px-4">
              <div className="opacity-100"
                   onClick={() => setSettings({ ...settings, modalIsOpen: false })}
              >
                {/* Tinted background */}
                <div className="fixed inset-0 bg-gray-8 opacity-60" />
              </div>

              <div className="my-8 inline-block min-w-full transform rounded-[13px] text-left
                              transition-all bg-overlay-3 md:min-w-[420px] shadow-level4 shadow-lg
                              p-0 bg-[rgb(40,40,40)] w-[600px] !overflow-visible opacity-100 scale-100">
                {/* Setting Header with close button */}
                <div className="flex items-center border-b px-5 py-4 text-lg font-medium border-dark-divider-border-2">
                  Settings
                  <button className="ml-auto cursor-pointer rounded transition-all"
                          onClick={() => setSettings({ ...settings, modalIsOpen: false })}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="px-6 pt-4 pb-6">
                  <div className="mt-6 flex justify-between first:mt-0">
                    <div className="w-[340px]">
                      <h3 className="text-base font-medium">
                        Font size
                      </h3>
                      <h3 className="text-label-3 mt-1.5">
                        Select font size for the code editor
                      </h3>
                    </div>

                    {/* Font Size Dropdown Menu */}
                    <div className="w-[170px]">
                      <div className="relative">
                        <button className="flex cursor-pointer items-center rounded px-3 py-1.5 text-left focus:outline-none whitespace-nowrap
                                           bg bg-dark-fill-3 hover:bg-dark-fill-2 active:bg-dark-fill-3 w-full justify-between"
                                type="button"
                                onClick={handleClickDropdown}
                        >
                          {fontSize}
                          <BsChevronDown />
                        </button>
                        
                        {/* Show Dropdown with font sizes */}
                        {settings.dropdownIsOpen && (
                          <ul className="absolute mt-1 max-h-56 overflow-auto rounded-lg p-2 z-50 focus:outline-none shadow-lg w-full bg-dark-layer-1"
                              style={{filter: "drop-shadow(rgba(0, 0, 0, 0.04) 0px 1px 3px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 6px 16px)" }}
                          >
                            {EDITOR_FONT_SIZES.map((fontSize, index) => (
                              <SettingsListItem key={index}
                                                fontSize={fontSize}
                                                selectedOption={settings.fontSize}
                                                handleFontSizeChange={(fontSize) => {
                                                  // Set the font size in the local storage
                                                  setFontSize(fontSize);
                                                  // Pass the new font size it back to the PrefrenceNavBar
                                                  // which is essentially passing it back to the Playground,
                                                  // which then passes the settings to the CodeMirror to
                                                  // reflect the new font size
                                                  setSettings({ ...settings,
                                                               fontSize: fontSize,
                                                               dropdownIsOpen: false });
                                                }}
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}
export default SettingsModal;


// --------------------------------------- //
//   S E T T I N G S   L I S T   I T E M   //
// --------------------------------------- //
type SettingsListItemProps = {
    fontSize: string;
    selectedOption: string;
    handleFontSizeChange: (fontSize: string) => void;
};

const SettingsListItem: React.FC<SettingsListItemProps> = ({ fontSize,
                                                             selectedOption,
                                                             handleFontSizeChange }) => {
    return (
        <li className="relative flex h-8 cursor-pointer select-none py-1.5 pl-2 
                       text-label-2 dark:text-dark-label-2 hover:bg-dark-fill-3 rounded-lg">
          <div className={`flex h-5 flex-1 items-center pr-2 ${selectedOption === fontSize ? "font-medium" : ""}`}
               // Every time we select a new font size call handleFontSizeChange()
               // to make the editor use immediately the new font size
               onClick={() => handleFontSizeChange(fontSize)}
          >
            <div className="whitespace-nowrap">{fontSize}</div>
          </div>
          <span className={`text-blue dark:text-dark-blue flex items-center pr-2
                            ${selectedOption === fontSize ? "visible" : "invisible" }`}
          >
            <BsCheckLg />
          </span>
        </li>
    );
};

