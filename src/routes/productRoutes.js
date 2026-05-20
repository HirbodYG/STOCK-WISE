const express = require("express");

function createProductRoutes(controller) {
  const router = express.Router();

  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.post("/:id/adjust-stock", controller.adjustStock);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
}

module.exports = createProductRoutes;
