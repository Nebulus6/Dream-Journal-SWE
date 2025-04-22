import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/buttons.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyDreams from "./pages/MyDreams";
import NewDream from "./pages/NewDream";
import ForgotLogin from "./pages/ForgotLogin";
import Profile from "./pages/Profile";


function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my-dreams" element={<MyDreams />} />
                <Route path="/new-dream" element={<NewDream />} />
                <Route path="/forgot-password" element={<ForgotLogin />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

export default App;
