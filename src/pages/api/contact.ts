export const prerender = false;

import type { APIRoute } from "astro";

const GITHUB_REPO = "xlagrangex/cridilorenzo-astro";
const GITHUB_BRANCH = "main";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get("name")?.toString() || "Anonimo";
    const email = data.get("email")?.toString() || "";
    const phone = data.get("phone")?.toString() || "";
    const message = data.get("message")?.toString() || "";

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    const slug = `${dateStr}-${timeStr}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")}`;

    const mdContent = [
      "---",
      `name: "${name}"`,
      `email: "${email}"`,
      `phone: "${phone}"`,
      `date: "${now.toISOString()}"`,
      `read: false`,
      "---",
      "",
      message,
    ].join("\n");

    const githubToken = import.meta.env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ success: false, error: "Token non configurato" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = `src/content/contatti/${slug}.md`;
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `nuovo contatto: ${name}`,
          content: btoa(unescape(encodeURIComponent(mdContent))),
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ success: false, error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Errore nell'invio" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
