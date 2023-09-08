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

import util from './util.mjs'

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
    this.velocity = util.add(this.velocity, by)
  }

  move(){
    let friction = util.multiplyScalar(this.velocity, constants.d)
    this.position = util.add(this.position, util.subtract(this.velocity, friction))
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

    this.createdAt = Date.now()

    a.edges.add(this)
    b.edges.add(this)
  }

  length(){
    return util.distance(a.position, b.position)
  }
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
      vertices and edges, hold their respective structures for later 
      query or retrieval by element's (edge or vertex) id. 
    */
    this.vertices = new Map()
    this.edges = new Map() // id -> object

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

    for(let eid of v.edges){
      this.removeEdge(eid)
    }
  
    this.vertices.delete(id)
  }

  addEdge(a, b){
    if(!this.vertices.has(a) || !this.vertices.has(b)) return

    let v = this.vertices.get(a)
    let u = this.vertices.get(b)
  
    let e = new Edge(++this.edgeId, a, b)
  
    return e.id
  }

  randomEdge(){
    let v, u
    do{
      v = Math.floor(Math.random() * this.vertices.size)
      u = Math.floor(Math.random() * this.vertices.size)
    }while(!this.vertices.has(v) || !this.vertices.has(u))

    v = this.vertices.get(v)
    u = this.vertices.get(u)

    let e = new Edge(++this.edgeId, v, u)
    this.edges.set(e.id, e)

    v.edges.add(e)
    u.edges.add(e)
    return e.id
  }

  removeEdge(id){
    let e = this.edges.get(id)
    let v = this.vertices.get(e.source)
    let u = this.vertices.get(e.target)

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
          result = util.add(result, this.repulsion(v.position, u.position))
        }
      }

      v.accelerate(result)
    }

    // calculate edge-wise attraction
    for(let e of this.edges){
      let v = this.vertices.get(e.source)
      let u = this.vertices.get(e.target)

      let a = this.attraction(v.position, u.position)
      v.accelerate(a)
      u.accelerate(util.multiplyScalar(a, -1))
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
    let divisor = (this.constants.epsR + util.norm(util.subtract(posA, posB))) ** 2
    let termOne = dividend / divisor

    let dividend2 = util.subtract(posA, posB)
    let divisor2 = util.norm(util.subtract(posA, posB))
    let termTwo = util.divideScalar(dividend2, divisor2)

    let result = util.multiplyScalar(termTwo, termOne)
    return result
  }

  /*
    Returns a vector representing the position dependent
    attraction force between two objects
  */
  attraction(posA, posB){
    return util.multiplyScalar(util.subtract(posA, posB), -this.constants.K)
  }
}

export default Layout