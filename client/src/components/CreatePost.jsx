import React, { useEffect, useState } from "react";
import axios from "axios";

const optionsColors = {
  happy: "bg-yellow-100 text-yellow-900",
  sad: "bg-blue-100 text-blue-900",
  depression: "bg-purple-100 text-purple-900",
  adhd: "bg-pink-100 text-pink-900",
  other: "bg-gray-100 text-gray-700",
};

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    article: "",
    options: "other",
    tags: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ ...formData });

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/anonymous");
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditFormData({ ...editFormData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.article.trim()) {
      alert("Please fill in both Title and Article");
      return;
    }
    const newPost = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    try {
      const res = await axios.post("/api/anonymous", newPost);
      setPosts([res.data, ...posts]);
      setFormData({ title: "", article: "", options: "other", tags: "" });
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/anonymous/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
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
    if (!editFormData.title.trim() || !editFormData.article.trim()) {
      alert("Please fill in both Title and Article");
      return;
    }
    try {
      const updated = {
        ...editFormData,
        tags: editFormData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      const res = await axios.put(`/api/anonymous/${editingId}`, updated);
      setPosts(posts.map((p) => (p._id === editingId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10 tracking-wide drop-shadow-md">
        📝 Share Your Anonymous Stories
      </h1>

      {/* Form */}
      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mb-14">
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

      {/* Post List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col"
          >
            {editingId === post._id ? (
              <>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <textarea
                  name="article"
                  value={editFormData.article}
                  onChange={(e) => handleChange(e, true)}
                  rows={5}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <input
                  name="tags"
                  value={editFormData.tags}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <select
                  name="options"
                  value={editFormData.options}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full mb-6 px-5 py-3 border border-gray-300 rounded-lg text-blue-900 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                >
                  <option value="happy">😊 Happy</option>
                  <option value="sad">😢 Sad</option>
                  <option value="depression">🟣 Depression</option>
                  <option value="adhd">🌸 ADHD</option>
                  <option value="other">🗒️ Other</option>
                </select>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-400 active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">{post.title}</h2>
                <p className="text-gray-800 whitespace-pre-wrap mb-5 leading-relaxed">{post.article}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${optionsColors[post.options]}`}
                >
                  {post.options.toUpperCase()}
                </span>
                <div className="mt-4 flex flex-wrap gap-3">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-green-200 text-green-900 text-xs font-medium px-3 py-1 rounded-full select-none"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex justify-end gap-6 pt-6 border-t border-gray-100 text-sm">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    aria-label="Edit post"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                    aria-label="Delete post"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
