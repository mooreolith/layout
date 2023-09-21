import Module from './Module.mjs'
import Layer from './Layer.mjs'

class MLP extends Module {
  constructor(nin, nouts){
      super()
      let sz = [nin].concat(nouts)
      
      this.layers = []
      for(let i=0; i<nouts.length; i++){
          this.layers.push(new Layer(sz[i], sz[i+1], i!=nouts.length-1))
      }
  }
  
  eval(x){
      for(let layer of this.layers){
          x = layer.eval(x)
      }
      
      return x
  }
  
  parameters(){
      return [...this.layers.map(layer => layer.parameters())]
  }
  
  toString(){
      return `MLP of [${this.layers.map(layer => layer.toString()).join(', ')}]`
  }
}

export default MLP