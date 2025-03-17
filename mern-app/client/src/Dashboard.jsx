import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import './Dashboard.css';

function Dashboard(){
    return(
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
        <div className="welcome">
            <h1>Welcome to Continder!</h1>
        </div>
        </div>
);
}
export default Dashboard;