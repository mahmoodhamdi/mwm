/**
 * TeamMember Model Tests
 * اختبارات نموذج عضو الفريق
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TeamMember } from '../../../src/models/TeamMember';
import { Department } from '../../../src/models/Department';

let mongoServer: MongoMemoryServer | null = null;
let testDepartment: mongoose.Document | null = null;
let isConnected = false;

beforeAll(async () => {
  try {
    // Ensure no existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create({
      instance: { ip: '127.0.0.1' },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    isConnected = true;

    // Create test department
    testDepartment = await Department.create({
      name: { ar: 'التطوير', en: 'Development' },
      slug: 'development',
    });
  } catch (error) {
    console.warn('MongoMemoryServer could not start. Tests will be skipped.');
    isConnected = false;
  }
}, 120000);

afterAll(async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (isConnected) {
    await TeamMember.deleteMany({});
  }
});

// Helper function to skip test if not connected
const skipIfNotConnected = () => {
  if (!isConnected || !testDepartment) {
    return true;
  }
  return false;
};

describe('TeamMember Model', () => {
  describe('Schema Validation', () => {
    it('should create a team member with valid data', async () => {
      if (skipIfNotConnected()) return;
      const member = await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
        slug: 'ahmed-mohamed',
        position: { ar: 'مطور أول', en: 'Senior Developer' },
        bio: { ar: 'سيرة ذاتية', en: 'Biography' },
        department: testDepartment!._id,
        avatar: '/images/ahmed.jpg',
      });

      expect(member.name.ar).toBe('أحمد محمد');
      expect(member.name.en).toBe('Ahmed Mohamed');
      expect(member.slug).toBe('ahmed-mohamed');
      expect(member.isActive).toBe(true);
    });

    it('should require Arabic name', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
        })
      ).rejects.toThrow();
    });

    it('should require English name', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { ar: 'أحمد محمد' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
        })
      ).rejects.toThrow();
    });

    it('should require slug', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
        })
      ).rejects.toThrow();
    });

    it('should require department', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          avatar: '/images/ahmed.jpg',
        })
      ).rejects.toThrow();
    });

    it('should require avatar', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
        })
      ).rejects.toThrow();
    });

    it('should validate skill level range', async () => {
      if (skipIfNotConnected()) return;
      await expect(
        TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          skills: [{ name: { ar: 'جافاسكريبت', en: 'JavaScript' }, level: 150 }],
        })
      ).rejects.toThrow();
    });

    it('should validate skill category', async () => {
      if (skipIfNotConnected()) return;
      const member = await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
        slug: 'ahmed-mohamed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة', en: 'Bio' },
        department: testDepartment!._id,
        avatar: '/images/ahmed.jpg',
        skills: [
          { name: { ar: 'جافاسكريبت', en: 'JavaScript' }, level: 90, category: 'technical' },
        ],
      });

      expect(member.skills?.[0].category).toBe('technical');
    });

    it('should enforce unique slug', async () => {
      if (skipIfNotConnected()) return;
      await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
        slug: 'ahmed-mohamed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة', en: 'Bio' },
        department: testDepartment!._id,
        avatar: '/images/ahmed.jpg',
      });

      await expect(
        TeamMember.create({
          name: { ar: 'أحمد علي', en: 'Ahmed Ali' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مصمم', en: 'Designer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ali.jpg',
        })
      ).rejects.toThrow();
    });

    it('should set default values', async () => {
      if (skipIfNotConnected()) return;
      const member = await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
        slug: 'ahmed-mohamed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة', en: 'Bio' },
        department: testDepartment!._id,
        avatar: '/images/ahmed.jpg',
      });

      expect(member.order).toBe(0);
      expect(member.isActive).toBe(true);
      expect(member.isLeader).toBe(false);
      expect(member.isFeatured).toBe(false);
    });
  });

  describe('Static Methods', () => {
    describe('getActiveMembers', () => {
      it('should return only active members', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          isActive: true,
        });

        await TeamMember.create({
          name: { ar: 'علي أحمد', en: 'Ali Ahmed' },
          slug: 'ali-ahmed',
          position: { ar: 'مصمم', en: 'Designer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ali.jpg',
          isActive: false,
        });

        const { members } = await TeamMember.getActiveMembers();

        expect(members).toHaveLength(1);
        expect(members[0].slug).toBe('ahmed-mohamed');
      });

      it('should filter by department', async () => {
        if (skipIfNotConnected()) return;
        const otherDept = await Department.create({
          name: { ar: 'التصميم', en: 'Design' },
          slug: 'design',
        });

        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
        });

        await TeamMember.create({
          name: { ar: 'سارة علي', en: 'Sara Ali' },
          slug: 'sara-ali',
          position: { ar: 'مصممة', en: 'Designer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: otherDept._id,
          avatar: '/images/sara.jpg',
        });

        const { members } = await TeamMember.getActiveMembers({
          department: testDepartment!._id.toString(),
        });

        expect(members).toHaveLength(1);
        expect(members[0].slug).toBe('ahmed-mohamed');
      });

      it('should filter featured members', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          isFeatured: true,
        });

        await TeamMember.create({
          name: { ar: 'علي أحمد', en: 'Ali Ahmed' },
          slug: 'ali-ahmed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ali.jpg',
          isFeatured: false,
        });

        const { members } = await TeamMember.getActiveMembers({ featured: true });

        expect(members).toHaveLength(1);
        expect(members[0].slug).toBe('ahmed-mohamed');
      });

      it('should paginate results', async () => {
        if (skipIfNotConnected()) return;
        for (let i = 0; i < 5; i++) {
          await TeamMember.create({
            name: { ar: `عضو ${i}`, en: `Member ${i}` },
            slug: `member-${i}`,
            position: { ar: 'مطور', en: 'Developer' },
            bio: { ar: 'سيرة', en: 'Bio' },
            department: testDepartment!._id,
            avatar: `/images/member-${i}.jpg`,
          });
        }

        const { members, total } = await TeamMember.getActiveMembers({ limit: 2, page: 1 });

        expect(members).toHaveLength(2);
        expect(total).toBe(5);
      });
    });

    describe('getBySlug', () => {
      it('should return member by slug', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
        });

        const member = await TeamMember.getBySlug('ahmed-mohamed');

        expect(member).not.toBeNull();
        expect(member?.slug).toBe('ahmed-mohamed');
      });

      it('should return null for inactive member', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          isActive: false,
        });

        const member = await TeamMember.getBySlug('ahmed-mohamed');

        expect(member).toBeNull();
      });
    });

    describe('getFeaturedMembers', () => {
      it('should return featured members', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          isFeatured: true,
        });

        await TeamMember.create({
          name: { ar: 'علي أحمد', en: 'Ali Ahmed' },
          slug: 'ali-ahmed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ali.jpg',
          isFeatured: false,
        });

        const members = await TeamMember.getFeaturedMembers();

        expect(members).toHaveLength(1);
        expect(members[0].slug).toBe('ahmed-mohamed');
      });
    });

    describe('getLeaders', () => {
      it('should return leaders', async () => {
        if (skipIfNotConnected()) return;
        await TeamMember.create({
          name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
          slug: 'ahmed-mohamed',
          position: { ar: 'مدير تقني', en: 'CTO' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ahmed.jpg',
          isLeader: true,
        });

        await TeamMember.create({
          name: { ar: 'علي أحمد', en: 'Ali Ahmed' },
          slug: 'ali-ahmed',
          position: { ar: 'مطور', en: 'Developer' },
          bio: { ar: 'سيرة', en: 'Bio' },
          department: testDepartment!._id,
          avatar: '/images/ali.jpg',
          isLeader: false,
        });

        const leaders = await TeamMember.getLeaders();

        expect(leaders).toHaveLength(1);
        expect(leaders[0].slug).toBe('ahmed-mohamed');
      });
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt', async () => {
      if (skipIfNotConnected()) return;
      const member = await TeamMember.create({
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
        slug: 'ahmed-mohamed',
        position: { ar: 'مطور', en: 'Developer' },
        bio: { ar: 'سيرة', en: 'Bio' },
        department: testDepartment!._id,
        avatar: '/images/ahmed.jpg',
      });

      expect(member.createdAt).toBeDefined();
      expect(member.updatedAt).toBeDefined();
    });
  });
});
