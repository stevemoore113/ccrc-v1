
const { CustomValidator } = require('./../custom-tools');

describe('Custom validator test spec', () => {
  test('Expect input value is an empty string', () => {
    expect(CustomValidator.nonEmptyString('')).toBe(false);
  })
  test('Expect input value is not an empty string', () => {
    expect(CustomValidator.nonEmptyString('aaa')).toBe(true);
    expect(new CustomValidator().nonEmptyStringThrows('123')).toBeInstanceOf(CustomValidator);
  })
  test('Expect input value is an empty array', () => {
    expect(CustomValidator.nonEmptyArray([])).toBe(false);
  })
  test('Expect input value is not an empty array', () => {
    expect(CustomValidator.nonEmptyArray(['aaa'])).toBe(true);
  })
  test('Expect input value is email', () => {
    expect(
      new CustomValidator()
        .checkThrows('eeee@xxx.com', { s: CustomValidator.strategies.IS_EMAIL, m: 'input value is not email' })
    ).toBeInstanceOf(CustomValidator);
  })
  test('Static check with fn, It should returns true with input 123', () => {
    let res = CustomValidator.check('123', { fn: (val) => /^[0-9]/i.test(val) });
    expect(res).toBe(true);
    res = new CustomValidator().checkThrows('123', { fn: (val) => /^[0-9]/i.test(val) });
    expect(res).toBeInstanceOf(CustomValidator);
  })
  test(`Should throw error with static check method`, () => {
    expect(() => CustomValidator.check('', { m: 'Empty err', s: CustomValidator.strategies.NON_EMPTY_STRING })).toThrow('Empty err');
  })
  test('Input value is not number', () => {
    expect(CustomValidator.isNumber('123')).toBe(false);
  })
  test('Input value is not equals to another', () => {
    expect(CustomValidator.isEqual({ o: 'o' }, { k: 'k' })).toBe(false);
  })
})