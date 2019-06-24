import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fs from 'fs-extra'
import sinon from 'sinon'
import sinonTest from 'sinon-test'

import PluginsHelper from '../../src/helpers/PluginsHelper'
import { FILE_NAME as INFO_FILE_NAME } from '../../src/helpers/InfoHelper'

chai.use(chaiAsPromised)
const test = sinonTest(sinon)

describe('PluginSHelper', function() {
  const pluginId = 'custom-plugin'
  describe('Invalid JSON', function() {
    it('should throw error if file is string of invalid JSON', test(async function() {
      this.stub(fs, 'readFile').resolves('name: "Custom", url: "https://google.com", description: "custom plugin.", author: { name: "custom author", email: "author@custom.com" } }')
      await expect(PluginsHelper.getJsonFromPluginFile(pluginId, INFO_FILE_NAME)).to.eventually.be.rejectedWith(`Could not parse "${INFO_FILE_NAME}" file for plugin "${pluginId}" as JSON. Please ensure the info.json file at "plugins/${pluginId}/${INFO_FILE_NAME}" contains valid JSON with the appropriate information.`)
    }))
    it('should throw error if 2 root elements in file', test(async function() {
      this.stub(fs, 'readFile').resolves(`${JSON.stringify({ name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: 'author@custom.com' } })}{}`)
      await expect(PluginsHelper.getJsonFromPluginFile(pluginId, INFO_FILE_NAME)).to.eventually.be.rejectedWith(`Could not parse "${INFO_FILE_NAME}" file for plugin "${pluginId}" as JSON. Please ensure the info.json file at "plugins/${pluginId}/${INFO_FILE_NAME}" contains valid JSON with the appropriate information.`)
    }))
  })
  describe('Valid JSON', function() {
    it('should return file as JSON object if valid', test(async function() {
      const infoJson = { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: 'author@custom.com' } }
      this.stub(fs, 'readFile').resolves(JSON.stringify(infoJson, null, 4))
      await expect(PluginsHelper.getJsonFromPluginFile(pluginId, INFO_FILE_NAME)).to.eventually.deep.equals(infoJson)
    }))
  })
})