import fs from 'fs-extra'
import log4js from 'log4js'
import path from 'path'

import PluginsHelper, { PLUGINS_DIR } from './PluginsHelper'

const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    let indexJson = {}
    const plugins = await fs.readdir(PLUGINS_DIR)
    for (const plugin of plugins) {
      const info = await PluginsHelper.getPluginFile(plugin, 'info.json')
      const releases = await PluginsHelper.getPluginFile(plugin, 'releases.json')
      const latestRelease = await PluginsHelper.getLatestRelease(releases)
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
    await fs.writeFile(path.join(__dirname, '../index.json'), JSON.stringify(indexJson, null, 4))
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();
