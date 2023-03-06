const { palindrome } = require('../utils/for_testings')

test.skip('palindrome of Mauro', () => {
  const result = palindrome('Mauro')
  expect(result).toBe('oruaM')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
