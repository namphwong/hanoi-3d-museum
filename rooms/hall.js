// OWNER: feature/fusion-hall-audio
export function createHallRoom({ box, materials }) {
  // The schedule acts as a gateway display between Main Hall and Fusion Gallery.
  // Two clear side passages preserve the existing visitor flow.
  box("hall schedule plinth", [5.15, .26, .68], [0, .13, -8.58], materials.dark, { collider: true });
  box("hall schedule plinth trim", [5.25, .045, .78], [0, .285, -8.58], materials.gold, { cast: false });
  for (const x of [-2.12, 2.12]) {
    box("hall schedule support", [.12, .48, .12], [x, .52, -8.58], materials.gold);
  }
}
