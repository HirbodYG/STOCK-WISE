const ProductService = require("../src/services/productService");

function createRepoMock(overrides = {}) {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findBySku: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    ...overrides,
  };
}

describe("ProductService", () => {
  it("returns 400 when payload is invalid", async () => {
    const repo = createRepoMock();
    const service = new ProductService(repo);

    const result = await service.create({
      name: "A",
      sku: "",
      category: "",
      quantity: -1,
      minStock: -1,
      price: -1,
    });

    expect(result.error.status).toBe(400);
  });

  it("returns 409 when sku already exists", async () => {
    const repo = createRepoMock({
      findBySku: jest.fn().mockResolvedValue({ id: 1, sku: "SKU-1" }),
    });
    const service = new ProductService(repo);

    const result = await service.create({
      name: "Rice",
      sku: "SKU-1",
      category: "Food",
      quantity: 2,
      minStock: 1,
      price: 3.5,
    });

    expect(result.error.status).toBe(409);
  });

  it("decreases stock with OUT action", async () => {
    const repo = createRepoMock({
      findById: jest.fn().mockResolvedValue({ id: 1, quantity: 10 }),
      updateQuantity: jest.fn().mockResolvedValue({
        id: 1,
        name: "Rice",
        sku: "SKU-1",
        category: "Food",
        quantity: 7,
        min_stock: 2,
        price: 3.5,
        location: null,
        created_at: "2026-01-01",
        updated_at: "2026-01-02",
      }),
    });
    const service = new ProductService(repo);
    const result = await service.adjustStock(1, { action: "OUT", amount: 3 });
    expect(result.data.quantity).toBe(7);
  });

  it("blocks decreasing below zero", async () => {
    const repo = createRepoMock({
      findById: jest.fn().mockResolvedValue({ id: 1, quantity: 2 }),
    });
    const service = new ProductService(repo);
    const result = await service.adjustStock(1, { action: "OUT", amount: 5 });
    expect(result.error.status).toBe(400);
  });
});
