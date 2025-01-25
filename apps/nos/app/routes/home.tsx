import type * as schema from "~/db/schema";
import type { Route } from "./+types/home";
import { Welcome } from "~/components/Welcome";

export function meta(args: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.db;

  const photos = await db.query.photos.findMany({
    limit: 10,
  });

  return {
    photos,
    message: context.VALUE_FROM_CLOUDFLARE,
  };
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Welcome message={loaderData.message ?? "No Message"} />
      {loaderData.photos.map((photo: typeof schema.photos.$inferSelect) => (
        <img key={photo.id} src={photo.url} alt={photo.id.toString()} />
      ))}
    </div>
  );
}
