const request = require('supertest');
const express = require('express');

jest.mock('../../src/data/products', () => [
  { id: 1, name: 'Laptop Pro 15"', price: 1299.99, stock: 12, category: 'electronics' },
  { id: 2, name: 'Wireless Mouse', price: 39.99, stock: 0, category: 'electronics' },
]);

const productsRouter = require('../../src/routes/products');

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

test('GET /api/products retourne tous les produits', async () => {
  const res = await request(app).get('/api/products').expect(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(2);
});

test('GET /api/products/:id retourne un produit', async () => {
  const res = await request(app).get('/api/products/1').expect(200);
  expect(res.body).toHaveProperty('id', 1);
  expect(res.body).toHaveProperty('name', 'Laptop Pro 15"');
});

test('GET /api/products/:id retourne 404 si inexistant', async () => {
  const res = await request(app).get('/api/products/999').expect(404);
  expect(res.body).toHaveProperty('error');
});

test('GET /api/products/:id retourne 400 si id non numérique', async () => {
  const res = await request(app).get('/api/products/abc').expect(400);
  expect(res.body).toHaveProperty('error');
});

test('POST /api/products crée un produit', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ name: 'New Product', price: 49.99, stock: 10, category: 'misc' })
    .expect(201);
  expect(res.body).toHaveProperty('name', 'New Product');
  expect(res.body).toHaveProperty('price', 49.99);
});

test('POST /api/products retourne 400 si name manquant', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ price: 49.99 })
    .expect(400);
  expect(res.body).toHaveProperty('error');
});
