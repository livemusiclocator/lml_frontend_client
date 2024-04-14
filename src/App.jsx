import GigExplorer from "./components/GigExplorer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "./layouts/default"
// does this just happen automatically?
import "./index.css"

function App() {
  return <GigExplorer LayoutComponent={Layout}/>
}

export default App;
