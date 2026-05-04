const { SEED_ORDERS } = require('../../src/seed');

const VALID_STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

describe('orders seed data — tests unitaires', () => {
  test('le seed contient au moins une commande', () => {
    expect(Array.isArray(SEED_ORDERS)).toBe(true);
    expect(SEED_ORDERS.length).toBeGreaterThan(0);
  });

  test('chaque commande a les propriétés requises', () => {
    SEED_ORDERS.forEach((order) => {
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('productIds');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('createdAt');
    });
  });

  test('productIds est toujours un tableau non vide', () => {
    SEED_ORDERS.forEach((order) => {
      expect(Array.isArray(order.productIds)).toBe(true);
      expect(order.productIds.length).toBeGreaterThan(0);
    });
  });

  test('total est toujours un nombre positif', () => {
    SEED_ORDERS.forEach((order) => {
      expect(typeof order.total).toBe('number');
      expect(order.total).toBeGreaterThan(0);
    });
  });

  test('status est toujours une valeur valide', () => {
    SEED_ORDERS.forEach((order) => {
      expect(VALID_STATUSES).toContain(order.status);
    });
  });
});
