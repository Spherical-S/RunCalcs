import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [ping, setAPIStatus] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/ping")
      .then(res => setAPIStatus(res.data.result))
      .catch(err => console.error("Error fetching ping (API may be offline):", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Running Calculator</h1>
      <p>API Network Status: <strong>{ping}</strong></p>
    </div>
  );
}

export default App;