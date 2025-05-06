import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";
import QuizHistory from "./QuizHistory";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/profile", {
        withCredentials: true,
      });
      setUserData(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20">
        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00F260] to-[#0575E6] bg-clip-text text-transparent">
              User Profile
            </h2>

            {/* Profile Details */}
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{userData.username}</h3>
                  <p className="text-gray-300">{userData.email}</p>
                </div>
                <button
                  className="py-2 px-4 bg-[#00F260] hover:bg-[#00c154] text-black font-bold rounded-lg"
                  onClick={toggleEdit}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Edit Profile Section */}
            {isEditing && <UpdateProfile />}

            {/* Quiz History Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-center mb-6 text-[#00F260]">
                Your Quiz History
              </h3>
              <QuizHistory />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
