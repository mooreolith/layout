import assert from 'assert'
import MLP from '../src/MultilayerPerceptron.mjs'

describe("MLP", function(){
  let model = new MLP(3, [4, 4, 1])

  it('should instantiate', function(){
    assert.notEqual(model, undefined)
  })

  it('should eval', function(){
    let r = model.eval(2)
    assert.notEqual(r.data, undefined)
    assert.notEqual(r.data, NaN)
  })

  it('should list parameters', function(){
    let p = model.parameters()

    if(undefined in p) assert.fail('undefined parameter')
    if(NaN in p) assert.fail('non number parameter')
  })
})