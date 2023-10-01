import assert from 'assert'
import Layer from '../src/micrograd.js/Layer.mjs'


describe("Layer", function(){
  let layer = new Layer(4, 4, false)

  it('should instantiate', function(){
    assert.notEqual(layer, undefined)

    if(undefined in layer.neurons){
      assert.fail('undefined layer')
    }
  })

  it('should eval', function(){
    let y = layer.eval(1)
    assert.notEqual(y, undefined)
  })
})