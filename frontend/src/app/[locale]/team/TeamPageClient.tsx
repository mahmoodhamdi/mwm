'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { TeamCard } from '@/components/team';

interface Department {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
}

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

interface TeamMember {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  position: { ar: string; en: string };
  bio: { ar: string; en: string };
  department?: Department | null;
  avatar: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
  isFeatured: boolean;
}

interface TeamPageClientProps {
  members: TeamMember[];
  departments: Department[];
}

export function TeamPageClient({ members, departments }: TeamPageClientProps) {
  const locale = useLocale() as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    if (selectedDepartment === 'all') return members;
    return members.filter(m => m.department?._id === selectedDepartment);
  }, [members, selectedDepartment]);

  return (
    <>
      {/* Department Filter */}
      {departments.length > 0 && (
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
              selectedDepartment === 'all'
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {isRTL ? 'الكل' : 'All'}
          </button>
          {departments.map(department => (
            <button
              key={department._id}
              onClick={() => setSelectedDepartment(department._id)}
              className={`rounded-full border px-6 py-2 text-sm font-medium transition-colors ${
                selectedDepartment === department._id
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {department.name[locale]}
            </button>
          ))}
        </div>
      )}

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {isRTL ? 'لا يوجد أعضاء فريق في هذا القسم' : 'No team members in this department'}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map(member => (
            <TeamCard
              key={member._id}
              slug={member.slug}
              name={member.name[locale]}
              position={member.position[locale]}
              shortBio={member.bio[locale]}
              avatar={
                member.avatar ||
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
              }
              socialLinks={member.socialLinks}
            />
          ))}
        </div>
      )}
    </>
  );
}
