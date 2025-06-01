import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Heart,
  ArrowRight,
  Shield,
  Users,
  Star,
  Phone,
  Mail,
  MapPin,
  Brain,
  MessageCircle,
  Activity,
} from "lucide-react";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);

  // Use localStorage for authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep isLoggedIn in sync with localStorage
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenUser");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSignup = () => {
    window.location.href = "/signup";
  };

  // Only show Profile link if logged in
  const navLinks = [
    { name: "Anonymous Sharing", path: "/anonymoussharing" },
    { name: "Quiz", path: "/quiz" },
    { name: "Breathing Exercise", path: "/breathingexercise" },
    { name: "Therapy Chat", path: "/chat" },
    ...(isLoggedIn ? [{ name: "Profile", path: "/profile" }] : []),
  ];

  const services = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Understanding Mental Health",
      description:
        "Mental health is just as important as physical health. It affects how we think, feel, and act, influencing how we handle stress, relate to others, and make choices. Prioritizing mental well-being can lead to a more balanced, fulfilling life.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "You're Not Alone",
      description:
        "Millions of people struggle with mental health issues every day. Whether it's anxiety, depression, burnout, or trauma, it's okay to seek help. Community, connection, and support can make a world of difference on the path to healing.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "A Safe Space to Heal",
      description:
        "Everyone deserves a place where they feel heard, understood, and supported. This platform is designed to be that space — free of judgment, rooted in compassion, and focused on helping you feel better, one step at a time.",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const features = [
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Anonymous Sharing",
      description:
        "Share your thoughts and experiences safely in our anonymous community.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Mental Health Quiz",
      description:
        "Assess your mental wellness with our comprehensive evaluation tools.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Breathing Exercises",
      description:
        "Guided breathing techniques to help manage stress and anxiety.",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const testimonials = [
    {
      name: "Princess Diana",
      role: "Mental Health Advocate",
      content:
        "Everyone of us needs to show how much we care for each other and, in the process, care for ourselves.",
      rating: 5,
    },
    {
      name: "Robin Williams",
      role: "Actor & Comedian",
      content:
        "I think the saddest people always try their hardest to make people happy. Because they know what it feels like to feel absolutely worthless.",
      rating: 5,
    },
    {
      name: "Michelle Obama",
      role: "Former First Lady",
      content:
        "At the root of this dilemma is the way we view mental health in this country. Whether an illness affects your heart, your leg or your brain, it’s still an illness, and there should be no distinction.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Professional Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ name, path }) => (
                <div key={name} className="relative group">
                  <a
                    href={path}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-1"
                  >
                    {name}
                  </a>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map(({ name, path }) => (
                <a
                  key={name}
                  href={path}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {name}
                </a>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-full font-semibold mt-4 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Logout
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleLogin}
                    className="w-full text-gray-700 hover:text-blue-600 font-medium py-2 border border-gray-300 rounded-full transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  Mental Health Care
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MindCare
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We hear you. This platform is built for you — a safe space for
                  your mental health and wellness journey, offering
                  compassionate support tailored to your needs
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSignup}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-1000">1 in 5</div>
                  <div className="text-gray-600">
                    Adults Experience Mental Illness
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-1000">50%</div>
                  <div className="text-gray-600">
                    Mental Illness Begins by Age 14
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-1000">75%</div>
                  <div className="text-gray-600">
                    Mental Illness Begins by Age 24
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Quick Access
                    </h3>
                    <p className="text-gray-600">
                      Access our mental health tools instantly
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Anonymous & Confidential
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Therapy Chat</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">24/7 Available</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="/anonymoussharing"
                      className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                    >
                      Anonymous Sharing
                    </a>
                    <a
                      href="/chat"
                      className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                    >
                      Therapy Chat
                    </a>
                    <a
                      href="/quiz"
                      className="block w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center"
                    >
                      Take Quiz
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive mental health tools designed to support your
              wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <a
                key={index}
                href={
                  index === 0
                    ? "/anonymoussharing"
                    : index === 1
                    ? "/quiz"
                    : "/breathingexercise"
                }
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                  Explore Feature
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mental{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Health
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding mental health is crucial for overall well-being.
              Here are some key aspects to consider:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveService(index)}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Words that{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inspire
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Powerful quotes from influential voices on mental health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-gray-700 leading-relaxed mb-6 italic text-lg">
                  “{testimonial.content}”
                </p>
                <div className="mt-4 text-right">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm italic">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join our community today and take the first step towards better
              mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignup}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MindCare</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                MindCare is dedicated to providing a safe and supportive space
                for mental health and wellness.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {navLinks.map(({ name, path }) => (
                  <li key={name}>
                    <a
                      href={path}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Made By</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">👨‍💻</span>
                  Sreyash Mohanty
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">👨‍💻</span>
                  Aditya Jain
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2">👨‍💻</span>
                  Deepanshu Parashar
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 MindCare. All rights reserved. Your privacy and
              confidentiality are our priority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
