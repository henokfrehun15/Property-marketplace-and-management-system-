import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          Property<span>Hub</span>
        </Link>

        {/* Main navigation */}
        <nav className="nav-links">

          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/properties">
            Properties
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/favorites">
              Favorites
            </NavLink>
          )}
          {isAuthenticated && user?.role === "owner" && (
            <>
              <NavLink to="/dashboard">
                Dashboard
              </NavLink>

              <NavLink to="/inquiries/received">
                Received Inquiries
              </NavLink>
            </>
          )}
          {isAuthenticated && (
              <NavLink to="/inquiries/sent">
                My Inquiries
              </NavLink>
            )}

        </nav>

        {/* Authentication actions */}
        <div className="nav-actions">

          {isAuthenticated ? (
            <>
              <span className="user-greeting">
                Hi, {user?.name}
              </span>

              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-button"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;