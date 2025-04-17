const Router = require("express").Router();
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validator";
import { createUserSchema } from "../constants/schemaValidations";

Router.post(
    "/v1/createUser",
    validate(createUserSchema),
    userController.createUser
);

module.exports = Router;
