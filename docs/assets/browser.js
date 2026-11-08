import { filterBy, findProductById, getAllProducts, getStockStatus, updateProduct } from "./product-service.js";
import { PRODUCT_STATUS_LABELS } from "./product-types.js";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const table = document.querySelector("#products");
const filters = document.querySelector("#filters");
const category = document.querySelector("#category");
const stockFilter = document.querySelector("#stock-filter");
const count = document.querySelector<HTMLElement>("#count");
const edit = document.querySelector("#edit");
const id = document.querySelector("#product-id");
const nameInput = document.querySelector("#name");
const price = document.querySelector("#price");
const stock = document.querySelector("#stock");
const result = document.querySelector<HTMLElement>("#result");

function stockLabel(product) {
  return PRODUCT_STATUS_LABELS[getStockStatus(product.stock)];
}

function render() {
  let products = getAllProducts();
  if (category.value) {
    products = filterBy(products, "category", category.value);
  }
  if (stockFilter.value && stockFilter.validity.valid) {
    products = filterBy(products, "stock", stockFilter.valueAsNumber);
  }
  table.replaceChildren();
  for (const product of products) {
    const row = table.insertRow();
    const values = [product.id, product.name, currency.format(product.price), product.category, product.stock, stockLabel(product)];
    for (const value of values) {
      row.insertCell().textContent = String(value);
    }
  }
  count.textContent = products.length ? products.length + " sản phẩm" : "Không có sản phẩm phù hợp.";
}

for (const value of new Set(getAllProducts().map((product) => product.category))) {
  category.add(new Option(value, value));
}
filters.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});
filters.addEventListener("reset", () => queueMicrotask(render));

edit.addEventListener("submit", (event) => {
  event.preventDefault();
  const isUpdate = event.submitter instanceof HTMLButtonElement && event.submitter.value === "update";
  const productId = id.valueAsNumber;
  const update = {};
  if (nameInput.value.trim()) update.name = nameInput.value.trim();
  if (price.value) update.price = price.valueAsNumber;
  if (stock.value) update.stock = stock.valueAsNumber;

  if (isUpdate && Object.keys(update).length === 0) {
    result.textContent = "Nhập ít nhất một trường cần cập nhật.";
    return;
  }
  const product = isUpdate ? updateProduct(productId, update) : findProductById(productId);
  if (!product) {
    result.textContent = "Không tìm thấy sản phẩm có ID " + productId + ".";
    return;
  }
  const action = isUpdate ? "Đã cập nhật" : "Đã tìm thấy";
  result.textContent = action + " #" + product.id + " · " + product.name + " · " + currency.format(product.price) + " · Tồn kho " + product.stock + " · " + stockLabel(product) + ".";
  if (isUpdate) render();
});

render();
