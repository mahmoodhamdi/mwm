/**
 * TeamMember Model
 * نموذج عضو الفريق
 */

import mongoose, { Document, Schema } from 'mongoose';
import { LocalizedString } from '@mwm/shared';

// Type alias for backward compatibility
type IBilingual = LocalizedString;

/**
 * Social media links interface
 * واجهة روابط التواصل الاجتماعي
 */
export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  email?: string;
}

/**
 * Skill interface
 * واجهة المهارة
 */
export interface ISkill {
  name: IBilingual;
  level: number; // 1-100
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'other';
}

/**
 * TeamMember interface
 * واجهة عضو الفريق
 */
export interface ITeamMember extends Document {
  _id: mongoose.Types.ObjectId;
  name: IBilingual;
  slug: string;
  position: IBilingual;
  bio: IBilingual;
  shortBio?: IBilingual;
  department: mongoose.Types.ObjectId;
  avatar: string;
  coverImage?: string;
  skills?: ISkill[];
  socialLinks?: ISocialLinks;
  experience?: number; // years
  education?: Array<{
    degree: IBilingual;
    institution: IBilingual;
    year?: number;
  }>;
  certifications?: Array<{
    name: IBilingual;
    issuer?: IBilingual;
    year?: number;
    url?: string;
  }>;
  projects?: mongoose.Types.ObjectId[];
  seo?: {
    metaTitle?: IBilingual;
    metaDescription?: IBilingual;
    keywords?: string[];
  };
  order: number;
  isLeader: boolean;
  isFeatured: boolean;
  isActive: boolean;
  joinedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TeamMember schema
 * مخطط عضو الفريق
 */
const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      ar: {
        type: String,
        required: [true, 'Arabic name is required | الاسم بالعربية مطلوب'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
      },
      en: {
        type: String,
        required: [true, 'English name is required | الاسم بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters | الاسم لا يمكن أن يتجاوز 100 حرف'],
      },
    },

    slug: {
      type: String,
      required: [true, 'Slug is required | الرابط المختصر مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be URL-friendly | الرابط المختصر يجب أن يكون صالحاً للعناوين',
      ],
    },

    position: {
      ar: {
        type: String,
        required: [true, 'Arabic position is required | المنصب بالعربية مطلوب'],
        trim: true,
        maxlength: [
          100,
          'Position cannot exceed 100 characters | المنصب لا يمكن أن يتجاوز 100 حرف',
        ],
      },
      en: {
        type: String,
        required: [true, 'English position is required | المنصب بالإنجليزية مطلوب'],
        trim: true,
        maxlength: [
          100,
          'Position cannot exceed 100 characters | المنصب لا يمكن أن يتجاوز 100 حرف',
        ],
      },
    },

    bio: {
      ar: {
        type: String,
        required: [true, 'Arabic bio is required | السيرة الذاتية بالعربية مطلوبة'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English bio is required | السيرة الذاتية بالإنجليزية مطلوبة'],
        trim: true,
      },
    },

    shortBio: {
      ar: {
        type: String,
        trim: true,
        maxlength: [200, 'Short bio cannot exceed 200 characters'],
      },
      en: {
        type: String,
        trim: true,
        maxlength: [200, 'Short bio cannot exceed 200 characters'],
      },
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required | القسم مطلوب'],
      index: true,
    },

    avatar: {
      type: String,
      required: [true, 'Avatar is required | الصورة الشخصية مطلوبة'],
      trim: true,
    },

    coverImage: {
      type: String,
      trim: true,
    },

    skills: [
      {
        name: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        level: {
          type: Number,
          required: true,
          min: [1, 'Skill level must be at least 1'],
          max: [100, 'Skill level cannot exceed 100'],
        },
        category: {
          type: String,
          enum: ['technical', 'soft', 'language', 'tool', 'other'],
          default: 'technical',
        },
      },
    ],

    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
      website: { type: String, trim: true },
      email: { type: String, trim: true },
    },

    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
    },

    education: [
      {
        degree: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        institution: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        year: { type: Number },
      },
    ],

    certifications: [
      {
        name: {
          ar: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
        },
        issuer: {
          ar: { type: String, trim: true },
          en: { type: String, trim: true },
        },
        year: { type: Number },
        url: { type: String, trim: true },
      },
    ],

    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],

    seo: {
      metaTitle: {
        ar: { type: String, trim: true, maxlength: 60 },
        en: { type: String, trim: true, maxlength: 60 },
      },
      metaDescription: {
        ar: { type: String, trim: true, maxlength: 160 },
        en: { type: String, trim: true, maxlength: 160 },
      },
      keywords: [{ type: String, trim: true }],
    },

    order: {
      type: Number,
      default: 0,
    },

    isLeader: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    joinedAt: {
      type: Date,
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
    collection: 'team_members',
  }
);

