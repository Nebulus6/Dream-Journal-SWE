import "../styles/profile.css";
import { useEffect, useState } from "react";
import { auth, storage, db } from "../firebaseConfig";
import { User, onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs"; // Do "npm install dayjs"

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loginStreak, setLoginStreak] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(auth.currentUser);
        await handleLoginStreak(currentUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginStreak = async (uid: string) => {
    const today = dayjs().format("YYYY-MM-DD");
    const userStatsRef = doc(db, "userStats", uid);
    const docSnap = await getDoc(userStatsRef);

    if (!docSnap.exists()) {
      await setDoc(userStatsRef, {
        lastLoginDate: today,
        loginStreak: 1
      });
      setLoginStreak(1);
      return;
    }

    const data = docSnap.data();
    const lastLogin = data.lastLoginDate;
    const streak = data.loginStreak || 0;

    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    if (lastLogin === today) {
      setLoginStreak(streak);
    } else if (lastLogin === yesterday) {
      const newStreak = streak + 1;
      await updateDoc(userStatsRef, {
        lastLoginDate: today,
        loginStreak: newStreak
      });
      setLoginStreak(newStreak);
    } else {
      await updateDoc(userStatsRef, {
        lastLoginDate: today,
        loginStreak: 1
      });
      setLoginStreak(1);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, { photoURL: url });
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="profile-page"
      style={{
        background: "url('/assets/Images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div className="profile-card">
        <h2>Your Profile</h2>
        {loading ? (
          <p>Loading your information...</p>
        ) : user ? (
          <>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="profile-pic" />
            ) : (
              <p>No profile picture set</p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-input"
              disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}

            <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {loginStreak !== null && (
              <p><strong>Login Streak:</strong> {loginStreak} day(s) 🔥</p>
            )}
          </>
        ) : (
          <p>No user is logged in.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
