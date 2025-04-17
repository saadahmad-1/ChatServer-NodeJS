const Router = require("express").Router();

Router.use("/users", require("./user"));

module.exports = Router;
