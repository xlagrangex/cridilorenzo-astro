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
