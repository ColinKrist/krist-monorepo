import { initTRPC } from "@trpc/server";
import { count } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/db/schema";
import type { Bindings } from "~/server";

type HonoContext = Bindings;

const t = initTRPC.context<HonoContext>().create();

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  usersCount: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select({ value: count() }).from(users);
    return result[0].value;
  }),
});

export type AppRouter = typeof appRouter;
