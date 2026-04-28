import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Articolo blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrizione",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "date",
      title: "Data di pubblicazione",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "tags",
      title: "Tag",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "draft",
      title: "Bozza",
      type: "boolean",
      description: "Se attivo, l'articolo non sarà visibile sul sito.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Immagine di copertina",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Contenuto",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "date" },
  },
});
