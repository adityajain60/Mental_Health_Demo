import React, { useState } from "react";
import axios from "axios";

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
        "http://localhost:8000/posts/createPost",
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
    <div className="max-w-3xl mx-auto p-8 bg-white border border-gray-300 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">
        📝 Share Your Anonymous Story
      </h1>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Your Story Title"
        className="w-full mb-5 px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      />
      <textarea
        name="article"
        value={formData.article}
        onChange={handleChange}
        placeholder="Write your story here..."
        className="w-full mb-5 px-4 py-4 border border-gray-300 rounded-lg text-base placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        rows={6}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
        <select
          name="options"
          value={formData.options}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-5 py-3 text-green-900 font-medium focus:ring-2 focus:ring-green-400 focus:outline-none transition mb-4 sm:mb-0"
        >
          <option value="happy">😊 Happy</option>
          <option value="sad">😢 Sad</option>
          <option value="depression">🟣 Depression</option>
          <option value="adhd">🌸 ADHD</option>
          <option value="other">🗒️ Other</option>
        </select>
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-transform"
      >
        Post Your Story
      </button>
    </div>
  );
};

export default CreatePost;
