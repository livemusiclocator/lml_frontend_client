import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/NavBar";
import { SearchProvider } from "./contexts/SearchContext";
import GigsLoader from "./components/GigsLoader";

function App() {
  return (
    <SearchProvider>
      <Router>
        <Navbar />
        <GigsLoader />
      </Router>
    </SearchProvider>
  );
}

export default App;
