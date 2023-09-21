import Micrograd from '../src/micrograd.mjs'
import assert from 'assert'

describe("Neuron", function(){
  let neuron = new Micrograd.Neuron(4, true)

  it("should instantiate", function(){
    assert.notEqual(neuron, undefined)
  })
})

describe("Layer", function(){
  let layer = new Micrograd.Layer(4, 4, false)

  it('should instantiate', function(){
    assert.notEqual(layer, undefined)
  })
})

describe("MLP", function(){
  let model = new Micrograd.MLP(3, [4, 4, 1])

  it('should instantiate', function(){
    assert.notEqual(model, undefined)
  })
})