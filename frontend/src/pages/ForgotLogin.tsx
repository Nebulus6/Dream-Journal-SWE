import '../styles/login.css';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      setMessage('Error: ' + error.message);
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
          <h1>Reset your password</h1>
          <p>
            Enter your email address and we'll send you a link to reset your password.
            Make sure to check your spam folder just in case.
          </p>
        </div>

        <div className="right-panel">
          <h2>Forgot Password</h2>
          <form onSubmit={handlePasswordReset}>
            <input
              type="email"
              placeholder="Enter your email"
              maxLength={30}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">Send Reset Email</button>
          </form>

          {message && (
            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>{message}</p>
          )}

          <div className="bottom-text">
            Remembered your password? <a href="/login">Go back to login</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
