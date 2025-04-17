const { env } = process;

export const dbConfig = {
    USERNAME: env.DB_USER,
    PASSWORD: env.DB_PASSWORD,
    READER_HOST: env.DB_READER_HOST,
    WRITER_HOST: env.DB_WRITER_HOST,
    DATABASE: env.DATABASE,
    PORT: env.DB_PORT,
};
