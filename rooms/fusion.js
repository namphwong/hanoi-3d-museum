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
  const exitCarpetMaterial = new THREE.MeshStandardMaterial({
    color: 0x741f29,
    roughness: .92,
    metalness: 0
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

  // A symbolic final pathway continues behind the exhibits without changing
  // navigation or adding an interactive door.
  box("fusion carpet connector", [2.2, .026, 7], [0, .058, -12.1], exitCarpetMaterial, { cast: false, receive: true });
  for (const x of [-1.13, 1.13]) {
    box("fusion connector trim", [.06, .032, 7], [x, .061, -12.1], materials.gold, { cast: false });
  }
  box("fusion exit carpet", [2.2, .025, 4.9], [0, .055, -18], exitCarpetMaterial, { cast: false, receive: true });
  for (const x of [-1.13, 1.13]) {
    box("fusion exit carpet trim", [.06, .032, 4.9], [x, .061, -18], materials.gold, { cast: false });
  }

  // The dark panel reads as an endpoint only; the existing north wall remains
  // the actual boundary and supplies all required collision.
  box("symbolic exit portal", [2.5, 3.25, .1], [0, 1.72, -20.67], materials.dark, { cast: false });
  box("symbolic exit lintel", [2.7, .08, .12], [0, 3.38, -20.6], materials.gold, { cast: false });
  for (const x of [-1.3, 1.3]) {
    box("symbolic exit side trim", [.08, 3.4, .12], [x, 1.72, -20.6], materials.gold, { cast: false });
  }

  const signCanvas = document.createElement("canvas");
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const signContext = signCanvas.getContext("2d");
  signContext.fillStyle = "#171a1c";
  signContext.fillRect(0, 0, signCanvas.width, signCanvas.height);
  signContext.strokeStyle = "#c5a34d";
  signContext.lineWidth = 12;
  signContext.strokeRect(8, 8, signCanvas.width - 16, signCanvas.height - 16);
  signContext.fillStyle = "#f2e3b4";
  signContext.font = "700 116px Arial";
  signContext.textAlign = "center";
  signContext.textBaseline = "middle";
  signContext.fillText("EXIT  ↑", signCanvas.width / 2, signCanvas.height / 2 + 4);

  const signTexture = new THREE.CanvasTexture(signCanvas);
  signTexture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.65, .66),
    new THREE.MeshBasicMaterial({ map: signTexture })
  );
  sign.name = "fusion exit sign";
  sign.position.set(0, 3.75, -20.53);
  scene.add(sign);

  const exitLight = new THREE.PointLight(0xffe0a3, 3.2, 6.5, 2);
  exitLight.position.set(0, 3.95, -18.7);
  scene.add(exitLight);
}
