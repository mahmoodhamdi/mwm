/**
 * Menu Model
 * نموذج القائمة
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Menu item interface
 * واجهة عنصر القائمة
 */
export interface IMenuItem {
  id: string;
  label: {
    ar: string;
    en: string;
  };
  url: string;
  type: 'internal' | 'external';
  target: '_self' | '_blank';
  icon?: string;
  children?: IMenuItem[];
  order: number;
  isActive: boolean;
}

/**
 * Menu location type
 * نوع موقع القائمة
 */
export type MenuLocation = 'header' | 'footer' | 'sidebar' | 'mobile';

/**
 * Menu interface
 * واجهة القائمة
 */
export interface IMenu extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  location: MenuLocation;
  items: IMenuItem[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Menu item schema
 * مخطط عنصر القائمة
 */
const menuItemSchema = new Schema<IMenuItem>(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      ar: { type: String, required: [true, 'Arabic label is required | التسمية العربية مطلوبة'] },
      en: {
        type: String,
        required: [true, 'English label is required | التسمية الإنجليزية مطلوبة'],
      },
    },
    url: {
      type: String,
      required: [true, 'URL is required | الرابط مطلوب'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['internal', 'external'],
      default: 'internal',
    },
    target: {
      type: String,
      enum: ['_self', '_blank'],
      default: '_self',
    },
    icon: {
      type: String,
      trim: true,
    },
    children: {
      type: [
        {
          id: String,
          label: {
            ar: String,
            en: String,
          },
          url: String,
          type: { type: String, enum: ['internal', 'external'], default: 'internal' },
          target: { type: String, enum: ['_self', '_blank'], default: '_self' },
          icon: String,
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/**
 * Menu schema
 * مخطط القائمة
 */
const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: [true, 'Menu name is required | اسم القائمة مطلوب'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
    },

    slug: {
      type: String,
      required: [true, 'Menu slug is required | معرف القائمة مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug must contain only lowercase letters, numbers, and hyphens | المعرف يجب أن يحتوي فقط على أحرف صغيرة وأرقام وشرطات',
      ],
    },

    location: {
      type: String,
      required: [true, 'Menu location is required | موقع القائمة مطلوب'],
      enum: {
        values: ['header', 'footer', 'sidebar', 'mobile'],
        message: 'Invalid menu location | موقع القائمة غير صالح',
      },
    },

    items: {
      type: [menuItemSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'menus',
  }
);

// Indexes
menuSchema.index({ slug: 1 }, { unique: true });
menuSchema.index({ location: 1, isActive: 1 });

/**
 * Get menu by location
 * جلب القائمة حسب الموقع
 */
menuSchema.statics.getByLocation = async function (
  location: MenuLocation,
  locale?: 'ar' | 'en'
): Promise<IMenu | null> {
  const menu = await this.findOne({ location, isActive: true });
  if (!menu) return null;

  if (locale) {
    // Transform items to return only the selected locale
    const transformItems = (items: IMenuItem[]): unknown[] => {
      return items
        .filter(item => item.isActive)
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          id: item.id,
          label: item.label[locale],
          url: item.url,
          type: item.type,
          target: item.target,
          icon: item.icon,
          children: item.children ? transformItems(item.children as IMenuItem[]) : [],
        }));
    };

    return {
      ...menu.toObject(),
      items: transformItems(menu.items),
    } as IMenu;
  }

  return menu;
};

/**
 * Get menu by slug
 * جلب القائمة حسب المعرف
 */
menuSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<IMenu | null> {
  const menu = await this.findOne({ slug, isActive: true });
  if (!menu) return null;

  if (locale) {
    const transformItems = (items: IMenuItem[]): unknown[] => {
      return items
        .filter(item => item.isActive)
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          id: item.id,
          label: item.label[locale],
          url: item.url,
          type: item.type,
          target: item.target,
          icon: item.icon,
          children: item.children ? transformItems(item.children as IMenuItem[]) : [],
        }));
    };

    return {
      ...menu.toObject(),
      items: transformItems(menu.items),
    } as IMenu;
  }

  return menu;
};

/**
 * Upsert menu
 * إدراج أو تحديث القائمة
 */
menuSchema.statics.upsertMenu = async function (
  slug: string,
  data: Partial<IMenu>
): Promise<IMenu> {
  const menu = await this.findOneAndUpdate(
    { slug },
    { $set: { ...data, slug } },
    { new: true, upsert: true, runValidators: true }
  );
  return menu;
};

/**
 * Add menu item
 * إضافة عنصر للقائمة
 */
menuSchema.statics.addItem = async function (
  menuId: mongoose.Types.ObjectId,
  item: IMenuItem
): Promise<IMenu | null> {
  return this.findByIdAndUpdate(
    menuId,
    { $push: { items: item } },
    { new: true, runValidators: true }
  );
};

/**
 * Update menu item
 * تحديث عنصر في القائمة
 */
menuSchema.statics.updateItem = async function (
  menuId: mongoose.Types.ObjectId,
  itemId: string,
  updates: Partial<IMenuItem>
): Promise<IMenu | null> {
  const updateFields: Record<string, unknown> = {};
  Object.entries(updates).forEach(([key, value]) => {
    updateFields[`items.$.${key}`] = value;
  });

  return this.findOneAndUpdate(
    { _id: menuId, 'items.id': itemId },
    { $set: updateFields },
    { new: true, runValidators: true }
  );
};

/**
 * Remove menu item
 * حذف عنصر من القائمة
 */
menuSchema.statics.removeItem = async function (
  menuId: mongoose.Types.ObjectId,
  itemId: string
): Promise<IMenu | null> {
  return this.findByIdAndUpdate(menuId, { $pull: { items: { id: itemId } } }, { new: true });
};

/**
 * Reorder menu items
 * إعادة ترتيب عناصر القائمة
 */
menuSchema.statics.reorderItems = async function (
  menuId: mongoose.Types.ObjectId,
  itemIds: string[]
): Promise<IMenu | null> {
  const menu = await this.findById(menuId);
  if (!menu) return null;

  // Reorder items based on the provided order
  const reorderedItems = itemIds
    .map((id, index) => {
      const item = menu.items.find((i: IMenuItem) => i.id === id);
      if (item) {
        item.order = index;
        return item;
      }
      return null;
    })
    .filter(Boolean);

  menu.items = reorderedItems as IMenuItem[];
  await menu.save();

  return menu;
};

export interface IMenuModel extends mongoose.Model<IMenu> {
  getByLocation(location: MenuLocation, locale?: 'ar' | 'en'): Promise<IMenu | null>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<IMenu | null>;
  upsertMenu(slug: string, data: Partial<IMenu>): Promise<IMenu>;
  addItem(menuId: mongoose.Types.ObjectId, item: IMenuItem): Promise<IMenu | null>;
  updateItem(
    menuId: mongoose.Types.ObjectId,
    itemId: string,
    updates: Partial<IMenuItem>
  ): Promise<IMenu | null>;
  removeItem(menuId: mongoose.Types.ObjectId, itemId: string): Promise<IMenu | null>;
  reorderItems(menuId: mongoose.Types.ObjectId, itemIds: string[]): Promise<IMenu | null>;
}

export const Menu = mongoose.model<IMenu, IMenuModel>('Menu', menuSchema);
export default Menu;
