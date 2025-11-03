import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Practice from "./pages/Practice";

// Header component
function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Title & Pages */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-indigo-600">Civics Practice</h1>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/practice"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Practice
            </Link>
          </nav>
        </div>

        {/* User Email & Sign Out Button */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

// Home page
function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to USCIS Civics Test Practice
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Master the 100 civics questions for your U.S. citizenship test
          </p>

          {/* Cards */}
          <div className="flex justify-center">
            <Link
              to="/practice"
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-xl hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">Start Practice</h3>
              <p className="text-indigo-100">Practice with 10 random questions</p>
            </Link>
          </div>

          {/* About */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">About the Test</h3>
            <div className="text-sm text-blue-800 space-y-2 text-left max-w-2xl mx-auto">
              <p>• The civics test consists of 100 questions about U.S. history and government</p>
              <p>• During your interview, you will be asked up to 10 questions</p>
              <p>• You must answer 6 out of 10 questions correctly to pass</p>
              <p>• Practice as many times as you need to feel confident!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout that includes header
function ProtectedLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* Practice page with header */}
        <Route
          path="/practice"
          element={
            user ? (
              <ProtectedLayout>
                <Practice />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Pages without headers */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
