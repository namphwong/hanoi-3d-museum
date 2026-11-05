import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { artworks, museumConfig } from "./gallery-data.js";

const app = document.querySelector("#app");
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
app.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x191c1e);
scene.fog = new THREE.Fog(0x191c1e, 18, 52);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.05, 100);
camera.position.fromArray(museumConfig.startPosition);
camera.rotation.y = museumConfig.startRotationY;
scene.add(camera);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.pointerSpeed = 0.72;
const clock = new THREE.Clock();
const keys = new Set();
const colliders = [];
const artworkMeshes = [];
const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
raycaster.far = 5;

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe7e6e0, roughness: .86, metalness: 0 });
const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0x777a7b, roughness: .94, metalness: .02 });
const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x1c2023, roughness: .72, metalness: .2 });
const goldMaterial = new THREE.MeshStandardMaterial({ color: 0x9a7c35, roughness: .55, metalness: .38 });

scene.add(new THREE.HemisphereLight(0xe7edf3, 0x303236, 1.35));
const sun = new THREE.DirectionalLight(0xfff7e7, 2.1);
sun.position.set(-8, 13, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -24; sun.shadow.camera.right = 24; sun.shadow.camera.top = 24; sun.shadow.camera.bottom = -24;
scene.add(sun);

function box(name, size, position, material, { collider = false, cast = true, receive = true } = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name; mesh.position.set(...position); mesh.castShadow = cast; mesh.receiveShadow = receive;
  scene.add(mesh);
  if (collider) colliders.push(new THREE.Box3().setFromObject(mesh));
  return mesh;
}

// Floor and ceiling slabs.
box("floor", [30, .25, 34], [0, -.12, -4], concreteMaterial, { receive: true });
box("ceiling", [30, .22, 34], [0, 5.05, -4], darkMaterial, { cast: false });

// Outer shell, with a south entrance opening.
box("west outer wall", [.3, 5, 34], [-15, 2.5, -4], wallMaterial, { collider: true });
box("east outer wall", [.3, 5, 34], [15, 2.5, -4], wallMaterial, { collider: true });
box("north outer wall", [30, 5, .3], [0, 2.5, -21], wallMaterial, { collider: true });
box("south wall left", [12.6, 5, .3], [-8.7, 2.5, 13], wallMaterial, { collider: true });
box("south wall right", [12.6, 5, .3], [8.7, 2.5, 13], wallMaterial, { collider: true });

// Three gallery wings. Each divider leaves a generous doorway.
box("past divider north", [10.2, 5, .28], [-9.9, 2.5, -8], wallMaterial, { collider: true });
box("past divider south", [10.2, 5, .28], [-9.9, 2.5, 8], wallMaterial, { collider: true });
box("past divider inner a", [.28, 5, 5.3], [-4.8, 2.5, -5.35], wallMaterial, { collider: true });
box("past divider inner b", [.28, 5, 5.3], [-4.8, 2.5, 5.35], wallMaterial, { collider: true });

box("future divider north", [10.2, 5, .28], [9.9, 2.5, -8], wallMaterial, { collider: true });
box("future divider south", [10.2, 5, .28], [9.9, 2.5, 8], wallMaterial, { collider: true });
box("future divider inner a", [.28, 5, 5.3], [4.8, 2.5, -5.35], wallMaterial, { collider: true });
box("future divider inner b", [.28, 5, 5.3], [4.8, 2.5, 5.35], wallMaterial, { collider: true });

box("fusion south left", [5.2, 5, .28], [-7.4, 2.5, -9], wallMaterial, { collider: true });
box("fusion south right", [5.2, 5, .28], [7.4, 2.5, -9], wallMaterial, { collider: true });

// Industrial ceiling beams.
for (let z = -18; z <= 10; z += 4) box("ceiling beam", [29.4, .32, .34], [0, 4.63, z], darkMaterial);
for (const x of [-10, -5, 0, 5, 10]) box("ceiling rail", [.16, .18, 33], [x, 4.42, -4], darkMaterial);

// Entrance posts and central exhibit plinth.
box("entrance post left", [.45, 4.2, .45], [-2.4, 2.1, 12.4], darkMaterial, { collider: true });
box("entrance post right", [.45, 4.2, .45], [2.4, 2.1, 12.4], darkMaterial, { collider: true });
box("plinth", [2.4, .65, 2.4], [0, .33, -1.2], new THREE.MeshStandardMaterial({color:0xd8d6cd,roughness:.82}), { collider: true });
const sculpture = new THREE.Mesh(new THREE.TorusKnotGeometry(.58, .14, 120, 18), goldMaterial);
sculpture.position.set(0, 1.45, -1.2); sculpture.castShadow = true; scene.add(sculpture);

function addStripLight(x, z, color = 0xfff2d8) {
  const light = new THREE.PointLight(color, 6.5, 10, 2); light.position.set(x, 4.05, z); light.castShadow = false; scene.add(light);
  box("light", [1.6, .06, .12], [x, 4.42, z], new THREE.MeshBasicMaterial({color}));
}
[-11, -4, 3, 10].forEach(z => { addStripLight(-9.5, z); addStripLight(0, z); addStripLight(9.5, z); });
addStripLight(-6, -16); addStripLight(0, -16); addStripLight(6, -16);

function makePlaceholderTexture(art) {
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 760;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 1200, 760); grad.addColorStop(0, art.accent); grad.addColorStop(1, "#171a1c");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 760);
  ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 2;
  for (let x = -760; x < 1200; x += 90) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+760,760); ctx.stroke(); }
  ctx.fillStyle = "rgba(255,255,255,.86)"; ctx.font = "600 26px Arial"; ctx.letterSpacing = "8px"; ctx.fillText(art.section, 70, 95);
  ctx.font = "300 62px Arial"; wrapText(ctx, art.title.toUpperCase(), 70, 360, 1050, 76);
  ctx.font = "500 18px Arial"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillText("REPLACE THIS PLACEHOLDER IN gallery-data.js", 70, 680);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" "); let line = ""; let offset = 0;
  words.forEach(word => { const test = line + word + " "; if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, y + offset); line = word + " "; offset += lineHeight; } else line = test; });
  ctx.fillText(line, x, y + offset);
}

