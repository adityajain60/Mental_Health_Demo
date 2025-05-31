import React, { useState } from 'react';
import { ArrowRight, User, Lock } from 'lucide-react';

export default function SignInPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log('Sign in attempted with:', { name, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        {/* Header with emoji and welcome text */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👋</div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Welcome!</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {/* Sign in form */}
        <div className="space-y-4">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder=""
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder=""
              />
            </div>
          </div>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between text-xs pt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-gray-500">remember me?</span>
            </label>
            <button 
              type="button"
              onClick={() => console.log('Forgot password clicked')}
              className="text-blue-500 hover:text-blue-600"
            >
              forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200 flex items-center justify-center text-sm font-medium mt-6"
          >
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}