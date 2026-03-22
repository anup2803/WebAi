import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import { useEffect } from "react";
import WebsiteEditor from "./pages/Editor";
import LiveSite from "./pages/LiveSite";
import axios from "axios";
import Pricing from "./pages/Pricing";
export const serverUrl = "https://webserverbackend.onrender.com";
const App = () => {
    // Debug cookie fetch
  // useEffect(() => {
  //   axios
  //     .get(`${serverUrl}/api/debug-cookie`, { withCredentials: true })
  //     .then((res) => console.log("Cookies from backend:", res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={userData ? <Dashboard /> : <Home />}
        />
        <Route path="/generate" element={userData ? <Generate /> : <Home />} />
        <Route
          path="/editor/:id"
          element={userData ? <WebsiteEditor /> : <Home />}
        />
        <Route path="/site/:slug" element={<LiveSite />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>

    
  );
};

export default App;
