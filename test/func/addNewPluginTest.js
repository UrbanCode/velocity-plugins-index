import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { exec } from 'child_process'
import path from 'path'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import util from 'util'

import FuncHelper from './func-helper'
import PluginsHelper, { PLUGINS_DIR } from '../../src/helpers/PluginsHelper'
import InfoHelper, { FILE_NAME as INFO_FILE_NAME } from '../../src/helpers/InfoHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME, ERROR_TEXT } from '../../src/helpers/ReleasesHelper'
import { TEMP_PLUGIN_ID, VALID_IMAGE } from './func-constants'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })
const execAsync = util.promisify(exec)

describe('Add New Plugin Test', function() {
  const newPlugin = {
    name: 'Add New Plugin Functional Test Temporary Plugin',
    url: 'https://www.google.com',
    description: 'Hello world.',
    author: {
      name: 'custom author',
      email: 'author@custom.com'
    }
  }
  describe('Happy Path', function() {
    it('should correctly add new plugin with only required fields', test(async function() {
      const newRelease = {
        semver: '1.0.0',
        image: VALID_IMAGE,
        date: new Date().toISOString(),
        notes: []
      }
      try {
        await execAsync(`npm run add-new-plugin -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --name="${newPlugin.name}" --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email}`, {
          cwd: path.join(__dirname, '../../')
        })
      } catch (err) {
        expect(err.stdout).to.not.include('ERROR')
      }
      expect(InfoHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME))).to.not.throw
      await expect(PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME)).to.eventually.deep.equal(newPlugin)
      expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
      await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
    }))
    it('should correctly add new plugin with notes on release', test(async function() {
      const newRelease = {
        semver: '1.0.0',
        image: VALID_IMAGE,
        date: new Date().toISOString(),
        notes: ['hello world']
      }
      const command = `npm run add-new-plugin -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --notes=${FuncHelper.convertNotesForCommand(newRelease.notes)} --name="${newPlugin.name}" --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email}`
      try {
        await execAsync(command, {
          cwd: path.join(__dirname, '../../')
        })
      } catch (err) {
        expect(err.stdout).to.not.include('ERROR')
      }
      expect(InfoHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME))).to.not.throw
      await expect(PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME)).to.eventually.deep.equal(newPlugin)
      expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
      await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
    }))
    it('should correctly add new plugin with explicit date on release', test(async function() {
      const newRelease = {
        semver: '1.0.0',
        image: VALID_IMAGE,
        date: new Date('12/30/1992').toISOString(),
        notes: []
      }
      const command = `npm run add-new-plugin -- --pluginId=${TEMP_PLUGIN_ID} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date} --name="${newPlugin.name}" --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email}`
      try {
        await execAsync(command, {
          cwd: path.join(__dirname, '../../')
        })
      } catch (err) {
        expect(err.stdout).to.not.include('ERROR')
      }
      expect(InfoHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME))).to.not.throw
      await expect(PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, INFO_FILE_NAME)).to.eventually.deep.equal(newPlugin)
      expect(ReleasesHelper.validate(TEMP_PLUGIN_ID, await PluginsHelper.getJsonFromPluginFile(TEMP_PLUGIN_ID, RELEASES_FILE_NAME))).to.not.throw
      await FuncHelper.validateReleases(TEMP_PLUGIN_ID, [newRelease])
    }))
  })
  describe('Sad Path', function() {
    describe('Plugin Errors', function() {
      it('should error if name flag not provided', test(async function() {
        await expect(execAsync(`npm run add-new-plugin -- --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email} --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${VALID_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('The --name flag is required to add a new plugin')
      }))
      it('should error if url flag not provided', test(async function() {
        await expect(execAsync(`npm run add-new-plugin -- --name=${newPlugin.name} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email} --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${VALID_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('The --url flag is required to add a new plugin')
      }))
      it('should error if description flag not provided', test(async function() {
        await expect(execAsync(`npm run add-new-plugin -- --name=${newPlugin.name} --url=${newPlugin.url} --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email} --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${VALID_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('The --description flag is required to add a new plugin')
      }))
      it('should error if authorName flag not provided', test(async function() {
        await expect(execAsync(`npm run add-new-plugin -- --name=${newPlugin.name} --url=${newPlugin.url} --description="${newPlugin.description}" --authorEmail=${newPlugin.author.email} --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${VALID_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('The --authorName flag is required to add a new plugin')
      }))
      it('should error if authorEmail flag not provided', test(async function() {
        await expect(execAsync(`npm run add-new-plugin -- --name=${newPlugin.name} --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.0 --image=${VALID_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('The --authorEmail flag is required to add a new plugin')
      }))
    })
    describe('Release Common Errors', async function() {
      await FuncHelper.testAddReleaseSadPath('add-new-plugin', 'new plugin', `--name="${newPlugin.name}" --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email}`)
    })
    describe('Existing Plugin', function() {
      it('should error if plugin already exists', test(async function() {
        await FuncHelper.createExistingPlugin(TEMP_PLUGIN_ID)
        await expect(execAsync(`npm run add-new-plugin -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 --image=${VALID_IMAGE} --name="${newPlugin.name}" --url=${newPlugin.url} --description="${newPlugin.description}" --authorName="${newPlugin.author.name}" --authorEmail=${newPlugin.author.email}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(`The plugin ${TEMP_PLUGIN_ID} already exists, cannot add it as a new plugin. Use the add-release script to add a new release to an existing plugin.`)
      }))
    })
  })
})
