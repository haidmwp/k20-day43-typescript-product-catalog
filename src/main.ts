import { filterBy, findProductById, getAllProducts, getProductField, getStockStatus, updateProduct } from "./product-service";
import { PRODUCT_STATUS_LABELS } from "./product-types";
import type { Product } from "./product-types";

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

function printProducts(products: Product[]): void {
  console.table(products.map((product) => ({
    ID: product.id,
    Tên: getProductField(product, "name"),
    Giá: currency.format(getProductField(product, "price")),
    "Danh mục": product.category,
    "Tồn kho": product.stock,
    "Trạng thái": PRODUCT_STATUS_LABELS[getStockStatus(product.stock)],
  })));
}

function printResult(title: string, id: number, product: Product | undefined): void {
  console.log("\n" + title);
  if (product === undefined) {
    console.log("Không tìm thấy sản phẩm có ID " + id + ".");
    return;
  }
  printProducts([product]);
}

console.log("1. Danh sách sản phẩm");
printProducts(getAllProducts());
printResult("2a. Tìm ID tồn tại", 101, findProductById(101));
printResult("2b. Tìm ID không tồn tại", 999, findProductById(999));

const before = findProductById(101);
const after = updateProduct(101, { price: 23990000 });
console.log("\n3. Trước và sau khi chỉ cập nhật giá");
if (before && after) printProducts([before, after]);

printResult("4. Cập nhật tên và tồn kho", 102, updateProduct(102, { name: "Chuột không dây Pro", stock: 7 }));

const products = getAllProducts();
console.log("\n5a. Lọc theo danh mục computer");
printProducts(filterBy(products, "category", "computer"));
console.log("\n5b. Lọc theo tồn kho bằng 0");
printProducts(filterBy(products, "stock", 0));

if (false) {
  // @ts-expect-error Giá trị của category phải là string.
  filterBy(products, "category", 0);
  // @ts-expect-error Giá trị của stock phải là number.
  filterBy(products, "stock", "0");
  // @ts-expect-error Product không có trường color.
  filterBy(products, "color", "blue");
}

printResult("6. Cập nhật ID không tồn tại", 999, updateProduct(999, { stock: 1 }));
