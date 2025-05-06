import Navbar from "@/components/Navbar";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl z-0"></div>

        <h1 className="text-5xl sm:text-6xl font-extrabold z-10 bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
          AlgoArena
        </h1>
        <p className="text-xl sm:text-2xl mt-6 max-w-2xl z-10 text-gray-200">
          The ultimate arena for developers to prove their skills. Take quizzes, build streaks, and rise up the leaderboard.
        </p>
        <div className="flex gap-6 mt-10 z-10">
          <Link
            to="/login"
            className="px-6 py-3 bg-[#00F260] hover:bg-[#00c154] text-black font-semibold rounded-lg shadow-lg transition"
          >
            Enter the Arena
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-[#00F260] text-[#00F260] font-semibold rounded-lg hover:bg-[#00f26033] transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#00F260]">
          ⚡ Features for Dev Champions
        </h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Daily Challenges</h3>
            <p className="text-gray-300">Maintain your streak with fresh dev quizzes daily.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Milestone Rewards</h3>
            <p className="text-gray-300">Earn XP, unlock achievements, and climb the arena ladder.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2">Global Leaderboard</h3>
            <p className="text-gray-300">Compete with coders worldwide and top the charts.</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
