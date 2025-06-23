# Firebase Chat Backend Setup Guide

This guide will help you set up the Firebase chat backend with MySQL integration.

## Prerequisites

1. Node.js (v14 or higher)
2. MySQL database
3. Firebase project with Firestore enabled

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DATABASE=your_database_name
DB_READER_HOST=localhost
DB_WRITER_HOST=localhost
DB_PORT=3306

# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Server Configuration
PORT=3002
NODE_ENV=development
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key
6. Download the JSON file and use its values in your `.env` file

## Database Setup

1. Create a MySQL database
2. Update the database configuration in your `.env` file
3. The application will automatically create the necessary tables

## Running the Application

1. Development mode:

```bash
npm run start:dev
```

2. Production mode:

```bash
npm run dev
```

The server will start on port 3002 with Socket.IO support.

## API Endpoints

### Chat Rooms

- `POST /api/chat/v1/createRoom` - Create a new chat room
- `GET /api/chat/v1/userRooms/:userId` - Get user's chat rooms

### Messages

- `POST /api/chat/v1/sendMessage` - Send a message
- `GET /api/chat/v1/roomMessages/:roomId` - Get room messages
- `PUT /api/chat/v1/markRead/:messageId` - Mark message as read

### Room Management

- `POST /api/chat/v1/addMember` - Add member to room
- `DELETE /api/chat/v1/removeMember` - Remove member from room

### User Presence

- `PUT /api/chat/v1/updatePresence` - Update user online status

## Socket.IO Events

### Client to Server

- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - Typing indicator
- `markAsRead` - Mark message as read

### Server to Client

- `newMessage` - New message received
- `userJoined` - User joined room
- `userLeft` - User left room
- `userTyping` - User typing indicator
- `messageRead` - Message marked as read
- `error` - Error message

## Example Usage

### Creating a Chat Room

```javascript
const response = await fetch("/api/chat/v1/createRoom", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "General Chat",
    description: "General discussion room",
    isPrivate: false,
    userId: 1,
  }),
});
```

### Sending a Message

```javascript
const response = await fetch("/api/chat/v1/sendMessage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    roomId: "room-uuid",
    content: "Hello, world!",
    messageType: "text",
    userId: 1,
  }),
});
```

### Socket.IO Connection

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3002");

// Join a room
socket.emit("joinRoom", { userId: 1, roomId: "room-uuid" });

// Send a message
socket.emit("sendMessage", {
  userId: 1,
  roomId: "room-uuid",
  content: "Hello, world!",
});

// Listen for new messages
socket.on("newMessage", (message) => {
  console.log("New message:", message);
});
```

## Database Schema

### Users Table

- `id` (INTEGER, Primary Key, Auto Increment)
- `firstName` (String)
- `lastName` (String)
- `phoneNumber` (String)
- `firebaseUid` (String, Unique)
- `profilePicture` (String)
- `isOnline` (Boolean)
- `lastSeen` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### ChatRooms Table

- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `isPrivate` (Boolean)
- `createdBy` (INTEGER, Foreign Key)
- `firebaseRoomId` (String, Unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Messages Table

- `id` (UUID, Primary Key)
- `content` (Text)
- `messageType` (Enum: text, image, file, audio, video)
- `senderId` (INTEGER, Foreign Key)
- `roomId` (UUID, Foreign Key)
- `firebaseMessageId` (String, Unique)
- `isRead` (Boolean)
- `metadata` (JSON)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### RoomMembers Table

- `id` (UUID, Primary Key)
- `userId` (INTEGER, Foreign Key)
- `roomId` (UUID, Foreign Key)
- `role` (Enum: admin, moderator, member)
- `joinedAt` (DateTime)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Security Considerations

1. Implement proper authentication (JWT tokens)
2. Validate user permissions for room access
3. Sanitize message content
4. Rate limiting for message sending
5. Input validation for all endpoints

## Production Deployment

1. Use environment variables for all sensitive data
2. Set up proper database migrations
3. Configure Firebase security rules
4. Set up monitoring and logging
5. Use HTTPS in production
6. Implement proper error handling

## Troubleshooting

1. **Firebase connection issues**: Check your service account credentials
2. **Database connection issues**: Verify MySQL credentials and network access
3. **Socket.IO connection issues**: Check CORS configuration
4. **Model sync issues**: Check database permissions and schema compatibility
