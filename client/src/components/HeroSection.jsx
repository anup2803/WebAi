import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ setOpenLogin, userData }) => {
  const navigate = useNavigate();

  return (
    <section className="pt-44 pb-32 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-bold tracking-tight"
      >
        Build Stunning Websites <br />
        <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          With AI
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
      >
        Describe your idea and let AI generate a modern, responsive,
        production-ready website.
      </motion.p>

      {/* Get Started */}
      <button
        className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-8 cursor-pointer"
        onClick={() => {
          userData ? navigate("/dashboard") : setOpenLogin(true);
        }}
      >
        {userData ? "Go to dashboard" : "Get Started"}
      </button>
    </section>
  );
};

export default HeroSection;
