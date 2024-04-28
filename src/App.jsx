import GigExplorer from "./components/GigExplorer";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "./layouts/default";
import ReactGA from 'react-ga4';
// does this just happen automatically?
import "./index.css";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./getLocation";

ReactGA.initialize('G-8TKSCK99CN');

function App() {
  return (
    <ThemeProvider theme={getTheme()}>
      <GigExplorer LayoutComponent={Layout} />
    </ThemeProvider>
  );
}

export default App;
