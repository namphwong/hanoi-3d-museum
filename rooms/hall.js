// OWNER: feature/fusion-hall-audio
export function createHallRoom({ THREE, scene, box, materials }) {
  // Keep the station schedule squarely on the hall's centreline so it reads as
  // the main orientation board when visitors arrive from the entrance.
  const scheduleSupport = new THREE.Group();
  scheduleSupport.name = "hall schedule support group";
  scheduleSupport.position.set(0, 0, 4.8);

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
