import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../backendURL";
const API_BASE_URL = `${backendURL}/posts`;

const optionsColors = {
  happy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sad: "bg-blue-50 text-blue-700 border-blue-200",
  depression: "bg-purple-50 text-purple-700 border-purple-200",
  adhd: "bg-pink-50 text-pink-700 border-pink-200",
  other: "bg-slate-50 text-slate-700 border-slate-200",
};

const optionsIcons = {
  happy: "🌟",
  sad: "💙",
  depression: "🔮",
  adhd: "🧠",
  other: "📝",
};

const AnonymousPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    article: "",
    options: "other",
    tags: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getAllPosts`);
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deletePosts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
      alert(err.response?.data?.error || "Failed to delete post");
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setEditFormData({
      title: post.title,
      article: post.article,
      options: post.options,
      tags: post.tags.join(", "),
    });
  };

  const saveEdit = async () => {
    try {
      const updated = {
        ...editFormData,
        tags: editFormData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const res = await axios.put(
        `${API_BASE_URL}/editPosts/${editingId}`,
        updated,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(posts.map((p) => (p._id === editingId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      console.error("Update failed", err);
      alert(err.response?.data?.error || "Failed to update post");
    }
  };

  const handleView = (id) => {
    navigate(`/anonymouspost/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl px-6 py-3 mb-6 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg">🧠</span>
            </div>
            <span className="text-slate-700 font-semibold text-sm tracking-wide uppercase">
              Mental Health Community
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Anonymous Stories
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            A safe space to share your experiences, connect with others, and
            find support in our community
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {editingId === post._id ? (
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Title
                      </label>
                      <input
                        name="title"
                        value={editFormData.title}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your story title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Content
                      </label>
                      <textarea
                        name="article"
                        value={editFormData.article}
                        onChange={handleChange}
                        rows={6}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Share your story..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tags
                      </label>
                      <input
                        name="tags"
                        value={editFormData.tags}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="mental health, anxiety, support..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        name="options"
                        value={editFormData.options}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="happy">🌟 Happy & Hopeful</option>
                        <option value="sad">💙 Sadness & Grief</option>
                        <option value="depression">🔮 Depression</option>
                        <option value="adhd">🧠 ADHD & Focus</option>
                        <option value="other">📝 Other Experiences</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={saveEdit}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-slate-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${
                        optionsColors[post.options]
                      }`}
                    >
                      <span className="text-base">
                        {optionsIcons[post.options]}
                      </span>
                      {post.options.charAt(0).toUpperCase() +
                        post.options.slice(1)}
                    </span>
                    <div className="text-xs text-slate-500 font-medium">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-2xl font-bold mb-4 cursor-pointer text-slate-800 hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-600"
                    onClick={() => handleView(post._id)}
                    title="Click to view full post"
                  >
                    {post.title}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-slate-600 leading-relaxed mb-6 line-clamp-4">
                    {post.article.length > 200
                      ? `${post.article.substring(0, 200)}...`
                      : post.article}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="text-xs text-slate-500 px-3 py-1">
                          +{post.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleView(post._id)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                    >
                      <span>👁</span>
                      Read Full Story
                    </button>

                    {post.createdBy === userId && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors duration-200"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-semibold text-sm transition-colors duration-200"
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              No Stories Yet
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Be the first to share your story and help build this supportive
              community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousPosts;
