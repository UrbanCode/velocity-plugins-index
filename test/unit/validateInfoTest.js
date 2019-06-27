import { expect } from 'chai'

import InfoHelper, { ERROR_TEXT, FILE_NAME } from '../../src/helpers/InfoHelper'

describe('Validate info structure', function() {
  const pluginId = 'custom-plugin'
  describe('Invalid Root Element', function() {
    it('should throw error if info is undefined', function() {
      expect(() => InfoHelper.validate(pluginId, undefined)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is null', function() {
      expect(() => InfoHelper.validate(pluginId, null)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is an empty string', function() {
      expect(() => InfoHelper.validate(pluginId, '')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is a string', function() {
      expect(() => InfoHelper.validate(pluginId, 'info')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is a number', function() {
      expect(() => InfoHelper.validate(pluginId, 7)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is an array', function() {
      expect(() => InfoHelper.validate(pluginId, ['info'])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
    it('should throw error if info is a boolean', function() {
      expect(() => InfoHelper.validate(pluginId, true)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Root}`)
    })
  })
  describe('Invalid Name Element', function() {
    it('should throw error if info does not have name element', function() {
      expect(() => InfoHelper.validate(pluginId, {})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has undefined name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: undefined })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has null name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: null })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has empty string name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: '' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 7 })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number array element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: ['author'] })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number boolean element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: true })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Name} AND ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
  })
  describe('Invalid URL Element', function() {
    it('should throw error if info does not have url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has undefined url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: undefined })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has null url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: null })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has empty string url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: '' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 7 })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has array url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: ['url'] })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has boolean url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: true })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has non-URL string url element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'notaurl' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Url} AND ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
  })
  describe('Invalid Description Element', function() {
    it('should throw error if info does not have description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has undefined description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: undefined })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has null description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: null })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has empty string description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: '' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 7 })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has array description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: ['desc'] })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has boolean description element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: true })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Description} AND ${ERROR_TEXT.Author}`)
    })
  })
  describe('Invalid Author Element', function() {
    it('should throw error if info does not have author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has undefined author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: undefined })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has null author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: null })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has empty string author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: '' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has string author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: 'custom-author' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has number author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: 7 })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has array author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: ['custom-author'] })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
    it('should throw error if info has boolean author element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: true })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Author}`)
    })
  })
  describe('Invalid Author Name Element', function() {
    it('should throw error if info does not have author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: {} })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has undefined author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: undefined } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has null author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: null } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has empty string author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: '' } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has number author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 7 } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has array author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: ['author'] } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has boolean author name element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: true } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
  })
  describe('Invalid Author Email Element', function() {
    it('should throw error if info does not have author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author' } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has undefined author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: undefined } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has null author name and email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: null, email: null } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorName} AND ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has empty string author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: '' } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has number author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: 7 } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has array author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: ['author@custom.com'] } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has boolean author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: true } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
    it('should throw error if info has non-email string author email element', function() {
      expect(() => InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: 'notanemail' } })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.AuthorEmail}`)
    })
  })
  describe(`Valid Structure`, function() {
    it('should not throw error if info is valid', function() {
      let errorThrown
      try {
        InfoHelper.validate(pluginId, { name: 'Custom', url: 'https://google.com', description: 'custom plugin.', author: { name: 'custom author', email: 'author@custom.com' } })
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
  })
})