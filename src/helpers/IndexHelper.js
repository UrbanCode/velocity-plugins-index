import Joi from '@hapi/joi'
import path from 'path'

import InfoHelper from './InfoHelper'
import PluginsHelper from './PluginsHelper'
import ReleasesHelper from './ReleasesHelper'

export const FILE_NAME = 'index.json'
export const FILE = path.join(__dirname, '../../', FILE_NAME)
export const ERROR_TEXT = {
  Root: 'must have root JSON object for index containing elements for each pluginId whose values are a JSON object containing elements for the plugins info along with a "current" element whose value is a release object containing the latest release of the plugin',
  Plugin: 'must have pluginId\'s as elements in the root JSON object whose values are a JSON object containing elements for the plugin\'s info along with a "current" element whose value is a release object containing the latest release of the plugin',
  Current: 'must have "current" element in each plugin object whose value is a release object'
}

export default class IndexHelper {
  static getSchema() {
    return Joi.object().required().error(() => ERROR_TEXT.Root).pattern(Joi.string().required().error(() => ERROR_TEXT.Plugin), this.getPluginSchema().required().error(() => ERROR_TEXT.Plugin)
    )
  }

  static getPluginSchema() {
    let keys = InfoHelper.getKeysSchema()
    keys.current = ReleasesHelper.getSingleReleaseSchema().error(() => ERROR_TEXT.Current)
    return Joi.object().keys(keys)
  }

  static validate(index) {
    PluginsHelper.throwJoiError(null, FILE_NAME, Joi.validate(index, this.getSchema(), {
      abortEarly: false
    }))
  }
}