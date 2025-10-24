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

    // Media upload endpoint
    fastify.post("/upload", async (request, reply) => {
      // TODO: Implement media upload logic
      reply.code(501);
      return { error: "Not implemented" };
    });

    // Media retrieval endpoint
    fastify.get("/media/:id", async (request, reply) => {
      const { id: _id } = request.params as { id: string };
      // TODO: Implement media retrieval logic with _id
      reply.code(501);
      return { error: "Not implemented" };
    });

    const port = parseInt(process.env.PORT || "3003", 10);
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });
    console.log(`Media proxy server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
