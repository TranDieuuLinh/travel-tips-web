import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import type { UserConfig as ViteConfig } from 'vite'
import { config } from 'dotenv';
config({ quiet: true });


export default defineConfig({
  name: 'default',
  title: 'CMSSanity',

  projectId: process.env.PROJECTID!,
  dataset: process.env.DATASET!,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  
  vite: (config: ViteConfig) => ({
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      exclude: [
        '@mux/playback-core',
        '@mux/mux-video',
        '@mux/mux-player',
        '@mux/mux-player-react',
      ],
    },
    ssr: {
      noExternal: [
        '@mux/playback-core',
        '@mux/mux-video',
        '@mux/mux-player',
        '@mux/mux-player-react',
      ],
    },
  }),
})