import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { exec } from 'child_process'
import fs from 'fs-extra'
import moment from 'moment'
import path from 'path'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import util from 'util'

import { EXISTING_IMAGE, TEMP_PLUGIN_ID } from './func-constants'
import PluginsHelper, { PLUGINS_DIR } from '../../src/helpers/PluginsHelper'
import { FILE_NAME as INFO_FILE_NAME } from '../../src/helpers/InfoHelper'
import { FILE_NAME as RELEASES_FILE_NAME, ERROR_TEXT } from '../../src/helpers/ReleasesHelper'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })
const execAsync = util.promisify(exec)

export default class FuncHelper {
  static convertNotesForCommand(notes) {
    return JSON.stringify(notes.map((note) => { return `"${note}"` }))
  }

  static async createExistingPlugin(pluginId, name) {
    await fs.ensureDir(path.join(PLUGINS_DIR, pluginId))
    await fs.writeFile(path.join(PLUGINS_DIR, pluginId, INFO_FILE_NAME), JSON.stringify({
      name: name,
      url: 'https://google.com/',
      description: `${name} Description`,
      author: {
          name: 'Functional Tests',
          email: 'test-func@test.com'
      }
    }, null, 4))
    await fs.writeFile(path.join(PLUGINS_DIR, pluginId, RELEASES_FILE_NAME), JSON.stringify([{
      semver: '1.0.0',
      image: EXISTING_IMAGE,
      date: new Date().toISOString(),
      notes: []
    }], null, 4))
  }

  static async validateReleases(pluginId, expectedReleases) {
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

  static async testAddReleaseSadPath(script, errorText, extraCliArgs) {
    describe('Required Flags', function() {
      it('should error if pluginId flag not provided', test(async function() {
        const command = `npm run ${script} -- --semver=1.0.1 --image=${TEMP_PLUGIN_ID}:1.0.1 ${extraCliArgs}`
        await expect(execAsync(command, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(`The --pluginId flag is required to add a ${errorText}`)
      }))
      it('should error if semver flag not provided', test(async function() {
        await expect(execAsync(`npm run ${script} -- --pluginId=${TEMP_PLUGIN_ID} --image=${TEMP_PLUGIN_ID}:1.0.1 ${extraCliArgs}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(`The --semver flag is required to add a ${errorText}`)
      }))
      it('should error if semver flag not provided', test(async function() {
        await expect(execAsync(`npm run ${script} -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 ${extraCliArgs}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(`The --image flag is required to add a ${errorText}`)
      }))
    })
    describe('First Release', function() {
      it('should error if semver is invalid', test(async function() {
        const badSemver = '101'
        await expect(execAsync(`npm run ${script} -- --pluginId=${TEMP_PLUGIN_ID} --semver=${badSemver} --image=${TEMP_PLUGIN_ID}:1.0.1 ${extraCliArgs}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Semver)
      }))
      it('should error if date is invalid', test(async function() {
        const badDate = '11/12/2019'
        await expect(execAsync(`npm run ${script} -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 --image=${TEMP_PLUGIN_ID}:1.0.1 --date=${badDate} ${extraCliArgs}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain(ERROR_TEXT.Date)
      }))
      it('should error if notes are not array', test(async function() {
        const badNote = 'just a string'
        await expect(execAsync(`npm run ${script} -- --pluginId=${TEMP_PLUGIN_ID} --semver=1.0.1 --image=${TEMP_PLUGIN_ID}:1.0.1 --notes=${badNote} ${extraCliArgs}`, {
          cwd: path.join(__dirname, '../../')
        })).to.eventually.be.rejected.and.have.property('stdout').contain('Invalid notes. --notes flag must be a valid JSON array')
      }))
    })
  }
}