import "../styles/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Nebulous</h1>
        <p className="App-description">
          A platform for recording and exploring your dreams. Log your experiences, 
          connect with others, and uncover patterns in your subconscious.
        </p>
          <Link to="/login" className="btn start-button">
            Get Started
          </Link>
      </div>
      <img src="/assets/images/pink_clouds.jpg" alt="Dreamy Clouds" className="hero-image" />
    </div>
  );
}

export default Home;
