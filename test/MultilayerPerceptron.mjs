import assert from 'assert'
import MLP from '../src/MultilayerPerceptron.mjs'

describe("MLP", function(){
  let model = new MLP(3, [4, 4, 1])

  it('should instantiate', function(){
    assert.notEqual(model, undefined)
  })
})