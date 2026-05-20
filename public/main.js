const apiBase = "/api/products";
const messageEl = document.getElementById("message");
const form = document.getElementById("productForm");
const rowsEl = document.getElementById("productRows");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const filterBtn = document.getElementById("filterBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const lowStockOnlyEl = document.getElementById("lowStockOnly");
const saveBtn = document.getElementById("saveBtn");
const statProductsEl = document.getElementById("statProducts");
const statUnitsEl = document.getElementById("statUnits");
const statLowStockEl = document.getElementById("statLowStock");
const statValueEl = document.getElementById("statValue");

let editingId = null;
let messageTimeout = null;

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");
  messageEl.style.background = isError ? "#fee2e2" : "#ecfdf5";
  messageEl.style.color = isError ? "#b91c1c" : "#047857";

  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  messageTimeout = setTimeout(() => {
    messageEl.classList.add("hidden");
  }, 2200);
}

function formData() {
  return {
    name: document.getElementById("name").value.trim(),
    sku: document.getElementById("sku").value.trim(),
    category: document.getElementById("category").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    minStock: Number(document.getElementById("minStock").value),
    price: Number(document.getElementById("price").value),
    location: document.getElementById("location").value.trim(),
  };
}

function resetForm() {
  editingId = null;
  form.reset();
  saveBtn.textContent = "Save Product";
}

function fillForm(product) {
  document.getElementById("name").value = product.name;
  document.getElementById("sku").value = product.sku;
  document.getElementById("category").value = product.category;
  document.getElementById("quantity").value = product.quantity;
  document.getElementById("minStock").value = product.minStock;
  document.getElementById("price").value = product.price;
  document.getElementById("location").value = product.location || "";
  saveBtn.textContent = "Update Product";
}

function queryString() {
  const search = document.getElementById("search").value.trim();
  const category = document.getElementById("categoryFilter").value.trim();
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (lowStockOnlyEl.checked) params.set("lowStock", "true");
  return params.toString();
}

async function loadProducts() {
  saveBtn.disabled = true;
  rowsEl.innerHTML = `<tr><td colspan="8" class="empty">Loading products...</td></tr>`;

  const query = queryString();
  const res = await fetch(`${apiBase}${query ? `?${query}` : ""}`);
  const products = await res.json();
  rowsEl.innerHTML = "";
  renderStats(products);

  if (!products.length) {
    rowsEl.innerHTML = `<tr><td colspan="8" class="empty">No products found. Try different filters.</td></tr>`;
    saveBtn.disabled = false;
    return;
  }

  for (const product of products) {
    const tr = document.createElement("tr");
    const lowClass = product.quantity <= product.minStock ? "low-stock" : "";
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.sku}</td>
      <td>${product.category}</td>
      <td class="${lowClass}">${product.quantity}</td>
      <td>${product.minStock}</td>
      <td>$${Number(product.price).toFixed(2)}</td>
      <td class="muted">${product.location || "-"}</td>
      <td>
        <div class="row-actions">
          <button type="button" class="btn-secondary btn-small" data-edit="${product.id}">Edit</button>
          <button type="button" class="btn-danger btn-small" data-delete="${product.id}">Delete</button>
        </div>
      </td>
    `;
    rowsEl.appendChild(tr);
  }

  saveBtn.disabled = false;
}

function renderStats(products) {
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowStockCount = products.filter(
    (item) => Number(item.quantity) <= Number(item.minStock)
  ).length;
  const inventoryValue = products.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  );

  statProductsEl.textContent = String(totalProducts);
  statUnitsEl.textContent = String(totalUnits);
  statLowStockEl.textContent = String(lowStockCount);
  statValueEl.textContent = `$${inventoryValue.toFixed(2)}`;
}

async function saveProduct(event) {
  event.preventDefault();
  saveBtn.disabled = true;

  const payload = formData();
  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${apiBase}/${editingId}` : apiBase;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();
  if (!res.ok) {
    showMessage(body.error || "Operation failed", true);
    saveBtn.disabled = false;
    return;
  }

  showMessage(editingId ? "Product updated" : "Product created");
  resetForm();
  await loadProducts();
}

async function handleTableClick(event) {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;

  if (editId) {
    const res = await fetch(`${apiBase}/${editId}`);
    const product = await res.json();
    editingId = Number(editId);
    fillForm(product);
    showMessage(`Editing product #${editId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (deleteId) {
    const ok = window.confirm("Delete this product?");
    if (!ok) {
      return;
    }

    const res = await fetch(`${apiBase}/${deleteId}`, { method: "DELETE" });
    const body = await res.json();
    if (!res.ok) {
      showMessage(body.error || "Delete failed", true);
      return;
    }
    showMessage("Product deleted");
    await loadProducts();
  }
}

function clearFilters() {
  document.getElementById("search").value = "";
  document.getElementById("categoryFilter").value = "";
  lowStockOnlyEl.checked = false;
  loadProducts();
}

form.addEventListener("submit", saveProduct);
rowsEl.addEventListener("click", handleTableClick);
cancelEditBtn.addEventListener("click", () => {
  resetForm();
  showMessage("Edit canceled");
});
filterBtn.addEventListener("click", () => {
  loadProducts();
});
clearFiltersBtn.addEventListener("click", clearFilters);
document.getElementById("search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadProducts();
  }
});
document.getElementById("categoryFilter").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadProducts();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingId) {
    resetForm();
    showMessage("Edit canceled");
  }
});

loadProducts();
