import Micrograd from '../src/micrograd.mjs'
import assert from 'assert'


describe("MLP", function(){
  let model = new Micrograd.MLP(3, [4, 4, 1])

  it('should instantiate', function(){
    assert.notEqual(model, undefined)
  })
})