import { z } from "zod";

export function createEnv<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }

  return parsed.data;
}

export { z };
