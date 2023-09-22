import Value from './Value.mjs'

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
  let data_loss = new Value(0.0)
  for(let l of losses){
    data_loss.add(l)
  }
  data_loss = data_loss.mul(new Value(1.0).div(losses.length))
  
  // L2 regularization
  let alpha = new Value(1e-4)
  let reg_loss = new Value(0.0)
  for(let p of model.parameters()){
    reg_loss.add(new Value(p).mul(p))
  }

  let total_loss = data_loss.add(reg_loss)
  
  // accuracy
  let accuracy = []
  for(let i=0; i<yb.length; i++){
      let yi = yb[i]
      let scorei = scores[i]
      
      accuracy.push((yi > 0) == (scorei > 0) ? new Value(1.0) : new Value(0.0))
  }
  
  let accSum = new Value(0.0)
  for(let acc of accuracy){
    accSum.add(acc)
  }

  return [total_loss, accSum.div(accuracy.length)]
}

export default loss