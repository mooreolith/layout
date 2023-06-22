/* //////////////////////////////////////////////////// */
/*                                                      */
/*                     layout/index.js                  */
/*                         main()                       */
/*                                                      */
/*                      Josh M. Moore                   */
/*                  mooreolith@gmail.com                */
/*                                                      */
/*                       Jun 22, 2023                   */
/*                                                      */
/* //////////////////////////////////////////////////// */

/* //////////////////////////////////////////////////// */
/*      variables, data structures, and functions       */
/* //////////////////////////////////////////////////// */

/*
  vertices and edges, hold their respective structures for later 
  query or retrieval by element's (edge or vertex) id. 
*/
const vertices = new Map()
const edges = new Map()

/*
  constants is an object of named constants mainly for use in 
  the layout calculation.
*/
const constants = {
  /* f0: repulsion constant */
  f0: 1.0,
  /* epsR: "epsilon to avoid singularities" */
  epsR: .001,
  /* K: spring (attraction) constant */
  K: 1.0,
  /* d: friction constant */
  d: 0.85
}

/*
  vertexId contains the last added vertex's id.
  It is incremented with each addVertexI() and is thus unique.
*/
let vertexId = 0

/*
  edgeId contains the last added edge's id
  It is incremented with each addEdge() and is thus unique.
*/
let edgeId = 0

/*
  scale is a factor by which random starting points are multiplied.
*/
let scale = 3

/*
  edgeFrom
  I don't yet know how this will come in handy, but I have a feeling
  it, and its cousin edgesTo could provide speedier access to some
  of the ancipated implementation efforts.
*/
let edgesFrom = new Map() // key: from.id, value: e.id
let edgesTo = new Map() // key: to.id, value: e.id

/*
  Adds a vertex to this module's vertices map
  Returns a vertex id
*/
const addVertex = function(){
  let w = {
    id: ++vertexId,
    edges: new Set([]),
    position: [
      Math.random() * scale,
      Math.random() * scale,
      Math.random() * scale
    ],
    velocity: [0, 0, 0],
    accelerate: function(by){
      this.velocity = add(this.velocity, by)
    },
    move: function(){
      let friction = multiplyScalar(this.velocity, constants.d)
      this.position = add(this.position, subtract(this.velocity, friction))
    }
  }

  vertices.set(w.id, w)

  return w.id
}

/*
  Adds an edge between vertices specified by ids a and b
  Returns an edge id
*/
const addEdge = function(a, b){
  if(!vertices.has(a) || !vertices.has(b)) return

  let v = vertices.get(a)
  let u = vertices.get(b)

  console.assert(v !== undefined)
  console.assert(u !== undefined)

  let e = {
    id: ++edgeId,
    source: a,
    target: b
  }

  v.edges.add(e)
  u.edges.add(e)

  edges.set(e.id, e)
  edgesFrom.set(v.id, e.id)
  edgesTo.set(u.id, e.id)

  return e.id
}

/*
  Removes a vertex from this module's data structures
*/
const removeVertex = function(id){
  let v = vertices.get(id)

  for(let eid of v.edges.keys()){
    removeEdge(eid)
  }

  vertices.delete(id)
}

/*
  Removes an edge from this module's data structures
*/
const removeEdge = function(id){
  let e = edges.get(id)
  let v = vertices.get(e.source)
  let u = vertices.get(e.target)

  edgesFrom.delete(e.source)
  edgesTo.delete(e.target)
  v.edges.delete(e)
  u.edges.delete(e)

  edges.delete(e.id)
}

