import React, { useState } from "react";
import axios from "axios";
import { backendURL } from './../backendURL';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    article: "",
    options: "other",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.article.trim()) {
      alert("Please fill in both Title and Article");
      return;
    }

    const newPost = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const res = await axios.post(
        `${backendURL}/posts/createPost`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Post created successfully!");
      setFormData({ title: "", article: "", options: "other", tags: "" });
    } catch (err) {
      console.error("Failed to create post", err);
      alert(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-100 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💙</span>
            </div>
            <span className="text-blue-700 font-medium text-sm">
              Mental Health Care
            </span>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
             Share Your Anonymous Story
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            We hear you. This platform is built for you — a safe space for your
            mental health and wellness journey, offering compassionate support
            tailored to your needs.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Story Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your story a meaningful title..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Article Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Story
            </label>
            <textarea
              name="article"
              value={formData.article}
              onChange={handleChange}
              placeholder="Share your experience, thoughts, or feelings. This is a safe space..."
              rows={10}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Category and Tags */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="options"
                value={formData.options}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors bg-white"
              >
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="depression">🟣 Depression</option>
                <option value="adhd">🌸 ADHD</option>
                <option value="other">🗒️ Other</option>
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 active:scale-98 transition-all duration-200"
            >
              Post Your Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
