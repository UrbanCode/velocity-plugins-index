import { expect } from 'chai'

import PluginsHelper from '../../src/PluginsHelper'

describe('Validate info.json', function() {
  const pluginId = 'custom-plugin'
  describe('Invalid Root Element', function() {
    it('should throw error if info is undefined', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, undefined)).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is null', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, null)).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is an empty string', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, '')).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is a string', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, 'info')).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is a number', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, 7)).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is an array', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, ['info'])).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
    it('should throw error if info is a boolean', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, true)).throws(`Detected empty object for info.json for plugin "${pluginId}". Must be a JSON object with elements name, url, description and author.`)
    })
  })
  describe('Invalid Name Element', function() {
    it('should throw error if info does not have name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, {})).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has undefined name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: undefined })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has null name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: null })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has empty string name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: '' })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has number name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 7 })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has number array element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: ['author'] })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
    it('should throw error if info has number boolean element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: true })).throws(`info.json for plugin "${pluginId}" must have "name" element whose value is a string.`)
    })
  })
  describe('Invalid URL Element', function() {
    it('should throw error if info does not have url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom' })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has undefined url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: undefined })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has null url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: null })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has empty string url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: '' })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has number url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 7 })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has array url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: ['url'] })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
    it('should throw error if info has boolean url element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: true })).throws(`info.json for plugin "${pluginId}" must have "url" element whose value is a string.`)
    })
  })
  describe('Invalid Description Element', function() {
    it('should throw error if info does not have description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url' })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has undefined description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: undefined })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has null description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: null })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has empty string description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: '' })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has number description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 7 })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has array description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: ['desc'] })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
    it('should throw error if info has boolean description element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: true })).throws(`info.json for plugin "${pluginId}" must have "description" element whose value is a string.`)
    })
  })
  describe('Invalid Author Element', function() {
    it('should throw error if info does not have author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.' })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has undefined author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: undefined })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has null author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: null })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has empty string author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: '' })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has string author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: 'custom-author' })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has number author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: 7 })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has array author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: ['custom-author'] })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
    it('should throw error if info has boolean author element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: true })).throws(`info.json for plugin "${pluginId}" must have "author" element whose value is a JSON object.`)
    })
  })
  describe('Invalid Author Name Element', function() {
    it('should throw error if info does not have author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: {} })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has undefined author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: undefined } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has null author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: null } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has empty string author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: '' } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has number author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 7 } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has array author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: ['author'] } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
    it('should throw error if info has boolean author name element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: true } })).throws(`info.json for plugin "${pluginId}" must have "name" element in "author" object.`)
    })
  })
  describe('Invalid Author Email Element', function() {
    it('should throw error if info does not have author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author' } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has undefined author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: undefined } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has null author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: null } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has empty string author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: '' } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has number author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: 7 } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has array author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: ['author@custom.com'] } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
    it('should throw error if info has boolean author email element', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: true } })).throws(`info.json for plugin "${pluginId}" must have "email" element in "author" object.`)
    })
  })
  describe('Valid info.json', function() {
    it('should not thorw error if info is valid', function() {
      expect(() => PluginsHelper.validateInfo(pluginId, { name: 'Custom', url: 'custom-url', description: 'custom plugin.', author: { name: 'custom-author', email: 'author@custom.com' } })).to.not.throw
    })
  })
})