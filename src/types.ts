// Library imports
import { z } from 'zod';
// Custom imports
import { ChatMessageSchema } from "@/app/lib/zod_schemas";

// ------------------------------------- //
//   A U T H    M O D A L    S T A T E   //
// ------------------------------------- //
/**
 * The state for the authentication modal dialog
 */
export type AuthModalState = {
    isOpen: boolean;
    type: 'login' | 'signup' | 'forgotPassword';
};

// ----------------- //
//   E X A M P L E   //
// ----------------- //
/**
 * The example structure in the .ts files under '@/local-data/problems'
 */
export type Example = {
    id: number;
    inputText: string;
    outputText: string;
    explanation: string | null;
    image_explanation?: string;
};

// ----------------- //
//   P R O B L E M   //
// ----------------- //
/**
 * The problem structure in the .ts files under '@/local-data/problems'
 */
export type LocalProblem = {
    problem_id: string;
    problemStatement: string;
    examples: Example[];
    constraints: string;
    starterCode: string;
    handlerFunction: ((fn: any) => boolean);
    starterFunctionName: string;
};

// ----------------------------- //
//   U S E R   S E T T I N G S   //
// ----------------------------- //
/**
 * The user settings and the state of the modal and the
 * dropdown menu.
 */
export type UserSettings = {
    modalIsOpen: boolean;
    dropdownIsOpen: boolean;
    fontSize: string;
    language: ProgrammingLanguage;
    editorTheme: EditorTheme;
};

// ================== //
//   C H A T   G P T  //
// ================== //
/**
 * Message used in ChatGTP interaction (i.e., user message or
 * chatbot response).
 */
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * The ChatGPT agent can be either the user or the bot.
 */
export type ChatGPTAgent = 'user' | 'system';

/**
 * The format of the OpenAI ChatGPT messages
 */
export type ChatGPTMessage = {
    role: ChatGPTAgent,
    content: string
}

/**
 * The stream payload sent to OpenAI
 */
export type OpenAIStreamPayload = {
    model: string,
    messages: ChatGPTMessage[],
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number,
    max_tokens: number,
    stream: boolean,
    n: number
}

/**
 * The type of the message context
 */
export type MessageContextType = {
    messages: ChatMessage[],
    addMessage: (message: ChatMessage) => void, // To add a new message
    removeMessage: (id: string) => void, // To remove a message in case something goes wrong
    updateMessage: (id: string, updateFn: (prevText: string) => string) => void,
    isMessageUpdating: boolean, // true while we are receiving message chunks
    setIsMessageUpdating: (isUpdating: boolean) => void
}

// ------------------------------------------- //
//   P R O G R A M M I N G   L A N G U A G E   //
// ------------------------------------------- //
/**
 * The programming language to write code.
 */
export type ProgrammingLanguage = {
    id: number;
    name: string;
    label: string;
    value: string;
};

// --------------------------- //
//   M O N A C O   T H E M E   //
// --------------------------- //
/**
 * Monaco Theme lookup map type
 */
export type ThemeMap = {
    [key: string]: string;

}
// --------------------------- //
//   E D I T O R   T H E M E   //
// --------------------------- //
/**
 * The entry type in the lookup table with the editor themes.
 * For example, the first entry in the MONACO_THEME_MAP is active4d: "Active4D",
 * which means that the value is active4d and the label is "Active4D").
 */
export type EditorTheme = {
    value: string;
    label: string;
}

// ------------------------- //
//   O U T P U T   I N F O   //
// ------------------------- //
/**
 * Information about the execution output
 */
export type OutputInfo = {
    status?: {
        id: number;
        description: string;
    };
    compile_output: string;
    memory: string;
    time: string;
    stdout: string;
    stderr: string;
}

// ===================================== //
//     D   A   T   A   B   A   S   E     //
// ===================================== //
/**
 * User as stored in the database.
 */
export type DBUser = {
    email: string;
    name: string;
    isVerified: boolean;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    attemptedProblems: DBAttemptedProblem[];
}

/**
 * Problem as stored in the database.
 */
export interface DBProblem {
    problem_id: string;
    title: string;
    category: string;
    difficulty: string;
    order: number;
    videoId: string | null; // YouTube video URL
    link?: string; // External link to the problemd
};

/**
 * Attempted Problem as stored in the database.
 */
export type DBAttemptedProblem = DBProblem & {
    id: number;
    code: string;
    correct: boolean;
}

/**
 * The email types
 */
export enum EmailType {
    ACCOUNT_VERIFICATION, // Account verification
    RESET_PASSWORD        // Reset password
}