/*
  Returns a vector representing the sum of vectors a and b
*/
let add = function(a, b){
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
let subtract = function(a, b){
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

/*
  Returns a vector representing the position dependent repulsion
  force between two objects
*/
const repulsion = function(posA, posB){
  let dividend = constants.f0
  let divisor = (constants.epsR + norm(subtract(posA, posB))) ** 2
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
const attraction = function(posA, posB){
  return multiplyScalar(subtract(posA, posB), -constants.K)
}

/*
  Calculates an iteration of layout on all vertices and edges.
  Returns an array of vertex positions.
*/
const layout = function(){
  // calculate vertex-wise repulsion
  for(let v of vertices.values()){
    var result = [0, 0, 0]
    
    for(let u of vertices.values()){
      if(v.id !== u.id){
        result = add(result, repulsion(v.position, u.position))
      }
      // process.stdout.write('.')
    }

    v.accelerate(result)
    // process.stdout.write('#')
  }

  // calculate edge-wise attraction
  for(let e of edges.values()){
    let v = vertices.get(e.source)
    let u = vertices.get(e.target)

    let a = attraction(v.position, u.position)
    v.accelerate(a)
    u.accelerate(multiplyScalar(a, -1))

    // process.stdout.write('|')
  }

  for(let v of vertices.values()) v.move()
  return [...vertices.values()].map(v => v.position)
}


/* //////////////////////////////////////////////////// */
/*                   "main helpers"                     */
/* //////////////////////////////////////////////////// */

/*
  Collect a sample from a larger population.
  Returns a set.
*/
const sample = function(all, sampleSize){
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
const meanPos = function(sample){
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
const maxPos = function(sample){
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
const minPos = function(sample){
  let min = Infinity
  for(let v of sample.values()){
    let n = norm(v.position)
    if(n < min){
      min = n
    }
  }

  return min
}

const meanVel = function(sample){
  let sum = [0, 0, 0]
  for(let v of sample.values()){
    sum = add(sum, v.velocity)
  }

  let result = divideScalar(sum, sample.size)
  return result
}

/*
  An array of metrics, raised per step(), which includes layout().
*/
const data = []

/*
  Perform one layout calculation and raise metrics per round,
  saving metrics to the end of the data array.
*/
const step = function(description, dobj){
  // run and time layout
  let start = new Date()
  let l = layout()
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
  vertices, 
  edges, 
  addVertex, 
  addEdge, 
  removeVertex, 
  removeEdge,
  layout,
  data,
  step
}

/* //////////////////////////////////////////////////// */
/*                        "main"                        */
/* //////////////////////////////////////////////////// */

/*
  main program
*/
function main(){
  console.log(`
  /* //////////////////////////////////////////////////// */
  /*                                                      */
  /*                  calculation/index.js                */
  /*                          main()                      */
  /*                                                      */
  /*                      Josh M. Moore                   */
  /*                  mooreolith@gmail.com                */
  /*                                                      */
  /*                       Jun 22, 2023                   */
  /*                                                      */
  /* //////////////////////////////////////////////////// */
  `)

  /* 
    1000 vertices
  */
  for(let i=0; i<100; i++){
    addVertex()
  }
  console.log('vertices added')

  /*
    100 edges
  */
  for(let i=0; i<100; i++){
    let u, v
    do{
      v = Math.floor(Math.random() * vertices.size)
      u = Math.floor(Math.random() * vertices.size)
    }while(!vertices.has(v) || !vertices.has(u))

    if(vertices.has(v) && vertices.has(u)){
      addEdge(v, u)
    }
  }
  console.log('edges added')

  for(let i=0; i<1000; i++){
    step("timin'")
  }

  console.log('layout calls')

  // create the csv text in memory
  let csv = [
    '# of vertices', 
    '# of edges', 
    'ms for layout',
    'norm(meanPos(vs))',
    'norm(meanVel(vs))',
    'maxPos(vertexSample)', 
    'minPos(vertexSample)',
    'f0',
    'epsR',
    'K',
    'd'
  ].join(',').concat('\n', data.map(row => [
    row['# of vertices'],
    row['# of edges'],
    row['ms for layout'],
    row['norm(meanPos(vs))'],
    row['norm(meanVel(vs))'],
    row['maxPos(vertexSample)'],
    row['minPos(vertexSample)'],
    row['f0'],
    row['epsR'],
    row['K'],
    row['d']
  ].join(',')).join('\n'))

  // write the csv variable to the file system
  let fs = require('fs')
  fs.writeFile('metrics.csv', csv, err => {
    console.log(`File (data.csv) written`)
    if(err) console.error(err)
  })

  // console.table(data[data.length-1].layout)
  return data
}

if(require.main === module) main()
