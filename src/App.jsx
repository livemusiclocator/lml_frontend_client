import "./App.css";
import Map from "./components/Map";

function App() {
  return (
    <>
      <h1>Map Sandbox</h1>
      <p className="read-the-docs">
        Hopefully we come out with something nice out of this.
      </p>
      <div style={{ margin: "20px 0" }}>
        <Map />
      </div>
    </>
  );
}

export default App;
