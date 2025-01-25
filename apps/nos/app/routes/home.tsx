import * as schema from "~/db/schema";
import type { Route } from "./+types/home";
import { Form, useNavigation } from "react-router";

export function meta(args: Route.MetaArgs) {
  return [
    { title: "Photo Upload" },
    { name: "description", content: "Upload photos" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const fileData = formData.get("photo");
  const bibId = Number(formData.get("bibId"));

  console.log(bibId);

  if (!fileData || !(fileData instanceof File) || !bibId) {
    return { error: "Photo and bib ID are required" };
  }

  // Upload to R2
  const key = `${Date.now()}-${fileData.name}`;
  const arrayBuffer = await fileData.arrayBuffer();
  await context.R2.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: fileData.type,
    },
  });

  const url = `https://nos-images.krist.io/${key}`;

  // Save to database
  const db = context.db;
  const photo = await db
    .insert(schema.photos)
    .values({
      bibId,
      url,
      takenAt: new Date().toISOString(),
    })
    .returning()
    .get();

  return { success: true, photo };
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.db;

  const photos = await db.query.photos.findMany({
    limit: 10,
    orderBy: (photos, { desc }) => [desc(photos.createdAt)],
  });

  return {
    photos,
    message: context.VALUE_FROM_CLOUDFLARE,
  };
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isUploading = navigation.state === "submitting";

  return (
    <div className="space-y-8 p-4">
      <div className="max-w-md mx-auto">
        <Form
          method="post"
          encType="multipart/form-data"
          className="space-y-4"
          preventScrollReset
          replace
        >
          <div>
            <label
              htmlFor="bibId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bib ID
            </label>
            <input
              type="number"
              name="bibId"
              id="bibId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Photo
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Photo"}
          </button>
        </Form>

        {actionData?.error && (
          <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">
              {actionData.error}
            </p>
          </div>
        )}
      </div>

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
