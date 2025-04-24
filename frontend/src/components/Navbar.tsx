import { Link, useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
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
          <NavLink to="/" className="nav-link" end>Home</NavLink>
          {/* Changed to send user to login before mydreams and new dream pages accessed. */}
          <NavLink
            to="/my-dreams"
            className="nav-link"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                navigate('/login');
              }
            }}
          >
            My Dreams
          </NavLink>
          <NavLink
            to="/new-dream"
            className="nav-link"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                navigate('/login');
              }
            }}
          >
            New Dream
          </NavLink>
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
