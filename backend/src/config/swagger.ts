/**
 * Swagger Configuration
 * إعداد Swagger
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MWM API Documentation',
      version: '1.0.0',
      description: `
        MWM - Integrated Software Solutions API

        هذا هو التوثيق الرسمي لواجهة برمجة تطبيقات MWM.

        ## Authentication
        Most endpoints require JWT authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <token>\`

        ## Rate Limiting
        - 100 requests per 15 minutes per IP
        - Admin endpoints may have additional limits

        ## Response Format
        All responses follow this format:
        \`\`\`json
        {
          "success": true,
          "data": {...},
          "message": "Optional message"
        }
        \`\`\`

        Error responses:
        \`\`\`json
        {
          "success": false,
          "error": {
            "code": "ERROR_CODE",
            "message": "Error description"
          }
        }
        \`\`\`
      `,
      contact: {
        name: 'MWM Support',
        email: 'support@mwm.com',
        url: 'https://mwm.com',
      },
      license: {
        name: 'Private',
        url: 'https://mwm.com/terms',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Invalid input data' },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        LocalizedContent: {
          type: 'object',
          properties: {
            ar: { type: 'string', description: 'Arabic content' },
            en: { type: 'string', description: 'English content' },
          },
          required: ['ar', 'en'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
            isEmailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectid' },
            title: { $ref: '#/components/schemas/LocalizedContent' },
            slug: { type: 'string' },
            description: { $ref: '#/components/schemas/LocalizedContent' },
            icon: { type: 'string' },
            image: { type: 'string' },
            category: { type: 'string', format: 'objectid' },
            order: { type: 'number' },
            isActive: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectid' },
            title: { $ref: '#/components/schemas/LocalizedContent' },
            slug: { type: 'string' },
            description: { $ref: '#/components/schemas/LocalizedContent' },
            images: { type: 'array', items: { type: 'string' } },
            client: { type: 'string' },
            completionDate: { type: 'string', format: 'date' },
            category: { type: 'string', format: 'objectid' },
            technologies: { type: 'array', items: { type: 'string' } },
            isPublished: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
          },
        },
        TeamMember: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectid' },
            name: { $ref: '#/components/schemas/LocalizedContent' },
            position: { $ref: '#/components/schemas/LocalizedContent' },
            bio: { $ref: '#/components/schemas/LocalizedContent' },
            image: { type: 'string' },
            order: { type: 'number' },
            isActive: { type: 'boolean' },
            socialLinks: {
              type: 'object',
              properties: {
                linkedin: { type: 'string' },
                twitter: { type: 'string' },
                github: { type: 'string' },
              },
            },
          },
        },
        ContactMessage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'string', enum: ['new', 'read', 'replied', 'archived', 'spam'] },
            isStarred: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            pages: { type: 'number', example: 10 },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Authentication required',
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: {
                  code: 'FORBIDDEN',
                  message: 'You do not have permission to perform this action',
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: {
                  code: 'NOT_FOUND',
                  message: 'Resource not found',
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Invalid input data',
                  details: [],
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Services', description: 'Services management' },
      { name: 'Projects', description: 'Projects/Portfolio management' },
      { name: 'Team', description: 'Team members management' },
      { name: 'Contact', description: 'Contact form and messages' },
      { name: 'Settings', description: 'Site settings' },
      { name: 'Content', description: 'Site content management' },
      { name: 'Translations', description: 'Translation management' },
      { name: 'Menus', description: 'Navigation menus' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/docs/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default { swaggerSpec };
