import Micrograd from '../src/micrograd.mjs'
import assert from 'assert'
const Value = Micrograd.Value


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
    let fifth = new Value(2)
    let result = fourth.pow(fifth)
    
    assert.equal(result.data, 4)
  })

  it('should raise to an exponent', function(){
    let fourth = new Value(2)
    let result = fourth.pow(2)
    
    assert.equal(result.data, 4)
  })
})