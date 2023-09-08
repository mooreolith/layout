import MetricsCollector from './MetricsCollector.mjs'

const mc = new MetricsCollector(10, 10, 5, {
  vMeanPos: false, 
  vMinPos: false,
  vMaxPos: false, 
  vMeanVel: false, 
  eMeanDist: true, 
  eMeanAge: true
})

console.log(mc)
mc.iterate()