// Custom imports
import { EditorTheme, ProgrammingLanguage, ThemeMap } from "@/types";

// ---------------------------------------------------//
//   E D I T O R - R E L A T E D  C O N S T A N T S   //
// ---------------------------------------------------//
/** The Rapid API host to submit the code to compile and execute */
export const REACT_APP_RAPID_API_HOST = "judge0-ce.p.rapidapi.com"
/** The Rapid API URL to submit the code to compile and execute */
export const REACT_APP_RAPID_API_URL = "https://judge0-ce.p.rapidapi.com/submissions"

/**
 * The font size key-value pair that is used in the local storage to
 * remember the user selection
 */
export const FONT_SIZE = { key: 'editor-font-size', default: '16px' }
/**
 * The editor theme key-value pair that is used in the local storage to
 * remember the user selection
 */
export const LANGUAGE_ID = { key: 'language-id', default: '71' }

/**
 * The default editor theme
 */
export const DEFAULT_EDITOR_THEME: EditorTheme = {
  value: 'oceanic-next', 
  label: 'Oceanic Next'
}

/**
 * The editor theme key-value pair that is used in the local storage to
 * remember the user selection
 */
export const EDITOR_THEME = { key: 'editor-theme', default: DEFAULT_EDITOR_THEME.value }

/**
 * The programming languages that are supported by the editor
 */
export const PROGRAMMING_LANGUAGES:ProgrammingLanguage[] = [
    {
      id: 71,
      name: "Python (3.8.1)",
      label: "Python",
      value: "python",
    },  
    {
      id: 63,
      name: "JavaScript (Node.js 12.14.0)",
      label: "JavaScript",
      value: "javascript",
    },
    {
      id: 62,
      name: "Java (OpenJDK 13.0.1)",
      label: "Java",
      value: "java",
    },    
    {
      id: 54,
      name: "C++ (GCC 9.2.0)",
      label: "C++",
      value: "cpp",
    },  
    {
      id: 50,
      name: "C (GCC 9.2.0)",
      label: "C",
      value: "c",
    },
    {
      id: 79,
      name: "Objective-C (Clang 7.0.1)",
      label: "Objective-C",
      value: "objectivec",
    },
    {
      id: 51,
      name: "C# (Mono 6.6.0.161)",
      label: "C#",
      value: "csharp",
    },
    {
      id: 74,
      name: "TypeScript (3.7.4)",
      label: "TypeScript",
      value: "typescript",
    },
    {
      id: 85,
      name: "Perl (5.28.1)",
      label: "Perl",
      value: "perl",
    },
    /*
    {
      id: 45,
      name: "Assembly (NASM 2.14.02)",
      label: "Assembly (NASM)",
      value: "assembly",
    },
    {
      id: 46,
      name: "Bash (5.0.0)",
      label: "Bash",
      value: "bash",
    },
    {
      id: 47,
      name: "Basic (FBC 1.07.1)",
      label: "Basic",
      value: "basic",
    },
    {
      id: 75,
      name: "C (Clang 7.0.1)",
      label: "C (Clang 7.0.1)",
      value: "c",
    },
    {
      id: 76,
      name: "C++ (Clang 7.0.1)",
      label: "C++ (Clang 7.0.1)",
      value: "cpp",
    },
    {
      id: 48,
      name: "C (GCC 7.4.0)",
      label: "C (GCC 7.4.0)",
      value: "c",
    },
    {
      id: 52,
      name: "C++ (GCC 7.4.0)",
      label: "C++ (GCC 7.4.0)",
      value: "cpp",
    },
    {
      id: 49,
      name: "C (GCC 8.3.0)",
      label: "C (GCC 8.3.0)",
      value: "c",
    },
    {
      id: 53,
      name: "C++ (GCC 8.3.0)",
      label: "C++ (GCC 8.3.0)",
      value: "cpp",
    },
    {
      id: 86,
      name: "Clojure (1.10.1)",
      label: "Clojure",
      value: "clojure",
    },
    {
      id: 77,
      name: "COBOL (GnuCOBOL 2.2)",
      label: "COBOL",
      value: "cobol",
    },
    {
      id: 55,
      name: "Common Lisp (SBCL 2.0.0)",
      label: "Lisp",
      value: "lisp",
    },
    {
      id: 56,
      name: "D (DMD 2.089.1)",
      label: "D",
      value: "d",
    },
    {
      id: 57,
      name: "Elixir (1.9.4)",
      label: "Elixir",
      value: "elixir",
    },
    {
      id: 58,
      name: "Erlang (OTP 22.2)",
      label: "Erlang",
      value: "erlang",
    },
    {
      id: 44,
      label: "Executable",
      name: "Executable",
      value: "exe",
    },
    {
      id: 87,
      name: "F# (.NET Core SDK 3.1.202)",
      label: "F#",
      value: "fsharp",
    },
    {
      id: 59,
      name: "Fortran (GFortran 9.2.0)",
      label: "Fortran",
      value: "fortran",
    },
    {
      id: 60,
      name: "Go (1.13.5)",
      label: "Go",
      value: "go",
    },
    {
      id: 88,
      name: "Groovy (3.0.3)",
      label: "Groovy",
      value: "groovy",
    },
    {
      id: 61,
      name: "Haskell (GHC 8.8.1)",
      label: "Haskell",
      value: "haskell",
    },
    {
      id: 78,
      name: "Kotlin (1.3.70)",
      label: "Kotlin",
      value: "kotlin",
    },
    {
      id: 64,
      name: "Lua (5.3.5)",
      label: "Lua",
      value: "lua",
    },
    {
      id: 65,
      name: "OCaml (4.09.0)",
      label: "OCaml (4.09.0)",
      value: "ocaml",
    },
    {
      id: 66,
      name: "Octave (5.1.0)",
      label: "Octave",
      value: "octave",
    },
    {
      id: 67,
      name: "Pascal (FPC 3.0.4)",
      label: "Pascal",
      value: "pascal",
    },
    {
      id: 68,
      name: "PHP (7.4.1)",
      label: "PHP",
      value: "php",
    },
    {
      id: 43,
      label: "Plain Text",
      name: "Plain Text",
      value: "text",
    },
    {
      id: 69,
      name: "Prolog (GNU Prolog 1.4.5)",
      label: "Prolog",
      value: "prolog",
    },
    {
      id: 70,
      name: "Python (2.7.17)",
      label: "Python (2.7.17)",
      value: "python",
    },
    {
      id: 80,
      name: "R (4.0.0)",
      label: "R ",
      value: "r",
    },
    {
      id: 72,
      name: "Ruby (2.7.0)",
      label: "Ruby",
      value: "ruby",
    },
    {
      id: 73,
      name: "Rust (1.40.0)",
      label: "Rust",
      value: "rust",
    },
    {
      id: 81,
      name: "Scala (2.13.2)",
      label: "Scala",
      value: "scala",
    },
    {
      id: 82,
      name: "SQL (SQLite 3.27.2)",
      label: "SQL",
      value: "sql",
    },
    {
      id: 83,
      name: "Swift (5.2.3)",
      label: "Swift",
      value: "swift",
    },

    {
      id: 84,
      name: "Visual Basic.Net (vbnc 0.0.0.5943)",
      label: "Visual Basic.Net (vbnc 0.0.0.5943)",
      value: "vbnet",
    },
    */
];

