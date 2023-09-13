import MetricsCollector from '../src/MetricsCollector.mjs'
import assert from 'assert'

describe("MetricsCollector", function(){
  let mc = new MetricsCollector(100, 100, 50, {
    eMeanDist: true
  })

  it('should be instantiatable', function(){
    assert.notEqual(mc, undefined)
  })

  let l

  it('should iterate and collect edge mean distance function', function(){
    this.timeout('1s')
    l = mc.iterate(1)
    
    assert.notEqual(l[0].eMeanDist, undefined)
  })

  let metrics

  it('should iterate many times', function(){
    metrics = mc.iterate(100)
    assert.notEqual(metrics, undefined)
  })

  it('should not return NaN from the edge mean distance function', function(){
    let nans = [NaN, NaN, NaN]
    assert.notDeepEqual(metrics, nans)
  })
})