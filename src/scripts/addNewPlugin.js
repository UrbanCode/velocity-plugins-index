import fs from 'fs-extra'
import log4js from 'log4js'
import meow from 'meow'
import path from 'path'

import InfoHelper, { FILE_NAME as INFO_FILE_NAME } from '../helpers/InfoHelper'
import { PLUGINS_DIR } from '../helpers/PluginsHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../helpers/ReleasesHelper'

const logger = log4js.getLogger('addNew')
logger.level = process.env.LOG_LEVEL || 'INFO'

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
        },
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        authorName: {
          type: 'string'
        },
        authorEmail: {
          type: 'string'
        }
      }
    })
    if (!args.flags.pluginId) {
      throw new Error('The --pluginId flag is required to add a new plugin')
    }
    if (!args.flags.semver) {
      throw new Error('The --semver flag is required to add a new plugin')
    }
    if (!args.flags.image) {
      throw new Error('The --image flag is required to add a new plugin')
    }
    try {
      JSON.parse(args.flags.notes)
    } catch (err) {
      throw new Error(`Invalid notes. --notes flag must be a valid JSON array. For example: ['new feature', 'bug fixed']`)
    }
    if (!args.flags.name) {
      throw new Error('The --name flag is required to add a new plugin')
    }
    if (!args.flags.url) {
      throw new Error('The --url flag is required to add a new plugin')
    }
    if (!args.flags.description) {
      throw new Error('The --description flag is required to add a new plugin')
    }
    if (!args.flags.authorName) {
      throw new Error('The --authorName flag is required to add a new plugin')
    }
    if (!args.flags.authorEmail) {
      throw new Error('The --authorEmail flag is required to add a new plugin')
    }
    const newPlugin = {
      name: args.flags.name,
      url: args.flags.url,
      description: args.flags.description,
      author: {
        name: args.flags.authorName,
        email: args.flags.authorEmail
      }
    }
    const newReleases = [{
      semver: args.flags.semver,
      date: args.flags.date,
      image: args.flags.image,
      notes: JSON.parse(args.flags.notes)
    }]
    if (args.flags.supports) {
      newReleases[0].supports = args.flags.supports
    }

    if (await fs.exists(path.join(PLUGINS_DIR, args.flags.pluginId))) {
      throw new Error(`The plugin ${args.flags.pluginId} already exists, cannot add it as a new plugin. Use the add-release script to add a new release to an existing plugin.`)
    }
    await fs.ensureDir(path.join(PLUGINS_DIR, args.flags.pluginId))
    const releasesFile = path.join(PLUGINS_DIR, args.flags.pluginId, RELEASES_FILE_NAME)
    const infoFile = path.join(PLUGINS_DIR, args.flags.pluginId, INFO_FILE_NAME)
    InfoHelper.validate(args.flags.pluginId, newPlugin)
    ReleasesHelper.validate(args.flags.pluginId, newReleases)
    await fs.writeFile(infoFile, JSON.stringify(newPlugin, null, 4))
    await fs.writeFile(releasesFile, JSON.stringify(newReleases, null, 4))
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})();