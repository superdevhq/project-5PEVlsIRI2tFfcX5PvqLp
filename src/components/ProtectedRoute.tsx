
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: ('trainer' | 'client')[];
}

const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = ['trainer', 'client'] 
}: ProtectedRouteProps) => {
  const { user, userType, loading, client, trainer } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        
        toast({
          title: "Access restricted",
          description: `You don't have permission to access this page. Redirecting to your dashboard.`,
          variant: "destructive",
        });
        
        navigate(redirectPath, { replace: true });
        return;
      }
      
      // Additional check: if userType is 'client' but no client record exists
      if (userType === 'client' && !client && allowedUserTypes.includes('client')) {
        toast({
          title: "Account issue detected",
          description: "Your client account data could not be found. Please contact support.",
          variant: "destructive",
        });
        navigate('/login', { replace: true });
        return;
      }
      
      // Additional check: if userType is 'trainer' but no trainer record exists
      if (userType === 'trainer' && !trainer && allowedUserTypes.includes('trainer')) {
        toast({
          title: "Account issue detected",
          description: "Your trainer account data could not be found. Please contact support.",
          variant: "destructive",
        });
        navigate('/login', { replace: true });
        return;
      }
    }
  }, [user, userType, loading, client, trainer, allowedUserTypes, navigate, toast]);

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
  if (!user || 
      (userType && !allowedUserTypes.includes(userType)) ||
      (userType === 'client' && !client && allowedUserTypes.includes('client')) ||
      (userType === 'trainer' && !trainer && allowedUserTypes.includes('trainer'))) {
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
