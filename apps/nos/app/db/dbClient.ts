import type {
  D1Database,
  KVNamespace,
  R2Bucket,
} from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

export interface Env {
  D1: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
}

export const getDrizzle = (env: Env) => drizzle(env.D1);
