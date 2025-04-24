import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import logo from './assets/ContinderLogo-Photoroom.jpg';
 

function Signup() {
    const [name, setName] = useState("") 
    const [email, setEmail] = useState("") 
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("") // Clear any previous errors
        axios.post('http://localhost:5001/api/users/register', {name, email, password})
        .then(result => {
            console.log(result)
            navigate('/login') // Redirect to login page after successful registration
        })
        .catch(err => {
            console.log(err)
            setError("Registration failed. Please try again.")
        })
    }

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
            <div className="login-box">
                <div className="form-wrapper">
                    <img src={logo} alt="Continder Logo" className="logo-img" />
                    <h2>Sign Up</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                <strong>Name</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                autoComplete="off"
                                name="name"
                                className="form-control rounded-0"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="off"
                                name="email"
                                className="form-control rounded-0"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">
                                <strong>Password</strong>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                className="form-control rounded-0"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="sign-in-button">Sign Up</button>
                    </form>
                    <div className="signin-link">
                        Already have an account? <Link to='/login'>Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;