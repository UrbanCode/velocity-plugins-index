import Joi from '@hapi/joi'
import joiExtSemver from 'joi-extension-semver'
import semver from 'semver'

import DockerHelper from './DockerHelper'
import PluginsHelper from './PluginsHelper'

export const FILE_NAME = 'releases.json'
export const ERROR_TEXT = {
  RootArray: 'must have root JSON array containing release objects for releases',
  RootObject: 'must have JSON object for each release in the releases array containing "semver", "date", "image" and "notes" elements',
  RootUnique: 'must have unique semver, image, and date elements for each release object',
  Semver: 'must have "semver" element in release object whose value is a valid Semantic Version',
  Date: 'must have "date" element in releases object whose value is a valid ISO DateTime string',
  Image: 'must have "image" element in releases object whose value is a valid DockerHub image',
  NotesArray: 'must have "notes" element in releases object whose value is an array comprised of strings. May be empty array to omit notes.',
  NotesObject: '"notes" array can only be comprised of strings'
}

export default class ReleasesHelper {
  static getSchema() {
    // TODO: apply .sort on semver descending (maybe even date also) when that functionality gets released (joi 16.0)
    return Joi.array().required().unique((a, b) => {
      return a.semver === b.semver || a.image === b.image || a.date === b.date
    }).error((errors) => {
      if (errors.map(err => err.type).includes('array.unique')) {
        return ERROR_TEXT.RootUnique
      }
      return ERROR_TEXT.RootArray
    }).items(this.getSingleReleaseSchema())
  }

  static getSingleReleaseSchema() {
    return Joi.object().required().error(() => ERROR_TEXT.RootObject).keys({
      semver: Joi.extend(joiExtSemver).semver().required().valid().error(() => ERROR_TEXT.Semver),
      date: Joi.string().required().isoDate().error(() => ERROR_TEXT.Date),
      image: Joi.extend(this.getDockerImageExtension()).image().required().exists().error(() => ERROR_TEXT.Image),
      notes: Joi.array().required().error(() => ERROR_TEXT.NotesArray).items(Joi.string().error(() => ERROR_TEXT.NotesObject))
    })
  }

  static validate(plugin, releases) {
    PluginsHelper.throwJoiError(plugin, FILE_NAME, Joi.validate(releases, this.getSchema(), {
      abortEarly: false
    }))
  }

  static validateSingleRelease(plugin, release) {
    PluginsHelper.throwJoiError(plugin, FILE_NAME, Joi.validate(release, this.getSingleReleaseSchema(), {
      abortEarly: false
    }))
  }

  static getDockerImageExtension() {
    return {
      name: 'image',
      base: Joi.string(),
      rules: [{
        name: 'exists',
        validate(params, value, state, options) {
          const exists = DockerHelper.doesImageExist(value)
          if (!exists) {
            return this.createError('image.exists', {}, state, options)
          }
          return value
        },
        description: 'Checks to see if the docker image exists in DockerHub'
      }]
    }
  }

  static getLatestRelease(releases) {
    const latestVersion = releases.map(release => release.semver).sort(semver.rcompare)[0]
    return releases.filter((release => release.semver === latestVersion))[0]
  }
}