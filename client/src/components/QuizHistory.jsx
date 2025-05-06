import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/quiz/history", {
        withCredentials: true,
      });
      setHistory(res.data.history || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch quiz history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
          Quiz History
        </h2>

        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-400">No quiz attempts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-sm sm:text-base">
              <thead className="text-left bg-white/10">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((quiz, index) => (
                  <tr key={quiz._id} className="border-t border-white/10 hover:bg-white/5 transition">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{quiz.title}</td>
                    <td className="p-3 capitalize">{quiz.category}</td>
                    <td className="p-3">{quiz.score}</td>
                    <td className="p-3">
                      {new Date(quiz.attemptedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
