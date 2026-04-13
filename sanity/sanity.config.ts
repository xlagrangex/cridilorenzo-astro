import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'cridilorenzo',
  title: 'Christian DiLorenzo',
  projectId: 'v97micrw',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
