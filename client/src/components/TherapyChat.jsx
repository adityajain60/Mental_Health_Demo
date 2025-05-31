import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

// Gemini API Key will be handled by the environment as per instructions.
const GEMINI_API_KEY = "AIzaSyDt1aSqi0e6G0J75m-x2bAcznsdhaPkrPU"; // This will be an empty string.

const TherapyChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting from the AI therapist
    setMessages([
      {
        id: "initial-greeting",
        text: "Hello, I'm your AI Therapist. It's a safe space to talk about whatever is on your mind. How are you feeling today?",
        sender: "ai", // 'ai' will be mapped to 'model' for Gemini API
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchGeminiResponse = async (userMessageText, currentMessages) => {
    setIsLoading(true);

    const systemPrompt =
      "You are an AI therapist. Your primary goal is to listen, provide empathetic support, and help users explore their feelings and thoughts in a safe and non-judgmental space. You do not give medical advice or diagnoses. You can ask clarifying questions to understand the user better. Maintain a calm, understanding, and supportive tone. If the user expresses thoughts of self-harm or harming others, you should strongly advise them to seek help from a crisis hotline or mental health professional immediately, and provide a generic crisis hotline number if possible (e.g., 'In the US, you can call or text 988'). Keep your responses concise and conversational, typically 1-3 sentences unless more detail is truly needed.";

    let chatHistory = [
      // Start with the system prompt as a user message, and an AI acknowledgement.
      // This helps set the persona for the Gemini model.
      { role: "user", parts: [{ text: systemPrompt }] },
      {
        role: "model",
        parts: [
          { text: "Okay, I understand. I'm ready to listen and support you." },
        ],
      },
    ];

    // Add existing messages to chatHistory, converting sender to role
    currentMessages.forEach((msg) => {
      // We only add messages that were part of the actual conversation,
      // excluding the initial greeting if it's not meant to be part of history for the API
      if (msg.id !== "initial-greeting" || currentMessages.length === 1) {
        // include initial greeting if it's the only message
        chatHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    });

    // Add the current user message that needs a response
    chatHistory.push({ role: "user", parts: [{ text: userMessageText }] });

    const payload = {
      contents: chatHistory,
      // Optional: Add generationConfig if needed for specific controls
      // generationConfig: {
      //   temperature: 0.7,
      //   maxOutputTokens: 150,
      //   topP: 1.0,
      // }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(
          `Gemini API error: ${response.status} ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const result = await response.json();

      let aiResponseText =
        "I'm having a little trouble forming a thought right now. Could you try rephrasing?";
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        aiResponseText = result.candidates[0].content.parts[0].text.trim();
      } else {
        console.warn(
          "Gemini API response structure unexpected or content missing:",
          result
        );
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: aiResponseText, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: `Sorry, I encountered an error: ${error.message}. Please check the console.`,
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    // Add user's message to the state immediately for better UX
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    const messageTextForApi = inputValue; // Store before clearing
    setInputValue(""); // Clear input after getting the value

    // Call Gemini API with the new message and the updated context
    // Pass `updatedMessages` which now includes the latest user message.
    fetchGeminiResponse(messageTextForApi, updatedMessages);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4 font-sans">
      <div className="bg-slate-800 shadow-2xl rounded-xl w-full max-w-2xl flex flex-col h-[calc(100vh-80px)] max-h-[700px]">
        <header className="bg-slate-700 p-4 rounded-t-xl">
          <h1 className="text-2xl font-semibold text-center text-slate-100">
            AI Therapist
          </h1>
        </header>

        <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow ${
                  msg.sender === "user"
                    ? "bg-sky-600 text-white rounded-br-none"
                    : "bg-slate-600 text-slate-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl shadow bg-slate-600 text-slate-100 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 sm:p-5 border-t border-slate-700 bg-slate-800 rounded-b-xl flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow px-4 py-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            disabled={isLoading || inputValue.trim() === ""}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155; /* slate-700 */
        }
      `}</style>
    </div>
  );
};

export default TherapyChat;
