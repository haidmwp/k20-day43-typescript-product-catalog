import { filterBy, findProductById, getAllProducts, getStockStatus, updateProduct } from "./product-service.js";
import { PRODUCT_STATUS_LABELS } from "./product-types.js";
import type { Product, ProductUpdate } from "./product-types.js";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const table = document.querySelector<HTMLTableSectionElement>("#products")!;
const filters = document.querySelector<HTMLFormElement>("#filters")!;
const category = document.querySelector<HTMLSelectElement>("#category")!;
const stockFilter = document.querySelector<HTMLInputElement>("#stock-filter")!;
const count = document.querySelector<HTMLElement>("#count")!;
const edit = document.querySelector<HTMLFormElement>("#edit")!;
const id = document.querySelector<HTMLInputElement>("#product-id")!;
const nameInput = document.querySelector<HTMLInputElement>("#name")!;
const price = document.querySelector<HTMLInputElement>("#price")!;
const stock = document.querySelector<HTMLInputElement>("#stock")!;
const result = document.querySelector<HTMLElement>("#result")!;

function stockLabel(product: Product): string {
  return PRODUCT_STATUS_LABELS[getStockStatus(product.stock)];
}

function render(): void {
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
  const update: ProductUpdate = {};
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
