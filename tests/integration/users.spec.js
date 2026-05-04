const request = require('supertest');
const express = require('express');

jest.mock('../../src/data/users', () => [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'customer' },
]);

const usersRouter = require('../../src/routes/users');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

test('GET /api/users retourne tous les users', async () => {
  const res = await request(app).get('/api/users').expect(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(2);
});

test('GET /api/users/:id retourne un user', async () => {
  const res = await request(app).get('/api/users/2').expect(200);
  expect(res.body).toHaveProperty('id', 2);
  expect(res.body).toHaveProperty('email', 'bob@example.com');
});

test('GET /api/users/:id retourne 404 si inexistant', async () => {
  const res = await request(app).get('/api/users/999').expect(404);
  expect(res.body).toHaveProperty('error');
});

test('POST /api/users crée un user', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'David', email: 'david@example.com' })
    .expect(201);
  expect(res.body).toHaveProperty('name', 'David');
  expect(res.body).toHaveProperty('role', 'customer');
});

test('POST /api/users retourne 400 si email manquant', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'David' })
    .expect(400);
  expect(res.body).toHaveProperty('error');
});
