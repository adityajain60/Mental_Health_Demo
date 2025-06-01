import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/posts";

const optionsColors = {
  happy: "bg-yellow-100 text-yellow-800",
  sad: "bg-blue-100 text-blue-800",
  depression: "bg-purple-100 text-purple-800",
  adhd: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
};

const ViewAnonymousPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getPost/${id}`);
        setPost(res.data);
      } catch (err) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        Post not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-green-700">{post.title}</h1>
      <span
        className={`inline-block mb-4 text-xs px-3 py-1 rounded-full ${
          optionsColors[post.options]
        }`}
      >
        {post.options}
      </span>
      <p className="text-gray-800 whitespace-pre-wrap mb-6">{post.article}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {post.tags &&
          post.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
      </div>
      <div className="text-xs text-gray-400 mt-4">
        Posted on {new Date(post.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ViewAnonymousPost;
