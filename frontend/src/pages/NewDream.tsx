import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import "../styles/newdream.css";
import { useState } from "react";

const NewDream = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !description.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to submit a dream.");
      return;
    }

    try {
      const dreamsRef = collection(db, "dreams"); // stores in top-level 'dreams' collection
      await addDoc(dreamsRef, {
        uid: user.uid,
        title,
        date,
        description,
        timestamp: serverTimestamp(),
      });

      setSubmitted(true);
      setTitle("");
      setDate("");
      setDescription("");
    } catch (error: any) {
      alert("Failed to submit dream: " + error.message);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

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
          <h2>Describe your dream below</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Dream Title"
                maxLength={50}
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <textarea
                placeholder="The dream I had was..."
                rows={8}
                className="dream-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button type="submit" className="submit-btn">Submit Dream</button>
            </form>
          ) : (
            <div className="submission-notification">
              <p>🌙 Your dream was submitted successfully!</p>
              <button className="submit-btn" onClick={resetForm}>Submit Another</button>
              <button className="submit-btn" onClick={() => (window.location.href = "/dreams")}>
                View All Dreams
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDream;
