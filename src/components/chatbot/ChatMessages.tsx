"use client";
// Library inputs
import { HTMLAttributes, useContext } from 'react';
// Custom imports
import MarkdownLite from "@/components/chatbot/MarkdownLite";
import MarkdownBlock from "@/components/chatbot/MarkdownBlock";
import { cn } from "@/util/utils";
import { MessagesContext } from '@/context/messages';

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
};


const ChatMessages:React.FC<ChatMessagesProps> = ({ className, ...props }) => {
    // Access the messages in the messages context
    const {messages} = useContext(MessagesContext);
    
    /** Reverse the order of the messages  */
    const reversedMessages = [...messages].reverse();

    return (
        <div {...props} className={cn(
          // Reverse the messages via flex-col-reverse
          `flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue
           scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch`,
          className 
        )}>
          {/* Add a div to fill in the space of an empty chat so that if there
              is only one message is shows at the very top and not at the very bottom */}
          <div className="flex-1 flex-grow"/> 
            {reversedMessages.map((message) => (
               <div className="chat-message" key={message.id}>
                 <div className={cn('flex items-end', {
                  // Bot messages go left, user messages fo right
                   'justify-end': message.isUserMessage,
                 })}>
                   {/* <div className={cn('flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden', { */}
                   <div className={cn('flex flex-col space-y-2 text-sm mx-2 overflow-x-hidden', {
                    'order-1 items-end': message.isUserMessage,
                    'order-2 items-start': !message.isUserMessage,
                   })}>
                     <p className={cn('px-4 py-2 rounded-lg', {
                       'bg-blue-600 text-white': message.isUserMessage,
                       'bg-gray-200 text-gray-900': !message.isUserMessage,
                      })}>                         
                      {/* <MarkdownLite text={message.text} /> */}
                      <MarkdownBlock content={message.text}/>
                     </p>
                   </div>
                 </div>
               </div>
            ))}
        </div>
    );
}
export default ChatMessages;