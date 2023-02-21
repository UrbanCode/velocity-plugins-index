import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { exec } from 'child_process'
import moment from 'moment'
import path from 'path'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import util from 'util'

import { EXISTING_IMAGE, TEMP_PLUGIN_ID, VALID_IMAGE } from './func-constants'
import FuncHelper from './func-helper'
import PluginsHelper from '../../src/helpers/PluginsHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME, ERROR_TEXT } from '../../src/helpers/ReleasesHelper'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })
const execAsync = util.promisify(exec)

describe('Add Release Test', function() {
  describe('Happy Path', function() {
    describe('First Release', function() {
      it('should correctly add release with only required fields', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: []
        }
        try {
          await execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image}`, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
      }))
      it('should correctly add release with notes', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: ['hello world']
        }
        const command = `npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --notes=${FuncHelper.convertNotesForCommand(newRelease.notes)}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
      }))
      it('should correctly add release with explicit date', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date('12/30/1992').toISOString(),
          notes: []
        }
        const command = `npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
      }))
    })
    describe('Additional Release', function() {
      it('should correctly add release with only required fields', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: []
        }
        try {
          await execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image}`, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease, existingRelease])
      }))
      it('should correctly add release with notes', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: ['hello world']
        }
        const command = `npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --notes=${FuncHelper.convertNotesForCommand(newRelease.notes)}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease, existingRelease])
      }))
      it('should correctly add release with explicit date', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date(moment(Date.now()).add(1, 'year').valueOf()).toISOString(),
          notes: []
        }
        const command = `npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease, existingRelease])
      }))
      it('should correctly add release with supports field', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date('12/30/1992').toISOString(),
          notes: [],
          supports: '4.0.0'
        }
        const command = `npm run add-release -- --supports=${newRelease.supports} --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
        await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
      }))
    })
  })
  describe('Sad Path', function() {
    describe('Common Errors', async function() {
      await FuncHelper.testAddReleaseSadPath('add-release', 'release')
    })
    describe('Additional Release', function() {
      it('should error if semver is invalid', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const badSemver = '101'
        await expect(execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=${badSemver} --image=${TEMP_PLUGIN_ID}:1.0.1`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Semver)
      }))
      it('should error if date is invalid', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const badDate = '11/12/2019'
        await expect(execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 --image=${TEMP_PLUGIN_ID}:1.0.1 --date=${badDate}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Date)
      }))
      it('should error if notes are not array', test(async function() {
        const badNote = 'just a string'
        await expect(execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 --image=${TEMP_PLUGIN_ID}:1.0.1 --notes=${badNote}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('Invalid notes. --notes flag must be a valid JSON array')
      }))
      it('should error if adding a release that already exists', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        await expect(execAsync(`npm run add-release -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${EXISTING_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.RootUnique)
      }))
      it('should error if supports semver is invalid', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        const badSemver = '101'
        await expect(execAsync(`npm run add-release -- --supports=${badSemver} --pluginId=${TEMP_PLUGIN_ID} --semver=1.01 --image=${TEMP_PLUGIN_ID}:1.0.1`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Supports)
      }))
    })
  })
})
