import fs from 'fs-extra'
import log4js from 'log4js'
import path from 'path'

import IndexHelper, { FILE as INDEX_FILE } from '../helpers/IndexHelper'
import { FILE_NAME as INFO_FILE_NAME } from '../helpers/InfoHelper'
import PluginsHelper, { PLUGINS_DIR } from '../helpers/PluginsHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../helpers/ReleasesHelper'

const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    let indexString
    try {
      indexString = await fs.readFile(INDEX_FILE, 'utf-8')
    } catch (err) {
      logger.error(`Could not read index file at "${INDEX_FILE}"`)
      throw err
    }
    let indexJson
    try {
      indexJson = JSON.parse(indexString)
    } catch (err) {
      logger.error(`Could not parse index file at "${INDEX_FILE}" as valid JSON`)
      throw err
    }
    IndexHelper.validate(indexJson)
    // ensure every plugin in the plugins directory is present in the index JSON
    const plugins = await fs.readdir(PLUGINS_DIR)
    for (const plugin of plugins) {
      if (!indexJson[plugin]) {
        throw new Error(`Plugins directory "${PLUGINS_DIR}" has plugin "${plugin}" that is not present in the index file at "${INDEX_FILE}". Index file must contain all plugins in the plugins directory.`)
      }
    }
    // ensure every plugin in the index is present in the plugins directory
    for (const plugin in indexJson) {
      if (!(await fs.exists(path.join(PLUGINS_DIR, plugin)))) {
        throw new Error(`Index file at "${INDEX_FILE}" contains plugin "${plugin}" that does not have a corresponding directory in the plugins directory "${PLUGINS_DIR}". All plugins in the index file must have a corresponding directory in the plugins directory containing info.json and releases.json`)
      }
    }
    for (const plugin in indexJson) {
      const info = await PluginsHelper.getJsonFromPluginFile(plugin, INFO_FILE_NAME)
      const releases = await PluginsHelper.getJsonFromPluginFile(plugin, RELEASES_FILE_NAME)
      const latestRelease = await ReleasesHelper.getLatestRelease(releases)
      if (indexJson[plugin].name !== info.name) {
        throw new Error(`Plugin "${plugin}" name "${indexJson[plugin].name}" in index file "${INDEX_FILE}" does not match the name "${info.name}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].url !== info.url) {
        throw new Error(`Plugin "${plugin}" url "${indexJson[plugin].url}" in index file "${INDEX_FILE}" does not match the url "${info.url}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].description !== info.description) {
        throw new Error(`Plugin "${plugin}" description "${indexJson[plugin].description}" in index file "${INDEX_FILE}" does not match the description "${info.description}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].author.name !== info.author.name) {
        throw new Error(`Plugin "${plugin}" author name "${indexJson[plugin].author.name}" in index file "${INDEX_FILE}" does not match the author name "${info.author.name}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].author.email !== info.author.email) {
        throw new Error(`Plugin "${plugin}" author email "${indexJson[plugin].author.email}" in index file "${INDEX_FILE}" does not match the author email "${info.author.email}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].current.semver !== latestRelease.semver) {
        throw new Error(`Plugin "${plugin}" current release version "${indexJson[plugin].current.semver}" in index file "${INDEX_FILE}" does not match the latest release semver "${latestRelease.semver}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].current.date !== latestRelease.date) {
        throw new Error(`Plugin "${plugin}" current release date "${indexJson[plugin].current.date}" in index file "${INDEX_FILE}" does not match the latest release date "${latestRelease.date}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (indexJson[plugin].current.image !== latestRelease.image) {
        throw new Error(`Plugin "${plugin}" current release image "${indexJson[plugin].current.image}" in index file "${INDEX_FILE}" does not match the latest release image "${latestRelease.image}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
      if (JSON.stringify(indexJson[plugin].current.notes) !== JSON.stringify(latestRelease.notes)) {
        throw new Error(`Plugin "${plugin}" current release notes "${JSON.stringify(indexJson[plugin].current.notes)}" in index file "${INDEX_FILE}" does not match the latest release notes "${JSON.stringify(latestRelease.notes)}" found in the info file "${path.join(PLUGINS_DIR, plugin, 'info.json')}"`)
      }
    }
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();
