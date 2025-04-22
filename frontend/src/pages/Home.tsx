import "../styles/home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Home() {

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (user) {
      navigate("/new-dream");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Nebulous</h1>
        <p className="App-description">
          A platform for recording and exploring your dreams. Log your experiences, 
          connect with others, and uncover patterns in your subconscious.
        </p>
        <button className="btn start-button" onClick={handleStart}>
          Get Started
        </button>
      </div>
      <img src="/assets/images/pink_clouds.jpg" alt="Dreamy Clouds" className="hero-image" />
    </div>
  );
}

export default Home;
