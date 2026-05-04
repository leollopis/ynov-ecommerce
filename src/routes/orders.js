const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

const VALID_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

function parseOrder(row) {
  return { ...row, productIds: JSON.parse(row.productIds) };
}

// GET /api/orders
router.get("/", (_req, res) => {
  const orders = getDb().prepare("SELECT * FROM orders").all().map(parseOrder);
  res.json(orders);
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const row = getDb()
    .prepare("SELECT * FROM orders WHERE id = ?")
    .get(parseInt(req.params.id));
  if (!row) return res.status(404).json({ error: "Order not found" });
  res.json(parseOrder(row));
});

// POST /api/orders
router.post("/", (req, res) => {
  const { userId, productIds } = req.body;
  if (!userId || !productIds || !Array.isArray(productIds)) {
    return res
      .status(400)
      .json({ error: "userId and productIds[] are required" });
  }
  const createdAt = new Date().toISOString().split("T")[0];
  const result = getDb()
    .prepare(
      "INSERT INTO orders (userId, productIds, total, status, createdAt) VALUES (?, ?, ?, ?, ?)",
    )
    .run(userId, JSON.stringify(productIds), 0, "pending", createdAt);
  const newOrder = getDb()
    .prepare("SELECT * FROM orders WHERE id = ?")
    .get(result.lastInsertRowid);
  res.status(201).json(parseOrder(newOrder));
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const row = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Order not found" });
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` });
  }
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  res.json(parseOrder({ ...row, status }));
});

module.exports = router;
