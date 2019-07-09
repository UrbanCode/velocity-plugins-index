import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { exec } from 'child_process'
import fs from 'fs-extra'
import moment from 'moment'
import path from 'path'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import util from 'util'

import { EXISTING_IMAGE, VALID_IMAGE } from './func-constants'
import PluginsHelper, { PLUGINS_DIR } from '../../src/helpers/PluginsHelper'
import { FILE_NAME as INFO_FILE_NAME } from '../../src/helpers/InfoHelper'
import ReleasesHelper, { FILE_NAME as RELEASES_FILE_NAME, ERROR_TEXT } from '../../src/helpers/ReleasesHelper'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })
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
    describe('New Plugin', function() {
      it('should correctly add release with only required fields', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: []
        }
        try {
          await execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image}`, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease])
      }))
      it('should correctly add release with notes', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: ['hello world']
        }
        const command = `npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image} --notes=${convertNotesForCommand(newRelease.notes)}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease])
      }))
      it('should correctly add release with explicit date', test(async function() {
        const newRelease = {
          semver: '1.0.0',
          image: VALID_IMAGE,
          date: new Date('12/30/1992').toISOString(),
          notes: []
        }
        const command = `npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease])
      }))
    })
    describe('Existing Plugin', function() {
      it('should correctly add release with only required fields', test(async function() {
        await createExistingPlugin(tempPlugin)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: []
        }
        try {
          await execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image}`, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease, existingRelease])
      }))
      it('should correctly add release with notes', test(async function() {
        await createExistingPlugin(tempPlugin)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date().toISOString(),
          notes: ['hello world']
        }
        const command = `npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image} --notes=${convertNotesForCommand(newRelease.notes)}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease, existingRelease])
      }))
      it('should correctly add release with explicit date', test(async function() {
        await createExistingPlugin(tempPlugin)
        const existingRelease = PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME)[0]
        const newRelease = {
          semver: '1.0.1',
          image: VALID_IMAGE,
          date: new Date(moment(Date.now()).add(1, 'year').valueOf()).toISOString(),
          notes: []
        }
        const command = `npm run add-release -- --pluginId=${tempPlugin} --semver=${newRelease.semver} --image=${newRelease.image} --date=${newRelease.date}`
        try {
          await execAsync(command, {
            cwd: path.join(__dirname, '../../')
          })
        } catch (err) {
          expect(err.stdout).to.not.include('ERROR')
        }
        expect(ReleasesHelper.validate(tempPlugin, await PluginsHelper.getJsonFromPluginFile(tempPlugin, RELEASES_FILE_NAME))).to.not.throw
        await validateReleases(tempPlugin, [newRelease, existingRelease])
      }))
    })
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
    describe('New Plugin', function() {
      it('should error if semver is invalid', test(async function() {
        const badSemver = '101'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=${badSemver} --image=${tempPlugin}:1.0.1`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Semver)
      }))
      it('should error if date is invalid', test(async function() {
        const badDate = '11/12/2019'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1 --image=${tempPlugin}:1.0.1 --date=${badDate}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Date)
      }))
      it('should error if notes are not array', test(async function() {
        const badNote = 'just a string'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1 --image=${tempPlugin}:1.0.1 --notes=${badNote}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('Invalid notes. --notes flag must be a valid JSON array')
      }))
    })
    describe('Existing Plugin', function() {
      it('should error if semver is invalid', test(async function() {
        await createExistingPlugin(tempPlugin)
        const badSemver = '101'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=${badSemver} --image=${tempPlugin}:1.0.1`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Semver)
      }))
      it('should error if date is invalid', test(async function() {
        await createExistingPlugin(tempPlugin)
        const badDate = '11/12/2019'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1 --image=${tempPlugin}:1.0.1 --date=${badDate}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Date)
      }))
      it('should error if notes are not array', test(async function() {
        const badNote = 'just a string'
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.1 --image=${tempPlugin}:1.0.1 --notes=${badNote}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('Invalid notes. --notes flag must be a valid JSON array')
      }))
      it('should error if adding a release that already exists', test(async function() {
        await createExistingPlugin(tempPlugin)
        await expect(execAsync(`npm run add-release -- --pluginId=${tempPlugin} --semver=1.0.0 --image=${EXISTING_IMAGE}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.RootUnique)
      }))
    })
  })
})

function convertNotesForCommand(notes) {
  return JSON.stringify(notes.map((note) => { return `"${note}"` }))
}

async function createExistingPlugin(pluginId) {
  await fs.ensureDir(path.join(PLUGINS_DIR, pluginId))
  await fs.writeFile(path.join(PLUGINS_DIR, pluginId, INFO_FILE_NAME), JSON.stringify({
    name: 'Add Release Functional Test Temporary Plugin',
    url: 'https://google.com/',
    description: 'Temporary plugin for functional tests',
    author: {
        name: 'Functional Tests',
        email: 'test-func@test.com'
    }
  }))
  await fs.writeFile(path.join(PLUGINS_DIR, pluginId, RELEASES_FILE_NAME), JSON.stringify([{
    semver: '1.0.0',
    image: EXISTING_IMAGE,
    date: new Date().toISOString(),
    notes: []
  }]))
}

async function validateReleases(pluginId, expectedReleases) {
  const releases = await PluginsHelper.getJsonFromPluginFile(pluginId, RELEASES_FILE_NAME)
  for (let i = 0; i < expectedReleases.length; i++) {
    let expected = expectedReleases[i]
    let release = releases[i]
    for (var property in expected) {
      if (expected.hasOwnProperty(property)) {
        if (property === 'date') {
          expect(moment(release.date).diff(expected.date)).to.be.lessThan(10000, `Dates not equal. Expected date of ${expected.date} is not within 10 seconds of actual date ${release.date}`)
        } else {
          expect(release[property]).to.deep.equal(expected[property])
        }
      }
    }
  }
  expect(releases.length).to.equal(expectedReleases.length)
}