import '../styles/login.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      //Two factor auth
      if (!auth.currentUser?.emailVerified) {
        alert("Please verify your email before continuing.");
        await auth.signOut();
        return;
      }

      alert('Login successful!');
      navigate('/my-Dreams'); // change this to your post-login route
    } catch (error: any) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Welcome back, ${user.displayName || 'user'}!`);
      navigate('/my-dreams');
    } catch (error: any) {
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div className="login-container">
        
        <div className="left-panel"
          style={{
            backgroundImage: "url('/assets/images/dream-art.png')",
            backgroundSize: "cover",
            backgroundBlendMode: "multiply"
          }}
        >
          <h1>Welcome back to Nebulous!</h1>
          <p>
            Record and reflect on your dreams, discover patterns in your sleep,
            share stories with a like-minded community, or just explore the surreal
            world of the subconscious — you can do it all in Nebulous.
          </p>
        </div>
        
        <div className="right-panel">
          <h2>Log In</h2>
          <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="Email"
                maxLength={30}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            <input
                type="password"
                placeholder="Password"
                maxLength={30}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            <p className="forgot-password-text" onClick={() => navigate('/forgot-password')}>
              Forgot password?
            </p>

            <button type="submit" className="submit-btn">Log In</button>

            <div className="separator">or log in with</div>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                <img src="/assets/images/google-logo.png" alt="Google logo" />
              </button>
            </div>
          </form>

          <div className="bottom-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
