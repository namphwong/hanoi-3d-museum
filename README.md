# Hanoi Then & Now — 3D Museum

Bản nền bảo tàng 3D tối ưu cho GitHub Pages. Dự án dùng Three.js trực tiếp từ CDN, không cần cài Node.js hoặc chạy bước build.

## Chạy thử trên máy

Do trình duyệt không cho phép ES Modules chạy ổn định bằng `file://`, hãy mở thư mục bằng một web server tĩnh. Ví dụ với Python:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Thay ảnh và nội dung

1. Tạo thư mục `assets/artworks/` và chép ảnh vào đó.
2. Mở `gallery-data.js`.
3. Đổi `image: null` thành đường dẫn như `image: "./assets/artworks/past-01.jpg"`.
4. Sửa `title`, `description`, `meta` nếu cần.

Mỗi tác phẩm có thể thay đổi vị trí, hướng và kích thước bằng `position`, `rotation`, `size`. Giữ tên file không dấu, không khoảng trắng để tránh lỗi trên GitHub Pages.

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub (ví dụ `hanoi-museum`).
2. Đẩy toàn bộ file trong thư mục này lên nhánh `main`.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)` rồi Save.

Website sẽ có địa chỉ dạng `https://TEN-CUA-BAN.github.io/hanoi-museum/`.

Nếu repository được đặt đúng tên `TEN-CUA-BAN.github.io`, website sẽ nằm ngay tại `https://TEN-CUA-BAN.github.io/`.

## Điều khiển

- Desktop: WASD/phím mũi tên để di chuyển, chuột để nhìn, Esc để thả chuột.
- Mobile: cụm phím ở góc dưới trái để di chuyển, vuốt màn hình để nhìn.
- Nhấp vào tranh khi tâm ngắm đổi sang màu vàng để mở thông tin.

## Cấu trúc

- `index.html`: giao diện và các hộp thoại.
- `styles.css`: toàn bộ phong cách hiển thị.
- `app.js`: scene Three.js, kiến trúc, ánh sáng, điều khiển và tương tác.
- `gallery-data.js`: dữ liệu ảnh/nội dung để thay đổi nhanh.
- `.nojekyll`: yêu cầu GitHub Pages phục vụ dự án như một website tĩnh thuần túy.
