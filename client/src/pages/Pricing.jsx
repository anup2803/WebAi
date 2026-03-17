import React, { useState } from "react";
import { FaArrowLeft, FaCheck, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoginModel from "../components/LoginModel";
import { serverUrl } from "../App";

const Pricing = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const plans = [
    {
      key: "free",
      name: "Free",
      price: 0,
      credits: 100,
      description: "Perfect to explore Webbuilder.ai",
      features: [
        "AI website generation",
        "Responsive HTML output",
        "Basic animations",
      ],
      popular: false,
      button: "Get Started",
    },
    {
      key: "pro",
      name: "Pro",
      price: 499,
      credits: 500,
      description: "For serious creators & freelancers",
      features: [
        "Everything in Free",
        "Faster generation",
        "Edit & regenerate",
        "Download source code",
      ],
      popular: true,
      button: "Upgrade to Pro",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: 999,
      credits: 1000,
      description: "For teams & power users",
      features: [
        "Unlimited iterations",
        "Highest priority",
        "Team collaboration",
        "Dedicated support",
      ],
      popular: false,
      button: "Contact Sales",
    },
  ];

  const handleBuy = async (planKey) => {
    if (!userData) {
      navigate("/");
      return;
    }
    if (planKey == "free") {
      navigate("/dashboard");
      return;
    }
    setLoading(planKey);
    try {
      const result = await axios.post(
        `${serverUrl}/api/billing`,
        {
          planType: planKey,
        },
        { withCredentials: true },
      );
      window.location.href = result.data.sessionUrl;
    } catch (error) {
      console.log(error);
      setLoading(null);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#050505] text-white px-6 pt-16 pb-24">
      <button
        className="mb-8 text-zinc-400 hover:text-white"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft size={16} />
      </button>

      <h1 className="text-4xl font-bold mb-4 text-center">
        Simple, transparent pricing
      </h1>
      <p className="text-zinc-400 text-center mb-14">
        Buy credits once. Build anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -14, scale: 1.03 }}
            className={`rounded-3xl p-8 border backdrop-blur-xl transition-all ${
              p.popular
                ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                : "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
            }`}
          >
            {p.popular && (
              <span className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500">
                Most Popular
              </span>
            )}
            <h1 className="text-xl font-semibold mb-2">{p.name}</h1>
            <p className="text-zinc-400 text-sm mb-6">{p.description}</p>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-bold">Rs{p.price}</span>
              <span className="text-sm text-zinc-400 mb-1">/one-time</span>
            </div>
            <div className="flex items-center gap-2 mb-8">
              <FaCoins size={18} className="text-yellow-400" />
              <span className="font-semibold">{p.credits} Credits</span>
            </div>
            <ul className="space-y-3 mb-10">
              {p.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <FaCheck size={16} className="text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
            <motion.button
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleBuy(p.key)}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                p.popular
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {loading === p.key ? "Redirecting..." : p.button}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {openLogin && (
        <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Pricing;
