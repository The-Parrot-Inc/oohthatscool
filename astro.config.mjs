import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
const isLocalBuild = Boolean(process.env.LOCAL_BUILD);

// https://astro.build/config
export default defineConfig({
  adapter: isLocalBuild
    ? node({mode: 'standalone'})
    : vercel(),
  // React integration removed as we are now using only Astro components
});
