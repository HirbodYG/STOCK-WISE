function validateProductPayload(payload) {
  const errors = [];
  const requiredFields = ["name", "sku", "category", "quantity", "minStock", "price"];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      errors.push(`${field} is required`);
    }
  }

  if (payload.name && String(payload.name).trim().length < 2) {
    errors.push("name must be at least 2 characters");
  }

  if (payload.quantity !== undefined && Number(payload.quantity) < 0) {
    errors.push("quantity must be >= 0");
  }

  if (payload.minStock !== undefined && Number(payload.minStock) < 0) {
    errors.push("minStock must be >= 0");
  }

  if (payload.price !== undefined && Number(payload.price) < 0) {
    errors.push("price must be >= 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateProductPayload,
};
