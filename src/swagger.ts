// src/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';

// Определяем более точный тип для спецификации OpenAPI
interface OpenApiInfo {
  title: string;
  version: string;
  description: string;
}

interface OpenApiServer {
  url: string;
  description: string;
}

interface OpenApiSpec {
  openapi: string;
  info: OpenApiInfo;
  servers: OpenApiServer[];
  paths: Record<string, unknown>;
  components: {
    schemas: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TS-Basic API',
      version: '1.0.0',
      description: 'API for managing Users, Posts, and Comments',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options) as OpenApiSpec;

export default swaggerSpec;
