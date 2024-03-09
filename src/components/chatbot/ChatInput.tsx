"use client";
// Library imports
import TextareaAutosize from 'react-textarea-autosize';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { HTMLAttributes } from 'react';
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'core-js/stable'; // npm install core-js@latest
import 'regenerator-runtime/runtime'; // npm install regenerator-runtime@latest
// Custom imports
import { MessagesContext } from '@/context/messages';
import { cn } from "@/util/utils";
import { showError } from '@/util/UIUtil';
import { ChatMessage, MessageContextType } from "@/types";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
};

const ChatInput:React.FC<ChatInputProps> = ({ className, ...props }) => {
    const [input, setInput] = useState<string>('');
    const messageContext: MessageContextType = useContext(MessagesContext);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Speech recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const {mutate: sendMessage, isPending} = useMutation({
        mutationFn: async (message: ChatMessage) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: messageContext.messages }),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.body;
        },
        onMutate(message) { // This will fire before the mutationFn is fired and is passed the same args
            messageContext.addMessage(message);
        },
        onSuccess: async (stream) => {
            // Display the stream while we are getting it from the server
            // to the client (i.e., in real-time)
            if (!stream) {
                throw new Error('No stream available');
            }

            // Construct response message
            const id = nanoid(); // Create random id
            const responseMessage: ChatMessage = {
                id: id,
                isUserMessage: false,
                text: '', // Initially the content is empty
                          // Later will append the stream from the bot
            };

            messageContext.addMessage(responseMessage);
            messageContext.setIsMessageUpdating(true);

            // Decode the stream
            const reader = stream.getReader();
            const textDecoder = new TextDecoder();

            let done = false;
            while (!done) {
                const {value, done: doneReading} = await reader.read();
                done = doneReading;
                const chunkValue = textDecoder.decode(value);
                messageContext.updateMessage(id, (curr) => curr + chunkValue);
            }

            // Clean up
            messageContext.setIsMessageUpdating(false);
            setInput('');
            textareaRef.current?.focus();
        },
        onError(error, message) {
            showError('Something went wrong. Please try again. (' + message + ')');
            messageContext.removeMessage(message.id);
            textareaRef.current?.focus();
        }
    });

    useEffect(() => {
        if (!listening) {
            const updatedTranscript = input.length > 0 ?
                                      input + ' ' + transcript : transcript;
            setInput(updatedTranscript);
        }
    }, [listening]);

    return (
        <div {...props} className={cn('border-t border-zinc-300', className)}>
          {/*   S P E E C H    R E C O G N I T I O N   */}
          <div className="items-center mt-2">
            <div className="flex items-center">
              <Image src="/images/microphone.png"
                     alt="Microphone"
                     height={25}
                     width={25}
              />
              <div className={`${listening ? 'text-green-600' : 'text-red-600'}`}>{listening? 'On' : 'Off'}</div>
              <div className="mx-1 cursor-pointer" onClick={() => SpeechRecognition.startListening()}>
                <Image src="/images/start.png"
                       alt="Start Speech Recignition"
                       height={25}
                       width={25}
                />
              </div>
              <div className="mx-1 rounded-lg cursor-pointer" onClick={() => SpeechRecognition.stopListening()}>
                <Image src="/images/stop.png"
                       alt="Stop Speech Recignition"
                       height={25}
                       width={25}
                />
              </div>
              <div className="mx-1 rounded-lg cursor-pointer" onClick={() => setInput('')}>
                <Image src="/images/delete.png"
                       alt="Stop Speech Recignition"
                       height={25}
                       width={25}
                />
              </div>
            </div>
          </div>
          <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
            <TextareaAutosize className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
                              ref={textareaRef}
                              rows={2}
                              maxRows={4}
                              onKeyDown={(e) => {
                                  // Pressing just <Enter> means send the question
                                  // Pressing <Enter> + <Shift> means move to new line
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                       // Prevent reloading + Send the question
                                       e.preventDefault();

                                       const message = {
                                          id: nanoid(), // Create random id
                                          isUserMessage: true, // User input, not chatbot reply
                                          text: input
                                       };
                                       
                                       sendMessage(message);
                                  }
                              }}
                              value={input}
                              autoFocus
                              disabled={isPending}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder='Type your question...'
            />

            {/* Loading indicator */}
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400">
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CornerDownLeft className="w-3 h-3" />
                )}
              </kbd>
            </div>

            {/* Blue line at the bottom of the input text area for visually impaired people */}
            <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                 aria-hidden="true"
            />
          </div>
        </div>
    );
}
export default ChatInput;