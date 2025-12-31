import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.firstname, formData.lastname, formData.email, formData.password);
        // After successful signup, switch to login view
        setIsLogin(true);
        alert('Signup successful! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ firstname: '', lastname: '', email: '', password: '' });
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                className="auth-input"
                value={formData.firstname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastname"
                placeholder="Last Name (Optional)"
                className="auth-input"
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="error-message">{error}</div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <p className="auth-toggle">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={toggleAuthMode} className="auth-toggle-link">
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
