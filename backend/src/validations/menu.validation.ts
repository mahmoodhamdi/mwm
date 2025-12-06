/**
 * Menu Validation Schemas
 * مخططات التحقق من القوائم
 */

import Joi from 'joi';

/**
 * Bilingual validation schema
 * مخطط التحقق ثنائي اللغة
 */
const bilingualSchema = Joi.object({
  ar: Joi.string().required().messages({
    'any.required': 'Arabic value is required | القيمة العربية مطلوبة',
  }),
  en: Joi.string().required().messages({
    'any.required': 'English value is required | القيمة الإنجليزية مطلوبة',
  }),
});

/**
 * Menu item validation schema
 * مخطط التحقق من عنصر القائمة
 */
const menuItemSchema = Joi.object({
  id: Joi.string().required(),
  label: bilingualSchema.required(),
  url: Joi.string().required().messages({
    'any.required': 'URL is required | الرابط مطلوب',
  }),
  type: Joi.string().valid('internal', 'external').default('internal'),
  target: Joi.string().valid('_self', '_blank').default('_self'),
  icon: Joi.string().allow(''),
  children: Joi.array().items(Joi.link('#menuItem')).default([]),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
}).id('menuItem');

/**
 * Create menu validation
 * التحقق من إنشاء القائمة
 */
export const createMenuSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'any.required': 'Menu name is required | اسم القائمة مطلوب',
    'string.max': 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف',
  }),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Slug must contain only lowercase letters, numbers, and hyphens | المعرف يجب أن يحتوي فقط على أحرف صغيرة وأرقام وشرطات',
      'any.required': 'Slug is required | المعرف مطلوب',
    }),
  location: Joi.string().valid('header', 'footer', 'sidebar', 'mobile').required().messages({
    'any.only': 'Invalid menu location | موقع القائمة غير صالح',
    'any.required': 'Menu location is required | موقع القائمة مطلوب',
  }),
  items: Joi.array().items(menuItemSchema).default([]),
  isActive: Joi.boolean().default(true),
});

/**
 * Update menu validation
 * التحقق من تحديث القائمة
 */
export const updateMenuSchema = Joi.object({
  name: Joi.string().max(100),
  location: Joi.string().valid('header', 'footer', 'sidebar', 'mobile'),
  items: Joi.array().items(menuItemSchema),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Add menu item validation
 * التحقق من إضافة عنصر للقائمة
 */
export const addMenuItemSchema = Joi.object({
  id: Joi.string().required(),
  label: bilingualSchema.required(),
  url: Joi.string().required(),
  type: Joi.string().valid('internal', 'external').default('internal'),
  target: Joi.string().valid('_self', '_blank').default('_self'),
  icon: Joi.string().allow(''),
  children: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        label: bilingualSchema.required(),
        url: Joi.string().required(),
        type: Joi.string().valid('internal', 'external').default('internal'),
        target: Joi.string().valid('_self', '_blank').default('_self'),
        icon: Joi.string().allow(''),
        order: Joi.number().default(0),
        isActive: Joi.boolean().default(true),
      })
    )
    .default([]),
  order: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

/**
 * Update menu item validation
 * التحقق من تحديث عنصر في القائمة
 */
export const updateMenuItemSchema = Joi.object({
  label: bilingualSchema,
  url: Joi.string(),
  type: Joi.string().valid('internal', 'external'),
  target: Joi.string().valid('_self', '_blank'),
  icon: Joi.string().allow(''),
  order: Joi.number(),
  isActive: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required | يجب تحديد حقل واحد على الأقل',
  });

/**
 * Reorder menu items validation
 * التحقق من إعادة ترتيب عناصر القائمة
 */
export const reorderMenuItemsSchema = Joi.object({
  itemIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one item ID is required | يجب تحديد معرف عنصر واحد على الأقل',
    'any.required': 'Item IDs are required | معرفات العناصر مطلوبة',
  }),
});

/**
 * Query menus validation
 * التحقق من استعلام القوائم
 */
export const queryMenusSchema = Joi.object({
  location: Joi.string().valid('header', 'footer', 'sidebar', 'mobile'),
  isActive: Joi.boolean(),
  locale: Joi.string().valid('ar', 'en'),
});

export const menuValidation = {
  create: createMenuSchema,
  update: updateMenuSchema,
  addItem: addMenuItemSchema,
  updateItem: updateMenuItemSchema,
  reorderItems: reorderMenuItemsSchema,
  query: queryMenusSchema,
};

export default menuValidation;
