import React from 'react';
import './SignUp.css';

export const SignUp = () => {

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        alert('Account has been created successfully!');
      };

  return (
    <div class="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
export default SignUp
