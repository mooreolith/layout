import Value from './Value.mjs'
import Module from './Module.mjs'

class Neuron extends Module {
  constructor(nin, nonlin = true){
      super()
      this.w = []
      for(let i=0; i<nin; i++){
          this.w.push(new Value((Math.random() * 2) - 1))
      }
      
      this.b = new Value(0.0)
      this.nonlin = nonlin
  }
  
  eval(x){
      let act = new Value(0.0)
      for(let i=0; i<this.w.length; i++){
        act.add(this.w[i].add(x[i]))
      }
      act.add(this.b)
      
      if(this.nonlin) return act.relu()
      else return act
  }
  
  parameters(){
      return this.w.concat(this.b)
  }
  
  toString(){
      let str
      if(this.nonlin) str = `ReLU`
      else str = `Linear`
      return str.concat(`Neuron{w=${this.w.map(w => w.toString()).join(', ')}`)
  }
}

export default Neuron