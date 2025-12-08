/**
 * Email Service
 * خدمة البريد الإلكتروني
 */

import nodemailer, { Transporter } from 'nodemailer';
import { env, logger } from '../config';

/**
 * Email options interface
 * واجهة خيارات البريد الإلكتروني
 */
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Email template data
 * بيانات قالب البريد الإلكتروني
 */
interface TemplateData {
  name?: string;
  url?: string;
  data?: Record<string, string>;
  [key: string]: string | number | boolean | Record<string, string> | undefined;
}

/**
 * Email Service Class
 * فئة خدمة البريد الإلكتروني
 */
class EmailService {
  private transporter: Transporter | null = null;
  private from: string;

  constructor() {
    this.from = env.smtp.from || 'noreply@mwm.com';
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   * تهيئة ناقل البريد الإلكتروني
   */
  private initializeTransporter(): void {
    if (env.smtp.host && env.smtp.port && env.smtp.user && env.smtp.pass) {
      this.transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });

      // Verify connection in development
      if (env.isDev) {
        this.transporter.verify(error => {
          if (error) {
            logger.warn('Email transporter verification failed:', error.message);
          } else {
            logger.info('Email transporter is ready');
          }
        });
      }
    } else {
      logger.warn('Email service not configured - emails will be logged to console');
    }
  }

  /**
   * Send email
   * إرسال بريد إلكتروني
   */
  async send(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      // Log email in development if no transporter
      logger.info('Email would be sent:', {
        to: options.to,
        subject: options.subject,
        html: options.html.substring(0, 200) + '...',
      });
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      });

      logger.info(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Convert HTML to plain text
   * تحويل HTML إلى نص عادي
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Send email verification email
   * إرسال بريد التحقق
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${env.clientUrl}/auth/verify-email?token=${token}`;

    const html = this.getVerificationEmailTemplate({
      name,
      url: verificationUrl,
    });

    return this.send({
      to: email,
      subject: 'Verify your email | تحقق من بريدك الإلكتروني - MWM',
      html,
    });
  }

  /**
   * Send password reset email
   * إرسال بريد إعادة تعيين كلمة المرور
   */
  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${env.clientUrl}/auth/reset-password?token=${token}`;

    const html = this.getPasswordResetEmailTemplate({
      name,
      url: resetUrl,
    });

    return this.send({
      to: email,
      subject: 'Reset your password | إعادة تعيين كلمة المرور - MWM',
      html,
    });
  }

  /**
   * Send welcome email
   * إرسال بريد الترحيب
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = this.getWelcomeEmailTemplate({ name });

    return this.send({
      to: email,
      subject: 'Welcome to MWM | مرحباً بك في MWM',
      html,
    });
  }

  /**
   * Get verification email template
   * الحصول على قالب بريد التحقق
   */
  private getVerificationEmailTemplate(data: TemplateData): string {
    return `
<!DOCTYPE html>
<html dir="auto">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      <h2>Hello ${data.name || 'there'},</h2>
      <p>Thank you for registering with MWM. Please verify your email address by clicking the button below:</p>
      <p>شكراً لتسجيلك في MWM. يرجى التحقق من بريدك الإلكتروني بالنقر على الزر أدناه:</p>
      <p style="text-align: center;">
        <a href="${data.url}" class="button">Verify Email | تحقق من البريد</a>
      </p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد بأمان.</p>
      <p>This link will expire in 24 hours.</p>
      <p>سينتهي هذا الرابط خلال 24 ساعة.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Get password reset email template
   * الحصول على قالب بريد إعادة تعيين كلمة المرور
   */
  private getPasswordResetEmailTemplate(data: TemplateData): string {
    return `
<!DOCTYPE html>
<html dir="auto">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
    .warning { color: #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      <h2>Hello ${data.name || 'there'},</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإنشاء كلمة مرور جديدة:</p>
      <p style="text-align: center;">
        <a href="${data.url}" class="button">Reset Password | إعادة تعيين كلمة المرور</a>
      </p>
      <p class="warning">If you didn't request this, please ignore this email or contact support if you're concerned about your account security.</p>
      <p class="warning">إذا لم تطلب هذا، يرجى تجاهل هذا البريد أو الاتصال بالدعم إذا كنت قلقاً بشأن أمان حسابك.</p>
      <p>This link will expire in 1 hour.</p>
      <p>سينتهي هذا الرابط خلال ساعة واحدة.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Send contact reply email
   * إرسال رد على رسالة التواصل
   */
  async sendContactReply(
    email: string,
    name: string,
    originalSubject: string,
    replyMessage: string,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<boolean> {
    const html = this.getContactReplyEmailTemplate({
      name,
      originalSubject,
      replyMessage,
      locale,
    });

    return this.send({
      to: email,
      subject:
        locale === 'ar'
          ? `رد على رسالتك: ${originalSubject} - MWM`
          : `Re: ${originalSubject} - MWM`,
      html,
    });
  }

  /**
   * Send admin notification email
   * إرسال بريد إشعار للمسؤول
   */
  async sendAdminNotification(
    adminEmail: string,
    subject: string,
    message: string,
    data?: Record<string, string>
  ): Promise<boolean> {
    const html = this.getAdminNotificationEmailTemplate({
      subject,
      message,
      data,
    });

    return this.send({
      to: adminEmail,
      subject: `[MWM Admin] ${subject}`,
      html,
    });
  }

  /**
   * Get contact reply email template
   * الحصول على قالب بريد الرد على التواصل
   */
  private getContactReplyEmailTemplate(data: TemplateData): string {
    const isArabic = data.locale === 'ar';
    return `
<!DOCTYPE html>
<html dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: ${isArabic ? "'Cairo', 'Segoe UI'" : "'Segoe UI', Tahoma"}, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .original { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; border-${isArabic ? 'right' : 'left'}: 4px solid #d1d5db; }
    .reply { background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-${isArabic ? 'right' : 'left'}: 4px solid #2563eb; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      <h2>${isArabic ? `مرحباً ${data.name}،` : `Hello ${data.name},`}</h2>
      <p>${isArabic ? 'شكراً لتواصلك معنا. إليك ردنا على استفسارك:' : 'Thank you for contacting us. Here is our reply to your inquiry:'}</p>

      <p><strong>${isArabic ? 'الموضوع الأصلي:' : 'Original Subject:'}</strong></p>
      <div class="original">
        ${data.originalSubject}
      </div>

      <p><strong>${isArabic ? 'ردنا:' : 'Our Reply:'}</strong></p>
      <div class="reply">
        ${data.replyMessage}
      </div>

      <p>${isArabic ? 'إذا كان لديك أي أسئلة إضافية، لا تتردد في الرد على هذا البريد.' : 'If you have any additional questions, feel free to reply to this email.'}</p>

      <p>${isArabic ? 'مع أطيب التحيات،' : 'Best regards,'}<br><strong>${isArabic ? 'فريق MWM' : 'MWM Team'}</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Get admin notification email template
   * الحصول على قالب بريد إشعار المسؤول
   */
  private getAdminNotificationEmailTemplate(data: TemplateData): string {
    const dataEntries = data.data ? Object.entries(data.data) : [];
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #1f2937; padding: 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; }
    .content { padding: 30px; }
    .alert { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .data-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .data-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    .data-table td:first-child { font-weight: bold; width: 30%; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM Admin Notification</h1>
    </div>
    <div class="content">
      <div class="alert">
        <strong>${data.subject}</strong>
      </div>
      <p>${data.message}</p>
      ${
        dataEntries.length > 0
          ? `
      <table class="data-table">
        ${dataEntries.map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('')}
      </table>
      `
          : ''
      }
      <p style="margin-top: 20px;">
        <a href="${env.clientUrl}/admin" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">Go to Admin Panel</a>
      </p>
    </div>
    <div class="footer">
      <p>This is an automated notification from MWM Admin System</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Get welcome email template
   * الحصول على قالب بريد الترحيب
   */
  private getWelcomeEmailTemplate(data: TemplateData): string {
    return `
<!DOCTYPE html>
<html dir="auto">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      <h2>Welcome ${data.name || 'there'}!</h2>
      <h2>مرحباً ${data.name || 'بك'}!</h2>
      <p>Thank you for joining MWM. We're excited to have you on board!</p>
      <p>شكراً لانضمامك إلى MWM. نحن متحمسون لوجودك معنا!</p>
      <p style="text-align: center;">
        <a href="${env.clientUrl}" class="button">Get Started | ابدأ الآن</a>
      </p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل مع فريق الدعم لدينا.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const emailService = new EmailService();
export default emailService;
