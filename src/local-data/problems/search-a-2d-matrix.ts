"use client";
// Library impors
import assert from 'assert';
// Custom imports
import example1Img from "./images/search-a-2d-matrix_1.jpg";
import example2Img from "./images/search-a-2d-matrix_2.jpg";
import { LocalProblem } from "@/types";

// ------------------------------------------------------------------------- //
//               S   T   A   R   T   E   R       C   O   D   E               //
// ------------------------------------------------------------------------- //
/**
 * The starter code for the problem to solve.
 */
const starterCode_JS =
`// Do not edit function name
function searchMatrix(matrix, target) {
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
        // Test Case 1
        {
            matrix: [
                [1, 3, 5, 7],
                [10, 11, 16, 20],
                [23, 30, 34, 60],
            ],
            target: 3,
        },
        // Test Case 2
        {
            matrix: [
                [1, 3, 5, 7],
                [10, 11, 16, 20],
                [23, 30, 34, 60],
            ],
            target: 13,
        },
    ];
    const correct_results = [
        true, // Test Case 1
        false // Test Case 2
    ];

    // Check if the user's code produces the correct answers for
    // the different test cases
    for (let i = 0; i < test_cases.length; i++) {
        const result = fn(test_cases[i].matrix, test_cases[i].target);
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
export const search2DMatrix: LocalProblem = {
    problem_id: 'search-a-2d-matrix',
    problemStatement: `
    <p class='mt-3'>
      Write an efficient algorithm that searches for a value in an <code>m x n</code> matrix. This matrix has the following properties:
    </p>
    <li class='mt-3'>Integers in each row are sorted from left to right.</li>
    <li class='mt-3'>The first integer of each row is greater than the last integer of the previous row.</li>
    <p class='mt-3'>
      Given <code>matrix</code>, an <code>m x n</code> matrix, and <code>target</code>, return <code>true</code> if <code>target</code> is in the matrix, and <code>false</code> otherwise.
    </p>
    `,
    examples: [
        {
            id: 0,
            inputText: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 3`,
            outputText: `true`,
            explanation: null,
            image_explanation: example1Img.src,
        },
        {
            id: 1,
            inputText: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 13`,
            outputText: `false`,
            explanation: null,
            image_explanation: example2Img.src,
        },
        {
            id: 2,
            inputText: `matrix = [[1]], target = 1`,
            outputText: `true`,
            explanation: null,
        },
    ],
    constraints: `
    <li class='mt-2'><code>m == matrix.length</code></li>
    <li class='mt-2'><code>n == matrix[i].length</code></li>
    <li class='mt-2'><code>1 <= m, n <= 100</code></li>
    <li class='mt-2'><code>-10<sup>4</sup> <= matrix[i][j], target <= 10<sup>4</sup></code></li>
    `,
    starterCode: starterCode_JS,
    handlerFunction: validateUserCode,
    starterFunctionName: 'function searchMatrix',
};
