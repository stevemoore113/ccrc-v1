const { errorCodes } = require('../custom-codes');
const { CustomError } = require('../custom-models');

describe('Custom error test', () => {
  test('Should be exception', (done) => {
    const str = 'I am exception';
    const m = new CustomError(str);
    expect(m.type).toBe(errorCodes.ERR_EXCEPTION);
    expect(m.message).toBe(str);
    expect(m.code).toBe(99999);
    expect(m.isException()).toBe(true);
    expect(m.isSuccess()).toBe(false);
    done();
  });
  test('Shoule be success', (done) => {
    const m = new CustomError(errorCodes.SUCCESS);
    expect(m.type).toBe(errorCodes.SUCCESS);
    expect(m.isSuccess()).toBe(true);
    expect(m.isException()).toBe(false);
    done();
  });
  test('Should add error codes success', (done) => {
    const codes = []
    const code = {
      alias: 'ERR_TEST',
      code: 10001,
      httpStatus: 400,
      message: 'I am test error'
    };
    codes.push(code);
    CustomError.mergeCodes(codes)
    const m = new CustomError(code.alias);
    expect(m).toBeTruthy();
    expect(m.type).toBe(code.alias);
    expect(m.code).toBe(code.code);
    expect(m.message).toBe(code.message);
    expect(m.isSuccess()).toBe(false)
    expect(m.isException()).toBe(false);
    done();
  })
  test('Should add error code fail w/ 3 keys', (done) => {
    const codes = []
    const code = {
      alias: 'ERR_TEST1',
      code: 10001,
      message: 'I am test1 error'
    };
    codes.push(code);
    expect(() => CustomError.mergeCodes(codes)).toThrowError('Illegal error code format');
    done();
  })
  test('Should add error code fail w/ 4 keys but invalid name', (done) => {
    const codes = []
    const code = {
      al: 'ERR_TEST2',
      httpStatus: 400,
      code: 10001,
      message: 'I am test2 error'
    };
    codes.push(code);
    expect(() => CustomError.mergeCodes(codes)).toThrowError('Illegal error code format');
    done();
  })
  test('Should add error code fail w/ empty array', (done) => {
    const codes = []
    expect(() => CustomError.mergeCodes(codes)).toThrowError('Cannot merge with an empty array');
    done();
  })
  test('Can not add duplicated code', (done) => {
    const codes = []
    const code = {
      alias: 'SUCCESS',
      code: 0,
      httpStatus: 200,
      message: 'I am duplicate code'
    };
    codes.push(code);
    expect(() => CustomError.mergeCodes(codes)).toThrowError(`Duplicate key ${code.alias} was defined`);
    done();
  })
});
