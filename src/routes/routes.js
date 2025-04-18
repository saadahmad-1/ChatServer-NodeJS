import Router from "express";
import userRoutes from "./user";

Router.use("/users", userRoutes);

export default Router;
