import React, { useState } from "react";
import { Heart, Brain, Moon, Activity, Sun } from "lucide-react";
import { backendURL } from './../backendURL';

const initialState = {
  Gender: 0,
  Age: 20,
  "Academic Pressure": 5,
  "Study Satisfaction": 5,
  "Sleep Duration": 0,
  "Dietary Habits": 1,
  "Have you ever had suicidal thoughts ?": 0,
  "Study Hours": 6,
  "Financial Stress": 5,
  "Family History of Mental Illness": 0,
};

const fieldMeta = {
  Gender: {
    label: "Gender",
    type: "select",
    options: ["Female", "Male"],
    icon: Heart,
    description: "Your gender identity",
  },
  Age: {
    label: "Age",
    type: "number",
    min: 10,
    max: 100,
    step: 1,
    icon: Brain,
    description: "Your current age",
  },
  "Academic Pressure": {
    label: "Academic Pressure",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    icon: Activity,
    description: "Rate pressure you feel due to studies",
  },
  "Study Satisfaction": {
    label: "Study Satisfaction",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    icon: Brain,
    description: "How satisfied are you with your studies?",
  },
  "Sleep Duration": {
    label: "Sleep Duration",
    type: "select",
    options: [
      "7-8 hours",
      "Less than 5 hours",
      "5-6 hours",
      "More than 8 hours",
    ],
    icon: Moon,
    description: "Average hours of sleep per night",
  },
  "Dietary Habits": {
    label: "Dietary Habits",
    type: "select",
    options: ["Unhealthy", "Healthy", "Other"],
    icon: Activity,
    description: "Your daily food habits",
  },
  "Have you ever had suicidal thoughts ?": {
    label: "Suicidal Thoughts",
    type: "select",
    options: ["No", "Yes"],
    icon: Heart,
    description: "Have you ever had suicidal thoughts?",
  },
  "Study Hours": {
    label: "Study Hours",
    type: "number",
    min: 0,
    max: 18,
    step: 0.5,
    icon: Activity,
    description: "How many hours do you study per day?",
  },
  "Financial Stress": {
    label: "Financial Stress",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    icon: Brain,
    description: "Rate your financial stress from 1 to 10",
  },
  "Family History of Mental Illness": {
    label: "Family History",
    type: "select",
    options: ["No", "Yes"],
    icon: Brain,
    description: "Any family history of mental illness?",
  },
};

const MentalHealthForm = () => {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        `${backendURL}/model/predict-mental-health`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Prediction failed. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Mental Health Prediction
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-6"
        >
          {Object.entries(fieldMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <div key={key} className="space-y-2">
                <label className="flex items-center gap-2 text-slate-700 font-medium">
                  <Icon className="w-4 h-4" /> {meta.label}
                </label>
                <p className="text-xs text-slate-500">{meta.description}</p>
                {meta.type === "select" ? (
                  <select
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {meta.options.map((opt, idx) => (
                      <option key={idx} value={idx}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl"
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow text-center">
            {result.error ? (
              <p className="text-rose-600 font-medium">{result.error}</p>
            ) : (
              <p className="text-slate-800 text-lg font-semibold">
                Prediction: {result.prediction === 0 ? "Healthy" : "Depressed"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealthForm;
