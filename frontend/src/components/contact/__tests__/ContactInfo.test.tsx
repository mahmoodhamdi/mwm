/**
 * ContactInfo Component Tests
 * اختبارات مكون معلومات الاتصال
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContactInfo, ContactInfoItem, SocialLink } from '../ContactInfo';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('ContactInfo', () => {
  const defaultItems: ContactInfoItem[] = [
    {
      type: 'address',
      title: 'Address',
      value: '123 Main St, City',
    },
    {
      type: 'email',
      title: 'Email',
      value: 'contact@example.com',
      link: 'mailto:contact@example.com',
    },
    {
      type: 'phone',
      title: 'Phone',
      value: '+1 234 567 8900',
      link: 'tel:+12345678900',
    },
  ];

  const socialLinks: SocialLink[] = [
    { type: 'facebook', url: 'https://facebook.com/example' },
    { type: 'twitter', url: 'https://twitter.com/example' },
    { type: 'instagram', url: 'https://instagram.com/example' },
    { type: 'linkedin', url: 'https://linkedin.com/company/example' },
  ];

  describe('Default Variant', () => {
    it('should render title when showTitle is true', () => {
      render(<ContactInfo items={defaultItems} showTitle={true} />);
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should not render title when showTitle is false', () => {
      render(<ContactInfo items={defaultItems} showTitle={false} />);
      expect(screen.queryByText('Get in Touch')).not.toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(<ContactInfo items={defaultItems} title="Contact Information" />);
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });

    it('should render custom subtitle', () => {
      render(<ContactInfo items={defaultItems} subtitle="We love to hear from you!" />);
      expect(screen.getByText('We love to hear from you!')).toBeInTheDocument();
    });

    it('should render all contact info items', () => {
      render(<ContactInfo items={defaultItems} />);

      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, City')).toBeInTheDocument();

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('contact@example.com')).toBeInTheDocument();

      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('+1 234 567 8900')).toBeInTheDocument();
    });

    it('should render links for items with link property', () => {
      render(<ContactInfo items={defaultItems} />);

      const emailLink = screen.getByRole('link', { name: 'contact@example.com' });
      expect(emailLink).toHaveAttribute('href', 'mailto:contact@example.com');

      const phoneLink = screen.getByRole('link', { name: '+1 234 567 8900' });
      expect(phoneLink).toHaveAttribute('href', 'tel:+12345678900');
    });
  });

  describe('Card Variant', () => {
    it('should render as a card', () => {
      render(<ContactInfo items={defaultItems} variant="card" />);
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should render social links', () => {
      render(<ContactInfo items={defaultItems} variant="card" socialLinks={socialLinks} />);
      expect(screen.getByText('Follow Us')).toBeInTheDocument();
    });
  });

  describe('Minimal Variant', () => {
    it('should render compact layout', () => {
      render(<ContactInfo items={defaultItems} variant="minimal" showTitle={false} />);

      expect(screen.getByText('Address:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('Phone:')).toBeInTheDocument();
    });
  });

  describe('Horizontal Variant', () => {
    it('should render items horizontally', () => {
      render(<ContactInfo items={defaultItems} variant="horizontal" />);
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('should render all social link icons', () => {
      render(<ContactInfo items={defaultItems} socialLinks={socialLinks} />);

      const facebookLink = screen.getByLabelText('facebook');
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/example');

      const twitterLink = screen.getByLabelText('twitter');
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/example');

      const instagramLink = screen.getByLabelText('instagram');
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/example');

      const linkedinLink = screen.getByLabelText('linkedin');
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/example');
    });

    it('should open social links in new tab', () => {
      render(<ContactInfo items={defaultItems} socialLinks={socialLinks} />);

      const links = screen
        .getAllByRole('link')
        .filter(
          link =>
            link.getAttribute('href')?.includes('facebook') ||
            link.getAttribute('href')?.includes('twitter') ||
            link.getAttribute('href')?.includes('instagram') ||
            link.getAttribute('href')?.includes('linkedin')
        );

      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Contact Item Types', () => {
    it('should render hours type correctly', () => {
      const items: ContactInfoItem[] = [
        {
          type: 'hours',
          title: 'Working Hours',
          value: '9 AM - 5 PM',
        },
      ];

      render(<ContactInfo items={items} showTitle={false} />);
      expect(screen.getByText('Working Hours')).toBeInTheDocument();
      expect(screen.getByText('9 AM - 5 PM')).toBeInTheDocument();
    });

    it('should render website type correctly', () => {
      const items: ContactInfoItem[] = [
        {
          type: 'website',
          title: 'Website',
          value: 'www.example.com',
          link: 'https://example.com',
        },
      ];

      render(<ContactInfo items={items} showTitle={false} />);
      expect(screen.getByText('Website')).toBeInTheDocument();

      const websiteLink = screen.getByRole('link', { name: 'www.example.com' });
      expect(websiteLink).toHaveAttribute('href', 'https://example.com');
      expect(websiteLink).toHaveAttribute('target', '_blank');
    });

    it('should render custom type with custom icon', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;

      const items: ContactInfoItem[] = [
        {
          type: 'custom',
          title: 'Custom Item',
          value: 'Custom value',
          icon: <CustomIcon />,
        },
      ];

      render(<ContactInfo items={items} showTitle={false} />);
      expect(screen.getByText('Custom Item')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('All Social Link Types', () => {
    it('should render YouTube link', () => {
      const links: SocialLink[] = [{ type: 'youtube', url: 'https://youtube.com/example' }];
      render(<ContactInfo items={defaultItems} socialLinks={links} />);
      const youtubeLink = screen.getByLabelText('youtube');
      expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/example');
    });

    it('should render TikTok link', () => {
      const links: SocialLink[] = [{ type: 'tiktok', url: 'https://tiktok.com/@example' }];
      render(<ContactInfo items={defaultItems} socialLinks={links} />);
      const tiktokLink = screen.getByLabelText('tiktok');
      expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com/@example');
    });

    it('should render WhatsApp link', () => {
      const links: SocialLink[] = [{ type: 'whatsapp', url: 'https://wa.me/1234567890' }];
      render(<ContactInfo items={defaultItems} socialLinks={links} />);
      const whatsappLink = screen.getByLabelText('whatsapp');
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/1234567890');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for social links', () => {
      render(<ContactInfo items={defaultItems} socialLinks={socialLinks} />);

      expect(screen.getByLabelText('facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('linkedin')).toBeInTheDocument();
    });

    it('should use custom labels when provided', () => {
      const linksWithLabels: SocialLink[] = [
        { type: 'facebook', url: 'https://facebook.com/example', label: 'Our Facebook Page' },
      ];

      render(<ContactInfo items={defaultItems} socialLinks={linksWithLabels} />);
      expect(screen.getByLabelText('Our Facebook Page')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ContactInfo items={defaultItems} className="custom-class" showTitle={false} />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
