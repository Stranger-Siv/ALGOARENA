import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./components/UserProfile";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./components/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import AddQuiz from "./pages/admin/AddQuiz";
import Leaderboard from "./pages/admin/Leaderboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="quizzes" element={<ManageQuizzes />} />
          <Route path="add-quiz" element={<AddQuiz />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
