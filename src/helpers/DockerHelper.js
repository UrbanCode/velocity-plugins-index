import deasync from 'deasync'
import request from 'request'
import log4js from 'log4js'

const logger = log4js.getLogger('DockerHelper')
logger.level = process.env.LOG_LEVEL || 'debug'

export default class DockerHubHelper {
  static doesImageExist(image) {
    const imageExists = deasync(this.doesImageExistWithCallback)
    return imageExists(image)
  }

  static doesImageExistWithCallback(image, callback) {
    let [imageName, imageTag] = image.split(':')
    DockerHubHelper.getToken(imageName, function(error, token) {
      if (error) {
        callback(error, null)
      } else {
        if (!imageName.includes('/')) {
          imageName = `library/${imageName}`
        }
        const options = {
          method: 'GET',
          uri: `https://registry-1.docker.io/v2/${imageName}/manifests/${imageTag}`,
          headers: {
            authorization: `Bearer ${token}`
          }
        }
        request(options, function (error, response, body) {
          if (error) {
            logger.error(`Error getting the image tags - ${error}\n`)
            callback(null, false)
          } else {
            try {
              const json = JSON.parse(body)
              if (!json.errors) {
                callback(null, true)
              } else {
                logger.error(`Error parsing the image tags body data - ${json.errors}\n`)
                callback(null, false)
              }
            } catch (err) {
              logger.error(`Error parsing the image tags response - ${err}\n`)
              callback(null, false)
            }
          }
        })
      }
    })
  }

  static getToken(imageName, callback) {
    if (!imageName.includes('/')) {
      imageName = `library/${imageName}`
    }
    const options = {
      method: 'GET',
      uri: `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${encodeURIComponent(imageName)}:pull`,
      headers: { 
        Authorization: 'Basic ' + Buffer.from(process.env.DOCKERHUB_USR + ':' + process.env.DOCKERHUB_PSW).toString('base64')
      }
    }
    request(options, function (error, response, body) {
      if (error) {
        logger.error(`Error generating auth token - ${error}\n`)
        callback(null, false)
      } else {
        try {
          const token = JSON.parse(body).token
          callback(null, token)
        } catch (err) {
          logger.error(`Error parsing auth token - ${err}\n`)
          callback(null, false)
        }
      }
    })
  }
}