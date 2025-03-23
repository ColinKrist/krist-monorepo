import type * as schema from "~/db/schema";
import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta(args: Route.MetaArgs) {
  return [
    { title: "Photo Upload" },
    { name: "description", content: "Upload photos" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.db;

  const photos = await db.query.photos.findMany({
    limit: 10,
    orderBy: (photos, { desc }) => [desc(photos.createdAt)],
  });

  console.log(photos);

  return {
    photos,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-8 p-4">
      <Link to="/upload">Upload Some Photos</Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loaderData.photos.map((photo: typeof schema.photos.$inferSelect) => (
          <div key={photo.id} className="relative aspect-square">
            <img
              src={photo.url}
              alt={`Bib ${photo.bibId}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
