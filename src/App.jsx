import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";  // 
import Dashboar from "./components/Dashboar";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Agar User Logged In Hai to Login/Signup pe redirect nahi ho sakega */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes (Only for Logged In Users) */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboar />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
