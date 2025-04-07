import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "../styles/navbar.css";

function Navbar() {

  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setShowDropdown(false); // Close dropdown on auth change
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
        <div
          className="auth-buttons"
        >
          {user ? (
            <div
              className="user-menu"
              ref={menuRef}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img
                src="/assets/images/user_icon.png"
                alt="User Icon"
                className="user-icon"
                style={{ cursor: "pointer", width: "32px", height: "32px" }}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/my-dreams">My Dreams</Link>
                  <Link to="/new-dream">New Dream</Link>
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Log in</Link>
              <Link to="/signup" className="signup-btn">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
