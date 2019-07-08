import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonTest from 'sinon-test'

import DockerHelper from '../../src/helpers/DockerHelper'
import { VALID_IMAGE } from './func-constants'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })

describe('Does Image Exist', function() {
  this.timeout(20000)
  it('should correctly return false if docker image does not exist', test(async function() {
    // await expect(DockerHelper.doesImageExist('hello-world:nonexistenttag')).to.eventually.be.false
    expect(DockerHelper.doesImageExist('hello-world:nonexistenttag')).to.be.false
  }))
  it('should correctly return false if docker image does not have explicit tag', test(async function() {
    // await expect(DockerHelper.doesImageExist('hello-world')).to.eventually.be.false
    expect(DockerHelper.doesImageExist('hello-world')).to.be.false
  }))
  it('should correctly return false if docker image has "latest" tag', test(async function() {
    // await expect(DockerHelper.doesImageExist('hello-world:latest')).to.eventually.be.false
    expect(DockerHelper.doesImageExist('hello-world:latest')).to.be.false
  }))
  it('should correctly return true if docker image exists', test(async function() {
    // await expect(DockerHelper.doesImageExist(VALID_IMAGE)).to.eventually.be.true
    expect(DockerHelper.doesImageExist(VALID_IMAGE)).to.be.true
  }))
})