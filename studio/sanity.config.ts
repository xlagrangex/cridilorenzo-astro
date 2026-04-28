import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "Cri Dilorenzo",

  projectId: "v97micrw",
  dataset: "production",

  studioHost: "cridilorenzo",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenuti")
          .items([
            S.listItem()
              .title("Impostazioni sito")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Impostazioni sito")
              ),
            S.listItem()
              .title("Home page")
              .id("homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Home page")
              ),
            S.divider(),
            S.documentTypeListItem("post").title("Blog"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          schemaType !== "siteSettings" && schemaType !== "homepage"
      ),
  },

  document: {
    actions: (input, context) => {
      if (
        context.schemaType === "siteSettings" ||
        context.schemaType === "homepage"
      ) {
        return input.filter(
          ({ action }) =>
            action &&
            ["publish", "discardChanges", "restore"].includes(action)
        );
      }
      return input;
    },
  },
});
