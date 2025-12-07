/**
 * TeamCard Component Tests
 * اختبارات مكون بطاقة عضو الفريق
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TeamCard } from '../TeamCard';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} />;
  };
});

describe('TeamCard', () => {
  const defaultProps = {
    name: 'Ahmed Mohamed',
    slug: 'ahmed-mohamed',
    position: 'Senior Developer',
    avatar: '/images/ahmed.jpg',
  };

  describe('Default Variant', () => {
    it('should render member name', () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });

    it('should render member position', () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('should render member avatar', () => {
      render(<TeamCard {...defaultProps} />);
      const img = screen.getByAltText('Ahmed Mohamed');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/ahmed.jpg');
    });

    it('should render department when provided', () => {
      render(<TeamCard {...defaultProps} department="Development" />);
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('should render short bio when provided', () => {
      render(<TeamCard {...defaultProps} shortBio="Experienced developer" />);
      expect(screen.getByText('Experienced developer')).toBeInTheDocument();
    });

    it('should render skills when provided', () => {
      const skills = [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 },
      ];
      render(<TeamCard {...defaultProps} skills={skills} />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should show remaining count when more than 3 skills', () => {
      const skills = [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'TypeScript', level: 75 },
      ];
      render(<TeamCard {...defaultProps} skills={skills} />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('should render leader badge when isLeader is true', () => {
      render(<TeamCard {...defaultProps} isLeader />);
      expect(screen.getByText('Leader')).toBeInTheDocument();
    });

    it('should render featured badge when isFeatured is true', () => {
      render(<TeamCard {...defaultProps} isFeatured />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('should render view profile link by default', () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.getByText('View Profile')).toBeInTheDocument();
    });

    it('should hide view profile link when showArrow is false', () => {
      render(<TeamCard {...defaultProps} showArrow={false} />);
      expect(screen.queryByText('View Profile')).not.toBeInTheDocument();
    });
  });

  describe('Featured Variant', () => {
    it('should render member name', () => {
      render(<TeamCard {...defaultProps} variant="featured" />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });

    it('should render department badge', () => {
      render(<TeamCard {...defaultProps} variant="featured" department="Development" />);
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('should render up to 5 skills', () => {
      const skills = Array.from({ length: 7 }, (_, i) => ({
        name: `Skill ${i + 1}`,
        level: 80,
      }));
      render(<TeamCard {...defaultProps} variant="featured" skills={skills} />);
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 5')).toBeInTheDocument();
      expect(screen.queryByText('Skill 6')).not.toBeInTheDocument();
    });

    it('should render View Profile link', () => {
      render(<TeamCard {...defaultProps} variant="featured" />);
      expect(screen.getByText('View Profile')).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render as a link', () => {
      render(<TeamCard {...defaultProps} variant="compact" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('ahmed-mohamed'));
    });

    it('should render name and position', () => {
      render(<TeamCard {...defaultProps} variant="compact" />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('should render department', () => {
      render(<TeamCard {...defaultProps} variant="compact" department="Development" />);
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('should render avatar', () => {
      render(<TeamCard {...defaultProps} variant="compact" />);
      expect(screen.getByAltText('Ahmed Mohamed')).toBeInTheDocument();
    });
  });

  describe('Horizontal Variant', () => {
    it('should render member name', () => {
      render(<TeamCard {...defaultProps} variant="horizontal" />);
      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
    });

    it('should render department badge', () => {
      render(<TeamCard {...defaultProps} variant="horizontal" department="Development" />);
      expect(screen.getByText('Development')).toBeInTheDocument();
    });

    it('should render leader badge when isLeader', () => {
      render(<TeamCard {...defaultProps} variant="horizontal" isLeader />);
      expect(screen.getByText('Leader')).toBeInTheDocument();
    });

    it('should render up to 4 skills', () => {
      const skills = Array.from({ length: 6 }, (_, i) => ({
        name: `Skill ${i + 1}`,
        level: 80,
      }));
      render(<TeamCard {...defaultProps} variant="horizontal" skills={skills} />);
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 4')).toBeInTheDocument();
      expect(screen.queryByText('Skill 5')).not.toBeInTheDocument();
    });
  });

  describe('Social Links', () => {
    it('should render social links when provided', () => {
      const socialLinks = {
        linkedin: 'https://linkedin.com/in/ahmed',
        twitter: 'https://twitter.com/ahmed',
        github: 'https://github.com/ahmed',
        email: 'ahmed@example.com',
      };
      render(<TeamCard {...defaultProps} socialLinks={socialLinks} />);

      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<TeamCard {...defaultProps} className="custom-class" />);
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });
});
