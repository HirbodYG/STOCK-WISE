class ProductRepository {
  constructor(db) {
    this.db = db;
  }

  async create(product) {
    const now = new Date().toISOString();
    const result = await this.db.run(
      `INSERT INTO products
      (name, sku, category, quantity, min_stock, price, location, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.sku,
        product.category,
        Number(product.quantity),
        Number(product.minStock),
        Number(product.price),
        product.location || null,
        now,
        now,
      ]
    );

    return this.findById(result.id);
  }

  async findAll(filters = {}) {
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (filters.search) {
      sql += " AND (LOWER(name) LIKE ? OR LOWER(sku) LIKE ?)";
      const value = `%${String(filters.search).toLowerCase()}%`;
      params.push(value, value);
    }

    if (filters.category) {
      sql += " AND LOWER(category) = ?";
      params.push(String(filters.category).toLowerCase());
    }

    if (isEnabled(filters.lowStock)) {
      sql += " AND quantity <= min_stock";
    }

    sql += " ORDER BY id DESC";
    return this.db.all(sql, params);
  }

  async findById(id) {
    return this.db.get("SELECT * FROM products WHERE id = ?", [id]);
  }

  async findBySku(sku) {
    return this.db.get("SELECT * FROM products WHERE sku = ?", [sku]);
  }

  async update(id, product) {
    const now = new Date().toISOString();
    await this.db.run(
      `UPDATE products
      SET name = ?, sku = ?, category = ?, quantity = ?, min_stock = ?, price = ?, location = ?, updated_at = ?
      WHERE id = ?`,
      [
        product.name,
        product.sku,
        product.category,
        Number(product.quantity),
        Number(product.minStock),
        Number(product.price),
        product.location || null,
        now,
        id,
      ]
    );

    return this.findById(id);
  }

  async remove(id) {
    return this.db.run("DELETE FROM products WHERE id = ?", [id]);
  }

  async updateQuantity(id, quantity) {
    const now = new Date().toISOString();
    await this.db.run(
      "UPDATE products SET quantity = ?, updated_at = ? WHERE id = ?",
      [Number(quantity), now, id]
    );
    return this.findById(id);
  }
}

function isEnabled(value) {
  return value === true || String(value).toLowerCase() === "true";
}

module.exports = ProductRepository;
