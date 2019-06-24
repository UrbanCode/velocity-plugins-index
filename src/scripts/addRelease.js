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
          type: 'string',
          alias: 'p'
        },
        semver: {
          type: 'string',
          alias: 's'
        },
        image: {
          type: 'string',
          alias: 'i'
        },
        date: {
          type: 'string',
          alias: 'd',
          default: new Date().toISOString()
        },
        notes: {
          type: 'string',
          alias: 'n',
          default: []
        }
      }
    })
    if (!args.flags.pluginId) {
      throw new Error('The --pluginId, -p flag is required to add a release')
    }
    if (!args.flags.semver) {
      throw new Error('The --semver, -s flag is required to add a release')
    }
    if (!args.flags.image) {
      throw new Error('The --image, -i flag is required to add a release')
    }
    const newRelease = {
      semver: args.flags.semver,
      date: args.flags.date,
      image: args.flags.image,
      notes: args.flags.notes
    }

    await fs.ensureDir(path.join(PLUGINS_DIR, args.flags.pluginId))
    const releasesFile = path.join(PLUGINS_DIR, args.flags.pluginId, RELEASES_FILE_NAME)
    if (!await fs.exists(releasesFile)) {
      await fs.writeFile(releasesFile, JSON.stringify([newRelease], null, 4))
    } else {
      let releasesString
      try {
        releasesString = await fs.readFile(releasesFile, 'utf-8')
      } catch (err) {
        throw new Error(`Could not read releases file ${releasesFile}: `, err)
      }
      let releasesJson
      try {
        releasesJson = JSON.parse(releasesString)
      } catch (err) {
        throw new Error('Could not parse releases file as JSON: ', err)
      }
      releasesJson.unshift(newRelease)
      ReleasesHelper.validate(args.flags.pluginId, releasesJson)
      await fs.writeFile(releasesFile, JSON.stringify(releasesJson, null, 4))
    }
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();