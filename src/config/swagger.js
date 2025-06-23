import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChatBase API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for ChatBase backend with Firebase chat integration and MySQL database',
      contact: {
        name: 'ChatBase API Support',
        email: 'support@chatbase.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002/api',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique user identifier'
            },
            firstName: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'User last name'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number'
            },
            firebaseUid: {
              type: 'string',
              description: 'Firebase user ID'
            },
            profilePicture: {
              type: 'string',
              description: 'URL to user profile picture'
            },
            isOnline: {
              type: 'boolean',
              description: 'User online status'
            },
            lastSeen: {
              type: 'string',
              format: 'date-time',
              description: 'Last seen timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['firstName', 'lastName', 'phoneNumber']
        },
        ChatRoom: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique room identifier'
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Room name'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: 'Room description'
            },
            isPrivate: {
              type: 'boolean',
              description: 'Whether the room is private'
            },
            createdBy: {
              type: 'integer',
              description: 'User ID who created the room'
            },
            firebaseRoomId: {
              type: 'string',
              description: 'Firebase room identifier'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['name', 'createdBy']
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique message identifier'
            },
            content: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Message content'
            },
            messageType: {
              type: 'string',
              enum: ['text', 'image', 'file', 'audio', 'video'],
              description: 'Type of message'
            },
            senderId: {
              type: 'integer',
              description: 'User ID who sent the message'
            },
            roomId: {
              type: 'string',
              format: 'uuid',
              description: 'Room ID where message was sent'
            },
            firebaseMessageId: {
              type: 'string',
              description: 'Firebase message identifier'
            },
            isRead: {
              type: 'boolean',
              description: 'Whether message has been read'
            },
            metadata: {
              type: 'object',
              description: 'Additional message metadata'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['content', 'senderId', 'roomId']
        },
        RoomMember: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique membership identifier'
            },
            userId: {
              type: 'integer',
              description: 'User ID'
            },
            roomId: {
              type: 'string',
              format: 'uuid',
              description: 'Room ID'
            },
            role: {
              type: 'string',
              enum: ['admin', 'moderator', 'member'],
              description: 'User role in the room'
            },
            joinedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When user joined the room'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether membership is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['userId', 'roomId']
        },
        Error: {
          type: 'object',
          properties: {
            responseCode: {
              type: 'integer',
              description: 'Error response code'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            success: {
              type: 'boolean',
              description: 'Success status'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            responseCode: {
              type: 'integer',
              description: 'Response code (0 for success)'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            success: {
              type: 'boolean',
              description: 'Success status'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      }
    },
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Chat Rooms',
        description: 'Chat room management endpoints'
      },
      {
        name: 'Messages',
        description: 'Message management endpoints'
      },
      {
        name: 'Room Members',
        description: 'Room membership management endpoints'
      },
      {
        name: 'User Presence',
        description: 'User online status management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

export const specs = swaggerJsdoc(options);