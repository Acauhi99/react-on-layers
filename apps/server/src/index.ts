import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config/env.js";
import { apiRoutes } from "./presentation/routes/api.routes.js";

const fastify = Fastify({ logger: true });

// CORS
await fastify.register(cors, {
  origin: config.cors.origin,
  credentials: true,
});

// Routes
await fastify.register(apiRoutes, { prefix: "/api" });

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });
    console.log(`🚀 Server running on http://localhost:${config.server.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
