const getsecondsSinceEpoch = require('../../src/time')

test('returns current server time, in epoch seconds', () => {
    const result = getsecondsSinceEpoch()

    expect(result).toEqual(expect.any(Number))
})