import { useState, useEffect, useRef } from "react";

const articles = [
  {
    id: 1,
    title: "Benefits of Deep Breathing",
    url: "https://www.healthline.com/health/deep-breathing",
  },
  {
    id: 2,
    title: "How to Practice Mindful Breathing",
    url: "https://www.mindful.org/how-to-practice-mindful-breathing/",
  },
  {
    id: 3,
    title: "Breathing Exercises for Anxiety",
    url: "https://www.anxiety.org/breathing-exercises",
  },
];

// Breathing phases and durations in seconds
const phases = [
  { name: "Inhale", duration: 4 },
  { name: "Hold", duration: 7 },
  { name: "Exhale", duration: 8 },
];

export default function BreathingExercise() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(() => {
    // Load score from localStorage or start from 0
    const saved = localStorage.getItem("breathingScore");
    return saved ? Number(saved) : 0;
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    if (timeLeft === 0) {
      // Move to next phase or loop back
      setPhaseIndex((prev) => (prev + 1) % phases.length);
      setTimeLeft(phases[(phaseIndex + 1) % phases.length].duration);
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, running, phaseIndex]);

  // Start or pause breathing exercise
  const toggleRunning = () => {
    if (running) {
      setRunning(false);
    } else {
      setRunning(true);
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
    }
  };

  // Complete one full cycle and add score
  const completeCycle = () => {
    setScore((s) => {
      const newScore = s + 1;
      localStorage.setItem("breathingScore", newScore);
      return newScore;
    });
    setRunning(false);
    setPhaseIndex(0);
    setTimeLeft(phases[0].duration);
  };

  // Check if current phase is the last phase and timeLeft is 0 to complete cycle
  useEffect(() => {
    if (running && phaseIndex === phases.length - 1 && timeLeft === 0) {
      completeCycle();
    }
  }, [phaseIndex, timeLeft, running]);

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-green-700 text-center">
        Breathing & Mindfulness Exercise
      </h2>

      <div className="text-center">
        <div
          className={`mx-auto mb-3 w-32 h-32 rounded-full border-8 border-green-400
            ${running ? "animate-pulse" : ""}
          `}
          style={{
            animationTimingFunction: "ease-in-out",
            animationDuration: `${phases[phaseIndex].duration}s`,
            animationIterationCount: "infinite",
          }}
        />
        <p className="text-xl font-bold">{phases[phaseIndex].name}</p>
        <p className="text-lg text-gray-600">{timeLeft}s</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleRunning}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
        >
          {running ? "Pause" : "Start"}
        </button>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Educational Articles</h3>
        <ul className="list-disc list-inside space-y-1 text-green-800">
          {articles.map(({ id, title, url }) => (
            <li key={id}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t text-center">
        <p className="text-green-700 font-semibold">
          Your Breathing Exercise Score: <span className="text-xl">{score}</span>
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Each completed cycle adds 1 point to your score.
        </p>
      </div>
    </div>
  );
}
