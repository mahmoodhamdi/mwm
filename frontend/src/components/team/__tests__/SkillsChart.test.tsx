/**
 * SkillsChart Component Tests
 * اختبارات مكون رسم المهارات
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkillsChart } from '../SkillsChart';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('SkillsChart', () => {
  const mockSkills = [
    { name: 'JavaScript', level: 90, category: 'technical' as const },
    { name: 'React', level: 85, category: 'technical' as const },
    { name: 'Communication', level: 80, category: 'soft' as const },
    { name: 'English', level: 75, category: 'language' as const },
    { name: 'Git', level: 70, category: 'tool' as const },
  ];

  describe('Bars Variant', () => {
    it('should render all skills', () => {
      render(<SkillsChart skills={mockSkills} variant="bars" />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Communication')).toBeInTheDocument();
    });

    it('should render skill percentages', () => {
      render(<SkillsChart skills={mockSkills} variant="bars" />);
      expect(screen.getByText('90%')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('should limit skills when maxItems is set', () => {
      render(<SkillsChart skills={mockSkills} variant="bars" maxItems={2} />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.queryByText('Communication')).not.toBeInTheDocument();
    });

    it('should show remaining count when maxItems is set', () => {
      render(<SkillsChart skills={mockSkills} variant="bars" maxItems={2} />);
      expect(screen.getByText('+3 more skills')).toBeInTheDocument();
    });
  });

  describe('Radial Variant', () => {
    it('should render skills with circular progress', () => {
      render(<SkillsChart skills={mockSkills} variant="radial" />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('should render SVG elements', () => {
      const { container } = render(<SkillsChart skills={mockSkills} variant="radial" />);
      expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
    });

    it('should limit skills when maxItems is set', () => {
      render(<SkillsChart skills={mockSkills} variant="radial" maxItems={3} />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByText('Git')).not.toBeInTheDocument();
    });
  });

  describe('Grouped Variant', () => {
    it('should show category headers when showCategories is true', () => {
      render(<SkillsChart skills={mockSkills} variant="grouped" showCategories />);
      expect(screen.getByText('Technical Skills')).toBeInTheDocument();
      expect(screen.getByText('Soft Skills')).toBeInTheDocument();
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument();
    });

    it('should hide category headers when showCategories is false', () => {
      render(<SkillsChart skills={mockSkills} variant="grouped" showCategories={false} />);
      expect(screen.queryByText('Technical Skills')).not.toBeInTheDocument();
    });

    it('should show level labels for skills', () => {
      // Use a single skill to avoid multiple matches
      const singleSkill = [{ name: 'TestSkill', level: 95, category: 'technical' as const }];
      render(<SkillsChart skills={singleSkill} variant="grouped" />);
      expect(screen.getByText('Expert')).toBeInTheDocument();
    });

    it('should show Advanced level for 70-89 skills', () => {
      const advancedSkill = [{ name: 'TestSkill', level: 75, category: 'technical' as const }];
      render(<SkillsChart skills={advancedSkill} variant="grouped" />);
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should group skills by category', () => {
      render(<SkillsChart skills={mockSkills} variant="grouped" showCategories />);
      // Both JavaScript and React should be under Technical Skills
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render skills as pills', () => {
      render(<SkillsChart skills={mockSkills} variant="compact" />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should show dot indicators for skill level', () => {
      const { container } = render(<SkillsChart skills={mockSkills} variant="compact" />);
      // Each skill should have dots
      const skillPills = container.querySelectorAll('.rounded-full.px-3');
      expect(skillPills.length).toBe(5);
    });

    it('should show remaining count when maxItems is set', () => {
      render(<SkillsChart skills={mockSkills} variant="compact" maxItems={2} />);
      expect(screen.getByText('+3')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should apply transition classes', () => {
      const { container } = render(<SkillsChart skills={mockSkills} variant="bars" />);
      const progressBars = container.querySelectorAll('.transition-all');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<SkillsChart skills={mockSkills} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty skills array gracefully', () => {
      const { container } = render(<SkillsChart skills={[]} />);
      // Should render the container even if empty
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle skills without category', () => {
      const skillsWithoutCategory = [
        { name: 'Skill 1', level: 80 },
        { name: 'Skill 2', level: 70 },
      ];
      render(<SkillsChart skills={skillsWithoutCategory} variant="bars" />);
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
    });

    it('should handle very low skill levels', () => {
      const lowSkills = [{ name: 'New Skill', level: 10, category: 'other' as const }];
      render(<SkillsChart skills={lowSkills} variant="grouped" />);
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });

    it('should handle Intermediate skill level', () => {
      const intermediateSkill = [{ name: 'TestSkill', level: 55, category: 'technical' as const }];
      render(<SkillsChart skills={intermediateSkill} variant="grouped" />);
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
    });

    it('should handle Beginner skill level', () => {
      const beginnerSkill = [{ name: 'TestSkill', level: 35, category: 'technical' as const }];
      render(<SkillsChart skills={beginnerSkill} variant="grouped" />);
      expect(screen.getByText('Beginner')).toBeInTheDocument();
    });
  });
});