// Indexes (slug index is created by unique: true on the field)
teamMemberSchema.index({ department: 1, isActive: 1, order: 1 });
teamMemberSchema.index({ isActive: 1, isFeatured: 1 });
teamMemberSchema.index({ isActive: 1, isLeader: 1 });
teamMemberSchema.index({
  'name.ar': 'text',
  'name.en': 'text',
  'position.ar': 'text',
  'position.en': 'text',
});

/**
 * Get active team members
 * جلب أعضاء الفريق النشطين
 */
teamMemberSchema.statics.getActiveMembers = async function (
  options: {
    department?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    leaders?: boolean;
    limit?: number;
    page?: number;
  } = {}
): Promise<{ members: ITeamMember[]; total: number }> {
  const { department, locale, featured, leaders, limit = 10, page = 1 } = options;

  const filter: Record<string, unknown> = { isActive: true };
  if (department) filter.department = department;
  if (featured !== undefined) filter.isFeatured = featured;
  if (leaders !== undefined) filter.isLeader = leaders;

  const skip = (page - 1) * limit;
  const total = await this.countDocuments(filter);
  const members = await this.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('department', 'name slug');

  if (locale) {
    const localizedMembers = members.map((member: ITeamMember) => ({
      ...member.toObject(),
      name: member.name[locale],
      position: member.position[locale],
      bio: member.bio[locale],
      shortBio: member.shortBio?.[locale],
      skills: member.skills?.map(s => ({
        ...s,
        name: s.name[locale],
      })),
    }));
    return { members: localizedMembers, total };
  }

  return { members, total };
};

/**
 * Get team member by slug
 * جلب عضو الفريق بالرابط المختصر
 */
teamMemberSchema.statics.getBySlug = async function (
  slug: string,
  locale?: 'ar' | 'en'
): Promise<ITeamMember | null> {
  const member = await this.findOne({ slug, isActive: true })
    .populate('department', 'name slug')
    .populate('projects', 'title slug thumbnail');

  if (!member) return null;

  if (locale) {
    return {
      ...member.toObject(),
      name: member.name[locale],
      position: member.position[locale],
      bio: member.bio[locale],
      shortBio: member.shortBio?.[locale],
      skills: member.skills?.map((s: ISkill) => ({
        ...s,
        name: s.name[locale],
      })),
      education: member.education?.map(
        (e: { degree: IBilingual; institution: IBilingual; year?: number }) => ({
          ...e,
          degree: e.degree[locale],
          institution: e.institution[locale],
        })
      ),
      certifications: member.certifications?.map(
        (c: { name: IBilingual; issuer?: IBilingual; year?: number; url?: string }) => ({
          ...c,
          name: c.name[locale],
          issuer: c.issuer?.[locale],
        })
      ),
      seo: member.seo
        ? {
            ...member.seo,
            metaTitle: member.seo.metaTitle?.[locale],
            metaDescription: member.seo.metaDescription?.[locale],
          }
        : undefined,
    };
  }

  return member;
};

/**
 * Get featured team members
 * جلب أعضاء الفريق المميزين
 */
teamMemberSchema.statics.getFeaturedMembers = async function (
  limit = 6,
  locale?: 'ar' | 'en'
): Promise<ITeamMember[]> {
  const members = await this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(limit)
    .populate('department', 'name slug');

  if (locale) {
    return members.map((member: ITeamMember) => ({
      ...member.toObject(),
      name: member.name[locale],
      position: member.position[locale],
      shortBio: member.shortBio?.[locale],
    }));
  }

  return members;
};

/**
 * Get team leaders
 * جلب قادة الفريق
 */
teamMemberSchema.statics.getLeaders = async function (
  locale?: 'ar' | 'en'
): Promise<ITeamMember[]> {
  const leaders = await this.find({ isActive: true, isLeader: true })
    .sort({ order: 1 })
    .populate('department', 'name slug');

  if (locale) {
    return leaders.map((member: ITeamMember) => ({
      ...member.toObject(),
      name: member.name[locale],
      position: member.position[locale],
      shortBio: member.shortBio?.[locale],
    }));
  }

  return leaders;
};

export interface ITeamMemberModel extends mongoose.Model<ITeamMember> {
  getActiveMembers(options?: {
    department?: string;
    locale?: 'ar' | 'en';
    featured?: boolean;
    leaders?: boolean;
    limit?: number;
    page?: number;
  }): Promise<{ members: ITeamMember[]; total: number }>;
  getBySlug(slug: string, locale?: 'ar' | 'en'): Promise<ITeamMember | null>;
  getFeaturedMembers(limit?: number, locale?: 'ar' | 'en'): Promise<ITeamMember[]>;
  getLeaders(locale?: 'ar' | 'en'): Promise<ITeamMember[]>;
}

export const TeamMember = mongoose.model<ITeamMember, ITeamMemberModel>(
  'TeamMember',
  teamMemberSchema
);

export default TeamMember;
