# Quản lý danh mục sản phẩm

Ứng dụng TypeScript chạy bằng Node.js với `strict: true`. Dữ liệu mẫu gồm 5 sản phẩm và được lưu trong bộ nhớ.

## Cài đặt và chạy

Cần Node.js 18 trở lên và npm.

```sh
npm ci
npm run check
npm start
```

`npm start` biên dịch TypeScript vào `dist/` rồi chạy ví dụ bằng Node.js.

| File | Chức năng |
| --- | --- |
| `src/product-types.ts` | Khai báo kiểu sản phẩm, trạng thái, nhãn tiếng Việt và mapped type lỗi theo trường. |
| `src/product-service.ts` | Lưu dữ liệu mẫu và cung cấp hàm xem, tìm, cập nhật, đọc trường và lọc. |
| `src/main.ts` | Chạy sáu tình huống mẫu và kiểm tra các lời gọi sai kiểu bằng `@ts-expect-error`. |
| `src/browser.ts` | Kết nối các hàm danh mục với giao diện demo. |
| `docs/index.html` | Trang demo trên GitHub Pages. |
| `tsconfig.json` và `tsconfig.pages.json` | Cấu hình biên dịch cho Node.js và trình duyệt. |

`(typeof PRODUCT_STATUSES)[number]` suy ra union trạng thái. `Partial<Product>` mô tả dữ liệu cập nhật từng phần. `keyof` giới hạn tên trường và indexed access giữ kiểu giá trị tương ứng.

Chạy `npx tsc -p tsconfig.pages.json` để tạo lại JavaScript trong `docs/assets/`. GitHub Pages xuất bản từ `main` và thư mục `/docs`.
