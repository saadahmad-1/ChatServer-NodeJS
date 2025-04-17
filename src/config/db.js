import { Sequelize } from "sequelize";
import { dbConfig } from "../constants/envVars";

const sequelize = new Sequelize({
    dialect: "mysql",
    replication: {
        read: [
            {
                database: dbConfig.DATABASE,
                username: dbConfig.USERNAME,
                password: dbConfig.PASSWORD,
                host: dbConfig.READER_HOST,
                port: dbConfig.PORT,
            },
        ],
        write: {
            database: dbConfig.DATABASE,
            username: dbConfig.USERNAME,
            password: dbConfig.PASSWORD,
            host: dbConfig.WRITER_HOST,
            port: dbConfig.PORT,
        },
    },
    logging: false,
});

export default sequelize;
