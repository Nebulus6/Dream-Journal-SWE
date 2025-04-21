import "../styles/profile.css";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
                        <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </>
                ) : (
                    <p>No user is logged in.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
