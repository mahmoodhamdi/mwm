/**
 * Newsletter Service
 * خدمة النشرة البريدية
 */

import crypto from 'crypto';
import { Subscriber, ISubscriber, SubscriberStatus } from '../models/Subscriber';
import { Newsletter, INewsletter } from '../models/Newsletter';
import emailService from './email.service';
import { env, logger } from '../config';

/**
 * Subscription data interface
 */
interface SubscriptionData {
  email: string;
  name?: string;
  locale?: 'ar' | 'en';
  source?: 'website' | 'import' | 'manual' | 'api';
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
}

/**
 * Import result interface
 */
interface ImportResult {
  total: number;
  imported: number;
  duplicates: number;
  invalid: number;
  errors: string[];
}

/**
 * Newsletter Service Class
 * فئة خدمة النشرة البريدية
 */
class NewsletterService {
  /**
   * Subscribe to newsletter
   * الاشتراك في النشرة البريدية
   */
  async subscribe(data: SubscriptionData): Promise<{ subscriber: ISubscriber; isNew: boolean }> {
    const email = data.email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await Subscriber.getByEmail(email);

    if (existing) {
      // If already active, return existing
      if (existing.status === 'active') {
        return { subscriber: existing, isNew: false };
      }

      // Reactivate if previously unsubscribed
      existing.status = 'active';
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = undefined;
      existing.unsubscribeToken = crypto.randomBytes(32).toString('hex');
      if (data.name) existing.name = data.name;
      if (data.locale) existing.locale = data.locale;
      if (data.metadata) existing.metadata = data.metadata;
      await existing.save();

      return { subscriber: existing, isNew: false };
    }

    // Create new subscriber
    const subscriber = new Subscriber({
      email,
      name: data.name,
      locale: data.locale || 'ar',
      source: data.source || 'website',
      status: 'active', // For MVP, skip email verification
      metadata: data.metadata,
    });

    await subscriber.save();

    // Send welcome email (non-blocking, log failure)
    const emailSent = await this.sendWelcomeEmail(subscriber);
    if (!emailSent) {
      logger.warn(`Failed to send newsletter welcome email to ${subscriber.email}`);
    }

    return { subscriber, isNew: true };
  }

