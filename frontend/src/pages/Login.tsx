import '../styles/login.css';


const Login = () => {
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
          <h1>Welcom back to Nebulous!</h1>
          <p>
            Record and reflect on your dreams, discover patterns in your sleep,
            share stories with a like-minded community, or just explore the surreal
            world of the subconscious — you can do it all in Nebulous.
          </p>
        </div>
        
        <div className="right-panel">
          <h2>Log In</h2>
          <form>
          <input type="email" placeholder="Email" maxLength={30} />
          <input type="password" placeholder="Password" maxLength={30} />
          <button type="submit" className="submit-btn">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
