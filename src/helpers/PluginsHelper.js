import fs from 'fs-extra'
import path from 'path'

export const PLUGINS_DIR = path.join(__dirname, '../../plugins')

export default class PluginsHelper {
  static async getJsonFromPluginFile(plugin, file) {
    let stringContents
    try {
      stringContents = await fs.readFile(path.join(PLUGINS_DIR, plugin, file), 'utf-8')
    } catch (err) {
      throw new Error(`Could not read "${file}" file for plugin "${plugin}". Please ensure an info.json file exists in the directory "plugins/${plugin}" with the appropriate information.`, err)
    }
    let jsonContents
    try {
      jsonContents = JSON.parse(stringContents)
    } catch (err) {
      throw new Error(`Could not parse "${file}" file for plugin "${plugin}" as JSON. Please ensure the info.json file at "plugins/${plugin}/${file}" contains valid JSON with the appropriate information.`, err)
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