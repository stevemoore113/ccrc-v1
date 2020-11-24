const request = require('supertest');
const { models, codes } = require('@ccrc/app-common');
const app = require('../app');

describe(`Root spec`, () => {
  const agent = request.agent(app.callback());
  test(`Hello world`, async (done) => {
    const res = await agent
      .get('/api/v1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      traceId: expect.any(String),
      code: 0,
      message: '',
      result: null,
    });
    done();
  });
  test(`Throw error`, async (done) => {
    const res = await agent
      .get('/api/v1/throws');

    const err = new models.CustomError(codes.errorCodes.ERR_EXCEPTION);
    expect(res.status).toBe(err.httpStatus)
    expect(res.body).toEqual({
      traceId: expect.any(String),
      code: err.code,
      message: err.message,
      result: null,
    });
    done();
  })
})
