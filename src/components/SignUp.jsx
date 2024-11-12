import React from 'react';
import './SignUp.css';

export const SignUp = () => {
  return (
    <div class="signup-container">
        <h1>Sign Up</h1>
        <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Sign Up</button>
        </form>
    </div>
  )
}
export default SignUp
