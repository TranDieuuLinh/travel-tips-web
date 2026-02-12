import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import type { UserConfig as ViteConfig } from 'vite'

export default defineConfig({
  name: 'default',
  title: 'CMSSanity',

  projectId: '3b2dc5to',
  dataset: 'production',

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
