declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;
    MONGO_CONNECTION_STRING: string;
    JWT_SECRET_KEY: string;
    AUTH_MODE: string;
  }
}