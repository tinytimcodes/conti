import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Signup.css';
import { useNavigate } from 'react-router-dom';
 

function Signup() {
    const [name, setName] = useState() 
    const [email, setEmail] = useState() 
    const [password, setPassword] = useState() 

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5001/api/users/register', {name, email, password})
        .then(result => console.log(result))
        .catch(err=> console.log(err))
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
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                    <label htmlFor="email">
                        <strong>Name</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Email"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Password</strong>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        className="form-control rounded-0"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" onClick={handleClick} className="btn btn-success w-100 rounded-0">
                    Sign Up
                </button>
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