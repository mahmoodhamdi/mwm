/**
 * Base Repository
 * المستودع الأساسي
 *
 * Implements the Repository Pattern for MongoDB/Mongoose
 * ينفذ نمط المستودع لـ MongoDB/Mongoose
 */

import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  PopulateOptions,
  PipelineStage,
} from 'mongoose';

/**
 * Pagination metadata
 * بيانات الترقيم
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Query options for find operations
 * خيارات الاستعلام لعمليات البحث
 */
export interface FindOptions<T> {
  select?: ProjectionType<T>;
  sort?: Record<string, 1 | -1>;
  populate?: PopulateOptions | PopulateOptions[];
  lean?: boolean;
}

/**
 * Paginated query options
 * خيارات الاستعلام المرقم
 */
export interface PaginatedOptions<T> extends FindOptions<T> {
  page?: number;
  limit?: number;
}

/**
 * Paginated result
 * نتيجة مرقمة
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Base Repository Class
 * فئة المستودع الأساسية
 */
export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   * إنشاء مستند جديد
   */
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  /**
   * Create multiple documents
   * إنشاء مستندات متعددة
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(data) as unknown as T[];
  }

  /**
   * Find document by ID
   * البحث عن مستند بالمعرف
   */
  async findById(id: string, options?: FindOptions<T>): Promise<T | null> {
    let query = this.model.findById(id);

    if (options?.select) {
      query = query.select(options.select);
    }

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    if (options?.lean) {
      return query.lean().exec() as unknown as T | null;
    }

    return query.exec();
  }

  /**
   * Find one document
   * البحث عن مستند واحد
   */
  async findOne(filter: FilterQuery<T>, options?: FindOptions<T>): Promise<T | null> {
    let query = this.model.findOne(filter);

    if (options?.select) {
      query = query.select(options.select);
    }

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    if (options?.lean) {
      return query.lean().exec() as unknown as T | null;
    }

    return query.exec();
  }

  /**
   * Find multiple documents
   * البحث عن مستندات متعددة
   */
  async find(filter: FilterQuery<T> = {}, options?: FindOptions<T>): Promise<T[]> {
    let query = this.model.find(filter);

    if (options?.select) {
      query = query.select(options.select);
    }

    if (options?.sort) {
      query = query.sort(options.sort);
    }

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    if (options?.lean) {
      return query.lean().exec() as unknown as T[];
    }

    return query.exec();
  }

  /**
   * Find documents with pagination
   * البحث عن مستندات مع التصفح
   */
  async findPaginated(
    filter: FilterQuery<T> = {},
    options?: PaginatedOptions<T>
  ): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
    const skip = (page - 1) * limit;

    // Get total count
    const total = await this.model.countDocuments(filter);

    // Get documents
    let query = this.model.find(filter).skip(skip).limit(limit);

    if (options?.select) {
      query = query.select(options.select);
    }

    if (options?.sort) {
      query = query.sort(options.sort);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    const data = options?.lean
      ? ((await query.lean().exec()) as unknown as T[])
      : await query.exec();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Update document by ID
   * تحديث مستند بالمعرف
   */
  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true, ...options })
      .exec();
  }

  /**
   * Update one document
   * تحديث مستند واحد
   */
  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, runValidators: true, ...options })
      .exec();
  }

  /**
   * Update multiple documents
   * تحديث مستندات متعددة
   */
  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<{ modifiedCount: number }> {
    const result = await this.model.updateMany(filter, update).exec();
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Delete document by ID
   * حذف مستند بالمعرف
   */
  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Delete one document
   * حذف مستند واحد
   */
  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  /**
   * Delete multiple documents
   * حذف مستندات متعددة
   */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount };
  }

  /**
   * Count documents
   * عد المستندات
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /**
   * Check if document exists
   * التحقق من وجود مستند
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return result !== null;
  }

  /**
   * Aggregate documents
   * تجميع المستندات
   */
  async aggregate<R = unknown>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate(pipeline).exec();
  }

  /**
   * Distinct values
   * القيم المميزة
   */
  async distinct(field: string, filter?: FilterQuery<T>): Promise<unknown[]> {
    return this.model.distinct(field, filter).exec();
  }
}

export default BaseRepository;
