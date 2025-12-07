// MongoDB Initialization Script
// This script runs when the MongoDB container starts for the first time

// Switch to the mwm database
db = db.getSiblingDB('mwm');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        role: {
          enum: ['super_admin', 'admin', 'editor', 'author', 'viewer'],
          description: 'must be a valid role',
        },
      },
    },
  },
});

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, isActive: 1 });

// Create collections for other entities
db.createCollection('projects');
db.createCollection('services');
db.createCollection('team');
db.createCollection('blogposts');
db.createCollection('contacts');
db.createCollection('settings');
db.createCollection('translations');
db.createCollection('sitecontent');
db.createCollection('menus');
db.createCollection('newsletters');
db.createCollection('careers');
db.createCollection('applications');

// Create indexes for projects
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ isPublished: 1, isFeatured: 1, order: 1 });
db.projects.createIndex({ category: 1 });
db.projects.createIndex({ '$**': 'text' });

// Create indexes for services
db.services.createIndex({ slug: 1 }, { unique: true });
db.services.createIndex({ isActive: 1, order: 1 });

// Create indexes for team
db.team.createIndex({ slug: 1 }, { unique: true });
db.team.createIndex({ department: 1, isActive: 1, order: 1 });

// Create indexes for blog posts
db.blogposts.createIndex({ slug: 1 }, { unique: true });
db.blogposts.createIndex({ status: 1, publishedAt: -1 });
db.blogposts.createIndex({ category: 1, tags: 1 });
db.blogposts.createIndex({ author: 1 });

// Create indexes for contacts
db.contacts.createIndex({ status: 1, createdAt: -1 });
db.contacts.createIndex({ email: 1 });

// Create indexes for translations
db.translations.createIndex({ key: 1, namespace: 1 }, { unique: true });

// Create contact messages indexes
db.contactmessages.createIndex({ status: 1, createdAt: -1 });
db.contactmessages.createIndex({ isStarred: 1 });

// Create newsletter indexes
db.newslettersubscribers.createIndex({ email: 1 }, { unique: true });
db.newslettersubscribers.createIndex({ status: 1 });

// Create settings and menu indexes
db.settings.createIndex({ key: 1 }, { unique: true });
db.menus.createIndex({ slug: 1 }, { unique: true });
db.sitecontent.createIndex({ key: 1 }, { unique: true });

// Insert default admin user if not exists
const adminEmail = 'admin@mwm.com';
const existingAdmin = db.users.findOne({ email: adminEmail });

if (!existingAdmin) {
  print('Creating default admin user...');
  // Password: Admin@123 (hashed with bcrypt, 12 rounds)
  db.users.insertOne({
    email: adminEmail,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.2SJGXH1LPWbsyi',
    name: 'Admin',
    role: 'super_admin',
    isEmailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  print('Default admin user created: admin@mwm.com / Admin@123');
}

// Print success message
print('✅ MongoDB initialization completed successfully!');
print(
  '📦 Collections created: users, projects, services, team, blogposts, contacts, settings, translations, sitecontent, menus, newsletters, careers, applications'
);
print('🔑 Indexes created for optimal query performance');