function addArtwork(art) {
  const [w,h] = art.size;
  const group = new THREE.Group(); group.position.set(...art.position); group.rotation.set(...art.rotation);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + .18, h + .18, .09), darkMaterial); frame.castShadow = true; group.add(frame);
  const texture = art.image ? textureLoader.load(art.image) : makePlaceholderTexture(art); texture.colorSpace = THREE.SRGBColorSpace;
  const image = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({map:texture,roughness:.78,metalness:0}));
  image.position.z = .051; image.userData.artwork = art; group.add(image); artworkMeshes.push(image);
  const spot = new THREE.SpotLight(0xfff3dc, 10, 8, .52, .55, 1.4); spot.position.set(0, 1.65, 2.2); spot.target.position.set(0,0,0); group.add(spot, spot.target);
  scene.add(group);
}
artworks.forEach(addArtwork);

function playerCollides(position) {
  const radius = .32;
  const player = new THREE.Box3(new THREE.Vector3(position.x-radius,.1,position.z-radius),new THREE.Vector3(position.x+radius,2.05,position.z+radius));
  return colliders.some(box => box.intersectsBox(player));
}

function updateMovement(delta) {
  if (!controls.isLocked) return;
  const prev = camera.position.clone();
  const speed = museumConfig.moveSpeed * delta;
  const forward = keys.has("KeyW") || keys.has("ArrowUp");
  const back = keys.has("KeyS") || keys.has("ArrowDown");
  const left = keys.has("KeyA") || keys.has("ArrowLeft");
  const right = keys.has("KeyD") || keys.has("ArrowRight");
  if (forward) controls.moveForward(speed); if (back) controls.moveForward(-speed);
  if (left) controls.moveRight(-speed); if (right) controls.moveRight(speed);
  camera.position.y = museumConfig.eyeHeight;
  if (playerCollides(camera.position)) camera.position.copy(prev);
}

function currentRoom() {
  const {x,z} = camera.position;
  if (z < -9) return ["GALLERY 03", "Fusion Gallery"];
  if (x < -4.8) return ["GALLERY 01", "Past Gallery"];
  if (x > 4.8) return ["GALLERY 02", "Future Gallery"];
  return [z > 8 ? "ENTRANCE" : "CENTRAL SPACE", "Main Hall"];
}

