/* //////////////////////////////////////////////////// */
/*                                                      */
/*                     layout/layout.js                 */
/*                         main()                       */
/*                                                      */
/*                      Josh M. Moore                   */
/*                  mooreolith@gmail.com                */
/*                                                      */
/*                       Jun 22, 2023                   */
/*                                                      */
/* //////////////////////////////////////////////////// */

/*
  scale is a factor by which random starting points are multiplied.
*/
let scale = 3

/*
  Adds a vertex to this module's vertices map
  Returns a vertex id
*/

const Vertex = class Vertex {
  constructor(vertexId){
    this.id = vertexId
    this.edges = new Set()
    this.position = [
      Math.random() * scale,
      Math.random() * scale,
      Math.random() * scale
    ]
    this.velocity = [0, 0, 0]

    this.createdAt = Date.now()
  }

  accelerate(by){
    this.velocity = add(this.velocity, by)
  }

  move(){
    let friction = multiplyScalar(this.velocity, constants.d)
    this.position = add(this.position, subtract(this.velocity, friction))
  }
}

/*
  Adds an edge between vertices specified by ids a and b
  Returns an edge id
*/

const Edge = class Edge {
  constructor(edgeId, a, b){
    this.id = edgeId
    this.source = a
    this.target = b

    a.edges.add(this)
    b.edges.add(this)

    edges.set(this.id, this)
    edgesFrom.set(a.id, this.id)
    edgesTo.set(b.id, this.id)

    this.createdAt = Date.now()
  }
}

/*
  Returns a vector representing the sum of vectors a and b
*/
const add = function(a, b){
  console.assert(a !== undefined)
  console.assert(b !== undefined)

  return [
    a[0] + b[0], 
    a[1] + b[1],
    a[2] + b[2]
  ]
}

/*
  Returns a vector representing the subtraction of b from a
*/
const subtract = function(a, b){
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ]
}

/*
  Returns a scalar representing the dot product of a and b
*/
const dot = function(a, b){
  return (
    (a[0] * b[0]) + 
    (a[1] * b[1]) + 
    (a[2] * b[2])
  )
}

/*
  Returns a vector representing the cross product of a and b
*/
const cross = function(a, b){
  return [
    (a[1] * b[2]) - (b[1] * a[2]),
    (b[0] * a[2]) - (a[0] * b[2]),
    (a[0] * b[1]) - (b[0] * a[1])
  ]
}

/*
  Returns the normalized vector vec
*/
const norm = function(vec){
  return Math.abs(vec[0]) +
    Math.abs(vec[1]) +
    Math.abs(vec[2])
}

/*
  Returns a vector representing vector vec divided by scalar s
*/
const divideScalar = function(vec, s){
  return [
    vec[0] / s,
    vec[1] / s,
    vec[2] / s
  ]
}

/*
  Returns a vector representing vector vec multiplied by scalar s
*/
const multiplyScalar = function(vec, s){
  return [
    vec[0] * s,
    vec[1] * s,
    vec[2] * s
  ]
}

const distance = function(a, b){
  return Math.sqrt(((b[0]+ a[0])**2) + ((b[1]+ a[1])**2) + ((b[2]+ a[2])**2))
}


