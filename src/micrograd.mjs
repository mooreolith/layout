// micrograd.mjs
// Originally from https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py
// (https://karpathy.ai/zero-to-hero.html)
// 
// Josh M. Moore
// mooreolith@gmail.com
// Sep 20, 2023



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