/**
 * Footer Component Tests
 * اختبارات مكون الفوتر
 */

import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'ar',
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      footer: {
        description: 'We are a team specialized in software development',
        quickLinks: 'Quick Links',
        services: 'Services',
        contact: 'Contact',
        newsletter: 'Newsletter',
        newsletterPlaceholder: 'Your email',
        subscribe: 'Subscribe',
        copyright: 'All rights reserved',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
      },
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        blog: 'Blog',
        careers: 'Careers',
      },
      services: {
        'webDev.title': 'Web Development',
        'mobileDev.title': 'Mobile Development',
        'uiux.title': 'UI/UX Design',
        'backend.title': 'Backend Development',
        'consulting.title': 'Consulting',
        'support.title': 'Support',
      },
    };
    return translations[namespace]?.[key] || key;
  },
}));

// Mock Newsletter component
jest.mock('@/components/common/Newsletter', () => ({
  Newsletter: ({ variant }: { variant?: string }) => (
    <div data-testid="newsletter" data-variant={variant}>
      Newsletter Form
    </div>
  ),
}));

describe('Footer', () => {
  it('renders logo', () => {
    render(<Footer />);
    expect(screen.getByText('MWM')).toBeInTheDocument();
  });

  it('renders company description', () => {
    render(<Footer />);
    expect(
      screen.getByText('We are a team specialized in software development')
    ).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders services section', () => {
    render(<Footer />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Mobile Development')).toBeInTheDocument();
  });

  it('renders contact section', () => {
    render(<Footer />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders newsletter component', () => {
    render(<Footer />);
    expect(screen.getByTestId('newsletter')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter')).toHaveAttribute('data-variant', 'compact');
  });

  it('renders social media links', () => {
    render(<Footer />);
    // Check for social links by their aria-labels
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText('info@mwm.com')).toBeInTheDocument();
    expect(screen.getByText('+966 50 000 0000')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Footer className="custom-class" />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('custom-class');
  });

  it('has correct link hrefs', () => {
    render(<Footer />);
    const homeLink = screen.getAllByText('Home')[0].closest('a');
    expect(homeLink).toHaveAttribute('href', '/ar');
  });
});
