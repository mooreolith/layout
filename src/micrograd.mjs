// micrograd.mjs
// Originally from https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py
// (https://karpathy.ai/zero-to-hero.html)
// 
// Josh M. Moore
// mooreolith@gmail.com
// Sep 20, 2023

class Value {
    constructor(data, children=[], op='', label=''){
        this.data = data
        this.grad = 0.0
        this.label = label
        this._backward = () => undefined
        this.prev = new Set(children)
        this.op = op
    }
    
    toString(){
        return `Value(data=${this.data}, grad=${this.grad})`
    }
    
    add(other){
        if(!(other instanceof Value)){
            other = new Value(other)
        }
        
        let out = new Value(this.data + other.data, [this, other], '+')
        out._backward = () => {
            this.grad += out.grad
            other.grad += out.grad
        }
        
        return out
    }
    
    mul(other){
        if(!(other instanceof Value)){
            other = new Value(other)
        }
        
        let out = new Value(this.data * other.data, [this, other], '*')
        out._backward = () => {
            this.grad += other.data * out.grad
            other.grad += this.data * out.grad
        }
        
        return out
    }
    
    pow(other){
        let out = new Value(Math.pow(this.data, other), [this], `**${other}`)
        out._backward = () => {
            this.grad += (other.mul(Math.pow(this.data, other - 1)) * out.grad)
        }
        
        return out
    }
    
    relu(){
        let out
        if(this.data < 0){
            out = new Value(0.0)
        }else{
            out = new Value(this.data, [this], 'relu')
        }
        
        out._backward = () => {
            if(out.data > 0){
                this.grad = out.grad
            }else{
                this.grad = 0
            }
        }
        
        return out
    }
    
    div(other){
        if(!(other instanceof Value)) other = new Value(other)
        return this.mul(other.pow(-1))
    }
    
    neg(){
        return this.mul(-1)
    }
    
    sub(other){
        return this.add(other.neg())
    }
    
    tanh(){
        let x = this.data
        let t = (Math.exp(2*x)-1) / (Math.exp(2*x) + 1)
        let out = new Value(t, [this], 'tanh')
        
        out._backward = () => {
            this.grad += (1 - t**2) * out.grad
        }
        
        return out
    }
    
    exp(){
        let x = this.data
        let out = new Value(Math.exp(x), [this], 'exp')
        
        out._backward = () => {
            this.grad += out.data * out.grad
        }
        
        return out
    }
    
    backward(){
        let topo = []
        let visited = new Set()
        
        let build_topo = (v) => {
            if(!(v in visited)){
                visited.add(v)
                for(let child of v.prev) build_topo(child)
                topo.push(v)
            }
        }
        
        build_topo(this)
        this.grad = 1.0
        for(let node of topo.reverse()){
            node._backward()
        }
    }

    toString(){
        return `Value{data=${this.data}, grad=${this.grad}}`
    }
}

class Module {
  zero_grad(){
      for(let p of this.parameters()) p.grad = 0.0
  }
  
  parameters(){
      return []
  }
}

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

function loss(model, X, y){
    let Xb = X
    let yb = y
    
    let inputs = [Xb.map(xrow => xrow.map(x => new Value(x)))]
    
    // forward the model to get scores
    let scores = []
    for(let input of inputs){
        scores.push(model.eval(input))
    }
    
    // svm max-margin loss
    let losses = []
    for(let i=0; i<yb.length; i++){
        let yi = new Value(yb[i])
        let scorei = new Value(scores[i])
        
        losses.push(yi.neg().mul(scorei).add(1).relu())
    }
    let data_loss = losses.reduce((loss, sum) => sum.add(loss), new Value(0.0))
    
    // L2 regularization
    let alpha = new Value(1e-4)
    let reg_loss = alpha.mul(model.parameters().reduce((p, sum) => sum.add(p.mul(p)), new Value(0.0)))
    let total_loss = data_loss.add(reg_loss)
    
    // accuracy
    let accuracy = []
    for(let i=0; i<yb.length; i++){
        let yi = yb[i]
        let scorei = scores[i]
        
        accuracy.push((yi.data > 0) == (scorei.data > 0) ? new Value(1.0) : new Value(0.0))
    }
    
    
    let accSum = new Value(0)
    console.log(accSum)
    //    let accSum = accuracy.reduce((acc, sum) => sum.add(acc), new Value(0))

    // return [total_loss, accSum.div(accuracy.length)]
    return [total_loss]
}

function main(){
    let xs = [
        [2.0, 3.0, -1.0],
        [3.0, -1.0, 0.5],
        [0.5, 1.0, 1.0],
        [1.0, 1.0, -1.0]
    ]
    let ys = [1.0, -1.0, -1.0, 1.0]

    let model = new MLP(3, [4, 4, 1])

    let value = new Value(0.0).add(new Value(1.0))
    // console.log(value)

    let neuron = new Neuron(4)
    // console.log(neuron)

    let layer = new Layer(3, [4], true)
    // console.log(layer)

    let mlp = new MLP(3, [4, 4, 1])
    
    console.log(mlp.toString())
}

const Micrograd = {
    Value,
    Neuron,
    Layer,
    MLP,
    loss,
    main
}

export default Micrograd