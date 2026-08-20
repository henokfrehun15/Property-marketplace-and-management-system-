import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyDetails from "./pages/propertyDetails";
import Navbar from "./components/Navbar";
import Properties from "./pages/property";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Favorites from "./pages/Favorites";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
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
        <Route
          path="/dashboard"
          element={<OwnerDashboard />}
        />
        <Route
          path="/properties/create"
          element={<AddProperty />}
      />
        <Route
          path="/properties/:id/edit"
          element={<EditProperty />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;