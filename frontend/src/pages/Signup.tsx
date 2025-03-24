import '../styles/signup.css';
import { useState } from 'react';
import { useEffect } from 'react';


const Signup = () => {

  //for password validation checks
  const [password, setPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);

  //for confirm password check
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmCheck, setShowConfirmCheck] = useState(false);


  const checks = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]/.test(password),
  };

  useEffect(() => {
    const allPasswordValid = checks.length && checks.upper && checks.number && checks.special;
    if (allPasswordValid) {
      setShowRequirements(false);
    }
  
    if (confirmPassword === password && confirmPassword !== '') {
      setShowConfirmCheck(false);
    }
  }, [password, confirmPassword]);


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
            <form>
            <input type="text" placeholder="Username" maxLength={30} />
            <input type="email" placeholder="Email" maxLength={30} />
            
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
                <button type="button" className="google-btn">
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
