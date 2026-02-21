/**
 * Newsletter Service Unit Tests
 * اختبارات وحدة خدمة النشرة البريدية
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['CLIENT_URL'] = 'http://localhost:3000';

import crypto from 'crypto';
import { newsletterService } from '../../../src/services/newsletter.service';
import { Subscriber } from '../../../src/models/Subscriber';
import { Newsletter } from '../../../src/models/Newsletter';
import emailService from '../../../src/services/email.service';

// Mock models
jest.mock('../../../src/models/Subscriber');
jest.mock('../../../src/models/Newsletter');

// Mock email service
jest.mock('../../../src/services/email.service', () => ({
  __esModule: true,
  default: {
    send: jest.fn(),
  },
}));

// Mock logger
jest.mock('../../../src/config', () => ({
  env: {
    clientUrl: 'http://localhost:3000',
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('NewsletterService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create new subscriber with correct data', async () => {
      const subscriberData = {
        email: 'new@example.com',
        name: 'New User',
        locale: 'en' as const,
        source: 'website' as const,
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Subscriber as any).mockImplementation(function (data: any) {
        return { ...data, save: mockSave, unsubscribeToken: 'token123' };
      });
      (emailService.send as jest.Mock).mockResolvedValue(true);

      const result = await newsletterService.subscribe(subscriberData);

      expect(result.isNew).toBe(true);
      expect(result.subscriber).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
    });

    it('should normalize email to lowercase', async () => {
      const subscriberData = {
        email: 'TEST@EXAMPLE.COM',
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (Subscriber as any).mockImplementation(function (data: any) {
        return { ...data, save: mockSave, unsubscribeToken: 'token123' };
      });
      (emailService.send as jest.Mock).mockResolvedValue(true);

      await newsletterService.subscribe(subscriberData);

      expect(Subscriber.getByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return existing active subscriber without creating new one', async () => {
      const existingSubscriber = {
        email: 'existing@example.com',
        status: 'active',
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(existingSubscriber);

      const result = await newsletterService.subscribe({ email: 'existing@example.com' });

      expect(result.isNew).toBe(false);
      expect(result.subscriber).toBe(existingSubscriber);
    });

    it('should reactivate previously unsubscribed subscriber', async () => {
      const existingSubscriber = {
        email: 'reactivate@example.com',
        status: 'unsubscribed',
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(existingSubscriber);

      const result = await newsletterService.subscribe({
        email: 'reactivate@example.com',
        name: 'Updated Name',
      });

      expect(result.isNew).toBe(false);
      expect(existingSubscriber.status).toBe('active');
      expect(existingSubscriber.save).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe user with valid token', async () => {
      const email = 'user@example.com';
      const token = 'valid-token';
      const mockSubscriber = {
        email,
        unsubscribeToken: token,
        status: 'active',
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(mockSubscriber);

      const result = await newsletterService.unsubscribe(email, token);

      expect(result).toBe(true);
      expect(mockSubscriber.status).toBe('unsubscribed');
      expect(mockSubscriber.save).toHaveBeenCalled();
    });

    it('should return false for invalid token', async () => {
      const mockSubscriber = {
        email: 'user@example.com',
        unsubscribeToken: 'correct-token',
      };

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(mockSubscriber);

      const result = await newsletterService.unsubscribe('user@example.com', 'wrong-token');

      expect(result).toBe(false);
    });

    it('should return false for non-existent subscriber', async () => {
      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(null);

      const result = await newsletterService.unsubscribe('nonexistent@example.com', 'token');

      expect(result).toBe(false);
    });
  });

  describe('verifyEmail', () => {
    it('should verify pending subscriber and activate them', async () => {
      const mockSubscriber = {
        email: 'pending@example.com',
        status: 'pending',
        verificationToken: 'token123',
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Subscriber.findOne as jest.Mock).mockResolvedValue(mockSubscriber);

      const result = await newsletterService.verifyEmail('token123');

      expect(result).toBe(mockSubscriber);
      expect(mockSubscriber.status).toBe('active');
      expect(mockSubscriber.verificationToken).toBeUndefined();
      expect(mockSubscriber.save).toHaveBeenCalled();
    });

    it('should return null for invalid verification token', async () => {
      (Subscriber.findOne as jest.Mock).mockResolvedValue(null);

      const result = await newsletterService.verifyEmail('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('sendCampaign', () => {
    it('should send campaign to all active subscribers', async () => {
      const mockCampaign = {
        _id: 'campaign123',
        status: 'draft',
        recipientType: 'all',
        subject: { ar: 'موضوع', en: 'Subject' },
        content: { ar: 'محتوى', en: 'Content' },
        metrics: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      const mockSubscribers = [
        { email: 'user1@example.com', locale: 'ar', unsubscribeToken: 'token1' },
        { email: 'user2@example.com', locale: 'en', unsubscribeToken: 'token2' },
      ];

      (Newsletter.getById as jest.Mock).mockResolvedValue(mockCampaign);
      (Subscriber.getActiveSubscribers as jest.Mock).mockResolvedValue(mockSubscribers);
      (emailService.send as jest.Mock).mockResolvedValue(true);

      const result = await newsletterService.sendCampaign('campaign123');

      expect(result.success).toBe(true);
      expect(result.sentCount).toBe(2);
      expect(result.errors).toBe(0);
      expect(mockCampaign.status).toBe('sent');
      expect(emailService.send).toHaveBeenCalledTimes(2);
    });

    it('should throw error for non-existent campaign', async () => {
      (Newsletter.getById as jest.Mock).mockResolvedValue(null);

      await expect(newsletterService.sendCampaign('invalid-id')).rejects.toThrow(
        'Campaign not found'
      );
    });

    it('should throw error for campaign in invalid status', async () => {
      const mockCampaign = {
        status: 'sent',
      };

      (Newsletter.getById as jest.Mock).mockResolvedValue(mockCampaign);

      await expect(newsletterService.sendCampaign('campaign123')).rejects.toThrow(
        'Campaign cannot be sent in its current status'
      );
    });
  });

  describe('scheduleCampaign', () => {
    it('should schedule draft campaign for later sending', async () => {
      const scheduledAt = new Date('2026-12-31');
      const mockCampaign = {
        _id: 'campaign123',
        status: 'draft',
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Newsletter.findById as jest.Mock).mockResolvedValue(mockCampaign);

      const result = await newsletterService.scheduleCampaign('campaign123', scheduledAt);

      expect(result.status).toBe('scheduled');
      expect(result.scheduledAt).toBe(scheduledAt);
      expect(mockCampaign.save).toHaveBeenCalled();
    });

    it('should throw error for non-draft campaign', async () => {
      const mockCampaign = {
        status: 'sent',
      };

      (Newsletter.findById as jest.Mock).mockResolvedValue(mockCampaign);

      await expect(
        newsletterService.scheduleCampaign('campaign123', new Date())
      ).rejects.toThrow('Only draft campaigns can be scheduled');
    });
  });

  describe('cancelCampaign', () => {
    it('should cancel scheduled campaign', async () => {
      const mockCampaign = {
        _id: 'campaign123',
        status: 'scheduled',
        save: jest.fn().mockResolvedValue(undefined),
      };

      (Newsletter.findById as jest.Mock).mockResolvedValue(mockCampaign);

      const result = await newsletterService.cancelCampaign('campaign123');

      expect(result.status).toBe('cancelled');
      expect(result.cancelledAt).toBeDefined();
      expect(mockCampaign.save).toHaveBeenCalled();
    });

    it('should throw error for non-scheduled campaign', async () => {
      const mockCampaign = {
        status: 'draft',
      };

      (Newsletter.findById as jest.Mock).mockResolvedValue(mockCampaign);

      await expect(newsletterService.cancelCampaign('campaign123')).rejects.toThrow(
        'Only scheduled campaigns can be cancelled'
      );
    });
  });

  describe('importSubscribers', () => {
    it('should import valid subscribers and skip invalid ones', async () => {
      const csvData = [
        { email: 'valid1@example.com', name: 'User 1' },
        { email: 'valid2@example.com', name: 'User 2' },
        { email: 'invalid-email', name: 'Invalid' },
        { email: '', name: 'Empty' },
      ];

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(null);
      (Subscriber.create as jest.Mock).mockResolvedValue({});

      const result = await newsletterService.importSubscribers(csvData);

      expect(result.total).toBe(4);
      expect(result.imported).toBe(2);
      expect(result.invalid).toBe(2);
      expect(result.duplicates).toBe(0);
    });

    it('should detect and skip duplicate emails', async () => {
      const csvData = [{ email: 'existing@example.com', name: 'User' }];

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

      const result = await newsletterService.importSubscribers(csvData);

      expect(result.duplicates).toBe(1);
      expect(result.imported).toBe(0);
    });

    it('should apply tags from options', async () => {
      const csvData = [{ email: 'user@example.com' }];

      (Subscriber.getByEmail as jest.Mock).mockResolvedValue(null);
      (Subscriber.create as jest.Mock).mockResolvedValue({});

      await newsletterService.importSubscribers(csvData, {
        tags: ['imported', 'campaign-2024'],
      });

      expect(Subscriber.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: expect.arrayContaining(['imported', 'campaign-2024']),
        })
      );
    });
  });

  describe('exportSubscribers', () => {
    it('should export subscribers with filters', async () => {
      const mockSubscribers = [
        {
          email: 'user1@example.com',
          name: 'User 1',
          status: 'active',
          tags: ['tag1', 'tag2'],
          subscribedAt: new Date('2024-01-01'),
        },
        {
          email: 'user2@example.com',
          name: 'User 2',
          status: 'active',
          tags: [],
          subscribedAt: new Date('2024-01-02'),
        },
      ];

      (Subscriber.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSubscribers),
      });

      const result = await newsletterService.exportSubscribers({ status: 'active' });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        email: 'user1@example.com',
        name: 'User 1',
        status: 'active',
        tags: 'tag1, tag2',
        subscribedAt: expect.any(String),
      });
    });
  });
});
