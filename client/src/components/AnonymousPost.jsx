import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- Add this import

const API_BASE_URL = "http://localhost:8000/posts";

const optionsColors = {
  happy: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
  depression: "bg-purple-100 text-purple-800",
  adhd: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
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
  const navigate = useNavigate(); // <-- Add this

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

  // Add this function to handle redirect
  const handleView = (id) => {
    navigate(`/anonymouspost/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
        📝 Anonymous Stories
      </h1>

      {/* Post List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow"
          >
            {editingId === post._id ? (
              <>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                  className="w-full mb-2 border p-2 rounded"
                />
                <textarea
                  name="article"
                  value={editFormData.article}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mb-2 border p-2 rounded"
                />
                <input
                  name="tags"
                  value={editFormData.tags}
                  onChange={handleChange}
                  className="w-full mb-2 border p-2 rounded"
                />
                <select
                  name="options"
                  value={editFormData.options}
                  onChange={handleChange}
                  className="w-full mb-3 border p-2 rounded"
                >
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="depression">Depression</option>
                  <option value="adhd">ADHD</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-xl font-semibold mb-1 cursor-pointer hover:underline"
                  onClick={() => handleView(post._id)}
                  title="View full post"
                >
                  {post.title}
                </h2>
                <p className="text-gray-800 whitespace-pre-wrap mb-3">
                  {post.article}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    optionsColors[post.options]
                  }`}
                >
                  {post.options}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Only show Edit/Delete if current user is the creator */}
                {post.createdBy === userId && (
                  <div className="mt-4 flex justify-end gap-3 text-sm">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
                {/* Add a View button for all users */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleView(post._id)}
                    className="text-green-700 hover:underline text-sm"
                  >
                    👁️ View
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

export default AnonymousPosts;
