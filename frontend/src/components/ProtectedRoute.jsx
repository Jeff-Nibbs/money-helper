import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../services/api';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const token = getToken();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;

