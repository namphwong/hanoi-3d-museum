// Chỉnh sửa file này để thay tranh. image có thể là đường dẫn nội bộ,
// ví dụ "./assets/artworks/past-01.jpg", hoặc URL https công khai.
import { pastArtworks } from "./data/past.js";
import { futureArtworks } from "./data/future.js";
import { entranceArtworks } from "./data/entrance.js";
import { fusionArtworks } from "./data/fusion.js";
import { hallArtworks } from "./data/hall.js";

export const artworks = [
  ...pastArtworks,
  ...futureArtworks,
  ...entranceArtworks,
  ...fusionArtworks,
  ...hallArtworks
];

export const museumConfig = {
  title: "HANOI THEN & NOW",
  startPosition: [0, 1.7, 7.2],
  startRotationY: 0,
  moveSpeed: 4.6,
  eyeHeight: 1.7
};
