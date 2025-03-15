
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: ('trainer' | 'client')[];
}

const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = ['trainer', 'client'] 
}: ProtectedRouteProps) => {
  const { user, userType, client, trainer, loading } = useAuth();
  const navigate = useNavigate();

  // Effect to handle redirection when user type changes
  useEffect(() => {
    if (!loading && user && userType) {
      // If user is a client but trying to access trainer routes
      if (userType === 'client' && !allowedUserTypes.includes('client')) {
        navigate('/client-dashboard', { replace: true });
      }
      // If user is a trainer but trying to access client routes
      else if (userType === 'trainer' && !allowedUserTypes.includes('trainer')) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [userType, loading, user, allowedUserTypes, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Double check that the user has the correct type for this route
  if (!userType || !allowedUserTypes.includes(userType)) {
    // Redirect based on actual user data, not just userType
    if (trainer) {
      return <Navigate to="/dashboard" replace />;
    } else if (client) {
      return <Navigate to="/client-dashboard" replace />;
    } else {
      // If user type is unknown, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
