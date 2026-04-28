import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni sito",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      description:
        "Se vuoto, viene usato il logo di default. Carica un PNG trasparente per sostituirlo.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "logoAlt",
      title: "Testo alternativo logo",
      type: "string",
      initialValue: "Christian Dilorenzo — Counselor Professionista",
    }),
    defineField({
      name: "calendarUrl",
      title: "URL calendario (prenotazioni)",
      type: "url",
      description: "Link Google Calendar per le prenotazioni",
    }),
    defineField({
      name: "email",
      title: "Email di contatto",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Telefono",
      type: "string",
      description: 'Formato internazionale, es. "+39 347 330 1278"',
    }),
    defineField({
      name: "whatsappUrl",
      title: "URL WhatsApp",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Impostazioni sito" }),
  },
});
