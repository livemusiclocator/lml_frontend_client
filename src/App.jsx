import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Map from "./components/Map";
import Explore from "./components/Explore";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  );
}

export default App;
