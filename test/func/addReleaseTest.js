import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { exec } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import util from 'util'

import PluginsHelper, { PLUGINS_DIR } from '../../src/helpers/PluginsHelper'
import { FILE_NAME as INFO_FILE_NAME } from '../../src/helpers/InfoHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME } from '../../src/helpers/ReleasesHelper'

chai.use(chaiAsPromised)
const test = sinonTest(sinon)
const execAsync = util.promisify(exec)

describe('Add Release Test', function() {
  const tempPlugin = 'add-release-func-test-temporary-plugin'
  this.timeout(20000)
  this.beforeEach(async function() {
    await fs.remove(path.join(PLUGINS_DIR, tempPlugin))
  })
  this.afterEach(async function() {
    await fs.remove(path.join(PLUGINS_DIR, tempPlugin))
  })
  describe('Happy Path', function() {
    it('should add directory, releases file and new release if plugin doesn\'t exist', test(async function() {
      try {
        await execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.0 --image=${tempPlugin}:1.0.0`, {
          cwd: path.join(__dirname, '../../')
        })
      } catch (err) {
        expect(err.stdout).to.not.include('ERROR')
      }
      expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
    }))
    it('should add new release to existing plugin', test(async function() {
      await fs.ensureDir(path.join(PLUGINS_DIR, tempPlugin))
      await fs.writeFile(path.join(PLUGINS_DIR, tempPlugin, INFO_FILE_NAME), JSON.stringify({
        name: 'Add Release Functional Test Temporary Plugin',
        url: 'https://google.com/',
        description: 'Temporary plugin for functional tests',
        author: {
            name: 'Functional Tests',
            email: 'test-func@test.com'
        }
      }))
      await fs.writeFile(path.join(PLUGINS_DIR, tempPlugin, RELEASES_FILE_NAME), JSON.stringify([{
        semver: '1.0.0',
        image: `${tempPlugin}:1.0.0`,
        date: new Date().toISOString()
      }]))
      try {
        await execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1 --image=${tempPlugin}:1.0.1`, {
          cwd: path.join(__dirname, '../../')
        })
      } catch (err) {
        expect(err.stdout).to.not.include('ERROR')
      }
      expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
    }))
  })
  describe('Sad Path', function() {
    it('should error if pluginId flag not provided', test(async function() {
      await expect(execAsync(`npm run add-release -- --semver=1.0.1 --image=${tempPlugin}:1.0.1`, {
        cwd: path.join(__dirname, '../../')
      })).to.eventually.be.rejected.and.have.property('stdout').contain('The --pluginId, -p flag is required to add a release')
    }))
    it('should error if semver flag not provided', test(async function() {
      await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --image=${tempPlugin}:1.0.1`, {
        cwd: path.join(__dirname, '../../')
      })).to.eventually.be.rejected.and.have.property('stdout').contain('The --semver, -s flag is required to add a release')
    }))
    it('should error if semver flag not provided', test(async function() {
      await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1`, {
        cwd: path.join(__dirname, '../../')
      })).to.eventually.be.rejected.and.have.property('stdout').contain('The --image, -i flag is required to add a release')
    }))
    it('should error if adding a release that already exists', test(async function() {
      await fs.ensureDir(path.join(PLUGINS_DIR, tempPlugin))
      await fs.writeFile(path.join(PLUGINS_DIR, tempPlugin, INFO_FILE_NAME), JSON.stringify({
        name: 'Add Release Functional Test Temporary Plugin',
        url: 'https://google.com/',
        description: 'Temporary plugin for functional tests',
        author: {
            name: 'Functional Tests',
            email: 'test-func@test.com'
        }
      }))
      await fs.writeFile(path.join(PLUGINS_DIR, tempPlugin, RELEASES_FILE_NAME), JSON.stringify([{
        semver: '1.0.0',
        image: `${tempPlugin}:1.0.0`,
        date: new Date().toISOString()
      }]))
      await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.0 --image=${tempPlugin}:1.0.0`, {
        cwd: path.join(__dirname, '../../')
      })).to.eventually.be.rejected.and.have.property('stdout').contain(`plugin "${tempPlugin}" contains duplicate versions. Releases must have unique versions.`)
    }))
  })
})