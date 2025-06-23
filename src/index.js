import logger from "jet-logger";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";
import sequelize from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/routes.js";
import socketService from "./services/socketService.js";
import { specs } from "./config/swagger.js";
import "./models/index.js"; // Initialize model relationships

const app = express();
const server = createServer(app);
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ChatBase API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}));

app.get("/", async (req, res) => {
  res.status(200).json({
    status: "Ok",
    message: "No Worries! Server is healthy",
    documentation: "/api-docs"
  });
});

app.use("/api", routes);
app.use(errorHandler);

// Initialize Socket.IO
socketService.initialize(server);

// Authenticate database connection and start the server
sequelize
  .authenticate()
  .then(() => {
    // Sync database (in production, use migrations instead)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    server.listen(port, () => {
      const SERVER_START_MSG = `Database Authenticated and Server started on port: ${port}`;
      console.log(SERVER_START_MSG);
      console.log(`API Documentation available at: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
    process.exit(1); // Exit the process if the database connection fails
  });