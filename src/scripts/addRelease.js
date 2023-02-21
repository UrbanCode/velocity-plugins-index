import fs from 'fs-extra'
import log4js from 'log4js'
import meow from 'meow'
import path from 'path'

import { PLUGINS_DIR } from '../helpers/PluginsHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../helpers/ReleasesHelper'

const logger = log4js.getLogger('addRelease')
logger.level = process.env.LOG_LEVEL || 'debug'

;(async () => {
  try {
    const args = meow({
      flags: {
        pluginId: {
          type: 'string'
        },
        semver: {
          type: 'string'
        },
        image: {
          type: 'string'
        },
        date: {
          type: 'string',
          default: new Date().toISOString()
        },
        notes: {
          type: 'string',
          default: '[]'
        },
        supports: {
          type: 'string'
        }
      }
    })
    if (!args.flags.pluginId) {
      throw new Error('The --pluginId flag is required to add a release')
    }
    if (!args.flags.semver) {
      throw new Error('The --semver flag is required to add a release')
    }
    if (!args.flags.image) {
      throw new Error('The --image flag is required to add a release')
    }
    try {
      JSON.parse(args.flags.notes)
    } catch (err) {
      throw new Error(`Invalid notes. --notes flag must be a valid JSON array. For example: ['new feature', 'bug fixed']`)
    }
    const newRelease = {
      semver: args.flags.semver,
      date: args.flags.date,
      image: args.flags.image,
      notes: JSON.parse(args.flags.notes)
    }
    if (args.flags.supports) {
      newRelease.supports = args.flags.supports
    }

    await fs.ensureDir(path.join(PLUGINS_DIR, args.flags.pluginId))
    const releasesFile = path.join(PLUGINS_DIR, args.flags.pluginId, RELEASES_FILE_NAME)
    let releases = []
    if (await fs.exists(releasesFile)) {
      let releasesString
      try {
        releasesString = await fs.readFile(releasesFile, 'utf-8')
      } catch (err) {
        throw new Error(`Could not read releases file ${releasesFile}: `, err)
      }
      try {
        releases = JSON.parse(releasesString)
      } catch (err) {
        throw new Error('Could not parse releases file as JSON: ', err)
      }
    }
    releases.unshift(newRelease)
    ReleasesHelper.validate(args.flags.pluginId, releases.slice(0, 2))
    await fs.writeFile(releasesFile, JSON.stringify(releases, null, 4))
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();