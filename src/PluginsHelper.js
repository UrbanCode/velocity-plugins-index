import fs from 'fs-extra'
import log4js from 'log4js'
import moment from 'moment'
import path from 'path'
import semver from 'semver'

export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
export const PLUGINS_DIR = path.join(__dirname, '../plugins')
const logger = log4js.getLogger('PluginHelper')
logger.level = process.env.LOG_LEVEL || 'debug'

export default class PluginsHelper {
  static async getPluginFile(plugin, file) {
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
    if (file === 'info.json') {
      await this.validateInfo(plugin, jsonContents)
    } else if (file === 'releases.json') {
      await this.validateReleases(plugin, jsonContents)
    } else {
      throw new Error(`Invalid file plugin "${file}". Must be either "info.json" or "releases.json"`)
    }
    return jsonContents
  }

  static async validateInfo(plugin, info) {
    if (!info) {
      throw new Error(`Detected empty object for info.json for plugin "${plugin}". Must be a JSON object with elements name, url, description and author.`)
    }
    if (!info.name) {
      throw new Error(`info.json for plugin "${plugin}" must have "name" element.`)
    }
    if (!info.url) {
      throw new Error(`info.json for plugin "${plugin}" must have "url" element.`)
    }
    if (!info.description) {
      throw new Error(`info.json for plugin "${plugin}" must have "description" element.`)
    }
    if (!info.author) {
      throw new Error(`info.json for plugin "${plugin}" must have "author" element.`)
    }
    if (!info.author.name) {
      throw new Error(`info.json for plugin "${plugin}" must have "name" element in "author" object.`)
    }
    if (!info.author.email) {
      throw new Error(`info.json for plugin "${plugin}" must have "email" element in "author" object.`)
    }
  }

  static async validateReleases(plugin, releases) {
    if (!releases) {
      throw new Error(`Detected empty object for releases.json for plugin "${plugin}". Must be a JSON array with objects for each release containing semver, date, image and notes.`)
    }
    if (!Array.isArray(releases)) {
      throw new Error(`releases.json for plugin "${plugin}" is not a valid array. Must be a JSON array with objects for each release containing semver, date, image and notes.`)
    }
    if (releases.length < 1) {
      throw new Error(`releases.json for plugin "${plugin}" must contain at least one release.`)
    }
    for (const release of releases) {
      if (!release.semver) {
        throw new Error(`releases.json for plugin "${plugin}" contains a release without a "semver" element. All releases must have a "semver" element.`)
      }
      if (!semver.valid(release.semver)) {
        throw new Error(`releases.json for plugin "${plugin}" contains a release with an invalid semver "${release.semver}". All releases must have a valid "semver" element.`)
      }
      if (!release.date) {
        throw new Error(`releases.json for plugin "${plugin}" contains a release without a "date" element. All releases must have a "date" element.`)
      }
      if (!moment(release.date, DATE_TIME_FORMAT, true).isValid()) {
        throw new Error(`releases.json for plugin "${plugin}" contains a release with an invalid date "${release.date}". All releases must have a valid "date" element in the format "${DATE_TIME_FORMAT}"`)
      }
      if (!release.image) {
        throw new Error(`releases.json for plugin "${plugin}" contains a release without an "image" element. All releases must have a valid "image" element.`)
      }
      // add logic to check to make sure docker image exists
      if (release.notes) {
        if (!Array.isArray(release.notes)) {
          throw new Error(`releases.json for plugin "${plugin}" contains a release with invalid "notes" element. Releases may contain an optional "notes" element that must be an array of strings.`)
        }
        for (const note of release.notes) {
          if (typeof note !== 'string') {
            throw new Error(`releases.json for plugin "${plugin}" contains a release with an invalid note "${note}". Releases may contain an optional "notes" element that must be an array of strings.`)
          }
        }
      }
    }
    // make sure no duplicated release versions
    const releaseVersions = releases.map(release => release.semver).sort(semver.compare)
    if (new Set(releaseVersions).size !== releaseVersions.length) {
      throw new Error(`releases.json for plugin "${plugin}" contains duplicate versions. Releases must have unique versions.`)
    }
    // make sure release dates are always later than previous version
    let date, ver
    for (const version of releaseVersions) {
      const release = releases.filter(release => release.semver === version)[0]
      if (date && !moment(release.date).isAfter(date)) {
        throw new Error(`releases.json for plugin "${plugin}" contains invalid release "${release.semver}" whose date "${release.date}" is not after the previous release "${ver}" date "${date}". Each new release must have a date later than the previous release.`)
      }
      date = release.date
      ver = release.semver
    }
  }

  static async getLatestRelease(releases) {
    const latestVersion = releases.map(release => release.semver).sort(semver.rcompare)[0]
    return releases.filter((release => release.semver === latestVersion))[0]
  }
}