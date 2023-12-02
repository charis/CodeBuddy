// Libray imports
import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";
// Custom imports
import { OpenAIStreamPayload } from "@/types";

export async function createOpenAIStream(payload: OpenAIStreamPayload) {
    // Encodes the text to send to OpenAI API
    const textEncoder = new TextEncoder();

    // Decodes the response from OpenAI
    const textDecoder = new TextDecoder();

    let counter = 0;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
    });
    
    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data;
                    if (data === '[DONE]') { // We got all the data
                        controller.close(); // Close the stream
                        return;
                    }

                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || '';

                        // If the text is a prefixed character (e.g., new line) do nothing
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            return;
                        }

                        const queue = textEncoder.encode(text);
                        controller.enqueue(queue);

                        counter++;
                    }
                    catch(error) {
                        controller.error(error);
                    }
                }
            }

            // Parser
            const parser = createParser(onParse);

            for await (const chunk of response.body as any) {
                parser.feed(textDecoder.decode(chunk));
            }
        }
    });

    return stream;
}