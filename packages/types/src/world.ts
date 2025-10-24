import { z } from "zod";

export const WorldSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string(),
});

export type World = z.infer<typeof WorldSchema>;

export const CreateWorldSchema = WorldSchema.pick({
  name: true,
  description: true,
});

export type CreateWorld = z.infer<typeof CreateWorldSchema>;
