"use client";
// Library imports
import { MutableRefObject } from 'react';
// Custom imports
import { TIMEOUT, VALIDATION_ERROR_PREFIX, WEB_WORKER_URL } from "@/constants";

/**
 * Uses a web worker to validate the user function.
 * 
 * @param workerRef Reference to the web worker (needed for timeout termination)
 * @param validatorFunctionCode The user function source code
 * @param callbackFunctionCode The callback function source code that will be
 *                             passed to the validator function as argument
 * 
 * @returns {@code true} if the user function is correct or
 *          {@code false} if the user function is incorrect or it takes
 *          too long to complete and therefore times out.
 */
export async function validateFunction(workerRef: MutableRefObject<Worker | null>,
                                       validatorFunctionCode: string,
                                       callbackFunctionCode: string) : Promise<boolean> {
    let workerFinished = false; 
    const workerPromise = new Promise<boolean>((resolve, reject) => {
        workerRef.current = new Worker(WEB_WORKER_URL);
        workerRef.current.postMessage({
            validatorFunctionCode: validatorFunctionCode,
            callbackFunctionCode: callbackFunctionCode
        });

        workerRef.current.onmessage = (event) => {
            workerRef.current?.terminate();
            workerFinished = true;
            const success = event.data;
            resolve(success);
        };

        
        workerRef.current.onerror = (error) => {
            workerRef.current?.terminate();
            workerFinished = true;
            
            let errorMessage = error.message;
            const startIndex = errorMessage.indexOf(VALIDATION_ERROR_PREFIX);
            if (startIndex !== -1) {
                // Code validation error (i.e., incorrect user code).
                // Extract the reason.
                errorMessage = errorMessage.substring(startIndex + VALIDATION_ERROR_PREFIX.length);
            }
            reject(errorMessage);
        };
    });

    const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
            if (!workerFinished) {
                console.log("The validator web worker timed out after " + (TIMEOUT/1000) + " seconds");
                workerRef.current?.terminate();
                resolve(false);
            }
        }, TIMEOUT); // Timeout after 5 seconds
    });

    // Use Promise.race to return the first resolved promise
    // (either workerPromise or timeoutPromise)
    return Promise.race([workerPromise, timeoutPromise]);
}