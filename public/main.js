const apiBase = "/api/products";
const messageEl = document.getElementById("message");
const rowsEl = document.getElementById("productRows");
const filterBtn = document.getElementById("filterBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const lowStockOnlyEl = document.getElementById("lowStockOnly");
const statProductsEl = document.getElementById("statProducts");
const statUnitsEl = document.getElementById("statUnits");
const statLowStockEl = document.getElementById("statLowStock");
const statValueEl = document.getElementById("statValue");

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
  rowsEl.innerHTML = `<tr><td colspan="7" class="empty">Loading products...</td></tr>`;

  const query = queryString();
  const res = await fetch(`${apiBase}${query ? `?${query}` : ""}`);
  const products = await res.json();
  rowsEl.innerHTML = "";
  renderStats(products);

  if (!products.length) {
    rowsEl.innerHTML = `<tr><td colspan="7" class="empty">No products found. Try different filters.</td></tr>`;
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
    `;
    rowsEl.appendChild(tr);
  }
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

function clearFilters() {
  document.getElementById("search").value = "";
  document.getElementById("categoryFilter").value = "";
  lowStockOnlyEl.checked = false;
  loadProducts();
}

filterBtn.addEventListener("click", () => {
  loadProducts();
});
clearFiltersBtn.addEventListener("click", clearFilters);
lowStockOnlyEl.addEventListener("change", loadProducts);
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
loadProducts();
