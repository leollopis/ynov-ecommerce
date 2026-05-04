const request = require("supertest");
const express = require("express");
const { setupTestDb } = require("../helpers/db");
const ordersRouter = require("../../src/routes/orders");

const app = express();
app.use(express.json());
app.use("/api/orders", ordersRouter);

beforeEach(() => {
  setupTestDb(); // setup bdd purge reseed
});

const creationId = 5;
test("GET /api/orders/1 ", async () => {
  await request(app)
    .get("/api/orders/1")
    .expect(200)
    .then((response) => {
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("userId", 1);
      expect(response.body).toHaveProperty("productIds");
      expect(response.body).toHaveProperty("total", 1339.98);
      expect(response.body).toHaveProperty("status", "shipped");
      expect(response.body).toHaveProperty("createdAt", "2024-01-10");
    });
});

test("POST /api/orders ", async () => {
  const newOrder = {
    userId: 20,
    productIds: [1, 3],
  };
  await request(app)
    .post("/api/orders")
    .send(newOrder)
    .expect(201)
    .then((response) => {
      expect(response.body).toHaveProperty("id", creationId);
      expect(response.body).toHaveProperty("userId", newOrder.userId);
      expect(response.body).toHaveProperty("productIds");
      expect(response.body).toHaveProperty("total", 0);
      expect(response.body).toHaveProperty("status", "pending");
      expect(response.body).toHaveProperty("createdAt");
    });
});

test("GET /api/orders après création", async () => {
  const postRes = await request(app)
    .post("/api/orders")
    .send({ userId: 20, productIds: [1, 3] });

  const id = postRes.body.id;

  await request(app)
    .get(`/api/orders/${id}`)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveProperty("id", id);
    });
});

test("GET /api/orders avant vs après patch", async () => {
  const req1 = await request(app).get("/api/orders/2").expect(200);
  expect(req1.body).toHaveProperty("status", "pending");

  const req2 = await request(app)
    .patch("/api/orders/2/status")
    .send({ status: "delivered" })
    .expect(200);
  expect(req2.body).toHaveProperty("status", "delivered");

  expect(req1.body.status).not.toBe(req2.body.status);
});

test("GET /api/orders/999", async () => {
  await request(app)
    .get("/api/orders/999")
    .expect(404)
    .then((res) => {
      expect(res.body).toHaveProperty("error", "Order not found");
    });
});

// test("TEST qui plante", async () => {
//   expect(true).toBe(false);
// });
