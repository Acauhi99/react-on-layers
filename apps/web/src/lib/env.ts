import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_APP_ENV: z.enum(["development", "production", "test"]),
  VITE_ENABLE_DEVTOOLS: z.string().transform((val) => val === "true"),
});

export const env = envSchema.parse(import.meta.env);
