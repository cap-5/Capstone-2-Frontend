import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL, SOCKETS_URL, NODE_ENV } from "./shared";
import { io } from "socket.io-client";
import UserSearch from "./components/UserSearch";
import DisplayUserInfo from "./components/DisplayUserInfo";
import CreateGroup from "./components/CreateGroup";
import ImageRender from "./components/ImageRender";
import Dashboard from "./components/Dashboard";
import AssignItems  from "./components/AssignItems";

const socket = io(SOCKETS_URL, {
  withCredentials: NODE_ENV === "production",
});

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔗 Connected to socket");
    });
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

return (
  <div>
    <NavBar user={user} onLogout={handleLogout} />
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/upload/:groupId" element={<ImageRender />} />
        <Route path="/user-search" element={<UserSearch />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/assign" element={<AssignItems />} />
         {/* nested navbar layout */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<DisplayUserInfo />} />
        </Route>

      </Routes>
    </div>
  </div>
);
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);