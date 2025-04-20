import "../styles/mydreams.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

type Dream = {
  id: string;
  title: string;
  date: string;
  description: string;
  tag?: string;
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

  useEffect(() => {
    const fetchDreams = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to view your dreams.");
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
          .sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));

        setDreams(dreamData);
        setFilteredDreams(dreamData);
      } catch (error: any) {
        alert("Failed to fetch dreams: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();
  }, []);

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredDreams(dreams);
    } else {
      const filtered = dreams.filter((dream) => dream.tag?.toLowerCase() === tag.toLowerCase());
      setFilteredDreams(filtered);
    }
  };

  const uniqueTags = Array.from(new Set(dreams.map((d) => d.tag).filter(Boolean)));

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

          {/* Tag Filter Dropdown */}
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
                  <option key={i} value={tag}>
                    {tag}
                  </option>
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
              <button
                className="submit-btn"
                onClick={() => (window.location.href = "/new-dream")}
              >
                Log Your First Dream
              </button>
            </div>
          ) : (
            <div className="dream-list">
              {filteredDreams.map((dream, index) => (
                <div key={index} className="dream-card">
                  <h3>{dream.title}</h3>
                  <p className="dream-date">
                    {dream.timestamp
                      ? new Date(dream.timestamp.seconds * 1000).toLocaleDateString()
                      : dream.date}
                  </p>
                  <p><strong>Tag:</strong> {dream.tag ?? "No tag"}</p>
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