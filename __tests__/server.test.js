'use strict'

const { app, database } = require("../src/server");
const supertest = require('supertest');
const mockServer = supertest(app);
const base64 = require('base-64')
const bcrypt = require('bcrypt');
const basicAuth = require('../src/auth/middleware/basic')

beforeAll(async () => {
  await database.sync();
});

describe('Tests for users signin and signup', () => {
  test('POST to /signup to create a new user.', async () => {
    const result = await mockServer.post('/signup').send({
      username: "lorem",
      password: "1234"
    })
    expect(result.status).toEqual(201)
  });
  test('POST to /signin to login as a user (use basic auth)', async () => {
    const req = {
      headers: {
        authorization: `Basic ${base64.encode("lorem:1234")}`
      },
      body: {
        username: undefined
      }
    }
    const res = {}
    const next = jest.fn()
    const result = await basicAuth(req,res,next)
    expect(next).toHaveBeenCalled()
  })
})

afterAll(async () => {
  await database.drop();
});

/*
POST to /signup to create a new user.
POST to /signin to login as a user (use basic auth).
Need tests for auth middleware and the routes.
Does the middleware function (send it a basic header).
Do the routes assert the requirements (signup/signin).
This is going to require more “end to end” testing than you’ve done in the past.
To test signin, your tests actually need to create a user first, then try and login. i.e. The signin test will rely on the success of the signup test.
*/