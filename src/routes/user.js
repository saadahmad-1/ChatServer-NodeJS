import Router from "express";
import * as userController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validator.js";
import { createUserSchema } from "../constants/schemaValidations.js";

const router = Router();

/**
 * @swagger
 * /users/v1/createUser:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account with the provided information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: User's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: User's last name
 *                 example: "Doe"
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               firebaseUid:
 *                 type: string
 *                 description: Firebase user ID (optional)
 *                 example: "firebase-user-id-123"
 *               profilePicture:
 *                 type: string
 *                 description: URL to user's profile picture (optional)
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               responseCode: 0
 *               message: "User Created Successfully"
 *               success: true
 *               data:
 *                 id: 1
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 phoneNumber: "+1234567890"
 *                 firebaseUid: "firebase-user-id-123"
 *                 profilePicture: "https://example.com/profile.jpg"
 *                 isOnline: false
 *                 lastSeen: null
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               responseCode: 100
 *               message: "Invalid parameters"
 *               success: false
 *       409:
 *         description: Phone number already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               responseCode: 102
 *               message: "Phone Number is already registered"
 *               success: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               responseCode: 101
 *               message: "Internal Server Error"
 *               success: false
 */
router.post(
    "/v1/createUser",
    validate(createUserSchema),
    userController.createUser
);

export default router;
