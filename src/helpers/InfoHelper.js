import Joi from '@hapi/joi'

import PluginsHelper from './PluginsHelper'

export const FILE_NAME = 'info.json'
export const ERROR_TEXT = {
  Root: 'must have root JSON object for info',
  Name: 'must have "name" element in "root" object whose value is a string',
  Url: 'must have "url" element in "root" object whose value is a valid URI',
  Description: 'must have "description" element in "root" object whose value is a string',
  Author: 'must have "author" element in "root" object whose value is a JSON object',
  AuthorName: 'must have "name" element in "root.author" object whose value is a string',
  AuthorEmail: 'must have "email" element in "root.author" object whose value is a valid email address'
}

export default class InfoHelper {
  static getSchema() {
    return Joi.object().required().error(() => ERROR_TEXT.Root).keys({
      name: Joi.string().required().error(() => ERROR_TEXT.Name),
      url: Joi.string().required().uri().error(() => ERROR_TEXT.Url),
      description: Joi.string().required().error(() => ERROR_TEXT.Description),
      author: Joi.object().required().error(() => ERROR_TEXT.Author).keys({
        name: Joi.string().required().error(() => ERROR_TEXT.AuthorName),
        email: Joi.string().required().email().error(() => ERROR_TEXT.AuthorEmail)
      })
    })
  }

  static validate(plugin, info) {
    PluginsHelper.throwJoiError(plugin, FILE_NAME, Joi.validate(info, this.getSchema(), {
      abortEarly: false
    }))
  }
}