import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({
  path: path.join(dirname, '.env'),
});

const { NODE_ENV, MONGO_CONNECTION_STRING, JWT_SECRET_KEY, PORT, AUTH_MODE } = process.env;

const config = {
  NODE_ENV,
  PORT: PORT ?? 4000,
  MONGO_CONNECTION_STRING,
  JWT_SECRET_KEY,
  AUTH_MODE: AUTH_MODE === 'true',
};

export default config;
