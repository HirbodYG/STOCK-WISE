# StockWise - Inventory CRUD Project

StockWise is a web-based inventory management project built for System Analysis and Design requirements.
It includes a Vanilla JavaScript SPA frontend, a Node.js + Express backend, SQLite database, REST API, validation, unit tests, and Swagger documentation.

## Tech Stack

- Frontend: Vanilla JavaScript (SPA)
- Backend: Node.js + Express
- Database: SQLite
- API Docs: Swagger UI (OpenAPI)
- Testing: Jest

## Project Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  db/
  repositories/
  routes/
  services/
  validation/
public/
swagger/
tests/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start in development mode:

```bash
npm run dev
```

3. Open:
- App UI: <http://localhost:3000>
- Swagger Docs: <http://localhost:3000/api-docs>

## API Overview

- `GET /api/products` list products (supports `search`, `category`, `lowStock=true`)
- `GET /api/products/:id` get one product
- `POST /api/products` create product
- `PUT /api/products/:id` update product
- `DELETE /api/products/:id` delete product

## Validation Rules

- `name` required, minimum 2 characters
- `sku` required and unique
- `quantity >= 0`
- `minStock >= 0`
- `price >= 0`

## Tests

Run:

```bash
npm test
```

Current tests focus on service layer business rules (validation + unique SKU checks).

## Reproducibility

- Clone the repository
- Run `npm install`
- Run `npm run dev`
- Use Swagger or frontend UI to test CRUD
