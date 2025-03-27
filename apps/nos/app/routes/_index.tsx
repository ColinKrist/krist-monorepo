import { users } from "~/db/schema";
import { count } from "drizzle-orm";
import type { Route } from "./+types/_index";
import { useLoaderData } from "react-router";
import { globalAppContext } from "~/server/context";

export const loader = async ({ context }: Route.LoaderArgs) => {
  try {
    const ctx = context.get(globalAppContext);
    const trpcUserCount = await ctx.client.usersCount.query();

    return { usersCount: trpcUserCount };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default function Index() {
  const { usersCount } = useLoaderData<typeof loader>();
  return <div>registered users: {usersCount}</div>;
}
