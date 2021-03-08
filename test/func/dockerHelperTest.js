import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonTest from 'sinon-test'

import DockerHelper from '../../src/helpers/DockerHelper'
// import { VALID_IMAGE } from './func-constants'

chai.use(chaiAsPromised)
const test = sinonTest(sinon, { useFakeTimers: false })

describe('Does Image Exist', function() {
  it('should correctly return false if docker image does not exist', test(async function() {
    expect(DockerHelper.doesImageExist('hillo-wirld:linux')).to.be.false
  }))
  it('should correctly return false if docker image has tag that does not exist', test(async function() {
    expect(DockerHelper.doesImageExist('hello-world:nonexistenttag')).to.be.false
  }))
  // it('should correctly return true if docker image exists', test(async function() {
  //   expect(DockerHelper.doesImageExist(VALID_IMAGE)).to.be.true
  // }))
})