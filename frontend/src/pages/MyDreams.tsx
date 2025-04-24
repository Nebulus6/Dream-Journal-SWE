import { getFirestore } from 'firebase/firestore';
import "../styles/mydreams.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

type Dream = {
  id: string;
  title: string;
  date: string;
  description: string;
  tag?: string;
  audioURL?: string;
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  };
};

const MyDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("You must be logged in to view your dreams.");
        setLoading(false);
        return;
      }
  
      try {
        const dreamsRef = collection(db, "dreams");
        const q = query(dreamsRef, where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
  
        const dreamData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Dream, "id">),
          }))
          .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  
        setDreams(dreamData);
        setFilteredDreams(dreamData);
      } catch (error: any) {
        alert("Failed to fetch dreams: " + error.message);
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setFilteredDreams(
      tag === "All"
        ? dreams
        : dreams.filter(d => d.tag?.toLowerCase() === tag.toLowerCase())
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const uniqueTags = Array.from(new Set(dreams.map((d) => d.tag).filter(Boolean)));

  return (
    <div
      className="dream-wrapper"
      style={{
        background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <div
        className="dream-container"
        style={{
          overflowY: "auto",
          maxHeight: "90vh",
          padding: "1rem",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div className="right-panel" style={{ maxWidth: "700px", width: "100%" }}>
          <h2>Your Submitted Dreams</h2>

          {uniqueTags.length > 0 && (
            <div className="tag-filter">
              <label htmlFor="tag-select">Filter by Tag:</label>
              <select
                id="tag-select"
                value={selectedTag}
                onChange={(e) => handleTagFilter(e.target.value)}
                className="form-input"
              >
                <option value="All">All</option>
                {uniqueTags.map((tag, i) => (
                  <option key={i} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <p>Loading your dreams...</p>
          ) : filteredDreams.length === 0 ? (
            <div className="empty-state">
              <img
                src="/assets/images/empty-dreams.png"
                alt="No dreams"
                className="empty-image"
              />
              <h3>No dreams yet...</h3>
              <p>Start by logging a dream and return here to reflect on them anytime.</p>
              <button className="submit-btn" onClick={() => (window.location.href = "/new-dream")}>
                Log Your First Dream
              </button>
            </div>
          ) : (
            <div className="dream-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => toggleExpand(dream.id)}
                  className="dream-card"
                  style={{
                    backgroundColor: "#e6ddfb",
                    borderRadius: "8px",
                    padding: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    transition: "background 0.2s",
                    border: expandedId === dream.id ? "2px solid #b598f0" : "2px solid transparent"
                  }}
                >
                  <h3 style={{ margin: 0 }}>{dream.title}</h3>
                  <p style={{ margin: "0.25rem 0 0.5rem", fontWeight: "500" }}>
                    {dream.tag ?? "No tag"} — {new Date(dream.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>

                  {expandedId === dream.id && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <p><strong>Description:</strong> {dream.description}</p>
                      {dream.audioURL && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <p><strong>Audio:</strong></p>
                          <audio controls>
                            <source src={dream.audioURL} type="audio/webm" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  )}
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
