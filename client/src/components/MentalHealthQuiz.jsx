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

const accentColors = [
  "from-green-400 to-blue-500",
  "from-teal-400 to-green-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-pink-400 to-red-500",
  "from-yellow-400 to-green-500",
  "from-orange-400 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-purple-500",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 py-10">
      <div className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-green-100 p-0 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 text-center tracking-tight">
            Mental Health Self Check-In
          </h1>
          <p className="text-green-900 text-lg text-center font-medium">
            Take a moment to reflect on your well-being.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-10">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              🎉 Thanks for completing the quiz!
            </h2>
            <p className="text-green-800 mb-6 max-w-md">
              This isn't a diagnostic tool, but a way to help reflect on your
              mental health. If you're struggling, consider talking to a
              professional. Everyone recognizes mental health differently, and
              it's okay to seek help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition font-semibold"
                onClick={resetQuiz}
              >
                Retake Quiz
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg shadow hover:from-blue-700 hover:to-green-600 transition font-semibold"
                onClick={handleGoToChat}
              >
                Discuss with AI Therapist
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-full rounded-2xl p-6 mb-4 bg-gradient-to-br ${
                  accentColors[current % accentColors.length]
                } shadow-lg`}
              >
                <div className="mb-2 text-lg text-white font-semibold tracking-wide text-center">
                  Question {current + 1} of {questions.length}
                </div>
                <div className="text-2xl font-bold text-white text-center mb-2 drop-shadow">
                  {questions[current].question}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {questions[current].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full px-4 py-3 bg-white/90 text-green-900 border-2 border-green-200 rounded-xl shadow hover:bg-green-50 hover:border-blue-400 hover:scale-105 transition-all duration-150 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 w-full bg-green-200 h-3 rounded-full shadow-inner">
              <div
                className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Subtle floating shapes for extra modern feel */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-300 to-blue-200 opacity-30 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-300 to-blue-200 opacity-30 rounded-full blur-2xl pointer-events-none animate-pulse" />
    </div>
  );
};

export default MentalHealthQuiz;
