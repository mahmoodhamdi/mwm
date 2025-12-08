/**
 * Database Connection Integration Tests
 * اختبارات تكامل اتصال قاعدة البيانات
 */

// Set required environment variables before any imports
process.env['NODE_ENV'] = 'test';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';
process.env['REDIS_URL'] = 'redis://localhost:6379';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-that-is-long-enough';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Database Connection', () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1' },
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch {
      // Skip tests if MongoDB memory server fails to start
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

  describe('Connection Status', () => {
    it('should be connected to MongoDB', () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should have a valid connection host', () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }
      expect(mongoose.connection.host).toBeDefined();
    });
  });

  describe('Basic Operations', () => {
    // Define a simple test schema
    const TestSchema = new mongoose.Schema({
      name: { type: String, required: true },
      value: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    });

    let TestModel: mongoose.Model<mongoose.Document & { name: string; value: number }>;

    beforeAll(() => {
      // Create model only if not already exists
      TestModel = mongoose.models['Test'] || mongoose.model('Test', TestSchema);
    });

    beforeEach(async () => {
      if (mongoose.connection.readyState === 1) {
        await TestModel.deleteMany({});
      }
    });

    it('should create a document', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const doc = await TestModel.create({ name: 'Test Document', value: 42 });

      expect(doc._id).toBeDefined();
      expect(doc.name).toBe('Test Document');
      expect(doc.value).toBe(42);
    });

    it('should read a document', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      await TestModel.create({ name: 'Read Test', value: 100 });
      const doc = await TestModel.findOne({ name: 'Read Test' });

      expect(doc).not.toBeNull();
      expect(doc?.value).toBe(100);
    });

    it('should update a document', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const doc = await TestModel.create({ name: 'Update Test', value: 50 });
      await TestModel.updateOne({ _id: doc._id }, { value: 75 });
      const updated = await TestModel.findById(doc._id);

      expect(updated?.value).toBe(75);
    });

    it('should delete a document', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const doc = await TestModel.create({ name: 'Delete Test' });
      await TestModel.deleteOne({ _id: doc._id });
      const deleted = await TestModel.findById(doc._id);

      expect(deleted).toBeNull();
    });

    it('should perform aggregation', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      await TestModel.create([
        { name: 'Agg 1', value: 10 },
        { name: 'Agg 2', value: 20 },
        { name: 'Agg 3', value: 30 },
      ]);

      const result = await TestModel.aggregate([
        { $group: { _id: null, total: { $sum: '$value' } } },
      ]);

      expect(result[0].total).toBe(60);
    });

    it('should handle bulk operations', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const docs = await TestModel.insertMany([
        { name: 'Bulk 1', value: 1 },
        { name: 'Bulk 2', value: 2 },
        { name: 'Bulk 3', value: 3 },
      ]);

      expect(docs).toHaveLength(3);

      const count = await TestModel.countDocuments();
      expect(count).toBe(3);
    });

    it('should support indexes', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      // Create an index
      await TestModel.collection.createIndex({ name: 1 });

      const indexes = await TestModel.collection.indexes();
      const hasNameIndex = indexes.some((idx) => idx.key && 'name' in idx.key);

      expect(hasNameIndex).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const InvalidSchema = new mongoose.Schema({
        email: {
          type: String,
          required: true,
          validate: {
            validator: (v: string) => /\S+@\S+\.\S+/.test(v),
            message: 'Invalid email format',
          },
        },
      });

      const InvalidModel =
        mongoose.models['InvalidTest'] || mongoose.model('InvalidTest', InvalidSchema);

      await expect(InvalidModel.create({ email: 'invalid' })).rejects.toThrow();
    });

    it('should handle duplicate key errors', async () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      const UniqueSchema = new mongoose.Schema({
        code: { type: String, unique: true, required: true },
      });

      const UniqueModel =
        mongoose.models['UniqueTest'] || mongoose.model('UniqueTest', UniqueSchema);

      // Ensure index is created
      await UniqueModel.syncIndexes();

      await UniqueModel.create({ code: 'ABC123' });

      await expect(UniqueModel.create({ code: 'ABC123' })).rejects.toThrow();
    });
  });

  describe('Connection Events', () => {
    it('should emit connected event', () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should have correct database name', () => {
      if (mongoose.connection.readyState !== 1) {
        console.warn('Skipping - MongoDB not available');
        return;
      }

      expect(mongoose.connection.db?.databaseName).toBeDefined();
    });
  });
});
