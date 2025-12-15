'use client';

/**
 * Header Component
 * مكون الهيدر
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from '@/providers/ThemeProvider';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { type Locale } from '@/i18n/config';

interface NavItem {
  key: string;
  href: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'careers', href: '/careers' },
  { key: 'contact', href: '/contact' },
];

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export function Header({ transparent = false, className }: HeaderProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [locale]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleDropdownToggle = useCallback((key: string) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  }, []);

  const getLocalizedHref = (href: string) => `/${locale}${href === '/' ? '' : href}`;

  const isActive = (href: string) => {
    if (typeof window === 'undefined') return false;
    const currentPath = window.location.pathname;
    const localizedHref = getLocalizedHref(href);
    if (href === '/') {
      return currentPath === `/${locale}` || currentPath === `/${locale}/`;
    }
    return currentPath.startsWith(localizedHref);
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled || !transparent
          ? 'bg-white/95 shadow-sm backdrop-blur-sm dark:bg-gray-900/95'
          : 'bg-transparent',
        className
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href={getLocalizedHref('/')}
            className="text-primary-600 dark:text-primary-400 flex items-center gap-2 text-xl font-bold"
          >
            <span className="text-2xl">MWM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(item => (
              <div key={item.key} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.key)}
                      className={cn(
                        'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'hover:text-primary-600 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                    >
                      {t(item.key)}
                      <ChevronDown
                        className={cn(
                          'size-4 transition-transform',
                          activeDropdown === item.key && 'rotate-180'
                        )}
                      />
                    </button>
                    {activeDropdown === item.key && (
                      <div className="absolute top-full mt-1 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        {item.children.map(child => (
                          <Link
                            key={child.key}
                            href={getLocalizedHref(child.href)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {t(child.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={getLocalizedHref(item.href)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'hover:text-primary-600 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {t(item.key)}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher variant="minimal" />
            <ThemeToggle />
            <Button variant="primary" size="sm" className="ms-2">
              {tCommon('contactUs')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] bg-white transition-transform duration-300 ease-in-out md:top-20 md:h-[calc(100vh-5rem)] lg:hidden dark:bg-gray-900',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6">
            {navItems.map(item => (
              <div key={item.key} className="border-b border-gray-100 dark:border-gray-800">
                {item.children ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.key)}
                      className="flex w-full items-center justify-between py-4 text-lg font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t(item.key)}
                      <ChevronDown
                        className={cn(
                          'size-5 transition-transform',
                          activeDropdown === item.key && 'rotate-180'
                        )}
                      />
                    </button>
                    {activeDropdown === item.key && (
                      <div className="pb-4 ps-4">
                        {item.children.map(child => (
                          <Link
                            key={child.key}
                            href={getLocalizedHref(child.href)}
                            className="block py-2 text-gray-600 dark:text-gray-400"
                            onClick={toggleMenu}
                          >
                            {t(child.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={getLocalizedHref(item.href)}
                    className={cn(
                      'block py-4 text-lg font-medium',
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    onClick={toggleMenu}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {t(item.key)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-4 flex items-center justify-center gap-4">
              <LanguageSwitcher variant="buttons" showIcon={false} />
            </div>
            <Button variant="primary" fullWidth>
              {tCommon('contactUs')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Header;
