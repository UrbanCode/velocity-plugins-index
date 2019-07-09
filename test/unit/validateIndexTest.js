import { expect } from 'chai'
import sinon from 'sinon'

import DockerHelper from '../../src/helpers/DockerHelper'
import IndexHelper, { FILE_NAME as INFO_FILE_NAME, ERROR_TEXT as INDEX_ERROR_TEXT } from '../../src/helpers/IndexHelper'
import { ERROR_TEXT as INFO_ERROR_TEXT } from '../../src/helpers/InfoHelper'
import { ERROR_TEXT as RELEASES_ERROR_TEXT } from '../../src/helpers/ReleasesHelper'

describe('Validate index structure', function() {
  const validPlugin = {
    name: 'Custom Plugin',
    url: 'https://google.com',
    description: 'custom plugin',
    author: {
      name: 'writer',
      email: 'writer@gmail.com'
    },
    current: {
      semver: '1.0.0',
      date: new Date().toISOString(),
      image: 'custom-image:1.0.0',
      notes: []
    }
  }
  let imageStub
  this.beforeEach(function() {
    imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
  })
  this.afterEach(function() {
    imageStub.restore()
  })
  describe('Invalid Root', function() {
    it('should throw error if index is undefined', function() {
      expect(() => IndexHelper.validate(undefined)).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is null', function() {
      expect(() => IndexHelper.validate(null)).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is empty string', function() {
      expect(() => IndexHelper.validate('')).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is string', function() {
      expect(() => IndexHelper.validate('plugins')).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is number', function() {
      expect(() => IndexHelper.validate(10)).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is array', function() {
      expect(() => IndexHelper.validate([validPlugin])).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if index is boolean', function() {
      expect(() => IndexHelper.validate(true)).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
  })
  describe('Invalid Root Elements', function() {
    it('should throw error if root element is undefined', function() {
      expect(() => IndexHelper.validate(JSON.stringify(`{undefined: ${JSON.stringify(validPlugin)}}`))).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if root element is null', function() {
      expect(() => IndexHelper.validate(JSON.stringify(`{null: ${JSON.stringify(validPlugin)}}`))).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if root element is empty string', function() {
      expect(() => IndexHelper.validate({'': validPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if root element is number', function() {
      expect(() => IndexHelper.validate(JSON.stringify(`{7: ${JSON.stringify(validPlugin)}}`))).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if root element is array', function() {
      expect(() => IndexHelper.validate(JSON.stringify(`{['pluginId']: ${JSON.stringify(validPlugin)}}`))).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
    it('should throw error if root element is boolean', function() {
      expect(() => IndexHelper.validate(JSON.stringify(`{true: ${JSON.stringify(validPlugin)}}`))).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Root}`)
    })
  })
  describe('Invalid Plugin', function() {
    it('should throw error if plugin object is undefined', function() {
      expect(() => IndexHelper.validate({'custom-plugin': undefined})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is null', function() {
      expect(() => IndexHelper.validate({'custom-plugin': null})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is empty string', function() {
      expect(() => IndexHelper.validate({'custom-plugin': ''})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is string', function() {
      expect(() => IndexHelper.validate({'custom-plugin': 'i am a plugin'})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is number', function() {
      expect(() => IndexHelper.validate({'custom-plugin': 6})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is array', function() {
      expect(() => IndexHelper.validate({'custom-plugin': [validPlugin]})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
    it('should throw error if plugin object is boolean', function() {
      expect(() => IndexHelper.validate({'custom-plugin': true})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Plugin}`)
    })
  })
  describe('Invalid Plugin Info', function() {
    describe('Name', function() {
      it('should throw error if missing name', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.name
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = ['plugin name']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
      it('should throw error if name is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.name = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Name}`)
      })
    })
    describe('Url', function() {
      it('should throw error if missing url', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.url
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = ['plugin url']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
      it('should throw error if url is not a valid url', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.url = 'notaurl'
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Url}`)
      })
    })
    describe('Description', function() {
      it('should throw error if missing description', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.description
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = ['plugin description']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
      it('should throw error if description is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.description = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Description}`)
      })
    })
    describe('Author', function() {
      it('should throw error if missing author', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.author
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = ['plugin author']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.Author}`)
      })
      it('should throw error if author is empty object', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author = {}
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName} AND ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
    })
    describe('Author Name', function() {
      it('should throw error if missing author name', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.author.name
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = ['author name']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
      it('should throw error if author name is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.name = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorName}`)
      })
    })
    describe('Author Email', function() {
      it('should throw error if missing author email', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.author.email
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = 9
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = ['author email']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
      it('should throw error if author email is not a valid email', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.author.email = 'notanemail'
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INFO_ERROR_TEXT.AuthorEmail}`)
      })
    })
  })
  describe('Invalid Current Release', function() {
    describe('Root', function() {
      it('should throw error if missing current key', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.current
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = 'current release'
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = 7
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = [validPlugin.current]
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
      it('should throw error if current is boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${INDEX_ERROR_TEXT.Current}`)
      })
    })
    describe('Semver', function() {
      it('should throw error if missing semver', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.current.semver
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = 7
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = ['1.0.0']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
      it('should throw error if semver not a valid semver', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.semver = '1.0.0.0'
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Semver}`)
      })
    })
    describe('Date', function() {
      it('should throw error if missing date', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.current.date
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = 7
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = ['1.0.0']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
      it('should throw error if date not a valid ISO date', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.date = Date.now()
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Date}`)
      })
    })
    describe('Image', function() {
      it('should throw error if missing image', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        delete badInfoPlugin.current.image
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image undefined', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = undefined
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image null', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = null
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image empty string', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = ''
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image number', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = 7
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image array', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = ['custom-image']
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
      it('should throw error if image boolean', function() {
        let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
        badInfoPlugin.current.image = true
        expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.Image}`)
      })
    })
    describe('Notes', function() {
      describe('Root', function() {
        it('should throw error if missing notes', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          delete badInfoPlugin.current.notes
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes undefined', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = undefined
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes null', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = null
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes empty string', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = ''
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes string', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = 'i am a note'
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes number', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = 7
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if notes boolean', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = true
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
      })
      describe('Elements', function() {
        it('should throw error if note undefined', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = [undefined]
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesArray}`)
        })
        it('should throw error if note null', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = [null]
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesObject}`)
        })
        it('should throw error if note empty string', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = ['']
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesObject}`)
        })
        it('should throw error if note number', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = [7]
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesObject}`)
        })
        it('should throw error if note array', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = [['custom-note']]
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesObject}`)
        })
        it('should throw error if note boolean', function() {
          let badInfoPlugin = JSON.parse(JSON.stringify(validPlugin))
          badInfoPlugin.current.notes = [true]
          expect(() => IndexHelper.validate({'custom-plugin': badInfoPlugin})).throws(Error).with.property('message', `Invalid JSON in "${INFO_FILE_NAME}": ${RELEASES_ERROR_TEXT.NotesObject}`)
        })
      })
    })
  })
  describe(`Valid Structure`, function() {
    it('should not throw error if index is valid', function() {
      let errorThrown
      try {
        IndexHelper.validate({ 'custom-plugin': validPlugin})
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
    it('should not throw error if index is valid with multiple plugins', function() {
      let errorThrown
      try {
        IndexHelper.validate({ 'custom-plugin': validPlugin, 'custom-plugin-better': validPlugin})
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
  })
})