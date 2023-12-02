// Library imports
import { ReactNode, createContext, useState } from 'react';
// Custom imports
import { ChatMessage, MessageContextType } from "@/types";
import { nanoid } from 'nanoid';


type ProvidersProps = {
    children: React.ReactNode;
};

export const MessagesContext = createContext<MessageContextType>({
    // Fallback values (i.e., values that the message context will fall back to
    // if no values are provided)
    messages: [],
    addMessage: () => {},
    removeMessage: () => {},
    updateMessage: () => {},
    isMessageUpdating: false,
    setIsMessageUpdating: () => {}

});


/**
 * Messages-provider wrapper
 */
const MessagesProvider:React.FC<ProvidersProps> = ({children}) => {
    /** Keeps track if the message is updating */
    const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);

    /** Stores the messages */
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: nanoid(), // Create random id
            text: 'Hello, how can I help you?',
            isUserMessage: false
        }
    ]);

    /**
     * Adds a new message.
     * 
     * @param message The message to add
     */
    const addMessage = (message: ChatMessage) => {
        // Append the new message to the previous messages
        setMessages((prev) => [...prev, message]);
    };

    /**
     * Removes the message with the given id.
     * 
     * @param id The id of the message to remove
     */
    const removeMessage = (id: string) => {
        // Append the new message to the previous messages
        setMessages((prev) => prev.filter((message) => message.id !== id));
    };

    /**
     * Updates the text for the message with the given id.
     * 
     * @param id The id of the message to update its text
     * @param updateFn The function that updates the current text of the message
     */
    const updateMessage = (id: string, updateFn: (currText: string) => string) => {
        setMessages((prev) => prev.map((message) => {
            if (message.id === id) {
                // If this is the message we want to update, call the update
                // function with the message.text as argument
                return {...message, text: updateFn(message.text)};
            }

            return message;
        }));
    };

    return (
        <MessagesContext.Provider value={{
            messages,
            addMessage,
            removeMessage,
            updateMessage,
            isMessageUpdating,
            setIsMessageUpdating,
        }}>
            {children}
        </MessagesContext.Provider>
    );
}
export default MessagesProvider;