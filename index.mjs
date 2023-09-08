import MetricsCollector from './MetricsCollector.mjs'

const mc = new MetricsCollector(100, 100, 50, {
  meanPos: true, 
  minPos: true,
  maxPos: true, 
  meanVel: true, 
  meanDist: true, 
  meanAge: false
})

const result = mc.iterate()
console.table(result)