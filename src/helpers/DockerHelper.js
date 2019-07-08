import deasync from 'deasync'
import drc from 'docker-registry-client'

export default class DockerHubHelper {
  static doesImageExist(image) {
    const imageExists = deasync(this.doesImageExistWithCallback)
    return imageExists(image)
  }

  static doesImageExistWithCallback(image, callback) {
    const [imageName, imageTag] = image.split(':')
    const client = drc.createClientV2({
      name: imageName
    })
    if (!imageTag || imageTag === 'latest') {
      client.close()
      callback(null, false)
    } else {
      client.getManifest({ ref: imageTag }, function(err, manifest) { // eslint-disable-line no-unused-vars
        client.close()
        callback(null, !err)
      })
    }
  }

  /**
   * Commented out for now in favor of the synchronous/callback method above.
   * If Joi ever supports asynchronous validation for rules, use this async method instead
   */
  // static async doesImageExist(image) {
  //   const [imageName, imageTag] = image.split(':')
  //   const client = drc.createClientV2({
  //     name: imageName
  //   })
  //   try {
  //     const getManifest = util.promisify(client.getManifest.bind(client))
  //     await getManifest({ ref: imageTag || 'latest' })
  //   } catch (err) {
  //     return false
  //   } finally {
  //     client.close()
  //   }
  //   return true
  // }
}