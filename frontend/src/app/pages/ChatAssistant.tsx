import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI Dental Assistant. I can help you book appointments, find doctors, check availability, and answer questions about dental care. How can I assist you today?",
    timestamp: new Date(),
  },
];

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: input,
    timestamp: new Date(),
  };

  const updatedMessages = [...messages, userMessage];
  setInput("");
  setIsTyping(true);

  try {
    // send conversation history
    const history = updatedMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.content,
        history: history,
      }),
    });

    const data = await response.json();

    // 🔥 IMPORTANT: use backend history (not manual append)
    if (data.history) {
      const formattedMessages: Message[] = data.history.map(
  (msg: any, index: number) => {

    let content = msg.content;

    // handle structured content from LLM
    if (Array.isArray(content)) {
      content = content
        .map((block: any) => {
          if (typeof block === "string") return block;
          if (block?.text) return block.text;
          return "";
        })
        .join("");
    }

    if (typeof content === "object") {
            content = JSON.stringify(content);
          }

          if (!content || content.trim() === "") {
            content = "(no response)";
          }

    return {
      id: index.toString(),
      role: msg.role,
      content: content,
      timestamp: new Date(),
    };
  }
);

      setMessages(formattedMessages);
    } else {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "No response from assistant.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }
  } catch (error) {
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "⚠️ Failed to connect to AI assistant.",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, errorMessage]);
  }

  setIsTyping(false);
};



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Chat header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              AI Dental Assistant
            </h2>
            <p className="text-sm text-slate-500">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-6">
        <div ref={scrollRef} className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-slate-300"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-slate-700" />
                )}
              </div>

              <div
                className={`flex-1 max-w-[70%] ${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "assistant"
                      ? "bg-white border border-slate-200"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "assistant"
                        ? "text-slate-400"
                        : "text-blue-100"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about appointments, doctors, or availability..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
