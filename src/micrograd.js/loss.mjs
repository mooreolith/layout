import Value from './Value.mjs'

function loss(model, Xb, yb){
  let inputs = Xb.map(input => new Value(input))
  let scores = inputs.map(x => model.eval(x))
  
  let losses = scores.map((_, i) => {
    let yi = new Value(yb[i])
    let si = scores[i]
    let out = (yi.neg().mul(si)).add(1).relu()
    return out
  })
  let data_loss = losses.reduce((sum, it) => sum.add(it), new Value(0.0)).div(losses.length)
  let alpha = new Value(1e-4)
  let reg_loss = alpha.mul(
    model.parameters().reduce(
      (sum, r) => sum.add(
        r.reduce((s, p) => s.add(p), new Value(0.0))
      ), 
      new Value(0.0)))
  let total_loss = data_loss.add(reg_loss)

  let accuracy = yb.map((yi, i) => {
    return (yi > 0) == (scores[i].data > 0) ? 1 : 0
  })

  return [
    total_loss, 
    accuracy.reduce((sum, a) => sum + a, 0) / (accuracy.length)
  ]
}

export default loss