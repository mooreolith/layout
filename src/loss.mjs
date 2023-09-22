import Value from './Value.mjs'

function loss(model, Xb, yb){
  let inputs = Xb.map(input => new Value(input))

  // forward the model to get scores
  let scores = inputs.map(input => model.eval(input))

  // svm "max-margin" loss
  let losses = yb.map((yi, i) => {
    let scorei = scores[i]
    return new Value(yi).neg().mul(scorei).add(1).relu()
  })
  let data_loss = losses
    .reduce((a, sum) => sum.add(a), 0)
    .mul(new Value(losses.length).pow(-1))
  let alpha = new Value(1e-4)
  let reg_loss = alpha * 
    model.parameters()
    .map(p => p.data)
    .reduce((a, sum) => sum + (a * a))
  let total_loss = data_loss + reg_loss

  let accuracy = yb.map((a, i) => {
    let yi = a
    let scorei = scores[i]

    return yi > 0 == scorei.data > 0
  })

  return [
    total_loss, 
    accuracy
      .map(a => a.data)
      .reduce((a, sum) => sum + a, 0)
  ]
}

export default loss