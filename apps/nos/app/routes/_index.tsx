import { Button } from "@/components/ui/button";
import type { Route } from "./+types/_index";
import { useLoaderData } from "react-router";
import { globalAppContext } from "@/server/context";

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
  return (
    <div className="flex flex-col grow size-full items-center justify-center gap-3">
      <h1>registered users: {usersCount}</h1>
      <Button>hello</Button>
    </div>
  );
}
