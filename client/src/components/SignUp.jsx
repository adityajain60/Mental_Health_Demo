import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Removed PhotoIcon import as profile picture section is removed
// Removed FaFacebookF, FaTwitter, FaGoogle imports as social icons are removed

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    gender: "",
    bio: "", // Bio field is kept
    age: "",
  });

  // const [profilePicture, setProfilePicture] = useState(null); // Removed profilePicture state
  const [error, setError] = useState("");
  const [missingDetailsError, setMissingDetailsError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleFileChange = (e) => { // Removed handleFileChange
  //   setProfilePicture(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "username",
      "password",
      "name",
      "email",
      "gender",
      "age",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setMissingDetailsError(
        `Please fill in all required fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    setMissingDetailsError(""); // Clear previous missing fields error

    try {
      const response = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send data as JSON
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || `Network response was not ok (${response.status})`
        );
        throw new Error(
          data.error || `Network response was not ok (${response.status})`
        );
      }

      console.log("Signup successful:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Error signing up. Please try again.");
    }
  };

  // handleCancel function is kept in case it's needed for other purposes,
  // but the "Cancel" button that used it has been removed.
  // Bio field reset is kept. Profile picture reset is removed.
  const handleCancel = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      email: "",
      gender: "",
      bio: "",
      age: "",
    });
    // setProfilePicture(null); // Removed profilePicture state reset
    setError("");
    setMissingDetailsError("");
    navigate("/"); // Optional: navigate to home or another page on cancel
  };

  const closeModal = () => {
    setError("");
    setMissingDetailsError("");
  };

  // Common input field styling
  const inputStyle =
    "block w-full px-3 py-2 mt-1 border-b-2 border-gray-300 bg-transparent placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-0 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-gray-700";

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      {(error || missingDetailsError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full mx-4">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V7a1 1 0 112 0v3a1 1 0 01-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Error
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {error || missingDetailsError}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={closeModal}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        {/* 1) On top instead of create Account, Write Sign Up, and center it */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className={labelStyle}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Choose a username"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelStyle}>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label htmlFor="age" className={labelStyle}>
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Your age"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className={labelStyle}>
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                autoComplete="sex"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputStyle} py-[9px]`} 
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non Binary">Non Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Bio - This section is kept */}
          <div>
            <label htmlFor="bio" className={labelStyle}>
              About (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Write a few sentences about yourself."
            />
          </div>

          {/* 2) Remove option for profile pic - Entire Profile Picture section removed */}

          {/* Buttons */}
          {/* 5) Remove Cancel button */}
          {/* 6) Center Create Account Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="w-full max-w-xs sm:w-auto rounded-md bg-indigo-600 px-6 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Create Account &rarr;
            </button>
          </div>

          {/* 4) Remove social media icons - Entire Social Media Separator and Icons section removed */}
        </form>
      </div>
    </div>
  );
}