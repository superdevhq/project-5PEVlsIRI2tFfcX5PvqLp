
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// AppRoutes component to handle conditional routing based on user type
const AppRoutes = () => {
  const { user, userType } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? (
          <Navigate to={userType === 'trainer' ? '/dashboard' : '/client-dashboard'} replace />
        ) : (
          <Login />
        )} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['trainer']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client-dashboard" 
        element={
          <ProtectedRoute allowedUserTypes={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect root to appropriate dashboard */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={userType === 'trainer' ? '/dashboard' : '/client-dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
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
