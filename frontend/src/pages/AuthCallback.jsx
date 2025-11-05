import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Auth.css';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token and update auth state
      login(token);
      navigate('/dashboard');
    } else {
      // No token received, redirect to login
      navigate('/auth');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Completing sign in...</h2>
          <p className="auth-subtitle">Please wait while we redirect you.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;

