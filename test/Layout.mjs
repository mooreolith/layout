import Layout from '../src/micrograd.js/Layout.mjs'
import assert from 'assert'

describe("Layout", function(){
  let layout = new Layout()
  let a, b, e

  it('should add a vertex reliably', function(){
    a = layout.addVertex()
    assert.equal(layout.vertices.size, 1)
  })

  it('should add an edge reliably', function(){
    b = layout.addVertex()
    e = layout.addEdge(a, b)
    assert.notEqual(e, undefined)
    assert.equal(layout.edges.size, 1)
  })

  it('should reliably remove an edge', function(){
    layout.removeEdge(e)
    assert.equal(layout.edges.size, 0)
  })

  it('should reliably remove a vertex', function(){
    layout.removeVertex(a)
    assert.equal(layout.vertices.size, 1)
  })

  let c, v, u

  it('should calculate repulsion between two vertices', function(){
    c = layout.addVertex()
    v = layout.vertices.get(b)
    u = layout.vertices.get(c)

    let rep = layout.repulsion(v.position, u.position)
    assert.notEqual(rep, undefined)
  })

  let d

  it('should calculate the attraction between two connected vertices', function(){
    d = layout.addEdge(b, c)
    let att = layout.attraction(v.position, u.position)
    assert.notEqual(att, undefined)
  })

  it('should calculate the attraction between two unconnected vertices', function(){
    layout = new Layout()
    a = layout.addVertex()
    b = layout.addVertex()

    v = layout.vertices.get(a)
    u = layout.vertices.get(b)

    let att = layout.attraction(v.position, u.position)
    assert.notEqual(att, undefined)
  })

  it('should calculate iterate()', function(){
    layout = new Layout()
    
    a = layout.addVertex()
    b = layout.addVertex()
    e = layout.addEdge(a, b)

    let iteration = layout.iterate()
    assert.notEqual(iteration, undefined)
  })

  it('should handle large numbers of vertices and edges (100v + 100e)', function(){
    layout = new Layout()

    for(let i=0; i<100; i++){
      layout.addVertex()
    }

    for(let i=0; i<100; i++){
      layout.randomEdge()
    }

    let iteration = layout.iterate()
    assert.notEqual(iteration, undefined)
  })

  it('should handle large numbers of vertices and edges (250v + 250e)', function(){
    layout = new Layout()

    for(let i=0; i<250; i++){
      layout.addVertex()
    }

    for(let i=0; i<250; i++){
      layout.randomEdge()
    }

    let iteration = layout.iterate()
    assert.notEqual(iteration, undefined)
  })

  it('should handle large numbers of vertices and edges (500v + 500e)', function(){
    layout = new Layout()

    for(let i=0; i<500; i++){
      layout.addVertex()
    }

    for(let i=0; i<500; i++){
      layout.randomEdge()
    }

    let iteration = layout.iterate()
    assert.notEqual(iteration, undefined)
  })

  it('should handle large numbers of vertices and edges (1000v + 1000e)', function(){
    layout = new Layout()

    for(let i=0; i<1000; i++){
      layout.addVertex()
    }

    for(let i=0; i<1000; i++){
      layout.randomEdge()
    }

    let iteration = layout.iterate()
    assert.notEqual(iteration, undefined)
  })
})