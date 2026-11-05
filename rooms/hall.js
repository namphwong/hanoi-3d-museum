// OWNER: feature/fusion-hall-audio
export function createHallRoom({ THREE, scene, box, materials }) {
  // The angled schedule is visible on arrival but stays outside the central runway.
  const scheduleSupport = new THREE.Group();
  scheduleSupport.name = "hall schedule support group";
  scheduleSupport.position.set(-3.8, 0, 4.8);
  scheduleSupport.rotation.y = Math.PI / 3;

  const base = new THREE.Mesh(new THREE.BoxGeometry(5.15, .26, .68), materials.dark);
  base.position.y = .13;
  base.castShadow = true;
  base.receiveShadow = true;
  scheduleSupport.add(base);

  const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(5.25, .045, .78), materials.gold);
  baseTrim.position.y = .285;
  scheduleSupport.add(baseTrim);

  for (const x of [-2.12, 2.12]) {
    const support = new THREE.Mesh(new THREE.BoxGeometry(.12, .48, .12), materials.gold);
    support.position.set(x, .52, 0);
    support.castShadow = true;
    scheduleSupport.add(support);
  }
  scene.add(scheduleSupport);

  // Overview photographs are decorative scene meshes, deliberately excluded
  // from the shared artwork raycast list and therefore never open a popup.
  const textureLoader = new THREE.TextureLoader();
  const overviewFrames = [
    { image: "./assets/decor/overview/anh5.jpg", position: [-4.62, 2.35, -5.35], rotationY: Math.PI / 2, width: 2.2, height: 1.65 },
    { image: "./assets/decor/overview/anh2.jpg", position: [-4.62, 2.35, 5.35], rotationY: Math.PI / 2, width: 2.2, height: 1.428 },
    { image: "./assets/decor/overview/anh10.jpg", position: [4.62, 2.35, -5.35], rotationY: -Math.PI / 2, width: 2.2, height: 1.402 },
    { image: "./assets/decor/overview/anh6.jpg", position: [4.62, 2.35, 5.35], rotationY: -Math.PI / 2, width: 2.2, height: 1.467 }
  ];

  for (const overview of overviewFrames) {
    const group = new THREE.Group();
    group.position.set(...overview.position);
    group.rotation.y = overview.rotationY;
    group.name = `decorative overview ${overview.image}`;

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(overview.width + .16, overview.height + .16, .08),
      materials.dark
    );
    frame.castShadow = true;
    group.add(frame);

    const texture = textureLoader.load(overview.image);
    texture.colorSpace = THREE.SRGBColorSpace;
    const picture = new THREE.Mesh(
      new THREE.PlaneGeometry(overview.width, overview.height),
      new THREE.MeshStandardMaterial({ map: texture, roughness: .82, metalness: 0 })
    );
    picture.position.z = .046;
    group.add(picture);
    scene.add(group);
  }

  // A compact low-poly Đông Sơn drum gives the hall a Vietnamese focal point.
  const bronze = new THREE.MeshStandardMaterial({ color: 0x8b5a24, roughness: .48, metalness: .65 });
  const bronzeDark = new THREE.MeshStandardMaterial({ color: 0x4c2d14, roughness: .58, metalness: .5 });
  const drum = new THREE.Group();
  drum.name = "low-poly Dong Son drum";
  drum.position.set(3.55, .36, -6.55);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(.5, .43, .92, 24), bronze);
  body.position.y = .5;
  body.castShadow = true;
  drum.add(body);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(.68, .54, .14, 32), bronze);
  top.position.y = 1.02;
  top.castShadow = true;
  drum.add(top);

  for (const radius of [.28, .48, .62]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .018, 8, 40), bronzeDark);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.098;
    drum.add(ring);
  }

  for (let index = 0; index < 8; index += 1) {
    const ray = new THREE.Mesh(new THREE.BoxGeometry(.32, .018, .055), bronzeDark);
    ray.position.y = 1.105;
    ray.rotation.y = index * Math.PI / 4;
    drum.add(ray);
  }
  scene.add(drum);

  box("Dong Son drum plinth", [1.18, .36, 1.18], [3.55, .18, -6.55], materials.dark, { collider: true });
  box("Dong Son drum plinth trim", [1.28, .045, 1.28], [3.55, .385, -6.55], materials.gold, { cast: false });
}
