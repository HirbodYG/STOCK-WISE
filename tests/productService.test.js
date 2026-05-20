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
});
