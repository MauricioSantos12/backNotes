const suma = (a, b) => {
  return a - b
}

const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 3, result: 4 },
  { a: 3, b: -3, result: 0 }
]

checks.forEach(element => {
  const { a, b, result } = element
  console.assert(
    suma(a, b) === result,
    `Sum of ${a} and ${b} epected be ${result}`
  )
})

console.log(`${checks.length} checks performanced`)
