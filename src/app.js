const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const db = require("./db/database");
const ProductRepository = require("./repositories/productRepository");
const ProductService = require("./services/productService");
const buildProductController = require("./controllers/productController");
const createProductRoutes = require("./routes/productRoutes");

const swaggerDoc = YAML.load(path.join(__dirname, "../swagger/openapi.yaml"));

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));

  const repo = new ProductRepository(db);
  const service = new ProductService(repo);
  const controller = buildProductController(service);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/products", createProductRoutes(controller));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  return app;
}

module.exports = createApp;
