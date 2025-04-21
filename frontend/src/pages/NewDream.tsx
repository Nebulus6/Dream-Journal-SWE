import "../styles/newdream.css";
import { useState } from "react";

const NewDream = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !description.trim()) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    console.log("Dream submitted:", { title, date, description });

    setSubmitted(true);
    setTitle("");
    setDate("");
    setDescription("");
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


              <img
                src="/assets/images/Audio.png"
                className="audio-button"
              />

              <button type="submit" className="submit-btn">Submit Dream</button>
            </form>
          ) : (
            <div className="submission-notification">
              <p>🌙 Your dream was submitted successfully!</p>
              <button className="submit-btn" onClick={resetForm}>Submit Another</button>
              <button className="submit-btn" onClick={() => (window.location.href = "/my-dreams")}>
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
