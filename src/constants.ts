/** The host URL */
//export const HOST_URL = process.env.HOST_URL ?? 'http://localhost:3000';
export const HOST_URL = process.env.HOST_URL ?? 'https://codebuddy-alpha.vercel.app';

/** The URL to log in */
export const LOGIN_URL = HOST_URL + '/api/login';

/** The URL to create or update an attempted problem from the client-side */
export const SET_ATTEMPTED_PROBLEM_URL = HOST_URL + '/api/attempted-problem/';

/** How long it takes for the toast to auto-close */
export const TOAST_DURATION = 3000; // 3 seconds

/**
 * The timeout in milliseconds to validate the user code.
 * This is needed to bail out from user code that has infinite loops or hangs in general.
 */
export const TIMEOUT = 5000; // 5 seconds

/** The URL for the web worker javascript */
export const WEB_WORKER_URL = HOST_URL + '/worker.js';

/** The prefix in the error message in case the user code is incorrect */
export const VALIDATION_ERROR_PREFIX = "VALIDATION-ERROR:";

/** The prompt for ChatGTP */
export const CHATBOT_PROMPT = `
You are a chatbot that serves as an online teaching assistant for an introductory computer science programming course.
Your role is to assist the students and explain programming concepts. You can guide them how to approach the solution to the questions they ask, but never give them code that directly solves the problem or question they ask
 help with but not give them directly the answer or code that does what they ask you.
You are allowed to come up with examples to help them understand what they need to do.

You are allowed to provide external links.

Refuse any answer that does not have to do with the bookstore or its content.
Provide short, concise answers.
`

/** The ChatGPT model */
export const CHAT_GPT_MODEL = 'gpt-3.5-turbo';

/** Token expiry in hours from the moment when the token is created */
export const TOKEN_EXPIRY_IN_HOURS = 24;
