import '../styles/signup.css';


const Signup = () => {
  return (
    <div
      className="signup-wrapper"
      style={{
        background: "url('/assets/images/background-clouds.jpg') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div className="signup-container">
        <div
          className="left-panel"
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
            <input type="password" placeholder="Password" maxLength={30} />
            <input type="password" placeholder="Confirm Password" maxLength={30} />
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
