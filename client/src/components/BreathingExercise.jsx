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

const resources = [
  {
    id: 1,
    title: "Breathing Techniques for Stress Relief",
    url: "https://www.webmd.com/balance/stress-management-breathing-exercises",
  },
  {
    id: 2,
    title: "The Science Behind Breathing Exercises",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/",
  },
];

// Breathing phases and durations in seconds
const phases = [
  { name: "Inhale", duration: 4 },
  { name: "Hold", duration: 7 },
  { name: "Exhale", duration: 8 },
];

const breathingTechniques = [
  {
    id: 1,
    title: "4-7-8 Breathing",
    description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. This technique is known for reducing anxiety and aiding sleep.",
    icon: "🌬️"
  },
  {
    id: 2,
    title: "Box Breathing",
    description: "Inhale, hold, exhale, and hold again, each for 4 seconds. Also known as square breathing, it is used by Navy SEALs to stay calm and focused.",
    icon: "🧊"
  },
  {
    id: 3,
    title: "Diaphragmatic Breathing",
    description: "Focus on breathing deeply into your belly rather than shallow chest breaths. This is the natural way to breathe and helps reduce stress.",
    icon: "🌊"
  },
  {
    id: 4,
    title: "Alternate Nostril Breathing",
    description: "Gently close one nostril while inhaling through the other, then switch. Balances the nervous system and calms the mind.",
    icon: "👃"
  }
];

export default function BreathingExercise() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [running, setRunning] = useState(false);
  const [activeSection, setActiveSection] = useState('exercise');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    if (timeLeft === 0) {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
      setTimeLeft(phases[(phaseIndex + 1) % phases.length].duration);
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, running, phaseIndex]);

  const toggleRunning = () => {
    if (running) {
      setRunning(false);
    } else {
      setRunning(true);
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
    }
  };

  const navItems = [
    { id: 'exercise', label: 'Exercise', icon: '💨' },
    { id: 'techniques', label: 'Techniques', icon: '🧘' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'benefits', label: 'Benefits', icon: '✨' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-800">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-800">
              Breathing & Mindfulness
            </h1>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Exercise Section */}
        {activeSection === 'exercise' && (
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Breathe & Focus
              </h2>
              
              <div className="relative mb-12">
                <div
                  className={`mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-200 to-purple-200
                    ${running ? "animate-pulse" : ""}
                  `}
                  style={{
                    animationTimingFunction: "ease-in-out",
                    animationDuration: `${phases[phaseIndex].duration}s`,
                    animationIterationCount: "infinite",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">{phases[phaseIndex].name}</p>
                    <p className="text-5xl md:text-6xl font-bold text-blue-600">{timeLeft}s</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={toggleRunning}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/30"
              >
                {running ? "⏸️ Pause Exercise" : "▶️ Start Exercise"}
              </button>
              
              <p className="mt-8 text-gray-600 text-lg max-w-lg mx-auto">
                Follow the 4-7-8 breathing pattern. Inhale for 4 seconds, hold for 7 seconds, then exhale for 8 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Techniques Section */}
        {activeSection === 'techniques' && (
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Breathing Techniques
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {breathingTechniques.map((technique) => (
                  <div 
                    key={technique.id}
                    className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start">
                      <span className="text-6xl mr-6">{technique.icon}</span>
                      <div>
                        <h3 className="font-bold text-2xl text-blue-600 mb-4">{technique.title}</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">{technique.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Educational Resources
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-blue-600 mb-8 flex items-center">
                    <span className="mr-3">📄</span>
                    Educational Articles
                  </h3>
                  <div className="space-y-6">
                    {articles.map(({ id, title, url }) => (
                      <a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-blue-600 group transition-colors duration-300 p-4 rounded-lg hover:bg-blue-50"
                      >
                        <span className="mr-4 text-xl">🔗</span>
                        <span className="group-hover:underline text-lg">{title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-blue-600 mb-8 flex items-center">
                    <span className="mr-3">🔬</span>
                    Additional Resources
                  </h3>
                  <div className="space-y-6">
                    {resources.map(({ id, title, url }) => (
                      <a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-blue-600 group transition-colors duration-300 p-4 rounded-lg hover:bg-blue-50"
                      >
                        <span className="mr-4 text-xl">📚</span>
                        <span className="group-hover:underline text-lg">{title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {activeSection === 'benefits' && (
          <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Benefits of Breathing Exercises
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: "🧘", title: "Reduces Stress", desc: "Lower cortisol levels and promote relaxation" },
                  { icon: "💓", title: "Lowers Blood Pressure", desc: "Improve cardiovascular health naturally" },
                  { icon: "🎯", title: "Improves Focus", desc: "Enhance concentration and mental clarity" },
                  { icon: "😴", title: "Enhances Sleep", desc: "Better sleep quality and faster onset" },
                  { icon: "⚡", title: "Boosts Energy", desc: "Increase oxygen flow and vitality" },
                  { icon: "🕊️", title: "Calms Anxiety", desc: "Activate parasympathetic nervous system" },
                  { icon: "🍃", title: "Improves Digestion", desc: "Stimulate digestive processes naturally" },
                  { icon: "🧠", title: "Increases Mindfulness", desc: "Develop present-moment awareness" }
                ].map((benefit, index) => (
                  <div 
                    key={index}
                    className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg text-center hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{benefit.title}</h3>
                    <p className="text-gray-700 text-sm">{benefit.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Regular breathing exercises can transform your physical and mental well-being. 
                  Start with just 5 minutes daily and gradually increase your practice time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}