// Library imports
import { ChatMessageHistorySchema } from "@/app/lib/zod_schemas";
import { ChatGPTMessage } from "@/types";
import { CHATBOT_PROMPT, CHAT_GPT_MODEL } from "@/constants";
// Custom imports
import { createOpenAIStream } from "@/util/OpenAIUtil";
import { OpenAIStreamPayload } from "@/types";

type RequestBody = {
}

export async function POST(request: Request) { //}: Promise<Response> {
    const { messages } = await request.json();
    // Message validation against our schema
    const parsedMessages = ChatMessageHistorySchema.parse(messages);
    
    // Prepare the messages to send to ChatGTP
    const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? 'user' : 'system',
        content: message.text
    }))
    
    // We need to render the messages in reverse order => unshift
    outboundMessages.unshift({
        role: 'system',
        content: CHATBOT_PROMPT
    });

    // The payload that we will send to the OpenAI API
    const payload: OpenAIStreamPayload = { // See https://platform.openai.com/docs/api-reference/chat/create
        model: CHAT_GPT_MODEL,
        messages: outboundMessages,
        // A higher temperature (e.g., 0.7) results in more diverse and creative output,
        // while a lower temperature (e.g., 0.2) makes the output more deterministic and focused
        temperature: 0.4,
        // With a higher value for p (i.e., close or equal to 1.0), the model will have a larger
        // set of candidate words, making the responses more diverse and unpredictable
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        // The maximum number of tokens to generate in the chat completion
        max_tokens: 500,
        stream: true,
        // How many chat completion choices to generate for each input message
        n: 1
    }

    const stream = await createOpenAIStream(payload);

    // Return a response to the client
    return new Response(stream);
};