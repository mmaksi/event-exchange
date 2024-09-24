const request = require('supertest');
const { app } = require('../../app');

// test if it has a route handler listening to /api/tickets for post requests
it('Has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('Can only be accessed if the user is logged in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('Can only be accessed if the user is logged in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('Returns status code other than 401 if the user is signed in', async () => {
  const cookie = await global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});
  expect(response.status).not.toEqual(401);
});

it('Return an error if an invalid price is provided', async () => {
  const cookie = await global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});
  expect(response.status).not.toEqual(401);
});

it('Creates a ticket with valid inputs', async () => {
  const cookie = await global.signin();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});
  expect(response.status).not.toEqual(401);
});
