# Phân công phát triển song song

## Branch của bạn

`feature/past-future-entrance`

Chỉ chỉnh:

- `data/past.js`, `data/future.js`, `data/entrance.js`
- `rooms/past.js`, `rooms/future.js`, `rooms/entrance.js`
- `assets/artworks/past/`, `assets/artworks/future/`, `assets/artworks/entrance/`

## Branch của Nhật

`feature/fusion-hall-audio`

Chỉ chỉnh:

- `data/fusion.js`, `data/hall.js`, `data/audio.js`
- `rooms/fusion.js`, `rooms/hall.js`
- `audio-manager.js`
- `assets/artworks/fusion/`, `assets/artworks/hall/`, `assets/audio/`

## File dùng chung

Không tự ý chỉnh song song các file sau:

- `app.js`
- `gallery-data.js`
- `index.html`
- `styles.css`

Các file dùng chung đã được nối sẵn với module của từng người. Nếu bắt buộc phải sửa, cần thông báo trước, commit riêng và yêu cầu người còn lại cập nhật `main` trước khi tiếp tục.

## Quy trình

1. Luôn bắt đầu bằng `git pull origin main`.
2. Làm trên đúng branch được phân công.
3. Commit nhỏ theo khu vực, ví dụ `feat(past): add first two artworks`.
4. Trước khi merge, cập nhật `main` vào branch và chạy thử.
5. Chỉ merge khi GitHub Pages build thành công và không có tài nguyên lỗi 404.
