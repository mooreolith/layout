import MLP from './micrograd.js/MultilayerPerceptron.mjs'
import loss from './micrograd.js/loss.mjs'

function main(){
  console.log(`layout/src/main.mjs
mooreolith@gmail.com
September 25 2023
`)

  let xs = [
      [2.0, 3.0, -1.0],
      [3.0, -1.0, 0.5],
      [0.5, 1.0, 1.0],
      [1.0, 1.0, -1.0]
  ]
  let ys = [1.0, -1.0, -1.0, 1.0]

  let model = new MLP(3, [4, 4, 1])

  for(let k=0; k<100; k++){
    let [total_loss, acc] = loss(model, xs, ys)

    // backward
    model.zero_grad()
    total_loss.backward()

    // update
    let learning_rate = 1.0 - 0.9 * k / 100
    for(let p of model.parameters()) p.data -= learning_rate * p.grad
    if(k % 1 == 0) console.log(`step ${k} loss ${total_loss.data}, accuracy ${acc*100}%`)
  }
}

main()