import Micrograd from '../src/micrograd.mjs'
import assert from 'assert'
const Neuron = Micrograd.Neuron


describe("Neuron", function(){
  let neuron = new Neuron(4, true)

  it("should instantiate", function(){
    assert.notEqual(neuron, undefined)

    for(let i=0; i<neuron.w.length; i++){
      assert.notEqual(neuron.w[i], undefined)
    }
  })

  it("should eval", function(){
    let y = neuron.eval(2)
    assert.notEqual(y, undefined)
  })

  it('should return parameters', function(){
    let ps = neuron.parameters()
    if(undefined in ps) assert.fail()
  })
})