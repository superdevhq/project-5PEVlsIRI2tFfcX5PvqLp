
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Loading spinner component to reduce duplication
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

// Root redirect component
const RootRedirect = () => {
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect if we have definitive information
    if (!loading) {
      if (user) {
        // Use the userType from metadata first for immediate redirection
        const destination = userType === 'trainer' ? '/dashboard' : '/client-dashboard';
        navigate(destination, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, userType, loading, navigate]);
  
  return <LoadingSpinner />;
};

// Login route component
const LoginRoute = () => {
  const { user, userType, loading } = useAuth();
  
  // If still loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If user is authenticated, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={userType === 'trainer' ? '/dashboard' : '/client-dashboard'} replace />;
  }
  
  // Otherwise, show login page
  return (
    <Layout footerVariant="minimal">
      <Login />
    </Layout>
  );
};

// AppRoutes component to handle conditional routing based on user type
const AppRoutes = () => {
  const { loading } = useAuth();
  const location = useLocation();

  // Don't render routes until authentication is determined
  // But only show loading for non-login routes to prevent flicker
  if (loading && location.pathname !== '/login') {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/forgot-password" element={
        <Layout footerVariant="minimal">
          <ForgotPassword />
        </Layout>
      } />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['trainer']}>
            <Layout showFooter={false}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client-dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['client']}>
            <Layout showFooter={false}>
              <ClientDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect root to appropriate dashboard */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Catch-all Route */}
      <Route path="*" element={
        <Layout footerVariant="app">
          <NotFound />
        </Layout>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
