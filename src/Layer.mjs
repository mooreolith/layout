import Neuron from './Neuron.mjs'
import Module from './Module.mjs'

class Layer extends Module {
  constructor(nin, nout, nonlin){
      super()
      this.neurons = []
      for(let i=0; i<nout; i++){
          this.neurons.push(new Neuron(nin, nonlin))
      }
  }
  
  eval(x){
      let out = []
      for(let neuron of this.neurons){
          out.push(neuron.eval(x))
      }
      
      if(out.length === 1) return out[0]
      else return out
  }
  
  parameters(){
      let outs = []
      for(let neuron of this.neurons){
          for(let p of neuron.parameters()){
              outs.push(p)
          }
      }
      
      return outs
  }
  
  toString(){
      return `Layer of [${this.neurons.map(n => n.toString()).join(', ')}]`
  }
}

export default Layer