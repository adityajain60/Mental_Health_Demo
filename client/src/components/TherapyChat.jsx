import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { MessageCircleIcon, ArrowUpRightIcon, BrainIcon } from "lucide-react";


// Gemini API Key will be handled by the environment as per instructions.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

  const formatQuizForAI = () => {
    if (!quizAnswers) return "";
    return Object.entries(quizAnswers)
      .map(
        ([idx, answer]) =>
          `Q${Number(idx) + 1}: ${questions[idx]?.question || ""}\nA: ${answer}`
      )
      .join("\n\n");
  };

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
                isAnalysis: true,
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
                isAnalysis: true,
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

  // Typing/analysis indicators
  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-3xl rounded-bl-md px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <span className="text-purple-600 text-sm font-medium">
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  );

  const LoadingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl rounded-bl-md px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-blue-600 text-sm font-medium">
            Analyzing your responses...
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <div
          className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ height: "90vh", maxHeight: 700 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80"></div>
            <div className="relative z-10 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <BrainIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    AI Wellness Companion
                  </h1>
                  <p className="text-white/80 text-sm">
                    Your safe space for mental health support
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white/50 to-white/30"
            style={{ minHeight: 0 }}
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex animate-fadeIn ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-2xl px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-br-md transform hover:scale-105"
                      : message.isAnalysis
                      ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 rounded-bl-md"
                      : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {message.isAnalysis && (
                    <div className="flex items-center space-x-2 mb-2">
                      <SparklesIcon className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                        Quiz Analysis
                      </span>
                    </div>
                  )}
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {analysisLoading && <LoadingIndicator />}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/30 bg-white/60 backdrop-blur-sm p-4 md:p-6 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                  placeholder="Share what's on your mind..."
                  className="w-full px-6 py-4 bg-white/80 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:shadow-md"
                  disabled={isLoading || analysisLoading}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button
                onClick={handleSendMessage}
                type="button"
                disabled={
                  isLoading || analysisLoading || inputValue.trim() === ""
                }
                className="group relative p-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-sm transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                <PaperAirplaneIcon className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            {/* Support Information */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600 mb-2">
                This is a supportive AI companion, not a replacement for
                professional therapy.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Safe Space</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Non-Judgmental</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Confidential</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quiz Suggestion Banner */}
          {!quizAnswers && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircleIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Get personalized support
                    </p>
                    <p className="text-xs text-emerald-600">
                      Take our quick mental health assessment for tailored
                      conversations
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => navigate("/quiz")}
                >
                  <span>Take Quiz</span>
                  <ArrowUpRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #2563eb);
        }
      `}</style>
    </div>
  );
};

export default TherapyChat;
