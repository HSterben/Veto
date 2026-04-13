import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

const client = connectionString
  ? postgres(connectionString)
  : (null as unknown as ReturnType<typeof postgres>);

export const db = client ? drizzle(client, { schema }) : null;
