
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Mail, Github, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AppFooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'minimal' | 'app';
  showSocial?: boolean;
  showNewsletter?: boolean;
  copyrightText?: string;
  companyName?: string;
}

const AppFooter = ({
  className,
  variant = 'default',
  showSocial = true,
  showNewsletter = false,
  copyrightText = `© ${new Date().getFullYear()} All rights reserved.`,
  companyName = 'FitPro AI',
  ...props
}: AppFooterProps) => {
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Client Management', href: '#' },
        { label: 'Workout Planning', href: '#' },
        { label: 'Nutrition Tracking', href: '#' },
        { label: 'Progress Monitoring', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Tutorials', href: '#' },
        { label: 'Contact Us', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { label: 'GitHub', href: '#', icon: <Github className="h-5 w-5" /> },
    { label: 'Twitter', href: '#', icon: <Twitter className="h-5 w-5" /> },
    { label: 'Instagram', href: '#', icon: <Instagram className="h-5 w-5" /> },
    { label: 'LinkedIn', href: '#', icon: <Linkedin className="h-5 w-5" /> },
  ];

  // Minimal footer for app pages
  if (variant === 'minimal') {
    return (
      <footer
        className={cn(
          'w-full border-t border-gray-100 bg-white py-4',
          className
        )}
        {...props}
      >
        <div className="container flex flex-col items-center justify-between gap-2 md:flex-row">
          <p className="text-center text-xs text-gray-400">
            {copyrightText} {companyName}
          </p>
          
          {showSocial && (
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    );
  }

  // App footer with simplified design
  if (variant === 'app') {
    return (
      <footer
        className={cn(
          'w-full border-t border-gray-100 bg-white py-6',
          className
        )}
        {...props}
      >
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600">{companyName}</h3>
              <p className="mt-1 text-sm text-gray-500">
                The ultimate platform for fitness professionals
              </p>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {footerLinks.slice(0, 2).map((group) => (
                <div key={group.title} className="min-w-[120px]">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{group.title}</h4>
                  <ul className="space-y-1">
                    {group.links.slice(0, 3).map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {showSocial && (
                <div className="min-w-[120px]">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Connect</h4>
                  <div className="flex gap-3 mt-1">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label={link.label}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              {copyrightText} {companyName}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600">Privacy</a>
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600">Terms</a>
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default full footer
  return (
    <footer
      className={cn(
        'w-full border-t border-gray-200 bg-white py-12',
        className
      )}
      {...props}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-blue-600">{companyName}</h2>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Empowering fitness professionals with intelligent tools to manage clients, 
              create personalized workout plans, and track progress effectively.
            </p>
            
            {showSocial && (
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:col-span-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-medium text-gray-900">{group.title}</h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {showNewsletter && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-base font-medium text-gray-900">Subscribe to our newsletter</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Get the latest fitness tips, industry insights, and product updates delivered to your inbox.
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="button" className="h-10">
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500">
              {copyrightText} {companyName}
            </p>
            <p className="flex items-center text-sm text-gray-500">
              Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> for fitness professionals worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
