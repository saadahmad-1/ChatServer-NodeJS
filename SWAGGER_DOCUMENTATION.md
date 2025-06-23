# SwaggerUI API Documentation

## Overview

This document describes the complete SwaggerUI API documentation implementation for the ChatBase backend application. The documentation covers all endpoints including user management and chat functionality.

## Features

### 📚 **Complete API Documentation**

- **Interactive API Explorer** - Test endpoints directly from the browser
- **Comprehensive Schema Definitions** - All data models and request/response schemas
- **Detailed Examples** - Real-world examples for all endpoints
- **Error Response Documentation** - Complete error handling documentation
- **Authentication Support** - JWT bearer token authentication documentation

### 🏷️ **Organized by Tags**

- **Users** - User management endpoints
- **Chat Rooms** - Chat room creation and management
- **Messages** - Message sending and retrieval
- **Room Members** - Room membership management
- **User Presence** - Online status management

## Accessing the Documentation

### Development Environment

```
http://localhost:3002/api-docs
```

### Production Environment

```
https://your-domain.com/api-docs
```

## API Endpoints Documentation

### 1. User Management

#### Create User

- **Endpoint**: `POST /api/users/v1/createUser`
- **Description**: Creates a new user account
- **Request Body**: User information (firstName, lastName, phoneNumber, etc.)
- **Response**: Created user object with all fields
- **Error Codes**: 400 (Invalid input), 409 (Phone number exists), 500 (Server error)

### 2. Chat Room Management

#### Create Chat Room

- **Endpoint**: `POST /api/chat/v1/createRoom`
- **Description**: Creates a new chat room and adds creator as admin
- **Request Body**: Room name, description, privacy settings, creator ID
- **Response**: Created room object with Firebase integration
- **Error Codes**: 400, 401, 500

#### Get User's Chat Rooms

- **Endpoint**: `GET /api/chat/v1/userRooms/{userId}`
- **Description**: Retrieves all rooms where user is a member
- **Parameters**: userId (path parameter)
- **Response**: Array of room memberships with room details
- **Error Codes**: 401, 500

### 3. Message Management

#### Send Message

- **Endpoint**: `POST /api/chat/v1/sendMessage`
- **Description**: Sends a message to a specific chat room
- **Request Body**: roomId, content, messageType, metadata, userId
- **Response**: Created message object
- **Error Codes**: 400, 401, 403, 404, 500

#### Get Room Messages

- **Endpoint**: `GET /api/chat/v1/roomMessages/{roomId}`
- **Description**: Retrieves messages from a chat room with pagination
- **Parameters**: roomId (path), limit, offset, userId (query)
- **Response**: Array of messages with sender information
- **Error Codes**: 401, 403, 500

#### Mark Message as Read

- **Endpoint**: `PUT /api/chat/v1/markRead/{messageId}`
- **Description**: Marks a specific message as read
- **Parameters**: messageId (path)
- **Request Body**: userId
- **Response**: Success confirmation
- **Error Codes**: 401, 403, 404, 500

### 4. Room Member Management

#### Add Member

- **Endpoint**: `POST /api/chat/v1/addMember`
- **Description**: Adds a user to a chat room with specified role
- **Request Body**: roomId, newMemberId, role, userId
- **Response**: Created membership object
- **Error Codes**: 400, 401, 403, 409, 500

#### Remove Member

- **Endpoint**: `DELETE /api/chat/v1/removeMember`
- **Description**: Removes a user from a chat room
- **Request Body**: roomId, memberIdToRemove, userId
- **Response**: Success confirmation
- **Error Codes**: 400, 401, 403, 404, 500

### 5. User Presence

#### Update Presence

- **Endpoint**: `PUT /api/chat/v1/updatePresence`
- **Description**: Updates user's online/offline status
- **Request Body**: isOnline, userId
- **Response**: Success confirmation
- **Error Codes**: 400, 401, 500

## Data Models

### User Schema

