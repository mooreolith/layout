import assert from 'assert'
import Value from '../src/Value.mjs'

describe("Value", function(){
  let value = new Value(0)

  it("should instantiate", function(){
    assert.notEqual(value, undefined)
  })

  it('should add a value to another value', function(){
    let second = new Value(3.3)
    let result = value.add(second)

    assert.equal(result.data, 3.3)
  })

  it('should multiply two values', function(){
    let third = new Value(1.0)
    let result = value.mul(third)

    assert.equal(result.data, 0.0)
  })

  it('should raise to an exponent', function(){
    let fourth = new Value(2)
    let result = fourth.pow(2)
    
    assert.equal(result.data, 4)
  })

  it('should relu the value', function(){
    let a = new Value(-1)
    assert.deepEqual(a.relu().data, 0)

    let b = new Value(2)
    assert.deepEqual(b.relu().data, 2)
  })

  it('should divide', function(){
    let a = new Value(10)
    assert.deepEqual(a.div(5).data, 2)
  })

  it('should negate', function(){
    let c = new Value(2.56)
    assert.deepEqual(c.neg().data, -2.56)
  })

  it('should tanh', function(){
    let d = new Value(0)
    assert.deepEqual(d.tanh().data, 0)
  })

  it('should exp', function(){
    let e = new Value(0)
    assert.deepEqual(e.exp().data, 1)
  })

  it('should back propagate', function(){
    let a = new Value(1)
    let b = new Value(2)
    let c = a.add(b)
    c.backward()
    assert.notDeepEqual(c.grad, undefined)
  })
})