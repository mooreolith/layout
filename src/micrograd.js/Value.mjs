class Value {
  constructor(data, children = [], op = '', label = '') {
    this.data = data
    this.grad = 0.0
    this.label = label
    this._backward = () => undefined
    this.prev = new Set(children)
    this.op = op
  }

  toString() {
    return `Value(data=${this.data}, grad=${this.grad})`
  }

  add(other) {
    if (!(other instanceof Value)) {
      other = new Value(other)
    }

    let out = new Value(this.data + other.data, [this, other], '+')
    out._backward = () => {
      this.grad += out.grad
      other.grad += out.grad
    }

    return out
  }

  mul(other) {
    if (!(other instanceof Value)) {
      other = new Value(other)
    }

    let out = new Value(this.data * other.data, [this, other], '*')
    out._backward = () => {
      this.grad += other.data * out.grad
      other.grad += this.data * out.grad
    }

    return out
  }

  pow(other) {
    let out = new Value(Math.pow(this.data, other), [this], `**${other}`)
    out._backward = () => {
      this.grad += (other * Math.pow(this.data, other-1)) * out.grad
    }

    return out
  }

  relu() {
    let out
    if (this.data < 0) {
      out = new Value(0.0)
    } else {
      out = new Value(this.data, [this], 'relu')
    }

    out._backward = () => {
      if (out.data > 0) {
        this.grad = out.grad
      } else {
        this.grad = 0
      }
    }

    return out
  }

  div(other) {
    if (!(other instanceof Value)) other = new Value(other)
    return this.mul(other.pow(-1))
  }

  neg() {
    return this.mul(-1)
  }

  sub(other) {
    return this.add(other.neg())
  }

  tanh() {
    let x = this.data
    let t = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1)
    let out = new Value(t, [this], 'tanh')

    out._backward = () => {
      this.grad += (1 - t ** 2) * out.grad
    }

    return out
  }

  exp() {
    let x = this.data
    let out = new Value(Math.exp(x), [this], 'exp')

    out._backward = () => {
      this.grad += out.data * out.grad
    }

    return out
  }

  backward() {
    let topo = []
    let visited = new Set()

    let build_topo = (v) => {
      if (!(v in visited)) {
        visited.add(v)
        for (let child of v.prev) build_topo(child)
        topo.push(v)
      }
    }

    build_topo(this)
    this.grad = 1.0
    for (let node of topo.reverse()) {
      node._backward()
    }
  }

  toString() {
    return `Value{data=${this.data}, grad=${this.grad}}`
  }
}

export default Value