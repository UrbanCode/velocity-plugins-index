import fs from 'fs-extra'
import log4js from 'log4js'

import PluginsHelper, { PLUGINS_DIR } from '../helpers/PluginsHelper'
import InfoHelper, { FILE_NAME as INFO_FILE_NAME } from '../helpers/InfoHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../helpers/ReleasesHelper'

const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    const plugins = await fs.readdir(PLUGINS_DIR)
    for (const plugin of plugins) {
      const info = await PluginsHelper.getJsonFromPluginFile(plugin, INFO_FILE_NAME)
      InfoHelper.validate(plugin, info)
      const releases = await PluginsHelper.getJsonFromPluginFile(plugin, RELEASES_FILE_NAME)
      ReleasesHelper.validate(plugin, releases)
    }
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();
