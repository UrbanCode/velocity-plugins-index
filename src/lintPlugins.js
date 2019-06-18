import fs from 'fs-extra'
import log4js from 'log4js'

import PluginsHelper, { PLUGINS_DIR } from './PluginsHelper'

const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    const plugins = await fs.readdir(PLUGINS_DIR)
    for (const plugin of plugins) {
      await PluginsHelper.getPluginFile(plugin, 'info.json')
      await PluginsHelper.getPluginFile(plugin, 'releases.json')
    }
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();
