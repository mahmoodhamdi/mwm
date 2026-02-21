/**
 * Email Service Unit Tests
 * اختبارات وحدة خدمة البريد الإلكتروني
 */

// Set environment variables before imports
process.env['NODE_ENV'] = 'test';
process.env['SMTP_HOST'] = 'smtp.example.com';
process.env['SMTP_PORT'] = '587';
process.env['SMTP_USER'] = 'test@example.com';
process.env['SMTP_PASS'] = 'test-password';
process.env['EMAIL_FROM'] = 'noreply@mwm.com';
process.env['CLIENT_URL'] = 'http://localhost:3000';

import nodemailer from 'nodemailer';

// Mock nodemailer before importing email service
jest.mock('nodemailer');

const mockSendMail = jest.fn();
const mockVerify = jest.fn();
const mockTransporter = {
  sendMail: mockSendMail,
  verify: mockVerify,
};

(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

// Mock logger
jest.mock('../../../src/config', () => ({
  env: {
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      user: 'test@example.com',
      pass: 'test-password',
      from: 'noreply@mwm.com',
    },
    clientUrl: 'http://localhost:3000',
    isDev: true,
  },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { emailService } from '../../../src/services/email.service';

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
  });

  describe('send', () => {
    it('should send email with correct options', async () => {
      const options = {
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      };

      const result = await emailService.send(options);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@mwm.com',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: expect.any(String),
        })
      );
    });

    it('should use provided text or convert HTML to text', async () => {
      const options = {
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test content</p>',
        text: 'Custom text',
      };

      await emailService.send(options);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Custom text',
        })
      );
    });

    it('should return false on send error', async () => {
      mockSendMail.mockRejectedValue(new Error('Send failed'));

      const options = {
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      };

      const result = await emailService.send(options);

      expect(result).toBe(false);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct token URL', async () => {
      const email = 'user@example.com';
      const name = 'Test User';
      const token = 'verification-token-123';

      const result = await emailService.sendVerificationEmail(email, name, token);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('Verify your email'),
          html: expect.stringContaining(name),
        })
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`http://localhost:3000/auth/verify-email?token=${token}`);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct token URL', async () => {
      const email = 'user@example.com';
      const name = 'Test User';
      const token = 'reset-token-123';

      const result = await emailService.sendPasswordResetEmail(email, name, token);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('Reset your password'),
          html: expect.stringContaining(name),
        })
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(`http://localhost:3000/auth/reset-password?token=${token}`);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email to new user', async () => {
      const email = 'newuser@example.com';
      const name = 'New User';

      const result = await emailService.sendWelcomeEmail(email, name);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('Welcome to MWM'),
          html: expect.stringContaining(name),
        })
      );
    });

    it('should include client URL in welcome email', async () => {
      await emailService.sendWelcomeEmail('user@example.com', 'User');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('http://localhost:3000');
    });
  });

  describe('sendContactReply', () => {
    it('should send contact reply in Arabic locale', async () => {
      const email = 'contact@example.com';
      const name = 'Contact User';
      const originalSubject = 'Question about services';
      const replyMessage = 'Thank you for your inquiry';

      const result = await emailService.sendContactReply(
        email,
        name,
        originalSubject,
        replyMessage,
        'ar'
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining(originalSubject),
          html: expect.stringContaining(name),
        })
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(replyMessage);
      expect(callArgs.html).toContain('dir="rtl"');
    });

    it('should send contact reply in English locale', async () => {
      const email = 'contact@example.com';
      const name = 'Contact User';
      const originalSubject = 'Question';
      const replyMessage = 'Reply message';

      await emailService.sendContactReply(email, name, originalSubject, replyMessage, 'en');

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('dir="ltr"');
    });
  });

  describe('sendAdminNotification', () => {
    it('should send admin notification email', async () => {
      const adminEmail = 'admin@example.com';
      const subject = 'New Contact Message';
      const message = 'You have received a new contact message';
      const data = { from: 'user@example.com', priority: 'high' };

      const result = await emailService.sendAdminNotification(adminEmail, subject, message, data);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: adminEmail,
          subject: expect.stringContaining('[MWM Admin]'),
          html: expect.stringContaining(message),
        })
      );
    });

    it('should include data table in admin notification', async () => {
      const adminEmail = 'admin@example.com';
      const subject = 'Test';
      const message = 'Test message';
      const data = { key1: 'value1', key2: 'value2' };

      await emailService.sendAdminNotification(adminEmail, subject, message, data);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('key1');
      expect(callArgs.html).toContain('value1');
      expect(callArgs.html).toContain('key2');
      expect(callArgs.html).toContain('value2');
    });

    it('should work without data parameter', async () => {
      const result = await emailService.sendAdminNotification(
        'admin@example.com',
        'Subject',
        'Message'
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalled();
    });
  });

  describe('HTML to text conversion', () => {
    it('should strip HTML tags and convert to plain text', async () => {
      const html = '<p>Hello <strong>World</strong></p><script>alert("xss")</script>';

      await emailService.send({
        to: 'user@example.com',
        subject: 'Test',
        html,
      });

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.text).not.toContain('<p>');
      expect(callArgs.text).not.toContain('<strong>');
      expect(callArgs.text).not.toContain('<script>');
      expect(callArgs.text).toContain('Hello');
      expect(callArgs.text).toContain('World');
    });
  });
});
