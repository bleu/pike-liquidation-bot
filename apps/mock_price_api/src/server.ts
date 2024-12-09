// src/server.ts
import Fastify from 'fastify';
import { env } from './config/env';
import app from './app';

const server = Fastify({
  logger: true, // This will help us see what's happening
});

// Register your application as a normal plugin.
server.register(app);

const start = async () => {
  try {
    // Log that we're attempting to start
    console.log(`Starting server on port ${env.PORT}...`);

    await server.listen({
      port: env.PORT || 3000,
      host: '0.0.0.0', // This ensures the server is accessible externally
    });

    console.log(`Server is running on port ${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Using an IIFE to allow top-level await
(async () => {
  try {
    await start();
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
