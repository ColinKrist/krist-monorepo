import { drizzle } from "drizzle-orm/d1";

export const getDrizzle = (env: Env) => drizzle(env.D1);
