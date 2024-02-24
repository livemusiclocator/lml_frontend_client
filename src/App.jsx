import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Map Sandbox</h1>
      <p className="read-the-docs">
        Hopefully we come out with something nice out of this.
      </p>
    </>
  );
}

export default App;
