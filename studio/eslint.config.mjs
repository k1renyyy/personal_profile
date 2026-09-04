import {defineConfig, globalIgnores} from 'eslint/config'
import studio from '@sanity/eslint-config-studio'

const eslintConfig = defineConfig([
  ...studio,
  globalIgnores(['.sanity/**', 'coverage/**', 'dist/**']),
])

export default eslintConfig
