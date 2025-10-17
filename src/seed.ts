import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categories } from "./schema";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  const data: (typeof categories.$inferInsert)[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
    });
  }

  console.log("Seed start");
  await db.insert(categories).values(data);
  console.log("Seed done");
};

main();
