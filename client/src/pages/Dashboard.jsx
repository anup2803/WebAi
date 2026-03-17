import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useState } from "react";
import { FaRegCopy, FaRocket } from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { LuCopyPlus } from "react-icons/lu";

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [websites, setWebsites] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const handleDeployed = async (id) => {
    try {
      const result = await axios(`${serverUrl}/api/website/deploy/${id}`, {
        withCredentials: true,
      });

      window.open(result.data.url, "_blank");
      setWebsites((prev) =>
        prev.map((w) =>
          w._id === id
            ? { ...w, deployed: true, deployedUrl: result.data.url }
            : w,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleAllWebsite = async () => {
      try {
        setLoading(true);

        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });

        setWebsites(result.data);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Error loading websites");
      } finally {
        setLoading(false);
      }
    };

    handleAllWebsite(); // 👈 THIS WAS MISSING
  }, []);

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployedUrl);
    setCopiedId(site._id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <IoMdArrowRoundBack size={16} onClick={() => navigate("/")} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
            onClick={() => navigate("/generate")}
          >
            + New Website
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>
          <h1 className="text-3xl font-bold">{userData.name}</h1>
        </motion.div>

        {/* loading */}
        {loading && (
          <div className="mt-24 text-center text-zinc-400">
            Loading your websites...
          </div>
        )}
        {error && !loading && (
          <div className="mt-24 text-center text-red-400">{error}</div>
        )}

        {websites?.length === 0 && (
          <div className="mt-24 text-center text-zinc-400">
            You have no website.
          </div>
        )}

        {!loading && !error && websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((m, i) => {
              const copied = copiedId === m._id;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
                >
                  <div
                    className="relative h-40 bg-black cursor-pointer"
                    onClick={() => navigate(`/editor/${m._id}`)}
                  >
                    <iframe
                      srcDoc={m.latestCode}
                      className=" absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                    />
                    <div className=" absolute inset-0 bg-black/30" />
                  </div>
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <h3 className="text-base font-semibold line-clamp-2">
                      {m.title}
                    </h3>
                    <p>
                      Last Updated{" "}
                      {new Date(m.updatedAt).toLocaleDateString()}{" "}
                    </p>
                    {!m.deployed ? (
                      <button
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
                        onClick={() => handleDeployed(m._id)}
                      >
                        <FaRocket size={18} />
                        Deploy
                      </button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(m)}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all  
                    ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 hover:bg-white/20 border border-white/10"}
                        `}
                      >
                        {copied ? (
                          <>
                            <FaRegCopy size={14} />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <IoShareSocial size={14} /> Share Link
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
