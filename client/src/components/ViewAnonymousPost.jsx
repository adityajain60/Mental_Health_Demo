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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-lg text-blue-700 font-semibold">
          Loading...
        </div>
      </div>
    );
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 font-semibold text-lg">
          Post not found.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💙</span>
            </div>
            <span className="text-blue-700 font-medium text-sm">
              Mental Health Care
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-blue-800">
            {post.title}
          </h1>
          <span
            className={`inline-block mb-4 text-xs px-3 py-1 rounded-full ${
              optionsColors[post.options]
            }`}
          >
            {post.options}
          </span>
          <p className="text-gray-800 whitespace-pre-wrap mb-6">
            {post.article}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags &&
              post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
          </div>
          <div className="text-xs text-gray-400 mt-4">
            Posted on {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnonymousPost;
