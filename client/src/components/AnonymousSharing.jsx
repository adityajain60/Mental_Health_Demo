import React from "react";
import { Link } from "react-router-dom";

const AnonymousSharing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl text-left space-y-6">
        <h1 className="text-5xl font-bold">Anonymous Sharing Portal</h1>
        <p className="text-lg">
          Welcome to the Anonymous Sharing Portal, a safe haven where you can
          express yourself freely without the fear of being judged.
        </p>
        <p className="text-lg">
          Here, you can share your thoughts, feelings, and experiences openly,
          knowing that your identity remains confidential. This platform is
          dedicated to fostering a supportive community where honesty and
          authenticity are valued.
        </p>
        <p className="text-lg">
          Whether you seek advice, want to share a personal story, or simply
          need a place to vent, our anonymous portal is here for you. Feel free
          to be yourself and connect with others who understand and respect your
          journey.
        </p>

        <div className="flex space-x-4 pt-4">
          <Link
            to="/create-anonymous-post"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-xl shadow-md hover:from-blue-700 hover:to-blue-500 transition-all"
          >
            Create a post right now →
          </Link>

          <Link
            to="/anonymous-posts"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-800 to-blue-600 border border-transparent rounded-xl shadow-md hover:from-blue-900 hover:to-blue-700 transition-all"
          >
            View all anonymous posts →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnonymousSharing;
