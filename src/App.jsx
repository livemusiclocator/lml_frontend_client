import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchHandler from "./components/SearchHandler";
import NewLayout from "./temp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/newlayout" element={<NewLayout/>}/>
    <Route path="*" element={<SearchHandler/>}/>
      </Routes>
    </Router>
  );
}

export default App;
