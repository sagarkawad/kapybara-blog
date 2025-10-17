import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/src/schema";

const connectionString = process.env.DATABASE_URL!;
console.log(connectionString);
export const db = drizzle(connectionString, { schema });
