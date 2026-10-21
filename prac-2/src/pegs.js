const PLAY_AREA = { left: -0.85, right: 0.85, top: 0.4, bottom: -0.65 };
const PEG_RADIUS = 0.03;
const ROW_SPACING = 0.2;
const COL_SPACING = 0.15;
const N_SPECIAL_PEGS = 20;

export const pegs = generatePegs();

export function hasSpecialPegs() {
  for (const peg of pegs) {
    if (peg.type == "SPECIAL" && !peg.popped) return true;
  }
  return false;
}

export function resetPegs() {
  pegs.length = 0;
  pegs.push(...generatePegs());
}

function generatePegs() {
  const pegs = [];
  let row = 0;

  for (let y = PLAY_AREA.top; y > PLAY_AREA.bottom; y -= ROW_SPACING) {
    const xOffset = row % 2 === 0 ? 0 : COL_SPACING / 2;
    for (
      let x = PLAY_AREA.left + xOffset;
      x < PLAY_AREA.right;
      x += COL_SPACING
    ) {
      pegs.push({
        x,
        y,
        radius: PEG_RADIUS,
        color: [0, 0, 1, 1],
        type: "NORMAL",
        popped: false,
      });
    }
    row++;
  }

  const specials = [];
  while (specials.length < N_SPECIAL_PEGS) {
    let special = pegs[Math.floor(Math.random() * pegs.length)];
    if (!specials.includes(special)) {
      specials.push(special);
      special.type = "SPECIAL";
      special.color = [1, 0.5, 0, 1];
    }
  }

  return pegs;
}
