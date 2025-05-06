import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/10 backdrop-blur-md shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent"
        >
          AlgoArena
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
