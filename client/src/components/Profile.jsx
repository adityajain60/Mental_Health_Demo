import React, { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Camera,
  Edit3,
  MapPin,
  Calendar,
  ExternalLink,
  Users,
  Grid,
  MoreHorizontal,
  Award,
  TrendingUp,
  Sun,
  Moon,
  Leaf,
  Smile,
  User,
} from "lucide-react";
import { backendURL } from './../backendURL';
// Adjust these API endpoints to match your backend routes
const API_BASE_URL = backendURL;
const USER_API = `${API_BASE_URL}/user`;
const POSTS_API = `${API_BASE_URL}/posts`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from URL params or localStorage
  const userId =
    new URLSearchParams(window.location.search).get("userId") ||
    localStorage.getItem("userId");

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
    // eslint-disable-next-line
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${USER_API}/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError("Failed to load user data");
      setUserData(null);
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${USER_API}/${userId}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setUserPosts(data);
    } catch (err) {
      setUserPosts([]);
      console.error("Error fetching posts:", err);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await fetch(`${POSTS_API}/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const newLikedPosts = new Set(likedPosts);
        if (newLikedPosts.has(postId)) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch(`${USER_API}/${userId}/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  };

  const calculateAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInMonths = Math.floor(
      (now - created) / (1000 * 60 * 60 * 24 * 30)
    );

    if (diffInMonths < 1) return "New member";
    if (diffInMonths < 12) return `${diffInMonths} months`;
    return `${Math.floor(diffInMonths / 12)} years`;
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-red-500 mb-4">
            <User size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600">
            {error || "Unable to load profile data"}
          </p>
        </div>
      </div>
    );
  }

  const wellnessStats = [
    { label: "Posts Shared", value: userPosts.length.toString(), icon: Heart },
    {
      label: "Member Since",
      value: new Date(userData.createdAt).getFullYear().toString(),
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8 border border-green-100">
          <div className="relative h-48 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
                <circle cx="25" cy="25" r="2" fill="white" opacity="0.3" />
                <circle cx="75" cy="35" r="1.5" fill="white" opacity="0.3" />
                <circle cx="45" cy="75" r="1" fill="white" opacity="0.3" />
                <path
                  d="M20,60 Q30,50 40,60 T60,60"
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
              </svg>
            </div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-400 to-teal-500">
                  {userData.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(userData.name)}
                    </div>
                  )}
                </div>
                
              </div>
            </div>
            <button
              className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors flex items-center gap-2"
              onClick={() => setShowEditModal(true)}
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {userData.name}
                  </h1>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    🌱 {userData.gender}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {userData.age} years old
                  </span>
                </div>
                <p className="text-gray-600 text-lg mb-4 max-w-2xl leading-relaxed">
                  {userData.bio ||
                    "Mental health advocate sharing my journey of healing and growth. Here to listen, support, and remind you that you're not alone. Every small step counts. 💚"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Healing since{" "}
                    {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-teal-600">{userData.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-6">
                  {wellnessStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Icon size={18} className="text-teal-600" />
                          <div className="text-2xl font-bold text-gray-800">
                            {stat.value}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

           
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-2 border border-green-100">
          <div className="flex space-x-1">
            {[
              { id: "posts", label: "Journal", icon: Grid },
              { id: "about", label: "About Me", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-green-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 overflow-hidden">
                          {userData.profilePicture ? (
                            <img
                              src={userData.profilePicture}
                              alt={userData.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                              {getInitials(userData.name)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">
                              {userData.name}
                            </h3>
                            {/* Mood badge */}
                            {post.options && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                {post.options}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatTimestamp(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                    )}

                    {/* Post Body */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {post.article}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-green-100">
                <Leaf className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">
                  Start sharing your wellness journey with the community.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Smile className="text-teal-600" size={24} />
              About {userData.name}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Leaf className="text-green-600" size={18} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <span className="text-sm text-gray-600">Age</span>
                    <p className="text-lg font-semibold text-gray-800">
                      {userData.age} years old
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <span className="text-sm text-gray-600">Gender</span>
                    <p className="text-lg font-semibold text-gray-800">
                      {userData.gender}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(userData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                    <span className="text-sm text-gray-600">Posts Shared</span>
                    <p className="text-lg font-semibold text-gray-800">
                      {userPosts.length}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="text-red-500" size={18} />
                  Bio
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {userData.bio ||
                      "This user hasn't shared their story yet. Every journey is unique and valuable."}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border border-teal-100">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">
                  💚 Remember
                </h3>
                <p className="text-teal-700 italic">
                  "Healing is not linear, and that's perfectly okay. Every step
                  you take, no matter how small, is a victory worth celebrating.
                  You are stronger than you know, and you are never alone in
                  this journey."
                </p>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <EditProfileModal
            userData={userData}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedUser) => {
              setUserData(updatedUser);
              setShowEditModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
