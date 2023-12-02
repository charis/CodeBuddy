importScripts("./worker_helper.js");

const DEBUG = false;

/**
 * Listens for messages from the main thread (i.e., executes when the
 * main thread calls the postMessage() function).
 */
self.addEventListener('message', (event) => {
    const validatorFunction = new Function(`return ${event.data.validatorFunctionCode}`)();
    const callbackFunction = new Function(`return ${event.data.callbackFunctionCode}`)();
    if (DEBUG) {
        console.log("validatorFunction:\n" + validatorFunction.toString() 
                  + "\n----------------------------------------------");
        console.log("callbackFunction:\n" + callbackFunction.toString()
                  + "\n----------------------------------------------");
    }

    // Alternatively:
    //const validatorFunction = eval('(' + event.data.validatorFunctionCode + ')');
    //const callbackFunction = eval('(' + event.data.callbackFunctionCode + ')');
    // Note:
    // Using new Function is generally safer than using eval. The eval function can
    // execute arbitrary code, which can be a security risk if the input is not properly
    // sanitized. In contrast, using new Function only evaluates the given expression
    // as a function body, providing a more controlled environment for code execution.

    const isCorrect = validatorFunction(callbackFunction);
    self.postMessage(isCorrect);
});
