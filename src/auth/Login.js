import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onAuthChange }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [UserErrors, setUserErrors] = useState({});
  const navigate = useNavigate();

  // Fetch error messages from backend
  useEffect(() => {
    axios.get("http://localhost:3001/errors")
      .then((res) => {
        setUserErrors(res.data);
      })
      .catch(err => console.error("Error fetching error messages:", err));
  }, []);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      if (result.status === 200) {
        console.log('Login successful');
        window.localStorage.setItem('access_token', result.data.token);
        window.localStorage.setItem('userID', result.data.userID);
        onAuthChange(true);
        navigate('/');
      } else {
        console.error('Login failed');
        onAuthChange(false);
      }
    } catch (err) {
      let errorMessage = 'Login failed';
      if (err.response && err.response.data.type && UserErrors) {
        switch (err.response.data.type) {
          case UserErrors.USERNAME_ALREADY_EXISTS:
            errorMessage = 'User already exists';
            break;
          case UserErrors.WRONG_CREDENTIALS:
            errorMessage = 'Wrong username/password combination';
            break;
          default:
            errorMessage = 'Something went wrong';
        }
      }
      alert(`ERROR: ${errorMessage}`);
      onAuthChange(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post('http://localhost:3001/auth/register', {
        username,
        password,
      });

      if (result.status === 200) {
        console.log('Registration successful');
        alert('Registration successful! Please login.');
        setIsLogin(true);
      } else {
        console.error('Registration failed');
        onAuthChange(false);
      }
    } catch (err) {
      console.error('Registration failed', err);
      alert('ERROR: Registration failed');
      onAuthChange(false);
    }
  };

  return (
    <div className="login-page"> {/* Scoped styling */}
      <h1 className="welcome-title">Welcome to Vision Vogue</h1>
      <p className="welcome-subtext">Please sign in or register to enter the website.</p>

      <div className="form-wrapper">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <div className="form-container">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit}>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
          )}
        </div>
        <button className="toggle-btn" onClick={toggleForm}>
          {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;