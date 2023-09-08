import Layout from './Layout.mjs'

class MetricsCollector {
  constructor(
    numVertices = 100, 
    numEdges = 100, 
    sampleSize = 50,
    observe = {
      meanPos: false,
      minPos: false,
      maxPos: false,
      meanVel: false,
      meanDist: false,
      meanAge: false
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
      this.layout.edges.get(id).age = Date.now()
    }
  }

  iterate(steps=1){
    let results = []
    for(let i=0; i<steps; i++){
      let result = {}

      for(let option of Object.keys(this.layout.constants)){
        result[option] = this.layout.constants[option]
      }

      let vsSample = MetricsCollector.sample(this.vertices, this.sampleSize)

      for(let item of Object.keys(observe)){
        if(observe[item]){
          result[item] = (new Function(samples, `return Layout.${item}(samples)`))()
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
    let s = new Set()
    do{
      let o = all.get(Math.floor(Math.random() * all.size))
      if(o !== undefined) s.add(o)
    }while(s.size < sampleSize)

    return s
  }

  /*
    Collect a sample's mean average position.
    Returns a vector.
  */
  static meanPos(sample){
    let sum = [0,0,0]
    for(let v of sample.values()){
      sum = add(sum, v.position)
    }
    let result = divideScalar(sum, sample.size)
    return result
  }

  /*
    Collect the maximum position by norm.
    Returns a scalar.
  */
  static maxPos(sample){
    let max = -Infinity
    for(let v of sample.values()){
      let n = norm(v.position)
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
  static minPos(sample){
    let min = Infinity
    for(let v of sample.values()){
      let n = norm(v.position)
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
  static meanVel(sample){
    let sum = [0, 0, 0]
    for(let v of sample.values()){
      sum = add(sum, v.velocity)
    }
  
    let result = divideScalar(sum, sample.size)
    return result
  }

  /*
    Collect a sample's mean distance of connected nodes
    Returns a scalar
  */
  static meanDist(sample){
    let sum = [0, 0, 0]
    for(let e of sample.values()){
      sum = add(sum, distance(e.source.position, e.target.position))
    }

    return divideScalar(sum, sample.size)
  }
}

function makeMetricsCollector(){
  return new MetricsCollector(...args)
}

export default MetricsCollector