import assert from 'assert'
import loss from '../src/loss.mjs'
import MLP from '../src/MultilayerPerceptron.mjs'

describe('loss function', function(){
  let xs = [
    [2.0, 3.0, -1.0],
    [3.0, -1.0, 0.5],
    [0.5, 1.0, 1.0],
    [1.0, 1.0, -1.0]
  ]
  let ys = [1.0, -1.0, -1.0, 1.0]

  let model = new MLP(3, [4, 4, 1])
  let [total_loss, acc] = loss(model, xs, ys)

  it('should compute total_loss (not return undefined or NaN)', function(){
    assert.notEqual(total_loss, undefined)
    assert.notEqual(total_loss.data, NaN)
  })  

  it('should compute accuracy (not return NaN nor undefined', function(){ 
    assert.notEqual(acc, undefined)
    assert.notEqual(acc.data, NaN)
  })
})