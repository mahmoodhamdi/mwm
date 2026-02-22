/**
 * Notification Validation Schemas
 * مخططات التحقق من الإشعارات
 */

import Joi from 'joi';

const localizedString = Joi.object({
  ar: Joi.string().required(),
  en: Joi.string().required(),
});

const sendNotification = Joi.object({
  userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  title: localizedString.required(),
  body: localizedString.required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error').default('info'),
  link: Joi.string().uri({ allowRelative: true }).optional(),
  data: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
});

const broadcastNotification = Joi.object({
  title: localizedString.required(),
  body: localizedString.required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error').default('info'),
  link: Joi.string().uri({ allowRelative: true }).optional(),
  data: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  topic: Joi.string().optional(),
});

export const notificationValidation = {
  sendNotification,
  broadcastNotification,
};
