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
      body[] { ..., _type == "image" => { ..., asset-> { url } } }
    }`,
    { slug }
  );
  return posts || null;
}

// ══════════════════════════════════════════════════════
// Site Settings
// ══════════════════════════════════════════════════════

export interface SanityImage {
  asset?: { url?: string };
}

export interface SiteSettings {
  logo?: SanityImage;
  logoAlt?: string;
  calendarUrl?: string;
  email?: string;
  phone?: string;
  whatsappUrl?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      logo { asset-> { url } },
      logoAlt,
      calendarUrl,
      email,
      phone,
      whatsappUrl
    }`
  );
  return data || null;
}

// ══════════════════════════════════════════════════════
// Homepage
// ══════════════════════════════════════════════════════

type SectionBase = { visible?: boolean };

export interface HomepageData {
  hero?: SectionBase & {
    headingTop?: string;
    headingItalic?: string;
    body?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    heroImage?: SanityImage;
    ratingTitle?: string;
    ratingDescription?: string;
  };
  chiSono?: SectionBase & {
    tags?: string[];
    heading?: string;
    body1?: string;
    body2?: string;
    image1?: SanityImage;
    image2?: SanityImage;
    ctaLabel?: string;
  };
  servizi?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    body?: string;
    items?: Array<{ title?: string; desc?: string; image?: SanityImage }>;
    conclusion?: string;
    ctaLabel?: string;
  };
  comeFunziona?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    body?: string;
    image?: SanityImage;
    stepsHeadingStart?: string;
    stepsHeadingItalic?: string;
    stepsIntro?: string;
    steps?: Array<{
      label?: string;
      title?: string;
      price?: string;
      priceSuffix?: string;
      details?: string;
      bulletPoints?: string[];
      highlighted?: boolean;
    }>;
    ctaLabel?: string;
  };
  perche?: SectionBase & {
    subtitle?: string;
    heading?: string;
    body?: string;
    items?: Array<{ title?: string; desc?: string; icon?: SanityImage }>;
  };
  diCosaMiOccupo?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    items?: Array<{ title?: string; desc?: string; image?: SanityImage }>;
  };
  strumenti?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    body?: string;
    items?: Array<{ num?: string; title?: string; desc?: string; icon?: SanityImage }>;
    ctaLabel?: string;
  };
  marquee?: SectionBase & {
    items?: Array<{ strong?: string; label?: string; iconKey?: string; highlight?: boolean }>;
  };
  confronto?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    psicologoTitle?: string;
    psicologoItems?: string[];
    counselorTitle?: string;
    counselorBadge?: string;
    counselorItems?: Array<{ text?: string; detail?: string }>;
    conclusion?: string;
    ctaLabel?: string;
  };
  faq?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    items?: Array<{ question?: string; answer?: string }>;
  };
  contatti?: SectionBase & {
    subtitle?: string;
    headingStart?: string;
    headingItalic?: string;
    body?: string;
    ctaLabel?: string;
  };
}

export async function getHomepage(): Promise<HomepageData | null> {
  const data = await sanityClient.fetch(
    `*[_type == "homepage"][0] {
      hero { ..., heroImage { asset-> { url } } },
      chiSono {
        ...,
        image1 { asset-> { url } },
        image2 { asset-> { url } }
      },
      servizi {
        ...,
        items[] { ..., image { asset-> { url } } }
      },
      comeFunziona {
        ...,
        image { asset-> { url } },
        steps[] { ... }
      },
      perche {
        ...,
        items[] { ..., icon { asset-> { url } } }
      },
      diCosaMiOccupo {
        ...,
        items[] { ..., image { asset-> { url } } }
      },
      strumenti {
        ...,
        items[] { ..., icon { asset-> { url } } }
      },
      marquee,
      confronto,
      faq,
      contatti
    }`
  );
  return data || null;
}

// Pick a value from Sanity if non-empty, else return fallback.
// Treats empty strings and empty arrays as "no value".
export function pick<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

// Default to true (visible) if undefined. Only hide when explicitly set to false.
export function isVisible(section: { visible?: boolean } | undefined | null): boolean {
  if (!section) return true;
  return section.visible !== false;
}

export function sanityImageUrl(
  img: SanityImage | undefined | null,
  fallback: string
): string {
  return img?.asset?.url || fallback;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const DECORATOR_TAGS: Record<string, string> = {
  strong: "strong",
  em: "em",
  underline: "u",
  "strike-through": "s",
  code: "code",
};

function linkAttributes(rawHref: string): string {
  const href = /^www\./i.test(rawHref) ? `https://${rawHref}` : rawHref;
  const external =
    /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?cridilorenzo\.com/i.test(href);
  return `href="${escapeAttribute(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}`;
}

function renderSpans(block: any): string {
  const links = new Map<string, string>(
    (block.markDefs || [])
      .filter((def: any) => def._type === "link" && def.href)
      .map((def: any) => [def._key, def.href])
  );

  // Sanity spezza un link in più span quando una parte è in grassetto o corsivo:
  // gli span consecutivi con lo stesso link vanno dentro un unico <a>.
  let html = "";
  let openLink: string | null = null;
  for (const child of block.children || []) {
    const marks: string[] = child.marks || [];
    // Testo non escapato: negli articoli Christian incolla gli embed YouTube
    // (<iframe>) direttamente nel testo e devono restare video.
    let text = child.text || "";
    for (const mark of marks) {
      const tag = DECORATOR_TAGS[mark];
      if (tag) text = `<${tag}>${text}</${tag}>`;
    }

    const linkKey = marks.find((mark) => links.has(mark)) ?? null;
    if (linkKey !== openLink) {
      if (openLink) html += "</a>";
      if (linkKey) html += `<a ${linkAttributes(links.get(linkKey)!)}>`;
      openLink = linkKey;
    }
    html += text;
  }
  if (openLink) html += "</a>";
  return html;
}

function renderBlock(block: any): string {
  if (block._type === "image") {
    const url = block.asset?.url;
    return url ? `<img src="${escapeAttribute(url)}" alt="" />` : "";
  }

  if (block._type !== "block") return "";

  const children = renderSpans(block);
  if (!children.trim()) return "";

  if (block.listItem) return `<li>${children}</li>`;

  const style = block.style || "normal";
  // L'h1 della pagina è già il titolo dell'articolo.
  if (style === "h1") return `<h2>${children}</h2>`;
  if (/^h[2-6]$/.test(style)) return `<${style}>${children}</${style}>`;
  if (style === "blockquote") return `<blockquote><p>${children}</p></blockquote>`;

  return `<p>${children}</p>`;
}

// Converte Portable Text in HTML semplice
export function portableTextToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  const html: string[] = [];
  let openList: string | null = null;
  for (const block of blocks) {
    const listTag =
      block._type === "block" && block.listItem
        ? block.listItem === "number" ? "ol" : "ul"
        : null;
    if (listTag !== openList) {
      if (openList) html.push(`</${openList}>`);
      if (listTag) html.push(`<${listTag}>`);
      openList = listTag;
    }
    html.push(renderBlock(block));
  }
  if (openList) html.push(`</${openList}>`);

  return html.filter(Boolean).join("\n");
}
