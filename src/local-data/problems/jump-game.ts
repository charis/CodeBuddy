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
`function canJump(nums) {
    // Write your code here
};
`;

const starterCode_JS = // This is the solution -- switch to starterCode_JS_orig
`function canJump(nums) {
    let lastGoodIndex = nums.length - 1;
    
    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= lastGoodIndex) {
            lastGoodIndex = i;
        }
    }
    
    return lastGoodIndex === 0;
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
        [2, 3, 1, 1, 4], // Test Case 1
        [3, 2, 1, 0, 4], // Test Case 2
        [2, 0, 0],       // Test Case 3
        [2, 5, 0, 0],    // Test Case 4
    ];
    const correct_results = [
        true,  // Test Case 1
        false, // Test Case 2
        true,  // Test Case 3
        true   // Test Case 4
    ];

    // Check if the user's code produces the correct answers for
    // the different test cases
    for (let i = 0; i < test_cases.length; i++) {
        const result = fn(test_cases[i]);
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
export const jumpGame: LocalProblem = {
    problem_id: 'jump-game',
    problemStatement: `
    <p class='mt-3'>
      You are given an integer array <code>nums</code>. You are initially positioned at the <strong>first index</strong>
      and each element in the array represents your maximum jump length at that position.
    </p>
    <p class='mt-3'>
      Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.
    </p>
    `,
    examples: [
        {
            id: 0,
            inputText: `nums = [2,3,1,1,4]`,
            outputText: `true`,
            explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
        },
        {
            id: 1,
            inputText: `nums = [3,2,1,0,4]`,
            outputText: `false`,
            explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.',
        },
    ],
    constraints: `
    <li class='mt-2'>
      <code>1 <= nums.length <= 10^4</code>
    </li>
    <li class='mt-2'>
      <code>0 <= nums[i] <= 10^5</code>
    </li>
    `,
    starterCode: starterCode_JS,
    handlerFunction: validateUserCode,
    starterFunctionName: 'function canJump(',
};
