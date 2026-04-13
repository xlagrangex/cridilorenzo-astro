export const prerender = false;

import type { APIRoute } from "astro";

const GITHUB_REPO = "xlagrangex/cridilorenzo-astro";
const GITHUB_BRANCH = "main";
const FORMSPREE_ID = "7e16502a-d7f9-4904-acfe-01a0afdf8c6c";

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

    // 1. Manda email via Formspree
    const formspreePromise = fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    // 2. Salva come .md nel repo via GitHub API
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
    let githubPromise: Promise<Response> | null = null;

    if (githubToken) {
      const filePath = `src/content/contatti/${slug}.md`;
      githubPromise = fetch(
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
    }

    // Esegui entrambi in parallelo
    await Promise.all([formspreePromise, githubPromise].filter(Boolean));

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