function updateUI() {
  const room = currentRoom(); document.querySelector("#room-kicker").textContent = room[0]; document.querySelector("#room-name").textContent = room[1];
  const mapX = 91 + camera.position.x * 4.2; const mapY = 84 + (camera.position.z - 1) * 3.1;
  const marker = document.querySelector("#map-player"); marker.style.left = `${Math.max(5,Math.min(176,mapX))}px`; marker.style.top = `${Math.max(4,Math.min(106,mapY))}px`; marker.style.transform = `rotate(${-camera.rotation.y}rad)`;
  raycaster.setFromCamera(new THREE.Vector2(0,0),camera); const hit = raycaster.intersectObjects(artworkMeshes,false)[0];
  document.querySelector("#crosshair").classList.toggle("target",Boolean(hit));
  if (hit && controls.isLocked) document.querySelector("#interaction-hint").textContent = "NHẤP ĐỂ XEM TÁC PHẨM";
  else if (controls.isLocked) document.querySelector("#interaction-hint").textContent = "WASD ĐỂ DI CHUYỂN · ESC ĐỂ THẢ CHUỘT";
  return hit;
}

function showArtwork(art) {
  controls.unlock();
  document.querySelector("#artwork-section").textContent = art.section; document.querySelector("#artwork-title").textContent = art.title;
  document.querySelector("#artwork-description").textContent = art.description; document.querySelector("#artwork-meta").textContent = art.meta;
  const preview = document.querySelector("#artwork-preview"); preview.style.backgroundColor = art.accent; preview.style.backgroundImage = art.image ? `url("${art.image}")` : "none";
  document.querySelector("#artwork-dialog").showModal();
}

renderer.domElement.addEventListener("click", () => { const hit = updateUI(); if (controls.isLocked && hit) showArtwork(hit.object.userData.artwork); else if (!document.querySelector("dialog[open]")) controls.lock(); });
addEventListener("keydown", e => keys.add(e.code)); addEventListener("keyup", e => keys.delete(e.code));
controls.addEventListener("lock", () => document.querySelector("#interaction-hint").classList.remove("hidden"));

document.querySelector("#enter-button").addEventListener("click", () => { document.querySelector("#welcome-dialog").close(); controls.lock(); });
document.querySelector("#close-artwork").addEventListener("click", () => document.querySelector("#artwork-dialog").close());
document.querySelector("#info-button").addEventListener("click", () => { controls.unlock(); document.querySelector("#help-dialog").showModal(); });
document.querySelector("#close-help").addEventListener("click", () => document.querySelector("#help-dialog").close());
document.querySelector("#map-button").addEventListener("click", e => { e.currentTarget.classList.toggle("active"); document.querySelector("#minimap").classList.toggle("hidden"); });
document.querySelector("#fullscreen-button").addEventListener("click", () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
document.querySelector("#sound-button").addEventListener("click", e => e.currentTarget.classList.toggle("active"));

document.querySelectorAll("[data-move]").forEach(button => {
  const codes = {forward:"KeyW",backward:"KeyS",left:"KeyA",right:"KeyD"}; const code = codes[button.dataset.move];
  button.addEventListener("pointerdown", e => { e.preventDefault(); keys.add(code); });
  ["pointerup","pointercancel","pointerleave"].forEach(type => button.addEventListener(type, () => keys.delete(code)));
});

let touchStart = null;
renderer.domElement.addEventListener("touchstart", e => { if (e.touches.length === 1) touchStart = [e.touches[0].clientX,e.touches[0].clientY]; },{passive:true});
renderer.domElement.addEventListener("touchmove", e => { if (!touchStart || e.touches.length !== 1) return; const t=e.touches[0],dx=t.clientX-touchStart[0],dy=t.clientY-touchStart[1]; camera.rotation.order="YXZ"; camera.rotation.y-=dx*.004; camera.rotation.x=Math.max(-1.35,Math.min(1.35,camera.rotation.x-dy*.004)); touchStart=[t.clientX,t.clientY]; },{passive:true});

addEventListener("resize", () => { camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });

function animate() {
  requestAnimationFrame(animate); const delta=Math.min(clock.getDelta(),.05); updateMovement(delta); sculpture.rotation.y+=delta*.3; sculpture.rotation.x+=delta*.08; updateUI(); renderer.render(scene,camera);
}
animate();
setTimeout(() => document.querySelector("#loading").classList.add("done"), 800);
