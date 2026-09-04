import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error('请设置 SANITY_STUDIO_PROJECT_ID 和 SANITY_STUDIO_DATASET')
}

export default defineConfig({
  name: 'default',
  title: 'Kiren Portfolio CMS',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
