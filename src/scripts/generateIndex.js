import fs from 'fs-extra'
import log4js from 'log4js'

import { FILE_NAME as INFO_FILE_NAME } from '../helpers/InfoHelper'
import PluginsHelper, { PLUGINS_DIR } from '../helpers/PluginsHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../helpers/ReleasesHelper'
import { FILE as INDEX_FILE } from '../helpers/IndexHelper'

const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    let indexJson = {}
    const plugins = await fs.readdir(PLUGINS_DIR)
    for (const plugin of plugins) {
      const info = await PluginsHelper.getJsonFromPluginFile(plugin, INFO_FILE_NAME)
      const releases = await PluginsHelper.getJsonFromPluginFile(plugin, RELEASES_FILE_NAME)
      const latestRelease = await ReleasesHelper.getLatestRelease(releases)
      indexJson[plugin] = {
        name: info.name,
        url: info.url,
        description: info.description,
        author: info.author,
        current: {
          semver: latestRelease.semver,
          date: latestRelease.date,
          image: latestRelease.image,
          notes: latestRelease.notes || []
        }
      }
    }
    await fs.writeFile(INDEX_FILE, JSON.stringify(indexJson, null, 4))
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();
