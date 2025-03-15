
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Simple check for allowed user types
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

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
