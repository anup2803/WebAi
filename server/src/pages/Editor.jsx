import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoCodeSlash } from "react-icons/io5";
import { MdMonitor } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import { useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import { RxCross2 } from "react-icons/rx";
import Editor from "@monaco-editor/react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const WebsiteEditor = () => {
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState([]);
  const { id } = useParams();
  const iframeRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, setThingkingIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [showFullPrev, setShowFullPrev] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const thinkingSteps = [
    "Understanding your request...",
    "Planning layout changes...",
    "Imporoving responsiveness...",
    "Appling animations...",
    "Finalizing update...",
  ];

  useEffect(() => {
    if (!updateLoading) return;
    const a = setInterval(() => {
      setThingkingIndex((prev) => (prev + 1) % thinkingSteps.length);
    }, 1200);
    return () => clearInterval(a);
  }, [updateLoading]);

  useEffect(() => {
    const handleWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessage(result.data.conversation);
        setPrompt("");
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Error");
      }
    };

    handleWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading....
      </div>
    );
  }

  const handleUpdate = async () => {
    setUpdateLoading(true);
    setMessage((m) => [...m, { role: "user", content: prompt }]);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id} `,
        { prompt },
        { withCredentials: true },
      );
      setUpdateLoading(false);
      setMessage((m) => [...m, { role: "ai", content: result.data.message }]);
      setCode(result.data.code);
      setPrompt("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeployed = async () => {
    try {
      const result = await axios(
        `${serverUrl}/api/website/deploy/${website._id}`,
        {
          withCredentials: true,
        },
      );
      window.open(result.data.url, "_blank");
    } catch (error) {}
  };
  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      {/* left side */}
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80">
        <Header />
        <>
          <div className=" flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {message.map((m, i) => (
              <div
                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                key={i}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-400 italic">
                  {thinkingSteps[thinkingIndex]}
                </div>
              </div>
            )}
          </div>
          {/* input filed */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                placeholder="Describe chanages ..."
                className="flex-1 resize-none px-4 rounded-2xl py-3 bg-white/5 border border-white/10 text-sm  outline-none"
              />
              <button
                onClick={handleUpdate}
                className="px-4 py-3 rounded-2xl text-black bg-white "
                disabled={updateLoading}
              >
                <IoMdSend size={14} />
              </button>
            </div>
          </div>
        </>
      </aside>
      {/* preview */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          {/* live preview */}
          <span className="text-sm text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            {/* button */}
            {website.deployed ? (
              ""
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition cursor-pointer"
                onClick={handleDeployed}
              >
                <FaRocket size={14} />
                Deploy
              </button>
            )}
            <button className="p-2 lg:hidden" onClick={() => setShowChat(true)}>
              <IoChatbubbleEllipsesOutline size={18} />
            </button>
            <button
              className="p-2 cursor-pointer"
              onClick={() => setShowCode(true)}
            >
              <IoCodeSlash size={18} />
            </button>
            <button
              className="p-2 cursor-pointer"
              onClick={() => setShowFullPrev(true)}
            >
              <MdMonitor size={18} />
            </button>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          className="flex-1 w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col"
          >
            <div className="h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]">
              <span className="text-sm font-medium">index.html</span>
              <button onClick={() => setShowCode(false)}>
                <RxCross2 size={14} />
              </button>
            </div>
            <Editor
              theme="vs-dark"
              value={code}
              language="html"
              onChange={(e) => setCode(e)}
            />
            ;
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullPrev && (
          <motion.div className="fixed inset-0 x-[9999] bg-black">
            <iframe
              className="w-full h-full bg-white"
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <button
              className=" absolute top-4 right-4 p-2 bg-black/70 rounded-lg cursor-pointer"
              onClick={() => setShowFullPrev(false)}
            >
              <RxCross2 size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
          >
            <Header onclose={() => setShowChat(false)} />
            <>
              <div className=" flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {message.map((m, i) => (
                  <div
                    className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
                    key={i}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {updateLoading && (
                  <div className="max-w-[85%] mr-auto">
                    <div className="px-4 py-2.5 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-400 italic">
                      {thinkingSteps[thinkingIndex]}
                    </div>
                  </div>
                )}
              </div>
              {/* input filed */}
              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    placeholder="Describe chanages ..."
                    className="flex-1 resize-none px-4 rounded-2xl py-3 bg-white/5 border border-white/10 text-sm  outline-none"
                  />
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-3 rounded-2xl text-black bg-white "
                    disabled={updateLoading}
                  >
                    <IoMdSend size={14} />
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  function Header({ onclose }) {
    return (
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
        {onclose && (
          <button onClick={onclose}>
            <RxCross2 color="white" size={18} />
          </button>
        )}
      </div>
    );
  }
};

export default WebsiteEditor;
