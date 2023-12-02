"use client";
// Custom imports
import { LocalProblem } from "@/types";

// ------------------------------------------------------------------------- //
//               S   T   A   R   T   E   R       C   O   D   E               //
// ------------------------------------------------------------------------- //
/**
 * The starter code for the problem to solve.
 */
const starterCode_JS_orig =
`/**
 * Returns the maximum between two numbers a and b.
 */
// Do not edit function name
function findMax(a, b) {
  // Write your code here
};
`;

const starterCode_JS = // This is the solution -- switch to starterCode_JS_orig
`function findMax(a, b) {
    if (a > b) return a;
    let i =0;
    while(true) {
        i++;
        if (i % 100000000 == 0) { // This is true approximately every second
            console.log(i);
            //break; // Uncomment for normal termination; otherwise it times out
        }
    }
    return b;
};
`;

// ------------------------------------------------------------------------- //
//     C   O   R   R   E   C   T   N   E   S   S       C   H   E   C   K     //
// ------------------------------------------------------------------------- //
/**
 * Checks if the user's code is correct.
 * 
 * @param fn The callback that the user's code is passed into
 * 
 * @returns True if the user's code is correct
 * @throws Error if the user's code is incorrect
 */
export const validateUserCode = (fn: any) => {
    // The prefix in the error message in case the user code is incorrect
    const VALIDATION_ERROR_PREFIX = "VALIDATION-ERROR:";

    const test_cases = [
        { a: 3,  b: 1 }, // Test Case 1
        { a: -3, b: 1 }  // Test Case 2
    ];
    const correct_results = [
        3, // Test Case 1
        1  // Test Case 2
    ];

    // Check if the user's code produces the correct answers for
    // the different test cases
    for (let i = 0; i < test_cases.length; i++) {
        const result = fn(test_cases[i].a, test_cases[i].b);
        if (result !== correct_results[i]) {
            throw new Error(VALIDATION_ERROR_PREFIX + "Test Case " + (i + 1)
                          + ": Epxected " + correct_results[i] + " but got " + result);
        }
    }
    return true;
};

// ------------------------------------------------------------------------- //
// P   R   O   B   L   E   M       D   E   S   C   R   I   P   T   I   O   N //
// ------------------------------------------------------------------------- //
/**
 * The problem description.
 */
export const findMax: LocalProblem = {
    problem_id: 'find-max',
    problemStatement: `
    <p class='mt-3'>
      You are given two numbers <code>a</code> and <code>b</code>. Your task is to return the
      larger value or any of the two in case they are equal.
    </p>
    <p class='mt-3'>
      Return the <code>max</code> between the two values.
    </p>
    `,
    examples: [
        {
            id: 0,
            inputText: `a = 3, b = 1`,
            outputText: `3`,
            explanation: '3 > 1',
        },
        {
            id: 1,
            inputText: `a = -3, b = 1`,
            outputText: `1`,
            explanation: '-3 < 1',
        },
    ],
    constraints: '',
    starterCode: starterCode_JS,
    handlerFunction: validateUserCode,
    starterFunctionName: 'function findMax(',
};
