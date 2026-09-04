import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error('请设置 SANITY_STUDIO_PROJECT_ID 和 SANITY_STUDIO_DATASET')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: 'q4cnews0k2h8nmbkis37gb3j',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
