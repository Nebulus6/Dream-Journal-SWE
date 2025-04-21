import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebaseConfig";
import "../styles/newdream.css";
import { useState, useRef } from "react";

const NewDream = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    // Stop any previous recorder and release audio tracks
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  
    // Clear previous blob and audio chunks
    setAudioBlob(null);
    audioChunks.current = [];
  
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
    // Stop any previous stream tracks (if still active)
    for (const track of stream.getTracks()) {
      if (track.readyState === "live") {
        track.stop();
      }
    }
  
    const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(newStream);
    mediaRecorderRef.current = mediaRecorder;
  
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };
  
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };
  
    mediaRecorder.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !description || !tag) {
      alert("Please fill out all fields.");
      return;
    }

    const user = getAuth().currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    let audioURL = null;

    if (audioBlob) {
      const audioRef = ref(storage, `dreamAudio/${user.uid}_${Date.now()}.webm`);
      const snapshot = await uploadBytes(audioRef, audioBlob);
      audioURL = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "dreams"), {
      uid: user.uid,
      title,
      date,
      description,
      tag,
      audioURL,
      timestamp: serverTimestamp(),
    });

    setSubmitted(true);
    setTitle("");
    setDate("");
    setDescription("");
    setTag("");
    setAudioBlob(null);
  };

  return (
    <div className="dream-wrapper" style={{
      background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
      backgroundSize: "cover"
    }}>
      <div className="dream-container">
        <div className="right-panel">
          <h2>Describe your dream below</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Dream Title" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
              <input type="text" placeholder="Tag (e.g. nightmare, lucid, recurring...)" className="form-input" value={tag} onChange={e => setTag(e.target.value)} />
              <textarea placeholder="The dream I had was..." className="dream-textarea" rows={8} value={description} onChange={e => setDescription(e.target.value)} />

              <div className="audio-recorder" style={{ marginBottom: "1rem" }}>
                {!recording ? (
                  <button type="button" className="submit-btn" onClick={handleStartRecording}>🎙️ Start Recording</button>
                ) : (
                  <button type="button" className="submit-btn" onClick={handleStopRecording}>⏹️ Stop Recording</button>
                )}
                {audioBlob && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p>✅ Audio attached</p>
                    <audio controls>
                      <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn">Submit Dream</button>
            </form>
          ) : (
            <div className="submission-notification">
              <p>🌙 Your dream was submitted successfully!</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
                <button className="submit-btn" onClick={() => setSubmitted(false)}>Submit Another</button>
                <button className="submit-btn" onClick={() => window.location.href = "/dreams"}>View All Dreams</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDream;
