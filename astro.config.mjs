import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [preact()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
  server: { port: 4321 },
});
