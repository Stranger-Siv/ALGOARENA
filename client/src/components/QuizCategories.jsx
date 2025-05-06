import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/categories", {
        withCredentials: true,
      });

      // FIX: Ensure we access the correct structure
      const fetched = res.data.categories || res.data || [];
      setCategories(fetched);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStartQuiz = (categorySlug) => {
    navigate(`/dashboard/quizzes/${categorySlug}`);
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
          Quiz Categories
        </h2>

        {loading ? (
          <p className="text-center text-gray-300">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">No categories available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div
              key={idx}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-md border border-white/20 hover:border-[#00F260] hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleStartQuiz(cat.slug || cat.name)}
            >
              <h3 className="text-xl font-bold text-white mb-2 capitalize">
                {cat.displayName || cat.name}
              </h3>
              <p className="text-gray-300 text-sm">
                {cat.description || "Challenge yourself with this category."}
              </p>
            </div>
            
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCategories;
