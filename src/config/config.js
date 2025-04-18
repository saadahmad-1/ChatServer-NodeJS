import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    readerHost: process.env.DB_READER_HOST,
    writerHost: process.env.DB_WRITER_HOST,
    dialect: "mysql",
  },
};
