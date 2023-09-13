/*
  Returns a vector representing the sum of vectors a and b
*/
const add = function(a, b){
  return [
    a[0] + b[0], 
    a[1] + b[1],
    a[2] + b[2]
  ]
}

/*
  Returns a vector representing the subtraction of b from a
*/
const subtract = function(a, b){
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ]
}

/*
  Returns a scalar representing the dot product of a and b
*/
const dot = function(a, b){
  return (
    (a[0] * b[0]) + 
    (a[1] * b[1]) + 
    (a[2] * b[2])
  )
}

/*
  Returns a vector representing the cross product of a and b
*/
const cross = function(a, b){
  return [
    (a[1] * b[2]) - (b[1] * a[2]),
    (b[0] * a[2]) - (a[0] * b[2]),
    (a[0] * b[1]) - (b[0] * a[1])
  ]
}

/*
  Returns the normalized vector vec
*/
const norm = function(vec){
  return Math.abs(vec[0]) +
    Math.abs(vec[1]) +
    Math.abs(vec[2])
}

/*
  Returns a vector representing vector vec divided by scalar s
*/
const divideScalar = function(vec, s){
  return [
    vec[0] / s,
    vec[1] / s,
    vec[2] / s
  ]
}

/*
  Returns a vector representing vector vec multiplied by scalar s
*/
const multiplyScalar = function(vec, s){
  return [
    vec[0] * s,
    vec[1] * s,
    vec[2] * s
  ]
}

const distance = function(a, b){
  return Math.sqrt(((b[0]+ a[0])**2) + ((b[1]+ a[1])**2) + ((b[2]+ a[2])**2))
}

const util = {
  add,
  subtract,
  dot,
  cross,
  norm,
  divideScalar,
  multiplyScalar,
  distance
}

export default util