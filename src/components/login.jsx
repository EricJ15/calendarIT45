import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export const Login = () => {
  return (
    <div className="login-container">
      <h1>CalTasks</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <Link to="/signup" className="signup-link">Sign Up</Link>
    </div>
  );
};

export default Login;
