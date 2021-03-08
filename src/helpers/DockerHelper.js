import deasync from 'deasync'
import request from 'request'

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
            callback(null, false)
          } else {
            try {
              const json = JSON.parse(body)
              if (!json.errors) {
                callback(null, true)
              } else {
                callback(null, false)
              }
            } catch (err) {
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
      uri: `https://auth.docker.io/token?service=registry.docker.io&scope=repository%3A${encodeURIComponent(imageName)}%3Apull`,
      headers: { 
        Authorization: 'Basic ' + Buffer.from(process.env.urbanCodeDocker_USR + ':' + process.env.urbanCodeDocker_PSW).toString('base64') 
      }
    }
    request(options, function (error, response, body) {
      if (error) {
        callback(null, false)
      } else {
        try {
          const token = JSON.parse(body).token
          callback(null, token)
        } catch (err) {
          callback(null, false)
        }
      }
    })
  }
}