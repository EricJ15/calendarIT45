// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/SignUp';
import Home from './components/home';
import { auth } from './config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('userEmail', user.email);
        setUserEmail(user.email);
      } else {
        localStorage.removeItem('userEmail');
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (email) => {
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            userEmail ? 
              <Navigate to="/" /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/" 
          element={
            userEmail ? 
              <Home userEmail={userEmail} /> : 
              <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
