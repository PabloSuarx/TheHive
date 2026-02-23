import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const jwt = formData.get("jwt") as string;
  const userId = formData.get("userId") as string;

  if (!file || !jwt || !userId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const uploadForm = new FormData();
  uploadForm.append("files", file);
  uploadForm.append("ref", "plugin::users-permissions.user");
  uploadForm.append("refId", userId);
  uploadForm.append("field", "avatar");

  const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";

  try {
    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("[upload-avatar] Strapi error:", errorText);
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const uploadData = await uploadRes.json();
    const avatarUrl = uploadData?.[0]?.url;

    if (!avatarUrl) {
      return new Response(JSON.stringify({ error: "No avatar URL in response" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, avatarUrl }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[upload-avatar] Error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
