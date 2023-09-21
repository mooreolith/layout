class Module {
  zero_grad(){
      for(let p of this.parameters()) p.grad = 0.0
  }
  
  parameters(){
      return []
  }
}

export default Module