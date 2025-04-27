// src/types/swagger-ui-express.d.ts

import { RequestHandler } from 'express';

declare module 'swagger-ui-express' {
  export const serve: RequestHandler[];
  export function setup(swaggerDoc: unknown, opts?: unknown): RequestHandler;
}
