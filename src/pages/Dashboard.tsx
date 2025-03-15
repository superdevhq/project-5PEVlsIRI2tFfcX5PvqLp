import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types';

// Dashboard Components
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ClientHeader from '@/components/dashboard/ClientHeader';
import ClientTabs from '@/components/dashboard/ClientTabs';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { clients, loading: clientsLoading } = useClients();
  const { userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a trainer
  useEffect(() => {
    if (!authLoading && userType !== 'trainer') {
      navigate('/client-dashboard', { replace: true });
    }
  }, [userType, authLoading, navigate]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setActiveTab("overview");
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar onClientSelect={handleClientSelect} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedClient ? (
          <>
            <ClientHeader 
              client={selectedClient} 
              onBackToClients={handleBackToClients} 
            />
            
            <ClientTabs 
              client={selectedClient} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Welcome to FitPro 1.5 AI</h2>
              {clientsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <span className="ml-2">Loading clients...</span>
                </div>
              ) : clients.length > 0 ? (
                <p className="text-gray-500 mb-6">
                  Select a client from the sidebar to view their details and manage their fitness journey.
                </p>
              ) : (
                <p className="text-gray-500 mb-6">
                  Get started by adding your first client using the "Add New Client" button in the sidebar.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;