// OWNER: feature/fusion-hall-audio
export function createFusionRoom({ THREE, scene, box, materials }) {
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x6f173c,
    roughness: .82,
    metalness: .04
  });
  const floorInsetMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2025,
    roughness: .94,
    metalness: .02
  });

  // A deep-red feature wall and dark floor inset give this room its own identity
  // while keeping the shared shell and circulation untouched.
  box("fusion feature wall", [12.4, 4.35, .08], [0, 2.35, -20.78], accentMaterial, { cast: false });
  box("fusion floor inset", [12.6, .035, 7.2], [0, .025, -16.7], floorInsetMaterial, { cast: false, receive: true });

  // Low plinths visually anchor the two freestanding, double-sided displays.
  for (const x of [-4.1, 4.1]) {
    box("fusion display plinth", [2.85, .28, .72], [x, .14, -15.2], materials.dark, { collider: true });
    box("fusion plinth trim", [2.95, .045, .82], [x, .3, -15.2], materials.gold, { cast: false });

    const light = new THREE.PointLight(0xff8ab7, 2.4, 7, 2);
    light.position.set(x, 3.95, -14.4);
    scene.add(light);
  }
}
