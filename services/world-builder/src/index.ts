import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

async function start() {
  try {
    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || "*",
    });

    fastify.get("/health", async () => {
      return { status: "ok" };
    });

    // World template endpoints
    fastify.get("/templates", async () => {
      // TODO: Implement template listing logic
      return {
        templates: [
          {
            id: "1",
            name: "Fantasy World",
            description: "Medieval fantasy setting",
          },
          {
            id: "2",
            name: "Sci-Fi Station",
            description: "Space station environment",
          },
          {
            id: "3",
            name: "Modern City",
            description: "Contemporary urban setting",
          },
        ],
      };
    });

    fastify.post("/build", async (request, reply) => {
      // TODO: Implement world building logic
      reply.code(501);
      return { error: "Not implemented" };
    });

    const port = parseInt(process.env.PORT || "3004", 10);
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });
    console.log(`World builder service listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
