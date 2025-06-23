import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
    path: resolve(__dirname, '../../.env')
});

const { env } = process;

export default {
  development: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DATABASE,
    host: env.DB_WRITER_HOST,
    port: env.DB_PORT,
    dialect: 'mysql'
  },
  test: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DATABASE,
    host: env.DB_WRITER_HOST,
    port: env.DB_PORT,
    dialect: 'mysql'
  },
  production: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DATABASE,
    host: env.DB_WRITER_HOST,
    port: env.DB_PORT,
    dialect: 'mysql'
  }
};