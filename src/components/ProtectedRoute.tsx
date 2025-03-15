
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
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
  const { user, userType, loading } = useAuth();

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

  if (!userType || !allowedUserTypes.includes(userType)) {
    // Redirect to the appropriate dashboard based on user type
    if (userType === 'trainer') {
      return <Navigate to="/dashboard" replace />;
    } else if (userType === 'client') {
      return <Navigate to="/client-dashboard" replace />;
    } else {
      // If user type is unknown, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
