import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../components/Dashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageQuizzes from "../pages/admin/ManageQuizzes";
import AddQuiz from "../pages/admin/AddQuiz";
import Leaderboard from "../pages/admin/Leaderboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
        <Route path="add-quiz" element={<AddQuiz />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
