import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyDetails from "./pages/propertyDetails";
import Navbar from "./components/Navbar";
import Properties from "./pages/property";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Favorites from "./pages/Favorites";
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
          path="/properties" element={<Properties />}
        />
        <Route
          path="/properties/:id" element={<PropertyDetails />}
/>      <Route
          path="/login" element={<Login />}
/>      <Route element={<ProtectedRoute />}>
          <Route
            path="/Favorites" element={<Favorites />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;