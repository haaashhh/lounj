import Fastify from "fastify";
import cors from "@fastify/cors";
import { worldRoutes } from "./routes/worlds";
import { env } from "./env";

const fastify = Fastify({
  logger: true,
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: env.CORS_ORIGIN,
    });

    fastify.get("/health", async () => {
      return { status: "ok" };
    });

    await fastify.register(worldRoutes, { prefix: "/api/worlds" });

    const port = parseInt(env.PORT, 10);
    const host = env.HOST;

    await fastify.listen({ port, host });
    console.log(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
