import * as dotenv from 'dotenv';

dotenv.config();

// environment
export const NODE_ENV: string = process.env.NODE_ENV || 'development';

// application
export const PORT: number = +(process.env.PORT || 4000);

// JWT
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'secret-key';

// database
export const MONGO_CONNECTION_STRING: string =
  process.env.MONGO_CONNECTION_STRING || 'your-mongo-db-connection-string';
