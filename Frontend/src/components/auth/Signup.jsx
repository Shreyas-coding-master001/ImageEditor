import React, { useState, useContext } from 'react';
import '../style/Signup.scss';
import { ImageContextData } from '../../context/ImageContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = ({setisLogin}) => {
  const [email, setEmail] = useState('');
  const [username, setusername] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { userData, setuserData } = useContext(ImageContextData);
  const navigate = useNavigate();;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        username, email, password
      },{
        withCredentials : true
      });
      
      setuserData(response.data.user || { email, username, loggedIn: true });
      navigate('/');
      if (setisLogin) setisLogin(false);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up for Image Editor</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className={`error-msg show`}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
              placeholder="Enter your name.."
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="link">
<Link to='/login'>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