```json
{
  "id": "uuid",
  "firstName": "string (3-30 chars)",
  "lastName": "string (3-30 chars)",
  "phoneNumber": "string",
  "firebaseUid": "string (optional)",
  "profilePicture": "string (optional)",
  "isOnline": "boolean",
  "lastSeen": "datetime (optional)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### ChatRoom Schema

```json
{
  "id": "uuid",
  "name": "string (3-100 chars)",
  "description": "string (max 500 chars)",
  "isPrivate": "boolean",
  "createdBy": "uuid",
  "firebaseRoomId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Message Schema

```json
{
  "id": "uuid",
  "content": "string (1-1000 chars)",
  "messageType": "enum (text, image, file, audio, video)",
  "senderId": "uuid",
  "roomId": "uuid",
  "firebaseMessageId": "string",
  "isRead": "boolean",
  "metadata": "object (optional)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### RoomMember Schema

```json
{
  "id": "uuid",
  "userId": "uuid",
  "roomId": "uuid",
  "role": "enum (admin, moderator, member)",
  "joinedAt": "datetime",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Response Formats

### Success Response

```json
{
  "responseCode": 0,
  "message": "Success message",
  "success": true,
  "data": {}
}
```

### Error Response

```json
{
  "responseCode": 100,
  "message": "Error message",
  "success": false
}
```

## Error Codes

| Code | Description           |
| ---- | --------------------- |
| 0    | Success               |
| 1    | Resource Not Found    |
| 100  | Invalid parameters    |
| 101  | Internal Server Error |
| 102  | Authorization Error   |

## Authentication

The API supports JWT Bearer token authentication:

```http
Authorization: Bearer <your-jwt-token>
```

## Testing with SwaggerUI

### 1. **Interactive Testing**

- Navigate to `/api-docs`
- Click on any endpoint
- Click "Try it out"
- Fill in the required parameters
- Click "Execute"

### 2. **Request Examples**

Each endpoint includes:

- Sample request bodies
- Expected responses
- Error scenarios
- Parameter descriptions

### 3. **Schema Validation**

- Real-time validation of request bodies
- Automatic parameter validation
- Clear error messages for invalid inputs

## Socket.IO Events (Not in Swagger)

Since Socket.IO events are not REST endpoints, they are documented separately:

### Client to Server Events

- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - Typing indicator
- `markAsRead` - Mark message as read

### Server to Client Events

- `newMessage` - New message received
- `userJoined` - User joined room
- `userLeft` - User left room
- `userTyping` - User typing indicator
- `messageRead` - Message marked as read
- `error` - Error message

## Customization Options

### SwaggerUI Configuration

```javascript
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "ChatBase API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      docExpansion: "list",
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  })
);
```

### Available Options

- `docExpansion`: Controls initial expansion state ('list', 'full', 'none')
- `filter`: Enables search functionality
- `showRequestHeaders`: Shows request headers in examples
- `tryItOutEnabled`: Enables "Try it out" functionality by default

## Production Considerations

### 1. **Security**

- Disable SwaggerUI in production or restrict access
- Use environment variables for sensitive information
- Implement proper authentication

### 2. **Performance**

- Cache Swagger specifications
- Optimize for production builds
- Consider CDN for static assets

### 3. **Monitoring**

- Track API usage through SwaggerUI
- Monitor endpoint performance
- Log API documentation access

## File Structure

```
src/
├── config/
│   └── swagger.js          # Swagger configuration
├── routes/
│   ├── user.js             # User routes with Swagger docs
│   └── chat.js             # Chat routes with Swagger docs
└── index.js                # Main app with SwaggerUI setup
```

## Benefits

### For Developers

- **Self-documenting API** - Always up-to-date documentation
- **Interactive testing** - Test endpoints without external tools
- **Clear examples** - Understand expected inputs and outputs
- **Error handling** - Know what errors to expect

### For API Consumers

- **Easy integration** - Clear understanding of API structure
- **Real-time testing** - Test endpoints before implementation
- **Comprehensive coverage** - All endpoints documented
- **Professional presentation** - Clean, organized interface

## Next Steps

1. **Add Authentication Middleware** - Implement JWT token validation
2. **Add More Endpoints** - Document additional functionality as needed
3. **Custom Styling** - Brand the documentation interface
4. **API Versioning** - Support multiple API versions
5. **Export Options** - Generate PDF or other documentation formats

The SwaggerUI implementation provides a complete, interactive API documentation system that makes it easy for developers to understand and integrate with your ChatBase backend.
