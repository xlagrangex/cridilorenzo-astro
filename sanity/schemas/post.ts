import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrizione SEO',
      type: 'text',
      rows: 3,
      description: '150-160 caratteri. Appare nei risultati Google.',
    }),
    defineField({
      name: 'date',
      title: 'Data pubblicazione',
      type: 'date',
    }),
    defineField({
      name: 'image',
      title: 'Immagine in evidenza',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'draft',
      title: 'Bozza',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Contenuto',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', date: 'date', draft: 'draft' },
    prepare({ title, date, draft }) {
      return {
        title: `${draft ? '📝 ' : ''}${title}`,
        subtitle: date,
      }
    },
  },
})