  /**
   * Unsubscribe from newsletter
   * إلغاء الاشتراك من النشرة البريدية
   */
  async unsubscribe(email: string, token: string): Promise<boolean> {
    const subscriber = await Subscriber.getByEmail(email);

    if (!subscriber) {
      return false;
    }

    if (subscriber.unsubscribeToken !== token) {
      return false;
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return true;
  }

  /**
   * Verify subscription email
   * التحقق من بريد الاشتراك
   */
  async verifyEmail(token: string): Promise<ISubscriber | null> {
    const subscriber = await Subscriber.findOne({
      verificationToken: token,
      status: 'pending',
    });

    if (!subscriber) {
      return null;
    }

    subscriber.status = 'active';
    subscriber.verificationToken = undefined;
    await subscriber.save();

    return subscriber;
  }

  /**
   * Send welcome email to subscriber
   * إرسال بريد الترحيب للمشترك
   */
  private async sendWelcomeEmail(subscriber: ISubscriber): Promise<boolean> {
    const unsubscribeUrl = `${env.clientUrl}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;

    const html = this.getSubscriptionWelcomeTemplate({
      name: subscriber.name,
      unsubscribeUrl,
      locale: subscriber.locale,
    });

    return emailService.send({
      to: subscriber.email,
      subject:
        subscriber.locale === 'ar'
          ? 'مرحباً بك في النشرة البريدية - MWM'
          : 'Welcome to our Newsletter - MWM',
      html,
    });
  }

  /**
   * Send campaign to subscribers
   * إرسال الحملة للمشتركين
   */
  async sendCampaign(
    campaignId: string
  ): Promise<{ success: boolean; sentCount: number; errors: number }> {
    const campaign = await Newsletter.getById(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      throw new Error('Campaign cannot be sent in its current status');
    }

    // Update status to sending
    campaign.status = 'sending';
    await campaign.save();

    // Get recipients based on recipient type
    let recipients: ISubscriber[];

    switch (campaign.recipientType) {
      case 'tags':
        recipients = await Subscriber.getActiveSubscribers(campaign.recipientTags);
        break;
      case 'specific':
        recipients = await Subscriber.find({
          _id: { $in: campaign.recipientIds },
          status: 'active',
        });
        break;
      case 'all':
      default:
        recipients = await Subscriber.getActiveSubscribers();
    }

    // Update recipient count
    campaign.metrics.recipientCount = recipients.length;
    await campaign.save();

    // Send emails
    let sentCount = 0;
    let errorCount = 0;

    for (const recipient of recipients) {
      try {
        const locale = recipient.locale || 'ar';
        const unsubscribeUrl = `${env.clientUrl}/newsletter/unsubscribe?email=${encodeURIComponent(recipient.email)}&token=${recipient.unsubscribeToken}`;

        const html = this.getCampaignEmailTemplate({
          subject: campaign.subject[locale],
          preheader: campaign.preheader?.[locale],
          content: campaign.content[locale],
          name: recipient.name,
          unsubscribeUrl,
          locale,
        });

        const success = await emailService.send({
          to: recipient.email,
          subject: campaign.subject[locale],
          html,
        });

        if (success) {
          sentCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        logger.error(`Failed to send campaign email to ${recipient.email}:`, error);
        errorCount++;
      }
    }

    // Update campaign status and metrics
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.metrics.sentCount = sentCount;
    await campaign.save();

    return { success: true, sentCount, errors: errorCount };
  }

  /**
   * Schedule campaign for later sending
   * جدولة الحملة للإرسال لاحقاً
   */
  async scheduleCampaign(campaignId: string, scheduledAt: Date): Promise<INewsletter> {
    const campaign = await Newsletter.findById(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'draft') {
      throw new Error('Only draft campaigns can be scheduled');
    }

    campaign.status = 'scheduled';
    campaign.scheduledAt = scheduledAt;
    await campaign.save();

    return campaign;
  }

  /**
   * Cancel scheduled campaign
   * إلغاء الحملة المجدولة
   */
  async cancelCampaign(campaignId: string): Promise<INewsletter> {
    const campaign = await Newsletter.findById(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'scheduled') {
      throw new Error('Only scheduled campaigns can be cancelled');
    }

    campaign.status = 'cancelled';
    campaign.cancelledAt = new Date();
    await campaign.save();

    return campaign;
  }

  /**
   * Import subscribers from CSV data
   * استيراد المشتركين من بيانات CSV
   */
  async importSubscribers(
    csvData: Array<{ email: string; name?: string; tags?: string[] }>,
    options: { locale?: 'ar' | 'en'; tags?: string[] } = {}
  ): Promise<ImportResult> {
    const result: ImportResult = {
      total: csvData.length,
      imported: 0,
      duplicates: 0,
      invalid: 0,
      errors: [],
    };

    const emailRegex = /^\S+@\S+\.\S+$/;

    for (const row of csvData) {
      const email = row.email?.toLowerCase().trim();

      if (!email || !emailRegex.test(email)) {
        result.invalid++;
        continue;
      }

      try {
        const existing = await Subscriber.getByEmail(email);

        if (existing) {
          result.duplicates++;
          continue;
        }

        const tags = [...(row.tags || []), ...(options.tags || [])];

        await Subscriber.create({
          email,
          name: row.name,
          status: 'active',
          source: 'import',
          locale: options.locale || 'ar',
          tags,
        });

        result.imported++;
      } catch (error) {
        result.errors.push(`Failed to import ${email}: ${(error as Error).message}`);
      }
    }

    return result;
  }

  /**
   * Export subscribers as array
   * تصدير المشتركين كمصفوفة
   */
  async exportSubscribers(
    filters: { status?: SubscriberStatus; tags?: string[] } = {}
  ): Promise<
    Array<{ email: string; name: string; status: string; tags: string; subscribedAt: string }>
  > {
    const query: Record<string, unknown> = {};

    if (filters.status) query.status = filters.status;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };

    const subscribers = await Subscriber.find(query).lean();

    return subscribers.map(s => ({
      email: s.email,
      name: s.name || '',
      status: s.status,
      tags: s.tags.join(', '),
      subscribedAt: s.subscribedAt.toISOString(),
    }));
  }

  /**
   * Get subscription welcome email template
   * الحصول على قالب بريد الترحيب بالاشتراك
   */
  private getSubscriptionWelcomeTemplate(data: {
    name?: string;
    unsubscribeUrl: string;
    locale: string;
  }): string {
    const isArabic = data.locale === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';

    return `
<!DOCTYPE html>
<html dir="${dir}" lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; direction: ${dir}; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
    .unsubscribe { color: #666666; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      ${
        isArabic
          ? `
        <h2>مرحباً ${data.name || 'بك'}!</h2>
        <p>شكراً لاشتراكك في نشرتنا البريدية.</p>
        <p>ستتلقى أحدث الأخبار والتحديثات منا.</p>
      `
          : `
        <h2>Welcome ${data.name || 'there'}!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive our latest news and updates.</p>
      `
      }
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      <p><a href="${data.unsubscribeUrl}" class="unsubscribe">${isArabic ? 'إلغاء الاشتراك' : 'Unsubscribe'}</a></p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Get campaign email template
   * الحصول على قالب بريد الحملة
   */
  private getCampaignEmailTemplate(data: {
    subject: string;
    preheader?: string;
    content: string;
    name?: string;
    unsubscribeUrl: string;
    locale: string;
  }): string {
    const isArabic = data.locale === 'ar';
    const dir = isArabic ? 'rtl' : 'ltr';

    return `
<!DOCTYPE html>
<html dir="${dir}" lang="${data.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${data.preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${data.preheader}</span>` : ''}
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; direction: ${dir}; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2563eb; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 30px; line-height: 1.6; }
    .footer { padding: 20px; text-align: center; color: #666666; font-size: 12px; background-color: #f8f9fa; }
    .unsubscribe { color: #666666; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MWM</h1>
    </div>
    <div class="content">
      ${data.name ? `<p>${isArabic ? `مرحباً ${data.name}،` : `Hi ${data.name},`}</p>` : ''}
      ${data.content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MWM. ${isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      <p><a href="${data.unsubscribeUrl}" class="unsubscribe">${isArabic ? 'إلغاء الاشتراك' : 'Unsubscribe'}</a></p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const newsletterService = new NewsletterService();
export default newsletterService;
