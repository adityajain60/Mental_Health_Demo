import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/SignUp";
import Login from "./components/SignIn";
import AnonymousSharing from "./components/AnonymousSharing";
import AnonymousPost from "./components/AnonymousPost";
import CreatePost from "./components/CreatePost";
import TherapyChat from "./components/TherapyChat";
import MentalHealthQuiz from "./components/MentalHealthQuiz";
import BreathingExercise from "./components/BreathingExercise";
import Profile from "./components/Profile";
import ViewAnonymousPost from "./components/ViewAnonymousPost";
import UnauthorizedAccess from "./components/UnauthorizedAccess";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("token:", token);

  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenUser");
    return <Navigate to="/unauthorizedAccess" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorizedAccess" element={<UnauthorizedAccess />} />
        <Route
          path="/anonymoussharing"
          element={
            <PrivateRoute>
              <AnonymousSharing />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/anonymous-posts"
          element={
            <PrivateRoute>
              <AnonymousPost />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-anonymous-post"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <MentalHealthQuiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/breathingexercise"
          element={
            <PrivateRoute>
              <BreathingExercise />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <TherapyChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/anonymouspost/:id"
          element={
            <PrivateRoute>
              <ViewAnonymousPost />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
