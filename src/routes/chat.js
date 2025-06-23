import Router from "express";
import * as chatController from "../controllers/chat.controller.js";
import { validate } from "../middlewares/validator.js";
import { 
  createChatRoomSchema, 
  sendMessageSchema, 
  addRoomMemberSchema, 
  removeRoomMemberSchema, 
  updatePresenceSchema 
} from "../constants/schemaValidations.js";

const router = Router();

/**
 * @swagger
 * /chat/v1/createRoom:
 *   post:
 *     summary: Create a new chat room
 *     description: Creates a new chat room and adds the creator as an admin member
 *     tags: [Chat Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: Name of the chat room
 *                 example: "General Discussion"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description of the chat room
 *                 example: "A room for general discussions"
 *               isPrivate:
 *                 type: boolean
 *                 description: Whether the room is private
 *                 default: false
 *                 example: false
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the room
 *                 example: 1
 *     responses:
 *       200:
 *         description: Chat room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Chat room created successfully"
 *               success: true
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "General Discussion"
 *                 description: "A room for general discussions"
 *                 isPrivate: false
 *                 createdBy: 1
 *                 firebaseRoomId: "firebase-room-id-123"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/v1/createRoom",
  validate(createChatRoomSchema),
  chatController.createChatRoom
);

/**
 * @swagger
 * /chat/v1/userRooms/{userId}:
 *   get:
 *     summary: Get user's chat rooms
 *     description: Retrieves all chat rooms that the user is a member of
 *     tags: [Chat Rooms]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *         example: 1
 *     responses:
 *       200:
 *         description: User's chat rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "User chat rooms retrieved successfully"
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440002"
 *                   userId: 1
 *                   roomId: "550e8400-e29b-41d4-a716-446655440001"
 *                   role: "admin"
 *                   joinedAt: "2024-01-01T00:00:00.000Z"
 *                   isActive: true
 *                   room:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "General Discussion"
 *                     description: "A room for general discussions"
 *                     isPrivate: false
 *                     createdBy: 1
 *                     firebaseRoomId: "firebase-room-id-123"
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                     updatedAt: "2024-01-01T00:00:00.000Z"
 *                     creator:
 *                       id: 1
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       profilePicture: "https://example.com/profile.jpg"
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/v1/userRooms/:userId",
  chatController.getUserChatRooms
);

/**
 * @swagger
 * /chat/v1/sendMessage:
 *   post:
 *     summary: Send a message to a chat room
 *     description: Sends a message to a specific chat room. User must be a member of the room.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - content
 *               - userId
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the chat room
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Message content
 *                 example: "Hello, everyone!"
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file, audio, video]
 *                 description: Type of message
 *                 default: text
 *                 example: "text"
 *               metadata:
 *                 type: object
 *                 description: Additional message metadata (optional)
 *                 example: { "fileSize": 1024, "fileName": "document.pdf" }
 *               userId:
 *                 type: integer
 *                 description: ID of the user sending the message
 *                 example: 1
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Message sent successfully"
 *               success: true
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440003"
 *                 content: "Hello, everyone!"
 *                 messageType: "text"
 *                 senderId: 1
 *                 roomId: "550e8400-e29b-41d4-a716-446655440001"
 *                 firebaseMessageId: "firebase-message-id-123"
 *                 isRead: false
 *                 metadata: {}
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User is not a member of this chat room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Chat room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/v1/sendMessage",
  validate(sendMessageSchema),
  chatController.sendMessage
);

/**
 * @swagger
 * /chat/v1/roomMessages/{roomId}:
 *   get:
 *     summary: Get messages from a chat room
 *     description: Retrieves messages from a specific chat room with pagination. User must be a member of the room.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the chat room
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of messages to retrieve
 *         example: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of messages to skip
 *         example: 0
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: ID of the user requesting messages
 *         example: 1
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Messages retrieved successfully"
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440003"
 *                   content: "Hello, everyone!"
 *                   messageType: "text"
 *                   senderId: 1
 *                   roomId: "550e8400-e29b-41d4-a716-446655440001"
 *                   firebaseMessageId: "firebase-message-id-123"
 *                   isRead: false
 *                   metadata: {}
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *                   sender:
 *                     id: 1
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     profilePicture: "https://example.com/profile.jpg"
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User is not a member of this chat room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/v1/roomMessages/:roomId",
  chatController.getRoomMessages
);

/**
 * @swagger
 * /chat/v1/markRead/{messageId}:
 *   put:
 *     summary: Mark a message as read
 *     description: Marks a specific message as read by the user. User must be a member of the room.
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the message to mark as read
 *         example: "550e8400-e29b-41d4-a716-446655440003"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user marking the message as read
 *                 example: 1
 *     responses:
 *       200:
 *         description: Message marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Message marked as read"
 *               success: true
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User is not a member of this chat room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/v1/markRead/:messageId",
  chatController.markMessageAsRead
);

/**
 * @swagger
 * /chat/v1/addMember:
 *   post:
 *     summary: Add a member to a chat room
 *     description: Adds a user to a chat room. Only admins and moderators can add members.
 *     tags: [Room Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - newMemberId
 *               - userId
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the chat room
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               newMemberId:
 *                 type: integer
 *                 description: ID of the user to add to the room
 *                 example: 2
 *               role:
 *                 type: string
 *                 enum: [admin, moderator, member]
 *                 description: Role to assign to the new member
 *                 default: member
 *                 example: "member"
 *               userId:
 *                 type: integer
 *                 description: ID of the user performing the action
 *                 example: 1
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Member added successfully"
 *               success: true
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440005"
 *                 userId: 2
 *                 roomId: "550e8400-e29b-41d4-a716-446655440001"
 *                 role: "member"
 *                 joinedAt: "2024-01-01T00:00:00.000Z"
 *                 isActive: true
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User doesn't have permission to add members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User is already a member of this room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/v1/addMember",
  validate(addRoomMemberSchema),
  chatController.addRoomMember
);

/**
 * @swagger
 * /chat/v1/removeMember:
 *   delete:
 *     summary: Remove a member from a chat room
 *     description: Removes a user from a chat room. Only admins and moderators can remove members.
 *     tags: [Room Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - memberIdToRemove
 *               - userId
 *             properties:
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the chat room
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               memberIdToRemove:
 *                 type: integer
 *                 description: ID of the user to remove from the room
 *                 example: 2
 *               userId:
 *                 type: integer
 *                 description: ID of the user performing the action
 *                 example: 1
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Member removed successfully"
 *               success: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User doesn't have permission to remove members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Member not found in this room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/v1/removeMember",
  validate(removeRoomMemberSchema),
  chatController.removeRoomMember
);

/**
 * @swagger
 * /chat/v1/updatePresence:
 *   put:
 *     summary: Update user presence status
 *     description: Updates the user's online/offline status and last seen timestamp
 *     tags: [User Presence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isOnline
 *               - userId
 *             properties:
 *               isOnline:
 *                 type: boolean
 *                 description: Whether the user is online
 *                 example: true
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *     responses:
 *       200:
 *         description: Presence updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "Presence updated successfully"
 *               success: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/v1/updatePresence",
  validate(updatePresenceSchema),
  chatController.updateUserPresence
);

export default router;