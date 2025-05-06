// src/components/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FilePlus, ListOrdered, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Manage Users", path: "/admin/users", icon: <Users size={20} /> },
  { name: "Manage Quizzes", path: "/admin/quizzes", icon: <ListOrdered size={20} /> },
  { name: "Add Quiz", path: "/admin/add-quiz", icon: <FilePlus size={20} /> },
  { name: "Leaderboard", path: "/admin/leaderboard", icon: <Home size={20} /> },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-6">AlgoArena Admin</h2>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 ${
              location.pathname === item.path ? "bg-gray-800" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
