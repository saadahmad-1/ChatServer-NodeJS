import logger from "jet-logger";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import sequelize from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.status(200).json({
    status: "Ok",
    message: "No Worries! Server is healthy",
  });
});

app.use("/api", require("./routes/routes"));
app.use(errorHandler);
// Authenticate database connection and start the server
sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      const SERVER_START_MSG = `Database Authenticated and Server started on port: ${port}`;
      logger.info(SERVER_START_MSG);
    });
  })
  .catch((err) => {
    logger.err(`Unable to connect to the database: ${err}`);
    process.exit(1); // Exit the process if the database connection fails
  });
