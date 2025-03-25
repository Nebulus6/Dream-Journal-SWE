import "../styles/mydreams.css";
import { useEffect, useState } from "react";

type Dream = {
  title: string;
  date: string;
  description: string;
};

const MyDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    const storedDreams = localStorage.getItem("dreams");
    if (storedDreams) {
      setDreams(JSON.parse(storedDreams));
    }
  }, []);

  return (
    <div
      className="dream-wrapper"
      style={{
        background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div className="dream-container">
        <div className="right-panel">
          <h2>Your Submitted Dreams</h2>

          {dreams.length === 0 ? (
            <div className="empty-state">
              <img
                src="/assets/images/empty-dreams.png"
                alt="No dreams"
                className="empty-image"
              />
              <h3>No dreams yet...</h3>
              <p>Start by logging a dream and return here to reflect on them anytime.</p>
              <button
                className="submit-btn"
                onClick={() => (window.location.href = "/new-dream")}
              >
                Log Your First Dream
              </button>
            </div>
          ) : (
            <div className="dream-list">
              {dreams.map((dream, index) => (
                <div key={index} className="dream-card">
                  <h3>{dream.title}</h3>
                  <p className="dream-date">{dream.date}</p>
                  <p>{dream.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDreams;
