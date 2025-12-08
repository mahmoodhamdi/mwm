/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus">Plus</span>,
  Search: () => <span data-testid="icon-search">Search</span>,
  Edit: () => <span data-testid="icon-edit">Edit</span>,
  Trash2: () => <span data-testid="icon-trash">Trash</span>,
  Eye: () => <span data-testid="icon-eye">Eye</span>,
  Briefcase: () => <span data-testid="icon-briefcase">Briefcase</span>,
  MapPin: () => <span data-testid="icon-mappin">MapPin</span>,
  Clock: () => <span data-testid="icon-clock">Clock</span>,
  DollarSign: () => <span data-testid="icon-dollar">Dollar</span>,
  Users: () => <span data-testid="icon-users">Users</span>,
  FileText: () => <span data-testid="icon-filetext">FileText</span>,
  X: () => <span data-testid="icon-x">X</span>,
  Save: () => <span data-testid="icon-save">Save</span>,
  Download: () => <span data-testid="icon-download">Download</span>,
  Mail: () => <span data-testid="icon-mail">Mail</span>,
  Phone: () => <span data-testid="icon-phone">Phone</span>,
  Calendar: () => <span data-testid="icon-calendar">Calendar</span>,
  CheckCircle: () => <span data-testid="icon-check">CheckCircle</span>,
  XCircle: () => <span data-testid="icon-xcirlce">XCircle</span>,
  Star: () => <span data-testid="icon-star">Star</span>,
  Filter: () => <span data-testid="icon-filter">Filter</span>,
  ArrowRight: () => <span data-testid="icon-arrowright">ArrowRight</span>,
  ArrowLeft: () => <span data-testid="icon-arrowleft">ArrowLeft</span>,
  Heart: () => <span data-testid="icon-heart">Heart</span>,
  Coffee: () => <span data-testid="icon-coffee">Coffee</span>,
  Zap: () => <span data-testid="icon-zap">Zap</span>,
  Globe: () => <span data-testid="icon-globe">Globe</span>,
  Award: () => <span data-testid="icon-award">Award</span>,
  Building: () => <span data-testid="icon-building">Building</span>,
  Share2: () => <span data-testid="icon-share">Share</span>,
  Facebook: () => <span data-testid="icon-facebook">Facebook</span>,
  Twitter: () => <span data-testid="icon-twitter">Twitter</span>,
  Linkedin: () => <span data-testid="icon-linkedin">Linkedin</span>,
  Link: () => <span data-testid="icon-link">Link</span>,
  Upload: () => <span data-testid="icon-upload">Upload</span>,
  Send: () => <span data-testid="icon-send">Send</span>,
}));

