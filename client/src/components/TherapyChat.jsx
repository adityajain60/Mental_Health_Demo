import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

// Gemini API Key will be handled by the environment as per instructions.
const GEMINI_API_KEY = "AIzaSyDt1aSqi0e6G0J75m-x2bAcznsdhaPkrPU";

// Copy of quiz questions for formatting
const questions = [
  { question: "How often do you feel overwhelmed with daily tasks?" },
  { question: "How well do you sleep at night?" },
  { question: "How often do you feel anxious or worried?" },
  { question: "Do you find joy in activities you used to enjoy?" },
  { question: "How often do you feel fatigued even after rest?" },
  { question: "Do you talk to someone about your feelings?" },
  { question: "How often do you experience mood swings?" },
  { question: "How would you rate your self-esteem?" },
  { question: "Do you find it difficult to concentrate?" },
  { question: "Do you feel supported by people around you?" },
];

const TherapyChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizAnswers = location.state?.quizAnswers;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to format quiz answers for AI
  const formatQuizForAI = () => {
    if (!quizAnswers) return "";
    return Object.entries(quizAnswers)
      .map(
        ([idx, answer]) =>
          `Q${Number(idx) + 1}: ${questions[idx]?.question || ""}\nA: ${answer}`
      )
      .join("\n\n");
  };

  // Initial greeting and quiz analysis (with duplicate prevention)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: "initial-greeting",
            text: "Hello, I'm your AI Therapist. It's a safe space to talk about whatever is on your mind. How are you feeling today?",
            sender: "ai",
          },
        ];
      }
      return prev;
    });

    if (quizAnswers) {
      setAnalysisLoading(true);
      const prompt =
        "Here are the user's answers to a mental health self-check quiz:\n\n" +
        formatQuizForAI() +
        "\n\nPlease provide a short, supportive, and empathetic analysis of these answers (2-4 sentences). Do not give medical advice or diagnosis. Be encouraging and gentle.";

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          const result = await res.json();
          let aiResponseText =
            "Thank you for sharing your answers. Remember, this is a safe space and I'm here to support you.";
          if (
            result.candidates &&
            result.candidates.length > 0 &&
            result.candidates[0].content &&
            result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0
          ) {
            aiResponseText = result.candidates[0].content.parts[0].text.trim();
          }
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === "quiz-analysis")) return prev;
            return [
              ...prev,
              {
                id: "quiz-analysis",
                text: aiResponseText,
                sender: "ai",
              },
            ];
          });
        })
        .catch(() => {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === "quiz-analysis")) return prev;
            return [
              ...prev,
              {
                id: "quiz-analysis",
                text: "Thank you for sharing your answers. Remember, this is a safe space and I'm here to support you.",
                sender: "ai",
              },
            ];
          });
        })
        .finally(() => setAnalysisLoading(false));
    }
    // eslint-disable-next-line
  }, [quizAnswers]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchGeminiResponse = async (userMessageText, currentMessages) => {
    setIsLoading(true);

    const systemPrompt =
      "You are an AI therapist. Your primary goal is to listen, provide empathetic support, and help users explore their feelings and thoughts in a safe and non-judgmental space. You do not give medical advice or diagnoses. You can ask clarifying questions to understand the user better. Maintain a calm, understanding, and supportive tone. If the user expresses thoughts of self-harm or harming others, you should strongly advise them to seek help from a crisis hotline or mental health professional immediately, and provide a generic crisis hotline number if possible (e.g., 'In the US, you can call or text 988'). Keep your responses concise and conversational, typically 1-3 sentences unless more detail is truly needed.";

    let chatHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      {
        role: "model",
        parts: [
          { text: "Okay, I understand. I'm ready to listen and support you." },
        ],
      },
    ];

    currentMessages.forEach((msg) => {
      if (msg.id !== "initial-greeting" || currentMessages.length === 1) {
        chatHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    });

    chatHistory.push({ role: "user", parts: [{ text: userMessageText }] });

    const payload = { contents: chatHistory };

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

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    const messageTextForApi = inputValue;
    setInputValue("");

    fetchGeminiResponse(messageTextForApi, updatedMessages);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 font-sans relative overflow-hidden">
      {/* Floating gradient shapes for modern look */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-gradient-to-br from-sky-400 to-blue-600 opacity-30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400 to-blue-300 opacity-30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-sky-300 to-blue-200 opacity-10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="bg-white/90 backdrop-blur-2xl shadow-2xl rounded-3xl w-full max-w-2xl flex flex-col h-[calc(100vh-80px)] max-h-[700px] border border-blue-100 relative z-10">
        <header className="bg-gradient-to-r from-sky-600 to-blue-700 p-6 rounded-t-3xl shadow flex items-center justify-center">
          <span className="text-3xl mr-3">💬</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Therapist
          </h1>
        </header>

        <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gradient-to-br from-blue-100 to-sky-100 text-blue-900 rounded-bl-none border border-blue-200"
                }`}
              >
                <p className="text-base whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {(isLoading || analysisLoading) && (
            <div className="flex justify-start">
              <div className="px-5 py-3 rounded-2xl shadow bg-blue-100 text-blue-900 rounded-bl-none border border-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-6 border-t border-blue-100 bg-white/80 rounded-b-3xl flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow px-5 py-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-colors placeholder-blue-400 font-medium"
            disabled={isLoading || analysisLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white p-3 rounded-xl shadow font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white"
            disabled={isLoading || analysisLoading || inputValue.trim() === ""}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
        {/* Show quiz suggestion if quiz not taken */}
        {!quizAnswers && (
          <div className="p-5 border-t border-blue-100 bg-blue-50 rounded-b-3xl flex flex-col items-center">
            <p className="text-blue-900 mb-3 text-center text-base">
              <span className="font-semibold text-sky-600">
                Want more personalized support?
              </span>{" "}
              Take our quick mental health quiz so the AI can better understand
              your needs.
            </p>
            <button
              className="px-6 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg shadow hover:from-sky-700 hover:to-blue-700 transition text-base font-semibold"
              onClick={() => navigate("/quiz")}
            >
              Take the Mental Health Quiz
            </button>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #60a5fa; /* sky-400 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb; /* blue-700 */
        }
      `}</style>
    </div>
  );
};

export default TherapyChat;
