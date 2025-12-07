/**
 * Project Model Tests
 * اختبارات نموذج المشروع
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Project, ProjectCategory } from '../../../src/models';

// Increase timeout for MongoMemoryServer
jest.setTimeout(60000);

describe('Project Model', () => {
  let mongoServer: MongoMemoryServer;
  let categoryId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a test category
    const category = await ProjectCategory.create({
      name: { ar: 'تطبيقات ويب', en: 'Web Applications' },
      slug: 'web-applications',
      isActive: true,
    });
    categoryId = category._id;
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a project with valid data', async () => {
      const projectData = {
        title: { ar: 'متجر إلكتروني', en: 'E-commerce Store' },
        slug: 'ecommerce-store',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
      };

      const project = await Project.create(projectData);

      expect(project._id).toBeDefined();
      expect(project.title.ar).toBe('متجر إلكتروني');
      expect(project.title.en).toBe('E-commerce Store');
      expect(project.slug).toBe('ecommerce-store');
      expect(project.isPublished).toBe(false);
      expect(project.isFeatured).toBe(false);
      expect(project.views).toBe(0);
    });

    it('should require title in both languages', async () => {
      const projectData = {
        title: { ar: '', en: 'E-commerce Store' },
        slug: 'ecommerce-store',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
      };

      await expect(Project.create(projectData)).rejects.toThrow();
    });

    it('should require unique slug', async () => {
      const projectData1 = {
        title: { ar: 'مشروع 1', en: 'Project 1' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
      };

      const projectData2 = {
        title: { ar: 'مشروع 2', en: 'Project 2' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
      };

      await Project.create(projectData1);
      await expect(Project.create(projectData2)).rejects.toThrow();
    });

    it('should require category', async () => {
      const projectData = {
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
      };

      await expect(Project.create(projectData)).rejects.toThrow();
    });

    it('should store technologies correctly', async () => {
      const projectData = {
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
        technologies: [
          { name: 'React', category: 'frontend' },
          { name: 'Node.js', category: 'backend' },
          { name: 'MongoDB', category: 'database' },
        ],
      };

      const project = await Project.create(projectData);
      expect(project.technologies).toHaveLength(3);
      expect(project.technologies[0].name).toBe('React');
      expect(project.technologies[0].category).toBe('frontend');
    });

    it('should store client information correctly', async () => {
      const projectData = {
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
        client: {
          name: { ar: 'شركة العميل', en: 'Client Company' },
          website: 'https://client.com',
        },
      };

      const project = await Project.create(projectData);
      expect(project.client?.name.ar).toBe('شركة العميل');
      expect(project.client?.website).toBe('https://client.com');
    });

    it('should store testimonial correctly', async () => {
      const projectData = {
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
        testimonial: {
          text: { ar: 'تجربة رائعة', en: 'Great experience' },
          author: { ar: 'أحمد', en: 'Ahmed' },
          position: { ar: 'مدير', en: 'Manager' },
        },
      };

      const project = await Project.create(projectData);
      expect(project.testimonial?.text.ar).toBe('تجربة رائعة');
      expect(project.testimonial?.author.en).toBe('Ahmed');
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test projects
      await Project.create([
        {
          title: { ar: 'مشروع 1', en: 'Project 1' },
          slug: 'project-1',
          shortDescription: { ar: 'وصف قصير', en: 'Short description' },
          description: { ar: 'وصف كامل', en: 'Full description' },
          thumbnail: '/images/project1.jpg',
          category: categoryId,
          isPublished: true,
          isFeatured: true,
          order: 1,
        },
        {
          title: { ar: 'مشروع 2', en: 'Project 2' },
          slug: 'project-2',
          shortDescription: { ar: 'وصف قصير', en: 'Short description' },
          description: { ar: 'وصف كامل', en: 'Full description' },
          thumbnail: '/images/project2.jpg',
          category: categoryId,
          isPublished: true,
          isFeatured: false,
          order: 2,
        },
        {
          title: { ar: 'مشروع 3', en: 'Project 3' },
          slug: 'project-3',
          shortDescription: { ar: 'وصف قصير', en: 'Short description' },
          description: { ar: 'وصف كامل', en: 'Full description' },
          thumbnail: '/images/project3.jpg',
          category: categoryId,
          isPublished: false,
          isFeatured: false,
          order: 3,
        },
      ]);
    });

    it('should get published projects', async () => {
      const result = await Project.getPublishedProjects();
      expect(result.projects).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should paginate published projects', async () => {
      const result = await Project.getPublishedProjects(1, 1);
      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should get project by slug', async () => {
      const project = await Project.getBySlug('project-1');
      expect(project).not.toBeNull();
      expect(project?.title.en).toBe('Project 1');
    });

    it('should return null for unpublished project slug', async () => {
      const project = await Project.getBySlug('project-3');
      expect(project).toBeNull();
    });

    it('should get featured projects', async () => {
      const projects = await Project.getFeaturedProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0].title.en).toBe('Project 1');
    });

    it('should increment view count', async () => {
      const project = await Project.findOne({ slug: 'project-1' });
      expect(project?.views).toBe(0);

      await Project.incrementViews(project!._id);

      const updatedProject = await Project.findOne({ slug: 'project-1' });
      expect(updatedProject?.views).toBe(1);
    });
  });

  describe('Timestamps', () => {
    it('should automatically set createdAt and updatedAt', async () => {
      const projectData = {
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
      };

      const project = await Project.create(projectData);
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBeDefined();
    });
  });

  describe('Category Population', () => {
    it('should populate category when getting by slug', async () => {
      await Project.create({
        title: { ar: 'مشروع', en: 'Project' },
        slug: 'test-project',
        shortDescription: { ar: 'وصف قصير', en: 'Short description' },
        description: { ar: 'وصف كامل', en: 'Full description' },
        thumbnail: '/images/project.jpg',
        category: categoryId,
        isPublished: true,
      });

      const project = await Project.getBySlug('test-project');
      expect(project?.category).toBeDefined();
      expect((project?.category as unknown as { name: { en: string } }).name.en).toBe(
        'Web Applications'
      );
    });
  });
});
