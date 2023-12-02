"use client";
// Library imports
import assert from 'assert';
// Custom imports
import { LocalProblem } from "@/types";

// ------------------------------------------------------------------------- //
//               S   T   A   R   T   E   R       C   O   D   E               //
// ------------------------------------------------------------------------- //
/**
 * The starter code for the problem to solve.
 */
const starterCode_JS =
`function validParentheses(s) {
    // Write your code here
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
    const test_cases = [
        '()',     // Test Case 1
        '()[]{}', // Test Case 2
        '(]',     // Test Case 3
        '([)]',   // Test Case 4
        '{[]}'    // Test Case 5
    ];
    const correct_results = [
        true,     // Test Case 1
        true,     // Test Case 2
        false,    // Test Case 3
        false,    // Test Case 4
        true      // Test Case 5
    ];
    
    // Check if the user's code produces the correct answers for
    // the different test cases
    for (let i = 0; i < test_cases.length; i++) {
        const result = fn(test_cases[i]);
        assert.deepEqual(result, correct_results[i]);
    }
    return true;
};

// ------------------------------------------------------------------------- //
// P   R   O   B   L   E   M       D   E   S   C   R   I   P   T   I   O   N //
// ------------------------------------------------------------------------- //
/**
 * The problem description.
 */
export const validParentheses: LocalProblem = {
    problem_id: 'valid-parentheses',
    problemStatement: `
    <p class='mt-3'>
      Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>,
      determine if the input string is valid.
    </p>
    <p class='mt-3'>An input string is valid if:</p>
    <ul>
      <li class='mt-2'>Open brackets must be closed by the same type of brackets.</li>
      <li class='mt-3'>Open brackets must be closed in the correct order.</li>
      <li class='mt-3'>Every close bracket has a corresponding open bracket of the same type. </li>
    </ul>
    `,
    examples: [
        {
            id: 0,
            inputText: "s = '()'",
            outputText: 'true',
            explanation: null,
        },
        {
            id: 1,
            inputText: "s = '()[]{}'",
            outputText: 'true',
            explanation: null,
        },
        {
            id: 2,
            inputText: "s = '(]'",
            outputText: 'false',
            explanation: null,
        },
        {
            id: 3,
            inputText: "s = '([)]'",
            outputText: 'false',
            explanation: null,
        },
    ],
    constraints: `
    <li class='mt-2'>
      <code>1 <= s.length <= 10<sup>4</sup></code>
    </li>
    <li class='mt-2 '>
      <code>s</code> consists of parentheses only <code class='text-md'>'()[]{}'</code>.
    </li>
    `,
    handlerFunction: validateUserCode,
    starterCode: starterCode_JS,
    starterFunctionName: 'function validParentheses(',
};
