"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Minimize2, Maximize2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// History item sent to the API (matches the shape our route expects)
interface HistoryItem {
  role: "user" | "model";
  parts: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Vyom AI, your career assistant powered by Gemini. Ask me anything about internships, your resume, interview prep, or skills to learn!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Keep a parallel history array in the Gemini format for multi-turn context
  const historyRef = useRef<HistoryItem[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyRef.current,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await res.json();
      const replyText: string = data.reply ?? "Sorry, I couldn't generate a response.";

      // Update Gemini history for next turn
      historyRef.current = [
        ...historyRef.current,
        { role: "user", parts: userText },
        { role: "model", parts: replyText },
      ];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I ran into an error. Please make sure GEMINI_API_KEY is set in your .env file.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
        isMinimized ? "w-80 h-16" : "w-96 h-[480px]"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20">
            <Bot className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Vyom AI</h3>
            <p className="text-xs text-emerald-400">● Online · Gemini</p>
          </div>
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-purple-500 text-white rounded-br-sm"
                      : "bg-white/5 text-zinc-200 border border-zinc-800/50 rounded-bl-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-zinc-800/50 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" />
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800/50 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border border-zinc-800/50 bg-white/5 text-white px-3 py-2 text-sm placeholder-zinc-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-xl bg-purple-500 p-2.5 text-white hover:bg-purple-600 disabled:opacity-40 transition-colors"
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
