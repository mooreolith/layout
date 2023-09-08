import Layout from './Layout.mjs'
import util from './util.mjs'

class MetricsCollector {
  constructor(
    numVertices = 100, 
    numEdges = 100, 
    sampleSize = 50,
    observe = {
      vMeanPos: false,
      vMinPos: false,
      vMaxPos: false,
      vMeanVel: false,
      eMeanDist: false,
      eMeanAge: false
    }){
    this.sampleSize = sampleSize
    this.observe = observe;
    this.layout = new Layout()

    for(let i=0; i<numVertices; i++){
      let id = this.layout.addVertex()
      this.layout.vertices.get(id).age = Date.now()
    }

    for(let i=0; i<numEdges; i++){
      let id = this.layout.randomEdge()
      let e = this.layout.edges.get(id)
      e.createdAt = Date.now()
    }
  }

  iterate(steps=1){
    let results = []
    for(let i=0; i<steps; i++){
      let result = {}

      for(let option of Object.keys(this.layout.constants)){
        result[option] = this.layout.constants[option]
      }

      let vsSample = MetricsCollector.sample(this.layout.vertices.values(), this.sampleSize)
      let esSample = MetricsCollector.sample(this.layout.edges.values(), this.sampleSize)

      console.log('vss, ess: ', vsSample, esSample)

      for(let item of Object.keys(this.observe)){
        console.log(item)

        if(this.observe[item]){
          if(item.startsWith('v')){
            result[item] = MetricsCollector[item](vsSample)
          }

          if(item.startsWith('e')){
            result[item] = MetricsCollector[item](esSample)
          }
        }
      }

      let now = Date.now()
      for(let e of this.layout.edges){
        let age = now - e.createdAt
        result.age = age
      }

      results.push(result)
    }
  }

  /*
    Collect a sample from a larger population.
    Returns a set.
  */
  static sample(all, sampleSize){
    

    let arr = [...all]
    let r = new Set()

    var chooseRandomSpecimen = function(sample){
      let candidate
      do{
        candidate = all[Math.round(Math.random() * sampleSize)]
      }while(candidate in r)
      return candidate
    }

    while(r.size < sampleSize){
      r.add(chooseRandomSpecimen())
    }

    return r
  }

  /*
    Collect a sample's mean average position.
    Returns a vector.
  */
  static vMeanPos(sample){
    let sum = [0,0,0]
    for(let v of sample){
      sum = util.add(sum, v.position)
    }
    let result = util.divideScalar(sum, sample.size)
    return result
  }

  /*
    Collect the maximum position by norm.
    Returns a scalar.
  */
  static vMaxPos(sample){
    let max = -Infinity
    for(let v of sample){
      let n = util.norm(v.position)
      if(n > max){
        max = n
      }
    }

    return max
  }

  /*
    Collect a sample's minimum position. 
    Returns a scalar.
  */
  static vMinPos(sample){
    let min = Infinity
    for(let v of sample){
      let n = util.norm(v.position)
      if(n < min){
        min = n
      }
    }

    return min
  }

  /*
    Collect a sample's minimum velocity
    Returns a scalar
  */
  static vMeanVel(sample){
    let sum = [0, 0, 0]
    for(let v of sample){
      sum = util.add(sum, v.velocity)
    }
  
    let result = util.divideScalar(sum, sample.size)
    return result
  }

  /*
    Collect a sample's mean distance of connected nodes
    Returns a scalar
  */
  static eMeanDist(sample){
    console.log(`sample: ${Array.from(sample)}`)
    let sum = [0, 0, 0]
    for(let e of sample){
      sum = util.add(sum, util.distance(e.source.position, e.target.position))
    }

    return util.divideScalar(sum, sample.size)
  }

  static eMeanAge(sample){
    let sum = 0.0
    for(let e of sample){
      sum += Date.now() - e.createdAt
    }
    return sum / sample.size
  }
}

export default MetricsCollector