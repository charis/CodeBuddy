"use client";
// Custom imports
import QueryProvider from "@/components/QueryProvider";
import ChatInput from "@/components/chatbot/ChatInput";
import ChatMessages from "@/components/chatbot/ChatMessages";

type ChatUIProps = {
};

const ChatUI:React.FC<ChatUIProps> = () => {
    return (
      <QueryProvider>
          <div className="w-auto bg-white border border-gray-200 rounded-md overflow-hidden">
            <ChatMessages className="px-2 py-3"/>
            <ChatInput className="px-4 pb-2"/>
          </div>
      </QueryProvider>
    );

}
export default ChatUI;