const Layout = class Layout {
  constructor(){
     /*
      vertexId contains the last added vertex's id.
      It is incremented with each addVertexI() and is thus unique.

      edgeId contains the last added edge's id
      It is incremented with each addEdge() and is thus unique.
    */
    this.vertexId = 0
    this.edgeId = 0

    /*
      edgeFrom
      I don't yet know how this will come in handy, but I have a feeling
      it, and its cousin edgesTo could provide speedier access to some
      of the ancipated implementation efforts.
    */
    this.edgesTo = new Map() // key: from.id, value: e.id
    this.edgesFrom = new Map() // key: to.id, value: e.id

    /*
      vertices and edges, hold their respective structures for later 
      query or retrieval by element's (edge or vertex) id. 
    */
    this.vertices = new Map()
    this.edges = new Map()

    /*
      constants is an object of named constants mainly for use in 
      the layout calculation.
    */
    this.constants = {
      /* f0: repulsion constant */
      f0: 1.0,
      /* epsR: "epsilon to avoid singularities" */
      epsR: .001,
      /* K: spring (attraction) constant */
      K: 1.0,
      /* d: friction constant */
      d: 0.85
    }
  }

  addVertex(){
    let w = new Vertex(++this.vertexId)
    this.vertices.set(w.id, w)
  
    return w.id
  }

  removeVertex(id){
    let v = this.vertices.get(id)

    for(let eid of v.edges.keys()){
      this.removeEdge(eid)
    }
  
    this.vertices.delete(id)
  }

  addEdge(a, b){
    if(!this.vertices.has(a) || !this.vertices.has(b)) return

    let v = this.vertices.get(a)
    let u = this.vertices.get(b)
  
    console.assert(v !== undefined)
    console.assert(u !== undefined)
  
    let e = new Edge(++this.edgeId, a, b)
  
    return e.id
  }

  randomEdge(){
    let u, v
    do{
      v = Math.floor(Math.random() * this.vertices.size)
      u = Math.floor(Math.random() * this.vertices.size)
    }while(!this.vertices.has(v) || !this.vertices.has(u))

    let id = undefined
    if(this.vertices.has(v) && this.vertices.has(u)){
      id = addEdge(v, u)
    }

    return id
  }

  removeEdge(id){
    let e = this.edges.get(id)
    let v = this.vertices.get(e.source)
    let u = this.vertices.get(e.target)
  
    this.edgesFrom.delete(e.source)
    this.edgesTo.delete(e.target)
    v.edges.delete(e)
    u.edges.delete(e)
  
    this.edges.delete(e.id)
  }

  /*
    Calculates an iteration of layout on all vertices and edges.
    Returns an array of vertex positions.
  */
  iterate(){
    // calculate vertex-wise repulsion
    for(let v of this.vertices.values()){
      var result = [0, 0, 0]
      
      for(let u of this.vertices.values()){
        if(v.id !== u.id){
          result = add(result, this.repulsion(v.position, u.position))
        }
      }

      v.accelerate(result)
    }

    // calculate edge-wise attraction
    for(let e of this.edges.values()){
      let v = this.vertices.get(e.source)
      let u = this.vertices.get(e.target)

      let a = this.attraction(v.position, u.position)
      v.accelerate(a)
      u.accelerate(multiplyScalar(a, -1))
    }

    for(let v of this.vertices.values()) v.move()
    return [...this.vertices.values()].map(v => v.position)
  }

  /*
    Returns a vector representing the position dependent repulsion
    force between two objects
  */
  repulsion(posA, posB){
    let dividend = this.constants.f0
    let divisor = (this.constants.epsR + norm(subtract(posA, posB))) ** 2
    let termOne = dividend / divisor

    let dividend2 = subtract(posA, posB)
    let divisor2 = norm(subtract(posA, posB))
    let termTwo = divideScalar(dividend2, divisor2)

    let result = multiplyScalar(termTwo, termOne)
    return result
  }

  /*
    Returns a vector representing the position dependent
    attraction force between two objects
  */
  attraction(posA, posB){
    return multiplyScalar(subtract(posA, posB), -this.constants.K)
  }
}


/* //////////////////////////////////////////////////// */
/*                   "main helpers"                     */
/* //////////////////////////////////////////////////// */



/*
  Perform one layout calculation and raise metrics per round,
  saving metrics to the end of the data array.
*/
const step = function(description, dobj){
  // run and time layout
  let start = new Date()
  let l = Layout()
  let end = new Date()
  let ms = end - start

  // sample vertices and edges
  let sampleSize = 50
  let vs = sample(vertices, sampleSize)
  let mps = meanPos(vs)
  let mpv = meanVel(vs)

  // record metrics
  data.push({
    'description': description,
    'ms for layout': ms,
    '# of vertices': vertices.size,
    '# of edges': edges.size,
    'norm(meanPos(vs))': norm(mps),
    'norm(meanVel(vs))': norm(mpv),
    'maxPos(vertexSample)': maxPos(vs),
    'minPos(vertexSample)': minPos(vs),
    'layout': l,
    'f0': constants.f0,
    'epsR': constants.epsR,
    'K': constants.K,
    'd': constants.d
  })
}

/*
  module exports
*/
module.exports = {
  Layout
}