import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useState } from "react";

const LiveSite = () => {
  const { slug } = useParams();

  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!slug) return;
    const handleWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-slug/${slug}`,
          { withCredentials: true },
        );
        setHtml(result.data.latestCode);
      } catch (error) {
        console.log(error);
        setError("site not found");
      }
    };

    handleWebsite();
  }, [slug]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        {error}
      </div>
    );
  }
  return (
    <div>
      <iframe
        title="Live Site"
        srcDoc={html}
        className="w-screen h-screen border-none"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default LiveSite;
