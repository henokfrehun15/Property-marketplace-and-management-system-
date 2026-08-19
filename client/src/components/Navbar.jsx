import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div>
        <Link to="/">
          <strong>PropertyHub</strong>
        </Link>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;