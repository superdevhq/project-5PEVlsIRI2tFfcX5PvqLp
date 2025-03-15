
import React from 'react';
import { Footer } from '@/components/ui/footer';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  footerVariant?: 'default' | 'slim' | 'centered';
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
        <Footer variant={footerVariant} />
      )}
    </div>
  );
};

export default Layout;
