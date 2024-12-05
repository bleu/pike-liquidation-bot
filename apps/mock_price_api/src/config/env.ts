import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const envSchema = z.object({
  RPC_URL: z.string().url(),
  PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  PORT: z.string().transform(Number).default('3000'),
});

export const env = envSchema.parse(process.env);
