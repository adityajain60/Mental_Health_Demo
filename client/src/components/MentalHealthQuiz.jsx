import React, { useState } from 'react';
const questions = [
  {
    id: 1,
    question: 'How often do you feel overwhelmed with daily tasks?',
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 2,
    question: 'How well do you sleep at night?',
    options: ['Very well', 'Okay', 'Not well', 'Barely sleep'],
  },
  {
    id: 3,
    question: 'How often do you feel anxious or worried?',
    options: ['Rarely', 'Sometimes', 'Frequently', 'All the time'],
  },
  {
    id: 4,
    question: 'Do you find joy in activities you used to enjoy?',
    options: ['Yes', 'Sometimes', 'Rarely', 'Not at all'],
  },
  {
    id: 5,
    question: 'How often do you feel fatigued even after rest?',
    options: ['Never', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 6,
    question: 'Do you talk to someone about your feelings?',
    options: ['Regularly', 'Sometimes', 'Rarely', 'Never'],
  },
  {
    id: 7,
    question: 'How often do you experience mood swings?',
    options: ['Never', 'Occasionally', 'Often', 'Very often'],
  },
  {
    id: 8,
    question: 'How would you rate your self-esteem?',
    options: ['High', 'Moderate', 'Low', 'Very low'],
  },
  {
    id: 9,
    question: 'Do you find it difficult to concentrate?',
    options: ['No', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 10,
    question: 'Do you feel supported by people around you?',
    options: ['Yes', 'Somewhat', 'Not really', 'Not at all'],
  },
];
const MentalHealthQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-green-50 rounded-2xl shadow-xl border border-green-100">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        🧠 Mental Health Self Check-In
      </h1>

      {submitted ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Thanks for completing the quiz!</h2>
          <p className="text-green-800 mb-6">
            This isn't a diagnostic tool, but a way to help reflect on your mental health. If you're struggling, consider talking to a professional.
            Everyone recognizes mental health differently, and it's okay to seek help.
          </p>
          <button 
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            onClick={resetQuiz}
          >
            Retake Quiz
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-lg text-green-800 font-medium">
            Question {current + 1} of {questions.length}
          </div>

          <div className="text-xl font-semibold text-green-900 mb-6">
            {questions[current].question}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {questions[current].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full px-4 py-3 bg-white text-green-800 border border-green-200 rounded-lg shadow-sm hover:bg-green-100 transition"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-6 w-full bg-green-200 h-2 rounded-full">
            <div
              className="h-2 bg-green-600 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default MentalHealthQuiz;
