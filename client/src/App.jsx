import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Properties from "./pages/property";

function Home() {
  return (
    <div>
      <h1>Welcome to PropertyHub</h1>
      <p>Find your next property.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/properties"
          element={<Properties />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;