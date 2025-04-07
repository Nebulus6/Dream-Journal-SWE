import '../styles/signup.css';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

import { signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../firebaseConfig';


const Signup = () => {

  //for password validation checks and confirm password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [showConfirmCheck, setShowConfirmCheck] = useState(false);
  const navigate = useNavigate();


  const checks = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?`~]/.test(password),
  };

  useEffect(() => {
    const allPasswordValid = checks.length && checks.upper && checks.number && checks.special;
    if (allPasswordValid) setShowRequirements(false);
    if (confirmPassword === password && confirmPassword !== '') setShowConfirmCheck(false);
  }, [password, confirmPassword, checks.length, checks.upper, checks.number, checks.special]);



  //this is to handle the actual signup 
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.username as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const userSignInfo = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userSignInfo.user.uid;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      alert("Account created successfully!");
      navigate('/my-Dreams');
    } catch (error: any) {
      alert("Signup failed: " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Optionally add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString()
      });
  
      alert("Signed up with Google successfully!");
      navigate('/my-Dreams');
    } catch (error: any) {
      alert("Google sign-up failed: " + error.message);
    }
  };


  return (
    <div
      className="signup-wrapper"
      style={{
        background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div className="signup-container">
       
       <div className="left-panel"
          style={{
            backgroundImage: "url('/assets/images/dream-art.png')",
            backgroundSize: "cover",
            backgroundBlendMode: "multiply"
          }}
        >
          <h1>Join the dreamers of the world</h1>
          <p>
            Record and reflect on your dreams, discover patterns in your sleep,
            share stories with a like-minded community, or just explore the surreal
            world of the subconscious — you can do it all in Nebulous.
          </p>
        </div>
        
        <div className="right-panel">
          <div className="form-wrapper">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
            <input name="username" type="text" placeholder="Username" maxLength={30} />
            <input name="email" type="email" placeholder="Email" maxLength={30} />

            
            {/* Password Input w/ validation */}
            <div className="password-input-container">
              
              <input
                type="password"
                placeholder="Password"
                maxLength={30}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                onBlur={() => setShowRequirements(false)}
                required
              />
              
              {showRequirements && (
                <div className="requirements-box">
                  <h4>REQUIREMENTS</h4>
                  <ul>
                    <li className={checks.length ? 'valid' : ''}>
                      {checks.length ? '✔️' : '☁️'} Minimum of 6 characters
                    </li>
                    <li className={checks.upper ? 'valid' : ''}>
                      {checks.upper ? '✔️' : '☁️'} Contains an uppercase letter
                    </li>
                    <li className={checks.number ? 'valid' : ''}>
                      {checks.number ? '✔️' : '☁️'} Contains a number
                    </li>
                    <li className={checks.special ? 'valid' : ''}>
                      {checks.special ? '✔️' : '☁️'} Special character (!@#$%)
                    </li>
                  </ul>
                </div>
              )}
              
            </div>
            
            <div className="password-input-container">
              <input
                type="password"
                placeholder="Confirm Password"
                maxLength={30}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setShowConfirmCheck(true)}
                onBlur={() => setShowConfirmCheck(false)}
                required
              />

              {showConfirmCheck && (
                <div className="requirements-box">
                  <h4>PASSWORD MATCH</h4>
                  <ul>
                    <li style={{ color: confirmPassword === password ? 'green' : 'red' }}>
                      {confirmPassword === password ? '✔️' : '☁️'} Passwords match
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">Sign Up</button>
              
            <div className="separator">or sign up with</div>
              
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="google-btn" onClick={handleGoogleSignup}>
                <img src="/assets/images/google-logo.png" alt="Google logo" />
              </button>
            </div>
            </form>
          </div>
          <div className="bottom-text">
            Already have an account? <a href="/login">Log in</a>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Signup;
