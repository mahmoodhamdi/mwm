'use client';

/**
 * Footer Component
 * مكون الفوتر
 */

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Newsletter } from '@/components/common/Newsletter';
import { type Locale } from '@/i18n/config';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'YouTube', href: '#', icon: Youtube },
];

interface FooterLink {
  key: string;
  href: string;
}

const quickLinks: FooterLink[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'careers', href: '/careers' },
];

const serviceLinks: FooterLink[] = [
  { key: 'webDev.title', href: '/services/web-development' },
  { key: 'mobileDev.title', href: '/services/mobile-development' },
  { key: 'uiux.title', href: '/services/ui-ux-design' },
  { key: 'backend.title', href: '/services/backend-development' },
  { key: 'consulting.title', href: '/services/consulting' },
  { key: 'support.title', href: '/services/support' },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tServices = useTranslations('services');

  const getLocalizedHref = (href: string) => `/${locale}${href === '/' ? '' : href}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-gray-900 pt-16 text-gray-300 dark:bg-gray-950', className)}>
      <Container>
        {/* Main Footer Content */}
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link
              href={getLocalizedHref('/')}
              className="mb-4 inline-block text-2xl font-bold text-white"
            >
              MWM
            </Link>
            <p className="mb-6 text-gray-400">{t('description')}</p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-primary-600 flex size-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:text-white"
                  aria-label={link.name}
                >
                  <link.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.key}>
                  <Link
                    href={getLocalizedHref(link.href)}
                    className="hover:text-primary-400 text-gray-400 transition-colors"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t('services')}</h3>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <li key={link.key}>
                  <Link
                    href={getLocalizedHref(link.href)}
                    className="hover:text-primary-400 text-gray-400 transition-colors"
                  >
                    {tServices(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t('contact')}</h3>

            {/* Contact Info */}
            <ul className="mb-6 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary-400 mt-1 size-5 shrink-0" />
                <span className="text-gray-400">123 Business Street, Tech City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary-400 size-5 shrink-0" />
                <a
                  href="tel:+966500000000"
                  className="hover:text-primary-400 text-gray-400 transition-colors"
                >
                  +966 50 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary-400 size-5 shrink-0" />
                <a
                  href="mailto:info@mwm.com"
                  className="hover:text-primary-400 text-gray-400 transition-colors"
                >
                  info@mwm.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="mb-3 font-medium text-white">{t('newsletter')}</h4>
              <Newsletter variant="compact" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} MWM. {t('copyright')}
            </p>
            <div className="flex gap-6">
              <Link
                href={getLocalizedHref('/privacy')}
                className="text-sm text-gray-500 transition-colors hover:text-gray-300"
              >
                {t('privacyPolicy')}
              </Link>
              <Link
                href={getLocalizedHref('/terms')}
                className="text-sm text-gray-500 transition-colors hover:text-gray-300"
              >
                {t('termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
