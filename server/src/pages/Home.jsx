import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Highlights from "../components/Highlights";
import HeroSection from "../components/HeroSection";
import LoginModel from "../components/LoginModel";
import { useDispatch, useSelector } from "react-redux";
import { LuCoins } from "react-icons/lu";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) return;
    const handleAllWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        setWebsites(result.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    handleAllWebsite(); // 👈 THIS WAS MISSING
  }, [userData]);
  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex  justify-between items-center">
          {/* logo */}
          <div
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            WebBuilder.ai
          </div>
          {/* right side */}
          <div className="flex items-center gap-5">
            {/* pricing */}
            <div
              className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </div>
            {/* credit */}
            {userData && (
              <div
                className=" hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition "
                onClick={() => navigate("/pricing")}
              >
                <LuCoins className="text-yellow-400 " size={14} />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits}</span>
                <span className="font-semibold">+</span>
              </div>
            )}
            {/* getstarted */}
            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm cursor-pointer"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              <div className=" relative">
                <button
                  className="flex items-center "
                  onClick={() => setOpenProfile((prev) => !prev)}
                >
                  <img
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                    alt=""
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className=" absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium truncate">
                            {userData.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {userData.email}
                          </p>
                        </div>
                        <button className="md:hidden w-full px-4 py-3 flex items-center  gap-2 text-sm border-b border-white/10 hover:bg-white/5">
                          <LuCoins className="text-yellow-400 " size={14} />
                          <span className="text-zinc-300">Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 "
                          onClick={() => navigate("/dashboard")}
                        >
                          Dashboard
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 "
                          onClick={handleLogOut}
                        >
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* HeroSection */}
      <HeroSection setOpenLogin={setOpenLogin} userData={userData} />

      {/* Card sections */}
      <Highlights highlights={highlights} />

      {/* display websites */}
      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <h3 className="text-2xl font-semibold mb-6">Your Websites</h3>
          <div className="grid gird-cols-1 md:grid-cols-3 gap-6">
            {websites.slice(0, 3).map((w, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`editor/${w._id}`)}
                className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className="h-40 bg-black">
                  <iframe
                    srcDoc={w.latestCode}
                    className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>
                  <p>
                    Last Updated{" "}
                    {new Date(w.updatedAt).toLocaleDateString()}{" "}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* footer */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} WebBuilder.ai
      </footer>

      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;
