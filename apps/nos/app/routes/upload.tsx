import * as schema from "~/db/schema";
import type { Route } from "./+types/upload";
import { Form, useNavigation } from "react-router";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const fileData = formData.get("photo");
  const bibId = Number(formData.get("bibId"));

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

export default function Upload({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isUploading = navigation.state === "submitting";

  return (
    <div className="max-w-md mx-auto">
      <Form
        method="post"
        encType="multipart/form-data"
        className="space-y-4"
        suppressHydrationWarning
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

      {actionData ? <p>{JSON.stringify(actionData)}</p> : null}
    </div>
  );
}
