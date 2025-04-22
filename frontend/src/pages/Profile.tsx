import "../styles/profile.css";
import { useEffect, useState } from "react";
import { auth, storage } from "../firebaseConfig";
import { User, onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await currentUser.reload(); // Refresh user info
                setUser(auth.currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        try {
            setUploading(true);
            const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            // Update the real Firebase Auth profile
            await updateProfile(auth.currentUser, { photoURL: url });

            // Refresh the user data and update state
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
                    </>
                ) : (
                    <p>No user is logged in.</p>
                )}
            </div>

        </div>
    );

};

export default Profile;
