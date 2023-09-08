function main(){
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

if(require !== undefined && require.main === module) 
  main()
