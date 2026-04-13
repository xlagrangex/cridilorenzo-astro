import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "v97micrw",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // false per avere dati freschi al build
});

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  image?: { asset: { url: string } };
  body: any[];
}

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && draft != true] | order(date desc) {
      _id, title, slug, description, date, tags, draft,
      image { asset-> { url } },
      body
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  const posts = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, description, date, tags, draft,
      image { asset-> { url } },
      body
    }`,
    { slug }
  );
  return posts || null;
}

// Converte Portable Text in HTML semplice
export function portableTextToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks.map((block) => {
    if (block._type === "image") {
      const url = block.asset?.url || block.asset?._ref;
      return url ? `<img src="${url}" alt="" />` : "";
    }

    if (block._type !== "block") return "";

    const children = (block.children || [])
      .map((child: any) => {
        let text = child.text || "";
        if (child.marks?.includes("strong")) text = `<strong>${text}</strong>`;
        if (child.marks?.includes("em")) text = `<em>${text}</em>`;
        return text;
      })
      .join("");

    if (!children.trim()) return "";

    const style = block.style || "normal";
    if (style === "h2") return `<h2>${children}</h2>`;
    if (style === "h3") return `<h3>${children}</h3>`;
    if (style === "h4") return `<h4>${children}</h4>`;
    if (style === "blockquote") return `<blockquote><p>${children}</p></blockquote>`;

    if (block.listItem === "bullet") return `<li>${children}</li>`;
    if (block.listItem === "number") return `<li>${children}</li>`;

    return `<p>${children}</p>`;
  }).join("\n");
}
