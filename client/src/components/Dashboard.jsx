import Footer from "./Footer";
import DashboardHome from "./DashboardHome";
import Navbar from "./Navbar";
import QuizCategories from "./QuizCategories";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"> {/* Match QuizCategories */}
      <Navbar />
      <div className="flex flex-1 pt-16">
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"> 
          <DashboardHome />
          <QuizCategories />
        </main>
      </div>
      <Footer />
    </div>
  );
}
