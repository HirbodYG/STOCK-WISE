function buildProductController(service) {
  return {
    create: async (req, res) => {
      const result = await service.create(req.body);
      if (result.error) {
        res.status(result.error.status).json({ error: result.error.message });
        return;
      }
      res.status(201).json(result.data);
    },

    list: async (req, res) => {
      const result = await service.list(req.query);
      res.status(200).json(result.data);
    },

    getById: async (req, res) => {
      const result = await service.getById(Number(req.params.id));
      if (result.error) {
        res.status(result.error.status).json({ error: result.error.message });
        return;
      }
      res.status(200).json(result.data);
    },

    update: async (req, res) => {
      const result = await service.update(Number(req.params.id), req.body);
      if (result.error) {
        res.status(result.error.status).json({ error: result.error.message });
        return;
      }
      res.status(200).json(result.data);
    },

    remove: async (req, res) => {
      const result = await service.remove(Number(req.params.id));
      if (result.error) {
        res.status(result.error.status).json({ error: result.error.message });
        return;
      }
      res.status(200).json(result.data);
    },
  };
}

module.exports = buildProductController;
