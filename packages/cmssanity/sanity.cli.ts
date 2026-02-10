import {defineCliConfig} from 'sanity/cli'
import { config } from 'dotenv';
config({ quiet: true });

export default defineCliConfig({
  api: {
    projectId: process.env.PROJECTID!,
    dataset: process.env.DATASET!,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
