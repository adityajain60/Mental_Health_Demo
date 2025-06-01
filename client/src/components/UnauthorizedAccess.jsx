import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <FaLock className="text-5xl text-red-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-xs">
          Sorry, you do not have permission to view this page. Please log in
          with the correct account or return to the homepage.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
