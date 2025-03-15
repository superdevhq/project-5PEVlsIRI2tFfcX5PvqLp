
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only run this effect when loading is complete
    if (!loading) {
      // Redirect to login if not authenticated
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }
      
      // If user type doesn't match allowed types, redirect to appropriate dashboard
      if (userType && !allowedUserTypes.includes(userType)) {
        const redirectPath = userType === 'trainer' ? '/dashboard' : '/client-dashboard';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, userType, loading, allowedUserTypes, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  // Don't render children until we're sure we shouldn't redirect
  if (!user || (userType && !allowedUserTypes.includes(userType))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
