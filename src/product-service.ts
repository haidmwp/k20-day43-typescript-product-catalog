import { PRODUCT_STATUSES } from "./product-types.js";
import type { Product, ProductStatus, ProductUpdate } from "./product-types.js";

const products: Product[] = [
  { id: 101, name: "Laptop Air", price: 24990000, category: "computer", stock: 8 },
  { id: 102, name: "Chuột không dây", price: 450000, category: "accessory", stock: 4 },
  { id: 103, name: "Bàn phím cơ", price: 1290000, category: "accessory", stock: 12 },
  { id: 104, name: "Màn hình 27 inch", price: 5990000, category: "computer", stock: 0 },
  { id: 105, name: "Tai nghe Bluetooth", price: 1890000, category: "audio", stock: 5 },
];

export function getAllProducts(): Product[] {
  return products.map((product) => ({ ...product }));
}

export function findProductById(id: number): Product | undefined {
  const product = products.find((item) => item.id === id);
  return product && { ...product };
}

export function updateProduct(id: number, update: ProductUpdate): Product | undefined {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }
  const updated = { ...products[index], ...update };
  products[index] = updated;
  return { ...updated };
}

export function getProductField<K extends keyof Product>(product: Product, key: K): Product[K] {
  return product[key];
}

export function filterBy<T, K extends keyof T>(items: T[], key: K, value: T[K]): T[] {
  return items.filter((item) => item[key] === value);
}

export function getStockStatus(stock: number): ProductStatus {
  const [inStock, lowStock, outOfStock] = PRODUCT_STATUSES;
  if (stock <= 0) {
    return outOfStock;
  }
  return stock <= 5 ? lowStock : inStock;
}
