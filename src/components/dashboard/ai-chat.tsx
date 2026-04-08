"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI internship assistant. I can help you find internships, improve your resume, and prepare for interviews. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 500);
  };

  const getAIResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      resume:
        "I can help improve your resume! Focus on quantifiable achievements, use action verbs, and tailor it to specific job descriptions. Would you like tips on a specific section?",
      interview:
        "Interview preparation is key! Practice common questions, research the company, and prepare examples using the STAR method. Need help with any specific questions?",
      skills:
        "To stand out, focus on technical skills (programming, data analysis) and soft skills (communication, teamwork). Consider taking online courses to strengthen your profile.",
      default:
        "That's a great question! Based on your profile, I'd recommend focusing on Python, JavaScript, and cloud technologies. Would you like personalized recommendations?",
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) return value;
    }
    return responses.default;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-2xl border border-zinc-800/50 bg-[#1a1919] backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-96"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 p-4">
        <div>
          <h3 className="font-semibold text-white">Vyom AI</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg text-white hover:bg-white/5 p-1.5 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg text-white hover:bg-white/5 p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-purple-500 text-background"
                      : "bg-white/5 text-white border border-zinc-800/50"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/40 text-foreground border border-border/50 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800/50 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-zinc-800/50 bg-white/5 text-white px-3 py-2 text-sm placeholder-muted-foreground focus:border-accent focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-lg bg-purple-500 p-2 text-white hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
