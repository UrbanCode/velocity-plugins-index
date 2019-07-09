import { expect } from 'chai'
import sinon from 'sinon'

import DockerHelper from '../../src/helpers/DockerHelper'
import ReleasesHelper, { ERROR_TEXT, FILE_NAME } from '../../src/helpers/ReleasesHelper'

describe('Validate Releases Structure', function() {
  const pluginId = 'custom-plugin'
  let imageStub
  this.beforeEach(function() {
    imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
  })
  this.afterEach(function() {
    imageStub.restore()
  })
  describe('Invalid Root Array', function() {
    it('should throw error if releases is undefined', function() {
      expect(() => ReleasesHelper.validate(pluginId, undefined)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is null', function() {
      expect(() => ReleasesHelper.validate(pluginId, null)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is an empty string', function() {
      expect(() => ReleasesHelper.validate(pluginId, '')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is a string', function() {
      expect(() => ReleasesHelper.validate(pluginId, 'releases')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is a number', function() {
      expect(() => ReleasesHelper.validate(pluginId, 7)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is an object', function() {
      expect(() => ReleasesHelper.validate(pluginId, { semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'] })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
    it('should throw error if releases is a boolean', function() {
      expect(() => ReleasesHelper.validate(pluginId, true)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
    })
  })
  describe('Invalid Release Object', function() {
    describe('Releases Array', function() {
      it('should throw error if empty array', function() {
        expect(() => ReleasesHelper.validate(pluginId, [])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if empty array', function() {
        expect(() => ReleasesHelper.validate(pluginId, [])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object undefined', function() {
        expect(() => ReleasesHelper.validate(pluginId, [undefined])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object null', function() {
        expect(() => ReleasesHelper.validate(pluginId, [null])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object is an empty string', function() {
        expect(() => ReleasesHelper.validate(pluginId, [''])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object is a string', function() {
        expect(() => ReleasesHelper.validate(pluginId, ['release'])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object is a number', function() {
        expect(() => ReleasesHelper.validate(pluginId, [7])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object is an array', function() {
        expect(() => ReleasesHelper.validate(pluginId, [[{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'] }]])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object is a boolean', function() {
        expect(() => ReleasesHelper.validate(pluginId, [true])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
    })
    describe('Release Object', function() {
      it('should throw error if release object undefined', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, undefined)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object null', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, null)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object is an empty string', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, '')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object is a string', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, 'release')).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object is a number', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, 7)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object is an array', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'] }])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
      it('should throw error if release object is a boolean', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, true)).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
    })
  })
  describe('Invalid Semver Element', function() {
    describe('Releases Array', function() {
      it('should throw error if release object does not have semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has undefined semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: undefined}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has null semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: null}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has empty string semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: ''}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has number semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: 101}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has float semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: 1.0}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has array semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: ['1.0.0']}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has boolean semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: true}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has invalid semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0.0'}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if releases have duplicate semvers', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]}, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom2', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootUnique}`)
      })
    })
    describe('Release Object', function() {
      it('should throw error if release object does not have semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has undefined semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: undefined})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has null semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: null})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has empty string semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: ''})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has number semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: 101})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has float semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: 1.0})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has array semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: ['1.0.0']})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has boolean semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: true})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has invalid semver element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0.0'})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Semver} AND ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
    })
  })
  describe('Invalid Date Element', function() {
    describe('Releases Array', function() {
      it('should throw error if release object does not have date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0'}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has undefined date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: undefined}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has null date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: null}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has empty date semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: ''}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has number date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: 101}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has float date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: 1.0}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has array date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: ['1.0.0']}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has boolean date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: true}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has invalid date element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: Date.now()}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if releases have duplicate dates', function() {
        const date = new Date().toISOString()
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date, image: 'custom', notes:[]}, {semver: '1.0.1', date, image: 'custom2', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootUnique}`)
      })
    })
    describe('Releases Object', function() {
      it('should throw error if release object does not have date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, { semver: '1.0.0' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has undefined date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: undefined})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has null date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: null})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has empty string date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: ''})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has number date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: 101})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has float date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: 1.0})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has array date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: ['1.0.0']})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has boolean date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: true})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has invalid date element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: Date.now()})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Date} AND ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
    })
  })
  describe('Invalid Image Element', function() {
    describe('Releases Array', function() {
      it('should throw error if release object does not have image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString()}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has undefined image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: undefined}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has null image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: null}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has empty image semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: ''}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has number image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 101}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has float image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 1.0}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has array image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: ['1.0.0']}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has boolean image element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: true}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if releases have duplicate images', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]}, {semver: '1.0.1', date: new Date(Date.now() + 1000).toISOString(), image: 'custom', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootUnique}`)
      })
      it('should throw error if releases has docker image that doesn\'t exist in DockerHub', function() {
        imageStub.restore()
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(false)
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if releases has docker image without explicit tag', function() {
        imageStub.restore()
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.RootArray}`)
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
      })
      it('should throw error if releases has docker image with latest tag', function() {
        imageStub.restore()
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom:latest', notes:[]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.RootArray}`)
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
      })
    })
    describe('Releases Object', function() {
      it('should throw error if release object does not have image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, { semver: '1.0.0', date: new Date().toISOString() })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has undefined image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: undefined})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has null image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: null})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has empty string image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: ''})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has number image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 101})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has float image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 1.0})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has array image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: ['1.0.0']})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has boolean image element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: true})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image} AND ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if releases has docker image that doesn\'t exist in DockerHub', function() {
        imageStub.restore()
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(false)
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image}`)
      })
      it('should throw error if releases has docker image without explicit tag', function() {
        imageStub.restore()
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes:[]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image}`)
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
      })
      it('should throw error if releases has docker image with latest tag', function() {
        imageStub.restore()
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom:latest', notes:[]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.Image}`)
        imageStub = sinon.stub(DockerHelper, 'doesImageExist').returns(true)
      })
    })
  })
  describe('Invalid Notes Element', function() {
    describe('Releases Array', function() {
      it('should throw error if release object does not have notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: undefined}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has undefined notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: undefined}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has null notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: null}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has empty notes semver element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: ''}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has number notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 101}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has float notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 1.0}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has string notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 'feature'}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has boolean notes element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: true}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
    })
    describe('Releases Object', function() {
      it('should throw error if release object does not have notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, { semver: '1.0.0', date: new Date().toISOString(), image: 'custom' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has undefined notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: undefined})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has null notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: null})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has empty string notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: ''})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has number notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 101})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has float notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 1.0})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has string notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: 'feature'})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has boolean notes element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: true})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
    })
  })
  describe('Invalid Notes Contents', function() {
    describe('Releases Array', function() {
      it('should throw error if release object has undefined notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [undefined]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has null notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [null]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has empty string notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: ['']}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has number notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [9]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has float notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [1.0]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has array notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [['feature']]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
      it('should throw error if release object has boolean notes contents', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [true]}])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject} AND ${ERROR_TEXT.RootArray}`)
      })
    })
    describe('Releases Object', function() {
      it('should throw error if release object has undefined notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [undefined]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesArray}`)
      })
      it('should throw error if release object has null notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [null]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
      it('should throw error if release object has empty string notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: ['']})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
      it('should throw error if release object has number notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [9]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
      it('should throw error if release object has float notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [1.0]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
      it('should throw error if release object has array notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [['feature']]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
      it('should throw error if release object has boolean notes contents', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, {semver: '1.0.0', date: new Date().toISOString(), image: 'custom', notes: [true]})).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.NotesObject}`)
      })
    })
  })
  describe('Invalid extra elements', function() {
    describe('Releases Array', function() {
      it('should throw error if release object has extra element', function() {
        expect(() => ReleasesHelper.validate(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'], extraprop: 'whoami' }])).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject} AND ${ERROR_TEXT.RootArray}`)
      })
    })
    describe('Releases Object', function() {
      it('should throw error if release object has extra element', function() {
        expect(() => ReleasesHelper.validateSingleRelease(pluginId, { semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'], extraprop: 'whoami' })).throws(Error).with.property('message', `Invalid JSON in "${FILE_NAME}" for plugin "${pluginId}": ${ERROR_TEXT.RootObject}`)
      })
    })
  })
  describe(`Valid Structure`, function() {
    it('should not throw error if releases is valid with single release', function() {
      let errorThrown
      try {
        ReleasesHelper.validate(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'] }])
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
    it('should not throw error if releases is valid with two releases', function() {
      let errorThrown
      try {
        ReleasesHelper.validate(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['initial release'] }, { semver: '1.0.1', date: new Date(Date.now() + 1000).toISOString(), image: `${pluginId}:1.0.1`, notes: ['second release'] }])
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
    it('should not throw error if releases is valid with empty notes', function() {
      let errorThrown
      try {
        ReleasesHelper.validate(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: [] }])
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
    it('should not throw error if releases is valid with multiple notes', function() {
      let errorThrown
      try {
        ReleasesHelper.validate(pluginId, [{ semver: '1.0.0', date: new Date().toISOString(), image: `${pluginId}:1.0.0`, notes: ['new feature', 'bug fix'] }])
      } catch (err) {
        errorThrown = err
      }
      expect(errorThrown).to.be.undefined
    })
  })
})