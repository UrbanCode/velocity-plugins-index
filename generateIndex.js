import fs from 'fs-extra'
import log4js from 'log4js'
import moment from 'moment'
import path from 'path'
import semver from 'semver'

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const logger = log4js.getLogger('generateIndex')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    let indexJson = {}
    const plugins = await fs.readdir(path.join(__dirname, 'plugins'))
    for (const plugin of plugins) {
      const info = await getPluginFile(plugin, 'info.json')
      const releases = await getPluginFile(plugin, 'releases.json')
      const latestRelease = await getLatestRelease(releases)
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
    await fs.writeFile(path.join(__dirname, 'index.json'), JSON.stringify(indexJson, null, 4))
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();

async function getPluginFile(plugin, file) {
  let stringContents
  try {
    stringContents = await fs.readFile(path.join(__dirname, 'plugins', plugin, file), 'utf-8')
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
    await validateInfo(plugin, jsonContents)
  } else if (file === 'releases.json') {
    await validateReleases(plugin, jsonContents)
  } else {
    throw new Error(`Invalid file plugin "${file}". Must be either "info.json" or "releases.json"`)
  }
  return jsonContents
}

async function validateInfo(plugin, info) {
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

async function validateReleases(plugin, releases) {
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
}

async function getLatestRelease(releases) {
  const latestVersion = releases.map(release => release.semver).sort(semver.rcompare)[0]
  return releases.filter((release => release.semver === latestVersion))[0]
}
