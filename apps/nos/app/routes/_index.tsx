import { users } from "~/db/schema";
import { count } from "drizzle-orm";
import type { Route } from "./+types/_index";
import { useLoaderData } from "react-router";

export const loader = async ({ context }: Route.LoaderArgs) => {
  try {
    const trpcUserCount = await context.client.usersCount.query();

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
