const { validateProductPayload } = require("../validation/productValidation");

class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    const validation = validateProductPayload(data);
    if (!validation.isValid) {
      return { error: { status: 400, message: validation.errors.join(", ") } };
    }

    const existing = await this.repository.findBySku(data.sku);
    if (existing) {
      return { error: { status: 409, message: "sku already exists" } };
    }

    const created = await this.repository.create(data);
    return { data: mapProduct(created) };
  }

  async list(filters) {
    const rows = await this.repository.findAll(filters);
    return { data: rows.map(mapProduct) };
  }

  async getById(id) {
    const row = await this.repository.findById(id);
    if (!row) {
      return { error: { status: 404, message: "product not found" } };
    }

    return { data: mapProduct(row) };
  }

  async update(id, data) {
    const validation = validateProductPayload(data);
    if (!validation.isValid) {
      return { error: { status: 400, message: validation.errors.join(", ") } };
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      return { error: { status: 404, message: "product not found" } };
    }

    const skuOwner = await this.repository.findBySku(data.sku);
    if (skuOwner && Number(skuOwner.id) !== Number(id)) {
      return { error: { status: 409, message: "sku already exists" } };
    }

    const updated = await this.repository.update(id, data);
    return { data: mapProduct(updated) };
  }

  async remove(id) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return { error: { status: 404, message: "product not found" } };
    }

    await this.repository.remove(id);
    return { data: { message: "product deleted" } };
  }
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    quantity: row.quantity,
    minStock: row.min_stock,
    price: row.price,
    location: row.location,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = ProductService;
