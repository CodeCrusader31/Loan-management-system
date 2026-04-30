// import dotenv from 'dotenv';
// import { z } from 'zod';

// // Load environment variables from .env file
// dotenv.config();

// // Define a schema for environment variables
// const envSchema = z.object({
//   PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
//   MONGO_URI: z.string().url({ message: 'MONGO_URI must be a valid URL' }),
//   JWT_SECRET: z.string().min(10, { message: 'JWT_SECRET must be at least 10 characters long' }),
//   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
// });

// // Validate the current process.env against the schema
// const parsedEnv = envSchema.safeParse(process.env);

// if (!parsedEnv.success) {
//   console.error(' Invalid environment variables:', parsedEnv.error.format());
//   process.exit(1);
// }

// export const env = parsedEnv.data;


import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define a schema for environment variables
const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  MONGO_URI: z.string().url({ message: 'MONGO_URI must be a valid URL' }),
  JWT_SECRET: z.string().min(10, { message: 'JWT_SECRET must be at least 10 characters long' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // ✅ ADD THESE (Cloudinary)
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

// Validate the current process.env against the schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(' Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;