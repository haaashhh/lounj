import type { FastifyPluginAsync } from "fastify";
import { prisma } from "@worldscape/database";
import { CreateWorldSchema } from "@worldscape/types";

export const worldRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async () => {
    const worlds = await prisma.world.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return { worlds };
  });

  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const world = await prisma.world.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!world) {
      reply.code(404);
      return { error: "World not found" };
    }

    return { world };
  });

  fastify.post("/", async (request, reply) => {
    const result = CreateWorldSchema.safeParse(request.body);

    if (!result.success) {
      reply.code(400);
      return { error: result.error.format() };
    }

    // TODO: Get user ID from auth context
    const userId = "temp-user-id";

    const world = await prisma.world.create({
      data: {
        ...result.data,
        ownerId: userId,
      },
    });

    reply.code(201);
    return { world };
  });
};
