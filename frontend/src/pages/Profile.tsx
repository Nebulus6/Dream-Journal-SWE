import "../styles/profile.css";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
            {/* Add more user info if you stored it in Firestore */}
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