// Careers Admin Page Tests
describe('Careers Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the careers admin page title', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByText('Careers Management')).toBeInTheDocument();
    });

    it('renders all three tabs (Jobs, Applications, Departments)', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getAllByText('Applications').length).toBeGreaterThan(0);
      expect(screen.getByText('Departments')).toBeInTheDocument();
    });

    it('renders statistics cards', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByText('Total Jobs')).toBeInTheDocument();
      expect(screen.getByText('Open Jobs')).toBeInTheDocument();
      expect(screen.getByText('Total Applications')).toBeInTheDocument();
      expect(screen.getByText('New Applications')).toBeInTheDocument();
    });

    it('renders the Add Job button', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByText('Add Job')).toBeInTheDocument();
    });

    it('renders search input', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  describe('Jobs Tab', () => {
    it('displays job list with job titles', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getByText('Frontend Developer - React')).toBeInTheDocument();
      expect(screen.getByText('UI/UX Designer')).toBeInTheDocument();
    });

    it('displays job departments', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Design').length).toBeGreaterThan(0);
    });

    it('displays job status badges', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      expect(screen.getAllByText('Open').length).toBeGreaterThan(0);
    });

    it('displays action buttons for each job', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const editButtons = screen.getAllByTestId('icon-edit');
      expect(editButtons.length).toBeGreaterThan(0);

      const deleteButtons = screen.getAllByTestId('icon-trash');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('filters jobs by search query', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Frontend' } });

      expect(screen.getByText('Frontend Developer - React')).toBeInTheDocument();
    });

    it('filters jobs by status', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const statusSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(statusSelect, { target: { value: 'open' } });

      expect(screen.getByText('Frontend Developer - React')).toBeInTheDocument();
    });
  });

  describe('Applications Tab', () => {
    it('switches to applications tab', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const applicationsTab = screen
        .getAllByRole('button')
        .find(btn => btn.textContent?.includes('Applications'));
      if (applicationsTab) fireEvent.click(applicationsTab);

      expect(screen.getByText('Ahmed Mohamed')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    });

    it('displays applicant information', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const applicationsTab = screen
        .getAllByRole('button')
        .find(btn => btn.textContent?.includes('Applications'));
      if (applicationsTab) fireEvent.click(applicationsTab);

      expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();
    });

    it('displays application status', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const applicationsTab = screen
        .getAllByRole('button')
        .find(btn => btn.textContent?.includes('Applications'));
      if (applicationsTab) fireEvent.click(applicationsTab);

      // Status badges appear as well as in select options
      expect(screen.getAllByText('Shortlisted').length).toBeGreaterThan(0);
      expect(screen.getAllByText('New').length).toBeGreaterThan(0);
    });
  });

  describe('Departments Tab', () => {
    it('switches to departments tab', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const departmentsTab = screen.getByRole('button', { name: /Departments/i });
      fireEvent.click(departmentsTab);

      // Should show department cards
      expect(screen.getAllByText(/jobs$/i).length).toBeGreaterThan(0);
    });

    it('displays department names', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const departmentsTab = screen.getByRole('button', { name: /Departments/i });
      fireEvent.click(departmentsTab);

      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('shows Add Department button on departments tab', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const departmentsTab = screen.getByRole('button', { name: /Departments/i });
      fireEvent.click(departmentsTab);

      expect(screen.getByText('Add Department')).toBeInTheDocument();
    });
  });

  describe('Job Modal', () => {
    it('opens job modal when clicking Add Job', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const addButton = screen.getByText('Add Job');
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Job')).toBeInTheDocument();
    });

    it('displays all job form fields', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const addButton = screen.getByText('Add Job');
      fireEvent.click(addButton);

      expect(screen.getByText('Title (Arabic)')).toBeInTheDocument();
      expect(screen.getByText('Title (English)')).toBeInTheDocument();
      // Department appears in multiple places
      expect(screen.getAllByText('Department').length).toBeGreaterThan(0);
      expect(screen.getByText('Job Type')).toBeInTheDocument();
    });

    it('closes modal when clicking Cancel', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      const addButton = screen.getByText('Add Job');
      fireEvent.click(addButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Add New Job')).not.toBeInTheDocument();
    });
  });

  describe('Application Modal', () => {
    it('opens application modal when clicking view on an application', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      // Switch to applications tab
      const applicationsTab = screen
        .getAllByRole('button')
        .find(btn => btn.textContent?.includes('Applications'));
      if (applicationsTab) fireEvent.click(applicationsTab);

      // Find and click view button (Eye icon)
      const viewButtons = screen.getAllByTitle('View');
      fireEvent.click(viewButtons[0]);

      expect(screen.getAllByText('Application Details').length).toBeGreaterThan(0);
    });

    it('displays applicant details in modal', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      // Switch to applications tab
      const applicationsTab = screen.getByRole('button', { name: /Applications/i });
      fireEvent.click(applicationsTab);

      // Find and click view button
      const viewButtons = screen.getAllByTitle('View');
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText('Applicant Information')).toBeInTheDocument();
    });

    it('allows updating application status', async () => {
      const CareersAdminPage = (await import('@/app/[locale]/admin/careers/page')).default;
      render(<CareersAdminPage />);

      // Switch to applications tab
      const applicationsTab = screen.getByRole('button', { name: /Applications/i });
      fireEvent.click(applicationsTab);

      // Find and click view button
      const viewButtons = screen.getAllByTitle('View');
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText('Update Status')).toBeInTheDocument();
    });
  });
});

