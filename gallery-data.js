// Chỉnh sửa file này để thay tranh. image có thể là đường dẫn nội bộ,
// ví dụ "./assets/artworks/past-01.jpg", hoặc URL https công khai.
export const artworks = [
  {
    id: "past-01",
    section: "PAST GALLERY",
    title: "Old Quarter Memories",
    description: "Thay bằng mô tả cho tư liệu, hình ảnh hoặc nhiệm vụ học tập của bạn.",
    meta: "PLACEHOLDER · IMAGE 01",
    image: null,
    accent: "#b76a48",
    position: [-13.82, 2.35, 2],
    rotation: [0, Math.PI / 2, 0],
    size: [3.2, 2.05]
  },
  {
    id: "past-02",
    section: "PAST GALLERY",
    title: "A City in Time",
    description: "Vị trí dành sẵn cho ảnh thứ hai của khu Past Gallery.",
    meta: "PLACEHOLDER · IMAGE 02",
    image: null,
    accent: "#8f4f38",
    position: [-8, 2.35, -6.82],
    rotation: [0, 0, 0],
    size: [3.4, 2.1]
  },
  {
    id: "future-01",
    section: "FUTURE GALLERY",
    title: "The City Ahead",
    description: "Vị trí dành sẵn cho hình ảnh hoặc task của khu Future Gallery.",
    meta: "PLACEHOLDER · IMAGE 03",
    image: null,
    accent: "#3d84a8",
    position: [13.82, 2.35, 2],
    rotation: [0, -Math.PI / 2, 0],
    size: [3.2, 2.05]
  },
  {
    id: "future-02",
    section: "FUTURE GALLERY",
    title: "Tomorrow's Skyline",
    description: "Vị trí dành sẵn cho ảnh thứ hai của khu Future Gallery.",
    meta: "PLACEHOLDER · IMAGE 04",
    image: null,
    accent: "#28657d",
    position: [8, 2.35, -6.82],
    rotation: [0, 0, 0],
    size: [3.4, 2.1]
  },
  {
    id: "fusion-01",
    section: "FUSION GALLERY",
    title: "Where Times Meet",
    description: "Vị trí dành sẵn cho nội dung kết nối quá khứ và tương lai.",
    meta: "PLACEHOLDER · IMAGE 05",
    image: null,
    accent: "#a88b3d",
    position: [-6, 2.35, -15.82],
    rotation: [0, 0, 0],
    size: [3.5, 2.15]
  },
  {
    id: "fusion-02",
    section: "FUSION GALLERY",
    title: "New Traditions",
    description: "Vị trí dành sẵn cho ảnh thứ hai của khu Fusion Gallery.",
    meta: "PLACEHOLDER · IMAGE 06",
    image: null,
    accent: "#826d35",
    position: [6, 2.35, -15.82],
    rotation: [0, 0, 0],
    size: [3.5, 2.15]
  },
  {
    id: "hall-01",
    section: "MAIN HALL",
    title: "Welcome to Hanoi",
    description: "Ảnh mở đầu ở sảnh. Bạn có thể dùng vị trí này cho poster chính của triển lãm.",
    meta: "PLACEHOLDER · HERO IMAGE",
    image: null,
    accent: "#b33a2e",
    position: [0, 2.55, -8.82],
    rotation: [0, 0, 0],
    size: [4.6, 2.6]
  }
];

export const museumConfig = {
  title: "HANOI THEN & NOW",
  startPosition: [0, 1.7, 7.2],
  startRotationY: 0,
  moveSpeed: 4.6,
  eyeHeight: 1.7
};
