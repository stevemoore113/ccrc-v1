const { agent } = require('supertest');
const request = require('supertest');
const { models } = require('@ccrc/app-common');
const { domain } = require('@ccrc/app-core');
const app = require('../app');

const _path = '/api/v1/accounts';




describe('account spec', () => {
  const agent = request.agent(app.callback());
  describe('require check', () => {
    test('[10001] email is empty', async (done) => {
      const res = await agent
        .post(_path)
        .send({});

      const err = new models.CustomError(domain.enums.errorCodes.ERR_EMAIL_EMPTY);
      expect(res.status).toBe(err.httpStatus)
      expect(res.body).toEqual({
        traceId: expect.any(String),
        code: err.code,
        message: err.message,
        result: null,
      });
      done();
    });
  });
});