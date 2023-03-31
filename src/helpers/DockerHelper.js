import deasync from 'deasync'
import { exec } from 'child_process'
import log4js from 'log4js'

const logger = log4js.getLogger('DockerHelper')
logger.level = process.env.LOG_LEVEL || 'INFO'

export default class DockerHubHelper {
  static doesImageExist(image) {
    const imageExists = deasync(this.doesImageExistWithCallback)
    return imageExists(image)
  }

  static doesImageExistWithCallback(image, callback) {
    DockerHubHelper.getImage(image, (error, pullText) => {
      if (error) {
        callback(null, false)
      } else {
        if (!image.includes(':')) {
          logger.trace(`Image '${image}' does not include colon, adding default latest tag`)
          image = `${image}:latest`
        }
        const exists = pullText.includes(`Status: Image is up to date for ${image}`) ||
          pullText.includes(`Status: Downloaded newer image for ${image}`)
        logger.debug(`Image '${image}' ${exists ? 'exists' : 'does NOT exist'}`)
        if (exists) {
          logger.debug(`Deleting image '${image}'`)
          DockerHubHelper.deleteImage(image, (error, deleteText) => { // eslint-disable-line no-unused-vars
            callback(null, true)
          })
        } else {
          callback(null, false)
        }
      }
    })
  }

  static getImage(image, callback) {
    const command = `docker pull ${image}`
    logger.trace(`Executing command '${command}'...`)
    exec(command, (error, stdout, stderr) => {
      logger.trace(`error: '${error}'`)
      logger.trace(`stdout: '${stdout}'`)
      logger.trace(`stderr: '${stderr}'`)
      if (error) {
        logger.error(error)
        callback(error, null)
      } else {
        callback(null, stdout)
      }
    })
  }

  static deleteImage(image, callback) {
    const command = `docker rmi ${image}`
    logger.trace(`Executing command '${command}'...`)
    exec(command, (error, stdout, stderr) => {
      logger.trace(`error: '${error}'`)
      logger.trace(`stdout: '${stdout}'`)
      logger.trace(`stderr: '${stderr}'`)
      if (error) {
        logger.error(error)
        callback(error, null)
      } else {
        callback(null, stdout)
      }
    })
  }
}