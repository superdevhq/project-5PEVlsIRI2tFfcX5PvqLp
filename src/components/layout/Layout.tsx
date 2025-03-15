
import React from 'react';
import AppFooter from '@/components/AppFooter';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  footerVariant?: 'default' | 'minimal' | 'app';
  hideFooterOnPaths?: string[];
}

const Layout = ({ 
  children, 
  showFooter = true, 
  footerVariant = 'default',
  hideFooterOnPaths = ['/dashboard', '/client-dashboard'] 
}: LayoutProps) => {
  // Check if we should hide the footer based on the current path
  const shouldHideFooter = () => {
    if (!showFooter) return true;
    
    const currentPath = window.location.pathname;
    return hideFooterOnPaths.some(path => 
      currentPath === path || currentPath.startsWith(`${path}/`)
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      
      {!shouldHideFooter() && (
        <AppFooter variant={footerVariant as 'default' | 'minimal' | 'app'} />
      )}
    </div>
  );
};

export default Layout;
