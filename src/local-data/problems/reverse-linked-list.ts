"use client";
// Custom imports
import exampleImg from "./images/reverseLinkedList.jpg";
import { LocalProblem } from "@/types";

// ------------------------------------------------------------------------- //
//               S   T   A   R   T   E   R       C   O   D   E               //
// ------------------------------------------------------------------------- //
/**
 * The starter code for the problem to solve.
 */
const starterCode_JS_orig =
`/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
// Do not edit function name
function reverseLinkedList(head) {
  // Write your code here
};
`;

const starterCode_JS = // This is the solution -- switch to starterCode_JS_orig
`function reverseLinkedList(head) {
    // This is a comment
    let prev = null;
    let current = head;
  
    while (current !== null) {
      const nextNode = current.next;
      current.next = prev;
      prev = current;
      current = nextNode;
    }
  
    return prev;
};
`

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
        [1, 2, 3, 4, 5], // Test Case 1
        [5, 4, 3, 2, 1], // Test Case 2
        [1, 2, 3],       // Test Case 3
        [1]];            // Test Case 4
    const correct_results = [
        [5, 4, 3, 2, 1], // Test Case 1
        [1, 2, 3, 4, 5], // Test Case 2
        [3, 2, 1],       // Test Case 3
        [1]];            // Test Case 4
    
    // Check if the user's code produces the correct answers for
    // the different test cases
    for (let i = 0; i < test_cases.length; i++) {
        const list = createLinkedList(test_cases[i]);
        const result = fn(list);
        const result_arr = getListValues(result);

        if (result_arr.length !== correct_results[i].length) {
            throw new Error(VALIDATION_ERROR_PREFIX + "Test Case " + (i + 1)
                          + ": Epxected " + correct_results[i] + " but got " + result_arr);
        }
            
        for (let j = 0; j < result_arr.length; j++) {
            if (result_arr[j] !== correct_results[i][j]) {
                throw new Error(VALIDATION_ERROR_PREFIX + "Test Case " + (i + 1)
                              + ": Epxected " + correct_results[i] + " but got " + result_arr);
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
export const reverseLinkedList: LocalProblem = {
    problem_id: 'reverse-linked-list',
    problemStatement: `
    <p class='mt-3'>
      Given the <code>head</code> of a singly linked list, reverse the list, and return
      <em>the reversed list</em>.
    </p>
    `,
    examples: [
        {
            id: 0,
            inputText: 'head = [1,2,3,4,5]',
            outputText: '[5,4,3,2,1]',
            explanation: null,
            image_explanation: exampleImg.src,
        },
        {
            id: 1,
            inputText: 'head = [1,2,3]',
            outputText: '[3,2,1]',
            explanation: null,
        },
        {
            id: 2,
            inputText: 'head = [1]',
            outputText: '[1]',
            explanation: null,
        },
    ],
    constraints: `
    <li class='mt-2'>
      The number of nodes in the list is the range <code>[0, 5000]</code>.
    </li>
    <li class='mt-2'>
      <code>-5000 <= Node.val <= 5000</code>
    </li>
    `,
    starterCode: starterCode_JS,
    handlerFunction: validateUserCode,
    starterFunctionName: 'function reverseLinkedList(',
};


// ------------------------------------------------------------------------- //
//     E   X   T   R   A   /   H   E   L   P   E   R       C   O   D   E     //
// ------------------------------------------------------------------------- //
// JS doesn't have a built-in LinkedList class, so we need to create one
/**
 * The LinkedList class.
 */
export class LinkedList {
    value: number;
    next: LinkedList | null;

    constructor(value: number) {
        this.value = value;
        this.next = null;
    }

    reverse(): LinkedList {
        let current: LinkedList | null = this;
        let prev: LinkedList | null = null;
        while (current !== null) {
            const next = current.next as LinkedList;
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev!;
    }
}

/**
 * Creates a linked list from an array
 * 
 * @param values The array of values to turn into a linked list
 * @returns the linked list from the array
 */
export function createLinkedList(values: number[]): LinkedList {
    const head = new LinkedList(values[0]);
    let current = head;
    for (let i = 1; i < values.length; i++) {
        const node = new LinkedList(values[i]);
        current.next = node;
        current = node;
    }
    return head;
}

/**
 * Returns an array of values from a linked list.
 * 
 * @param head The head of the list
 * @returns an array of values from a linked list.
 */
export function getListValues(head: LinkedList): number[] {
    const values = [];
    let current: LinkedList | null = head;
    while (current !== null) {
        values.push(current.value);
        current = current.next;
    }
    return values;
}