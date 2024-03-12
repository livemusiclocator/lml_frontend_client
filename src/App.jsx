import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Map from "./components/Map";
import Explore from "./components/Explore";
import { DateProvider } from "./contexts/DateContext";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <SearchProvider>
      <DateProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </Router>
      </DateProvider>
    </SearchProvider>
  );
}

export default App;
