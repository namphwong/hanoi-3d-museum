// Decorative overview photographs are intentionally kept outside the shared
// artwork list. They never enter the interaction raycast and cannot open a modal.
const overviewPlacements = [
  // Main Hall: four existing photographs on the inner side walls.
  { file: "anh5.jpg", position: [-4.62, 2.35, -5.35], rotationY: Math.PI / 2 },
  { file: "anh2.jpg", position: [-4.62, 2.35, 5.35], rotationY: Math.PI / 2 },
  { file: "anh10.jpg", position: [4.62, 2.35, -5.35], rotationY: -Math.PI / 2 },
  { file: "anh6.jpg", position: [4.62, 2.35, 5.35], rotationY: -Math.PI / 2 },

  // Station 1 / Past Gallery: two evenly spaced rows on the north and south walls.
  { file: "anh1.jpg", position: [-13, 2.35, -7.82], rotationY: 0 },
  { file: "anh3.jpg", position: [-9.9, 2.35, -7.82], rotationY: 0 },
  { file: "anh4.jpg", position: [-6.8, 2.35, -7.82], rotationY: 0 },
  { file: "anh7.jpg", position: [-13, 2.35, 7.82], rotationY: Math.PI },
  { file: "anh8.jpg", position: [-9.9, 2.35, 7.82], rotationY: Math.PI },
  { file: "anh9.jpg", position: [-6.8, 2.35, 7.82], rotationY: Math.PI },

  // Future Gallery: a balanced row on the currently empty south wall.
  { file: "001-vc3b9ng-lc3a2n-ce1baadn-ce1bba7a-ba-mc6b0c6a1i-sc3a1u-phe1bb91-khoe1baa3ng-nc483m-1925.jpg", position: [6.8, 2.35, 7.82], rotationY: Math.PI },
  { file: "00417.jpg", position: [9.9, 2.35, 7.82], rotationY: Math.PI },
  { file: "Ha-Noi-thay-doi-ngo-ngang-qua-nhung-thuoc-anh-xua-va-nay-2-1673942811-945-width660height440.jpg", position: [13, 2.35, 7.82], rotationY: Math.PI },

  // Fusion Gallery: three photographs on the outer side walls, clear of EXIT.
  { file: "Ha-Noi-Trien-Lam-3-2.jpg", position: [-14.82, 2.35, -12.4], rotationY: Math.PI / 2 },
  { file: "images.jpg", position: [-14.82, 2.35, -16.2], rotationY: Math.PI / 2 },
  { file: "xem-hinh-anh-ha-noi-trong-qua-khu-va-hien-tai-14.jpg", position: [14.82, 2.35, -16.2], rotationY: -Math.PI / 2 }
];

export const overviewFiles = overviewPlacements.map(({ file }) => file);

export function createOverviewGallery({ THREE, scene, materials }) {
  const textureLoader = new THREE.TextureLoader();

  for (const placement of overviewPlacements) {
    const imagePath = `./assets/decor/overview/${placement.file}`;
    textureLoader.load(imagePath, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;

      // Fit inside a consistent museum frame while preserving the exact source ratio.
      const aspect = texture.image.naturalWidth / texture.image.naturalHeight;
      const maxWidth = 2.45;
      const maxHeight = 1.72;
      const width = Math.min(maxWidth, maxHeight * aspect);
      const height = width / aspect;

      const group = new THREE.Group();
      group.name = `decorative overview ${placement.file}`;
      group.position.set(...placement.position);
      group.rotation.y = placement.rotationY;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + .16, height + .16, .08),
        materials.dark
      );
      frame.castShadow = true;
      group.add(frame);

      const picture = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshStandardMaterial({ map: texture, roughness: .82, metalness: 0 })
      );
      picture.position.z = .046;
      group.add(picture);
      scene.add(group);
    }, undefined, error => {
      console.warn(`Không tải được ảnh overview: ${imagePath}`, error);
    });
  }
}
