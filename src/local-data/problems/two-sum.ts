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
const starterCode_JS_orig =
`function twoSum(nums, target) {
    // Write your code here
};
`;

const starterCode_JS = // This is the solution -- switch to starterCode_JS_orig
`function twoSum(nums, target) {
    const hashTable = {};

    for (let i = 0; i < nums.length; i++) {
        let neededVal = target - nums[i];

        if (!(neededVal in hashTable)) {
            hashTable[nums[i]] = i;
        }
        else {
            return [hashTable[neededVal], i];
        }
    }
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

    const test_nums = [
        [2, 7, 11, 15], // Test Case 1
        [3, 2, 4],      // Test Case 2
        [3, 3]          // Test Case 3
    ];
    const test_targets = [
        9, // Test Case 1
        6, // Test Case 2
        6  // Test Case 3
    ];
    const correct_results = [
        [0, 1], // Test Case 1
        [1, 2], // Test Case 2
        [0, 1]  // Test Case 3
    ];
    
    // Check if the user's code produces the correct answers for
    // the different test cases
    let num_of_test_cases = test_nums.length;
    for (let i = 0; i < num_of_test_cases; i++) {
        // Get the output of the user's code
        const result = fn(test_nums[i], test_targets[i]);
        // Compare the user result with the correct result
        if (result.length !== correct_results[i].length) {
            return false;
        }
        
        for (let j = 0; j < result.length; j++) {
            if (result[j] !== correct_results[i][j]) {
                throw new Error(VALIDATION_ERROR_PREFIX + "Test Case " + (i + 1)
                              + ": Epxected " + correct_results[i] + " but got " + result);
            }
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
export const twoSum: LocalProblem = {
    problem_id: 'two-sum',
    problemStatement: `
    <p class='mt-3'>
      Given an array of integers <code>nums</code> and an integer <code>target</code>, return
      <em>indices of the two numbers such that they add up to</em> <code>target</code>.
    </p>
    <p class='mt-3'>
      You may assume that each input would have <strong>exactly one solution</strong>, and you
      may not use the same element twice.
    </p>
    <p class='mt-3'>You can return the answer in any order.</p>
    `,
    examples: [
        {
            id: 1,
            inputText: 'nums = [2,7,11,15], target = 9',
            outputText: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
            id: 2,
            inputText: 'nums = [3,2,4], target = 6',
            outputText: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
        {
            id: 3,
            inputText: 'nums = [3,3], target = 6',
            outputText: '[0,1]',
            explanation: null,
        },
    ],
    constraints: `
    <li class='mt-2'>
      <code>2 ≤ nums.length ≤ 10</code>
    </li>
    <li class='mt-2'>
      <code>-10 ≤ nums[i] ≤ 10</code>
    </li>
    <li class='mt-2'>
      <code>-10 ≤ target ≤ 10</code>
    </li>
    <li class='mt-2 text-sm'>
      <strong>Only one valid answer exists.</strong>
    </li>
    `,
    handlerFunction: validateUserCode,
    starterCode: starterCode_JS,
    starterFunctionName: 'function twoSum(',
};
