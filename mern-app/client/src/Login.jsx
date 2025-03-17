import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5001/api/users/login', {email, password})
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="login-container">
            <div className="laser-beams">
                <div className="beam beam-1"></div>
                <div className="beam beam-2"></div>
                <div className="beam beam-3"></div>
                <div className="beam beam-4"></div>
                <div className="beam beam-5"></div>
                <div className="beam beam-6"></div>
                <div className="beam beam-7"></div>
                <div className="beam beam-8"></div>
            </div>
            <div className="brand">
                <h1>Continder</h1>
            </div>
            <div className="login-box">
                <div className="form-wrapper">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input 
                                type="email" 
                                id="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input 
                                type="password" 
                                id="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" onClick={handleClick} className="sign-in-button"> Sign In </button>
                        <div className="signup-link">
                            Don't have an account? <Link to='/signup'>Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;