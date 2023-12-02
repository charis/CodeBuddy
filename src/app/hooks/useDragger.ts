// Library imports
import { useEffect, useRef } from 'react';

/**
 * Makes the THML element with the given id draggable.
 * 
 * @param id the id of the HTML element to make draggable
 */
function useDragger(id: string):void {
    /** Tracks mouse clicks */
    const isClicked = useRef<boolean>(false);
    /** Keep track of the initial mouse coordinates */
    const mouseCoords = useRef<{startX: number,   // Mouse initial x-coordinate when we click on the chat box
                                startY: number,   // Mouse initial y-coordinate when we click on the chat box
                                releaseX: number, // x-coordinate when we release the mouse button
                                releaseY: number  // y-coordinate when we release the mouse button
                              }>({ startX: 0, startY: 0, releaseX: 0, releaseY: 0 });
    
    // We cannot use the document object on the server-side platform like Node.js
    //  because Node.js does not have a global "window" object. However, if the
    // "window" global is defined, we are on the browser and can use the
    // "document" variable. Therefore, we need to ensure that the type of "window"
    // is not undefined before assigning the
    // call "document.getElementById(id);""
    /** The target element to make draggable */
    const target = (typeof window !== 'undefined')? document.getElementById(id) : null;
    if (!target) {
        throw new Error('There is no element with id=' + id);
    }

    /** The container which is the parent element of the target */
    const container = target.parentElement;
    if (!container) {
        throw new Error('The target element has no parent element');
    }

    /** Checks when the component is selected and the mouse is down */
    useEffect(() => {
        /*
         * Executes when the users presses the mouse button down
         */
        const onMouseDown = (e: MouseEvent) => {
            isClicked.current = true;
            mouseCoords.current.startX = e.clientX;
            mouseCoords.current.startY = e.clientY;
        }
        /*
         * Executes when the user releases the mouse button
         */
        const onMouseUp = (e: MouseEvent) => {
            isClicked.current = false;
            mouseCoords.current.releaseX = target.offsetLeft;
            mouseCoords.current.releaseY = target.offsetTop;
        }
        /*
         * Executes when the user moves the mouse
         */
        const onMouseMove = (e: MouseEvent) => {
            if (!isClicked.current) {
                return;
            }
            const newX = e.clientX - mouseCoords.current.startX + mouseCoords.current.releaseX;
            const newY = e.clientY - mouseCoords.current.startY + mouseCoords.current.releaseY;

            target.style.left = `${newX}px`;
            target.style.top = `${newY}px`;
        }        

        target.addEventListener('mousedown', onMouseDown);
        target.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseUp);

        /**
         * Removes the event listener for the mouse down events
         */
        const cleanup = () => {
            target.removeEventListener('mousedown', onMouseDown);
            target.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseUp);
          }

        return cleanup;
    }, [id, target, container]);
}
export default useDragger;