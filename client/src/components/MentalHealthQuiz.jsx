import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed with daily tasks?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
  {
    id: 2,
    question: "How well do you sleep at night?",
    options: ["Very well", "Okay", "Not well", "Barely sleep"],
  },
  {
    id: 3,
    question: "How often do you feel anxious or worried?",
    options: ["Rarely", "Sometimes", "Frequently", "All the time"],
  },
  {
    id: 4,
    question: "Do you find joy in activities you used to enjoy?",
    options: ["Yes", "Sometimes", "Rarely", "Not at all"],
  },
  {
    id: 5,
    question: "How often do you feel fatigued even after rest?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
  {
    id: 6,
    question: "Do you talk to someone about your feelings?",
    options: ["Regularly", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 7,
    question: "How often do you experience mood swings?",
    options: ["Never", "Occasionally", "Often", "Very often"],
  },
  {
    id: 8,
    question: "How would you rate your self-esteem?",
    options: ["High", "Moderate", "Low", "Very low"],
  },
  {
    id: 9,
    question: "Do you find it difficult to concentrate?",
    options: ["No", "Sometimes", "Often", "Always"],
  },
  {
    id: 10,
    question: "Do you feel supported by people around you?",
    options: ["Yes", "Somewhat", "Not really", "Not at all"],
  },
];

const MentalHealthQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [current]: option });
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setSubmitted(true);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
  };

  const handleGoToChat = () => {
    navigate("/chat", { state: { quizAnswers: answers } });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden flex items-center justify-center py-10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {submitted ? (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-white text-3xl">✨</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Thank you for taking the time
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Self-reflection is the first step toward understanding your
                mental health. Remember, this isn't a diagnostic tool, but a way
                to help you reflect. If you're struggling, consider reaching out
                to a mental health professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-200 font-semibold hover:scale-105"
                  onClick={resetQuiz}
                >
                  Retake Quiz
                </button>
                <button
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-200 font-semibold hover:scale-105 shadow-lg"
                  onClick={handleGoToChat}
                >
                  Therapy Chat
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span>💙</span>
                Mental Health Care
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
                Mental Health Self Check-In
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Take a moment to reflect on your well-being and inner state
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Progress</span>
                <span className="text-gray-700 font-medium">
                  {current + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((current + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  {questions[current].question}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {questions[current].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="group relative px-6 py-6 bg-gray-50 hover:bg-blue-50 text-gray-800 border-2 border-gray-100 hover:border-blue-200 rounded-2xl transition-all duration-200 font-semibold text-lg hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <span className="relative z-10">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthQuiz;
