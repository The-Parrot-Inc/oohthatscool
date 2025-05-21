import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
const isLocalBuild = Boolean(process.env.LOCAL_BUILD);

// https://astro.build/config
export default defineConfig({
  adapter: isLocalBuild
    ? node({mode: 'standalone'})
    : vercel(),
  // Add React integration
  integrations: [react()]
});
