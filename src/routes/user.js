import Router from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validator";
import { createUserSchema } from "../constants/schemaValidations";

const router = Router();

router.post(
    "/v1/createUser",
    validate(createUserSchema),
    userController.createUser
);

export default router;
