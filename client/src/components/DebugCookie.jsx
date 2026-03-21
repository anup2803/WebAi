import React, { useEffect } from "react";
import axios from "axios";

const DebugCookie = () => {
  useEffect(() => {
    axios
      .get("https://webserverbackend.onrender.com/api/debug-cookie", { withCredentials: true })
      .then(res => console.log("Cookies from backend:", res.data))
      .catch(err => console.log("Error fetching debug cookie:", err));
  }, []);

  return <div>Check console for cookie debug info</div>;
};

export default DebugCookie;
