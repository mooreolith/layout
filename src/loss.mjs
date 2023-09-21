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

export default loss