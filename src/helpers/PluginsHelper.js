import fs from 'fs-extra'
import log4js from 'log4js'
import path from 'path'

export const PLUGINS_DIR = path.join(__dirname, '../../plugins')
const logger = log4js.getLogger('PluginHelper')
logger.level = process.env.LOG_LEVEL || 'debug'

export default class PluginsHelper {
  static async getJsonFromPluginFile(plugin, file) {
    let stringContents
    try {
      stringContents = await fs.readFile(path.join(PLUGINS_DIR, plugin, file), 'utf-8')
    } catch (err) {
      logger.error(`Could not read "${file}" file for plugin "${plugin}". Please ensure an info.json file exists in the directory "plugins/${plugin}" with the appropriate information.`)
      throw err
    }
    let jsonContents
    try {
      jsonContents = JSON.parse(stringContents)
    } catch (err) {
      logger.error(`Could not parse "${file}" file for plugin "${plugin}" as JSON. Please ensure the info.json file at "plugins/${plugin}/${file}" contains valid JSON with the appropriate information.`)
      throw err
    }
    return jsonContents
  }

  static throwJoiError(plugin, fileName, result) {
    if (result.error) {
      const messages = [...new Set(result.error.details.map(detail => detail.message))].join(' AND ') // remove duplicate messages, then combine them with AND separating them
      throw new Error(`Invalid JSON in "${fileName}" for plugin "${plugin}": ${messages}`)
    }
  }
}