
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Mail, ExternalLink } from 'lucide-react';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'slim' | 'centered';
  showSocial?: boolean;
  showNewsletter?: boolean;
  copyrightText?: string;
  companyName?: string;
}

const Footer = ({
  className,
  variant = 'default',
  showSocial = true,
  showNewsletter = false,
  copyrightText = `© ${new Date().getFullYear()} All rights reserved.`,
  companyName = 'FitPro AI',
  ...props
}: FooterProps) => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Testimonials', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { label: 'Twitter', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
    { label: 'Facebook', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
    { label: 'Instagram', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
    { label: 'LinkedIn', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
  ];

  // Slim footer with just copyright and social links
  if (variant === 'slim') {
    return (
      <footer
        className={cn(
          'w-full border-t border-gray-200 bg-white py-6',
          className
        )}
        {...props}
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-gray-500">
            {copyrightText} {companyName}
          </p>
          
          {showSocial && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
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

  // Centered footer with stacked sections
  if (variant === 'centered') {
    return (
      <footer
        className={cn(
          'w-full border-t border-gray-200 bg-white py-12',
          className
        )}
        {...props}
      >
        <div className="container flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600">{companyName}</h2>
          </div>
          
          <div className="mb-8 grid grid-cols-2 gap-8 text-center sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col items-center">
                <h3 className="mb-3 text-sm font-medium text-gray-900">{group.title}</h3>
                <ul className="flex flex-col items-center gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {showSocial && (
            <div className="mb-8 flex items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
          
          <p className="text-center text-sm text-gray-500">
            {copyrightText} {companyName}
          </p>
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">{companyName}</h2>
            <p className="mt-4 text-sm text-gray-500">
              Helping fitness professionals manage their clients and deliver exceptional results.
            </p>
            
            {showSocial && (
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-medium text-gray-900">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {showNewsletter && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Subscribe to our newsletter</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get the latest fitness tips and updates delivered to your inbox.
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500">
              {copyrightText} {companyName}
            </p>
            <p className="flex items-center text-sm text-gray-500">
              Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> for fitness professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
