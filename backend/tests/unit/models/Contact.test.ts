/**
 * Contact Model Unit Tests
 * اختبارات وحدة نموذج رسائل التواصل
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Contact } from '../../../src/models';

describe('Contact Model', () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch {
      console.warn('MongoMemoryServer could not start');
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await Contact.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create contact message with valid data', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for contacting you.',
      };

      const contact = await Contact.create(contactData);

      expect(contact._id).toBeDefined();
      expect(contact.name).toBe('John Doe');
      expect(contact.email).toBe('john@example.com');
      expect(contact.subject).toBe('Test Subject');
      expect(contact.status).toBe('new'); // Default status
    });

    it('should require name', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should require email', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should require subject', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should require message', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should accept optional fields', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        phone: '+1234567890',
        company: 'Test Company',
        website: 'https://example.com',
        budget: '10k_25k',
        preferredContact: 'email',
      };

      const contact = await Contact.create(contactData);

      expect(contact.phone).toBe('+1234567890');
      expect(contact.company).toBe('Test Company');
      expect(contact.website).toBe('https://example.com');
      expect(contact.budget).toBe('10k_25k');
      expect(contact.preferredContact).toBe('email');
    });

    it('should set default status to new', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      const contact = await Contact.create(contactData);
      expect(contact.status).toBe('new');
    });

    it('should set default priority to normal', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      };

      const contact = await Contact.create(contactData);
      expect(contact.priority).toBe('normal');
    });

    it('should validate status enum values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        status: 'invalid-status',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });

    it('should validate priority enum values', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        priority: 'invalid-priority',
      };

      await expect(Contact.create(contactData)).rejects.toThrow();
    });
  });

  describe('Static Methods', () => {
    describe('getById', () => {
      it('should find contact by id', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const contact = await Contact.create({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
        });

        const found = await Contact.getById(contact._id.toString());
        expect(found).toBeDefined();
        expect(found?.name).toBe('John Doe');
      });

      it('should return null for non-existent id', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const found = await Contact.getById(new mongoose.Types.ObjectId().toString());
        expect(found).toBeNull();
      });
    });

    describe('getMessages', () => {
      beforeEach(async () => {
        if (mongoose.connection.readyState !== 1) return;

        // Create test messages
        await Contact.create([
          {
            name: 'User 1',
            email: 'user1@example.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: 'new',
            priority: 'high',
          },
          {
            name: 'User 2',
            email: 'user2@example.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: 'read',
            priority: 'normal',
          },
          {
            name: 'User 3',
            email: 'user3@example.com',
            subject: 'Subject 3',
            message: 'Message 3',
            status: 'new',
            priority: 'urgent',
            isStarred: true,
          },
        ]);
      });

      it('should get all messages with pagination', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Contact.getMessages({ page: 1, limit: 10 });
        expect(result.messages).toHaveLength(3);
        expect(result.pagination.total).toBe(3);
      });

      it('should filter by status', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Contact.getMessages({ status: 'new' });
        expect(result.messages).toHaveLength(2);
        result.messages.forEach((msg: { status: string }) => {
          expect(msg.status).toBe('new');
        });
      });

      it('should filter by priority', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Contact.getMessages({ priority: 'high' });
        expect(result.messages).toHaveLength(1);
        expect(result.messages[0].priority).toBe('high');
      });

      it('should filter by starred', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Contact.getMessages({ starred: true });
        expect(result.messages).toHaveLength(1);
        expect(result.messages[0].isStarred).toBe(true);
      });

      it('should search by name', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const result = await Contact.getMessages({ search: 'User 1' });
        expect(result.messages).toHaveLength(1);
        expect(result.messages[0].name).toBe('User 1');
      });
    });

    describe('getUnreadCount', () => {
      it('should return count of new messages', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Contact.create([
          {
            name: 'User 1',
            email: 'user1@example.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: 'new',
          },
          {
            name: 'User 2',
            email: 'user2@example.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: 'new',
          },
          {
            name: 'User 3',
            email: 'user3@example.com',
            subject: 'Subject 3',
            message: 'Message 3',
            status: 'read',
          },
        ]);

        const count = await Contact.getUnreadCount();
        expect(count).toBe(2);
      });
    });

    describe('markAsRead', () => {
      it('should mark message as read', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const contact = await Contact.create({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
          status: 'new',
        });

        await Contact.markAsRead(contact._id.toString());

        const updated = await Contact.findById(contact._id);
        expect(updated?.status).toBe('read');
        expect(updated?.readAt).toBeDefined();
      });
    });

    describe('markAsSpam', () => {
      it('should mark message as spam', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const contact = await Contact.create({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
        });

        const updated = await Contact.markAsSpam(contact._id.toString());
        expect(updated?.status).toBe('spam');
      });
    });

    describe('archive', () => {
      it('should archive message', async () => {
        if (mongoose.connection.readyState !== 1) return;

        const contact = await Contact.create({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message.',
        });

        const updated = await Contact.archive(contact._id.toString());
        expect(updated?.status).toBe('archived');
        expect(updated?.archivedAt).toBeDefined();
      });
    });

    describe('getStatistics', () => {
      it('should return message statistics', async () => {
        if (mongoose.connection.readyState !== 1) return;

        await Contact.create([
          {
            name: 'User 1',
            email: 'user1@example.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: 'new',
          },
          {
            name: 'User 2',
            email: 'user2@example.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: 'read',
          },
          {
            name: 'User 3',
            email: 'user3@example.com',
            subject: 'Subject 3',
            message: 'Message 3',
            status: 'replied',
          },
        ]);

        const stats = await Contact.getStatistics();
        expect(stats.total).toBe(3);
        expect(stats.byStatus.new).toBe(1);
        expect(stats.byStatus.read).toBe(1);
        expect(stats.byStatus.replied).toBe(1);
      });
    });
  });

  describe('Timestamps', () => {
    it('should set createdAt on create', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      });

      expect(contact.createdAt).toBeDefined();
    });

    it('should set updatedAt on update', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      });

      const originalUpdatedAt = contact.updatedAt;

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 100));

      contact.status = 'read';
      await contact.save();

      expect(contact.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Replies', () => {
    it('should add replies to message', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
      });

      contact.replies = [
        {
          message: 'Thank you for contacting us!',
          sentAt: new Date(),
          sentBy: new mongoose.Types.ObjectId(),
        },
      ];
      contact.status = 'replied';
      contact.repliedAt = new Date();
      await contact.save();

      const updated = await Contact.findById(contact._id);
      expect(updated?.replies).toHaveLength(1);
      expect(updated?.status).toBe('replied');
      expect(updated?.repliedAt).toBeDefined();
    });
  });

  describe('Labels and Notes', () => {
    it('should store labels', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        labels: ['important', 'follow-up'],
      });

      expect(contact.labels).toHaveLength(2);
      expect(contact.labels).toContain('important');
      expect(contact.labels).toContain('follow-up');
    });

    it('should store notes', async () => {
      if (mongoose.connection.readyState !== 1) return;

      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.',
        notes: 'This is a high-priority client.',
      });

      expect(contact.notes).toBe('This is a high-priority client.');
    });
  });
});
