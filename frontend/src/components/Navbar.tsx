import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left Side: Logo */}
        <img src="/assets/images/Nebulous_logo.png" alt="Nebulous Logo" className="logo" />

        {/* Centered Navigation Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/my-dreams">My Dreams</Link>
          <Link to="/new-dream">New Dream</Link>
        </div>

        {/* Right Side: Buttons */}
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Log in</Link>
          <Link to="/login" className="signup-btn">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
