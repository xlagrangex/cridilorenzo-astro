export const prerender = false;

import type { APIRoute } from "astro";

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const GITHUB_REPO = "xlagrangex/cridilorenzo-astro";
const GITHUB_BRANCH = "main";
const BLOG_PATH = "src/content/blog";

// GET — lista post
export const GET: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("dash_auth=ok")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${BLOG_PATH}?ref=${GITHUB_BRANCH}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } }
    );
    const files = await res.json();

    if (!Array.isArray(files)) {
      return new Response(JSON.stringify({ posts: [] }), { headers: { "Content-Type": "application/json" } });
    }

    // Fetch each file content
    const posts = await Promise.all(
      files
        .filter((f: any) => f.name.endsWith(".md"))
        .map(async (f: any) => {
          const fileRes = await fetch(f.url, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
          });
          const fileData = await fileRes.json();
          const content = Buffer.from(fileData.content, "base64").toString("utf-8");

          // Parse frontmatter
          const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          const frontmatter: Record<string, string> = {};
          if (match) {
            match[1].split("\n").forEach((line) => {
              const [key, ...val] = line.split(":");
              if (key && val.length) frontmatter[key.trim()] = val.join(":").trim().replace(/^["']|["']$/g, "");
            });
          }

          return {
            slug: f.name.replace(".md", ""),
            filename: f.name,
            sha: fileData.sha,
            title: frontmatter.title || f.name,
            date: frontmatter.date || "",
            draft: frontmatter.draft === "true",
            body: match ? match[2] : content,
            frontmatter,
          };
        })
    );

    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return new Response(JSON.stringify({ posts }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

// POST — crea o aggiorna post
export const POST: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("dash_auth=ok")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  try {
    const data = await request.json();
    const { title, description, date, tags, draft, body, slug, sha } = data;

    const safeSlug = slug || title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const mdContent = [
      "---",
      `title: "${title}"`,
      `description: "${description}"`,
      `date: "${date}"`,
      tags ? `tags: [${tags.split(",").map((t: string) => `"${t.trim()}"`).join(", ")}]` : "",
      `draft: ${draft ? "true" : "false"}`,
      "---",
      "",
      body,
    ].filter(Boolean).join("\n");

    const filePath = `${BLOG_PATH}/${safeSlug}.md`;
    const payload: any = {
      message: sha ? `aggiorna: ${title}` : `nuovo articolo: ${title}`,
      content: Buffer.from(mdContent).toString("base64"),
      branch: GITHUB_BRANCH,
    };
    if (sha) payload.sha = sha;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, slug: safeSlug }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

// DELETE — elimina post
export const DELETE: APIRoute = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("dash_auth=ok")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  try {
    const { filename, sha } = await request.json();
    const filePath = `${BLOG_PATH}/${filename}`;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `elimina: ${filename}`, sha, branch: GITHUB_BRANCH }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
