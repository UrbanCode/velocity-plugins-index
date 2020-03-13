import fs from 'fs-extra'
import path from 'path'

import { TEMP_PLUGIN_ID } from './func-constants'
import { PLUGINS_DIR } from '../../src/helpers/PluginsHelper'

beforeEach(async function() {
  await fs.remove(path.join(PLUGINS_DIR, TEMP_PLUGIN_ID))
})
afterEach(async function() {
  await fs.remove(path.join(PLUGINS_DIR, TEMP_PLUGIN_ID))
})