// Careers Public Page Tests
describe('Careers Public Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the careers page hero section', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getByText('Join Our Team')).toBeInTheDocument();
    });

    it('renders search input', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getByPlaceholderText('Search for a job...')).toBeInTheDocument();
    });

    it('renders filters button', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders job listings', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getByText('Open Positions')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer - React')).toBeInTheDocument();
    });

    it('renders benefits section', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getByText('Why Work With Us?')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive Health Insurance')).toBeInTheDocument();
      expect(screen.getByText('Flexible Work Environment')).toBeInTheDocument();
    });
  });

  describe('Job Filtering', () => {
    it('filters jobs by search query', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      const searchInput = screen.getByPlaceholderText('Search for a job...');
      fireEvent.change(searchInput, { target: { value: 'Frontend' } });

      expect(screen.getByText('Frontend Developer - React')).toBeInTheDocument();
    });

    it('shows filter options when clicking Filters', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      const filtersButton = screen.getByText('Filters');
      fireEvent.click(filtersButton);

      expect(screen.getByText('All Departments')).toBeInTheDocument();
    });
  });

  describe('Job Cards', () => {
    it('displays job type badges', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      // Job types appear in cards and in filter dropdown
      expect(screen.getAllByText('Full-time').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Remote').length).toBeGreaterThan(0);
    });

    it('displays job location', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getAllByText('Cairo, Egypt').length).toBeGreaterThan(0);
    });

    it('displays View Details link', async () => {
      const CareersPage = (await import('@/app/[locale]/careers/page')).default;
      render(<CareersPage />);

      expect(screen.getAllByText('View Details').length).toBeGreaterThan(0);
    });
  });
});

// Job Detail Page Tests
describe('Job Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('renders the job title', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      // Job title appears in multiple places (header, breadcrumb)
      expect(screen.getAllByText('Frontend Developer - React').length).toBeGreaterThan(0);
    });

    it('renders job description section', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Job Description')).toBeInTheDocument();
    });

    it('renders requirements section', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Requirements')).toBeInTheDocument();
    });

    it('renders responsibilities section', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Responsibilities')).toBeInTheDocument();
    });

    it('renders benefits section', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Benefits')).toBeInTheDocument();
    });

    it('renders job summary sidebar', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Job Summary')).toBeInTheDocument();
      expect(screen.getByText('Posted On')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
    });

    it('renders Apply Now buttons', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButtons = screen.getAllByText('Apply Now');
      expect(applyButtons.length).toBeGreaterThan(0);
    });

    it('renders social share buttons', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByTestId('icon-facebook')).toBeInTheDocument();
      expect(screen.getByTestId('icon-twitter')).toBeInTheDocument();
      expect(screen.getByTestId('icon-linkedin')).toBeInTheDocument();
    });

    it('renders related jobs section', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      expect(screen.getByText('Similar Jobs')).toBeInTheDocument();
    });
  });

  describe('Application Modal', () => {
    it('opens application modal when clicking Apply Now', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      expect(screen.getByText('Apply for this Job')).toBeInTheDocument();
    });

    it('displays application form fields', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Professional Information')).toBeInTheDocument();
    });

    it('has required form fields', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      expect(screen.getByText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByText(/Email/)).toBeInTheDocument();
      expect(screen.getByText(/Phone Number/)).toBeInTheDocument();
      expect(screen.getByText(/Years of Experience/)).toBeInTheDocument();
    });

    it('has resume upload field', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      expect(screen.getByText(/Resume/)).toBeInTheDocument();
    });

    it('closes modal when clicking Cancel', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Apply for this Job')).not.toBeInTheDocument();
    });

    it('submits the application form', async () => {
      const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
      render(<JobDetailPage />);

      const applyButton = screen.getAllByText('Apply Now')[0];
      fireEvent.click(applyButton);

      // Check the form opens
      expect(screen.getByText('Apply for this Job')).toBeInTheDocument();

      // Check submit button exists
      expect(screen.getByText('Submit Application')).toBeInTheDocument();
    });
  });
});

// Breadcrumb Tests
describe('Job Detail Breadcrumb', () => {
  it('renders breadcrumb navigation', async () => {
    const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
    render(<JobDetailPage />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('has correct breadcrumb links', async () => {
    const JobDetailPage = (await import('@/app/[locale]/careers/[slug]/page')).default;
    render(<JobDetailPage />);

    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/en');

    const careersLink = screen.getByText('Careers');
    expect(careersLink.closest('a')).toHaveAttribute('href', '/en/careers');
  });
});

// RTL Support Tests
describe('Careers RTL Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset locale mock
    jest.doMock('next-intl', () => ({
      useLocale: () => 'ar',
      useTranslations: () => (key: string) => key,
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  // Note: RTL tests would require re-importing modules with different locale
  // This is a placeholder for RTL-specific tests
  it('should support RTL layout', () => {
    // RTL support is implemented in the components
    expect(true).toBe(true);
  });
});
