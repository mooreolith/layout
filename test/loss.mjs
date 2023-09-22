import assert from 'assert'
import loss from '../src/loss.mjs'
import MLP from '../src/MultilayerPerceptron.mjs'

describe('loss function', function(){
  it('should compute loss', function(){
    let xs = [
      [2.0, 3.0, -1.0],
      [3.0, -1.0, 0.5],
      [0.5, 1.0, 1.0],
      [1.0, 1.0, -1.0]
    ]
    let ys = [1.0, -1.0, -1.0, 1.0]

    let model = new MLP(3, [4, 4, 1])
    let [total_loss, acc] = loss(model, xs, ys)

    assert.notEqual(total_loss, undefined)
    assert.notEqual(total_loss.data, NaN)

    assert.notEqual(acc, undefined)
    assert.notEqual(acc, NaN)
  })
})