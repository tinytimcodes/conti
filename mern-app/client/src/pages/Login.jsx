import React from "react";
import "./Login.css";

const Login = () => {
    return (
        <div className="login-container">
            <div className="logo">Continder</div>
            <div className="login-box">
                <h2>Welcome!</h2>
                <form>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" required />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" required />
                    </div>

                    <div className="options">
                        <label><input type="checkbox" /> Remember Me</label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit">Sign In</button>
                </form>

                <p className="signup-text">
                    Don't have an account? <a href="#">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;