// -------------------------------------------//
//   M O N A C O - E D I T O R  T H E M E S   //
// -------------------------------------------//
/**
 * The available editor themes
 */
export const MONACO_THEME_MAP: ThemeMap = {
    active4d                  : "Active4D",
    "all-hallows-eve"         : "All Hallows Eve",
    amy                       : "Amy",
    "birds-of-paradise"       : "Birds of Paradise",
    blackboard                : "Blackboard",
    "brilliance-black"        : "Brilliance Black",
    "brilliance-dull"         : "Brilliance Dull",
    "chrome-devtools"         : "Chrome DevTools",
    "clouds-midnight"         : "Clouds Midnight",
    clouds                    : "Clouds",
    cobalt                    : "Cobalt",
    dawn                      : "Dawn",
    dreamweaver               : "Dreamweaver",
    eiffel                    : "Eiffel",
    "espresso-libre"          : "Espresso Libre",
    github                    : "GitHub",
    idle                      : "IDLE",
    katzenmilch               : "Katzenmilch",
    "kuroir-theme"            : "Kuroir Theme",
    lazy                      : "LAZY",
    "magicwb--amiga-"         : "MagicWB (Amiga)",
    "merbivore-soft"          : "Merbivore Soft",
    merbivore                 : "Merbivore",
    "monokai-bright"          : "Monokai Bright",
    monokai                   : "Monokai",
    "night-owl"               : "Night Owl",
    "oceanic-next"            : "Oceanic Next",
    "pastels-on-dark"         : "Pastels on Dark",
    "slush-and-poppies"       : "Slush and Poppies",
    "solarized-dark"          : "Solarized-dark",
    "solarized-light"         : "Solarized-light",
    spacecadet                : "SpaceCadet",
    sunburst                  : "Sunburst",
    "textmate--mac-classic-"  : "Textmate (Mac Classic)",
    "tomorrow-night-blue"     : "Tomorrow-Night-Blue",
    "tomorrow-night-bright"   : "Tomorrow-Night-Bright",
    "tomorrow-night-eighties" : "Tomorrow-Night-Eighties",
    "tomorrow-night"          : "Tomorrow-Night",
    tomorrow                  : "Tomorrow",
    twilight                  : "Twilight",
    "upstream-sunburst"       : "Upstream Sunburst",
    "vibrant-ink"             : "Vibrant Ink",
    "xcode-default"           : "Xcode_default",
    zenburnesque              : "Zenburnesque",
    iplastic                  : "iPlastic",
    idlefingers               : "idleFingers",
    krtheme                   : "krTheme",
    monoindustrial            : "monoindustrial",
};

/** The server response status values after the code is submitted for execution */
export const RESPONSE_STATUS_VALUES = [
  {
    id: 1,
    description: "In Queue",
  },
  {
    id: 2,
    description: "Processing",
  },
  {
    id: 3,
    description: "Accepted",
  },
  {
    id: 4,
    description: "Wrong Answer",
  },
  {
    id: 5,
    description: "Time Limit Exceeded",
  },
  {
    id: 6,
    description: "Compilation Error",
  },
  {
    id: 7,
    description: "Runtime Error (SIGSEGV)",
  },
  {
    id: 8,
    description: "Runtime Error (SIGXFSZ)",
  },
  {
    id: 9,
    description: "Runtime Error (SIGFPE)",
  },
  {
    id: 10,
    description: "Runtime Error (SIGABRT)",
  },
  {
    id: 11,
    description: "Runtime Error (NZEC)",
  },
  {
    id: 12,
    description: "Runtime Error (Other)",
  },
  {
    id: 13,
    description: "Internal Error",
  },
  {
    id: 14,
    description: "Exec Format Error",
  },
];

  
