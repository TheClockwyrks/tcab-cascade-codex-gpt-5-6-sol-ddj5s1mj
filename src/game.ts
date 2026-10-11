import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as K from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";
export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}
export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}
export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}
export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}
export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}
export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
  readonly trail: readonly FlyerState[];
}
type R = { x: number; y: number; w: number; h: number };
type View = CardState & { color: "red" | "black" };
export interface CascadeDebugApi {
  readonly version: number;
  reset(s: DeepReadonly<CascadeState>): CascadeState;
  snapshot(s: DeepReadonly<CascadeState>): Record<string, unknown>;
  reconcile(s: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(s: DeepReadonly<CascadeState>, i: number): R | null;
  setScreen(s: DeepReadonly<CascadeState>, v: Screen): CascadeState;
  setMenuIndex(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  setTitleIndex(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  addCard(
    s: DeepReadonly<CascadeState>,
    p: PileKind,
    i: number,
    u: Suit,
    r: number,
    f: boolean,
  ): CascadeState;
  removeCard(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    s: DeepReadonly<CascadeState>,
    id: number,
    v: boolean,
  ): CascadeState;
  clearPile(
    s: DeepReadonly<CascadeState>,
    p: PileKind,
    i: number,
  ): CascadeState;
  clearTable(s: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(s: DeepReadonly<CascadeState>, n: number): CascadeState;
  clearWasteSets(s: DeepReadonly<CascadeState>): CascadeState;
  deal(s: DeepReadonly<CascadeState>): CascadeState;
  turnStock(s: DeepReadonly<CascadeState>): CascadeState;
  move(
    s: DeepReadonly<CascadeState>,
    a: PileKind,
    b: number,
    c: number,
    d: PileKind,
    e: number,
  ): [CascadeState, boolean];
  autoMove(
    s: DeepReadonly<CascadeState>,
    p: PileKind,
    i: number,
  ): [CascadeState, boolean];
  pointerDown(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    s: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(s: DeepReadonly<CascadeState>, x: number, y: number): CascadeState;
  setAutoFlip(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setWinDetect(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setLaunching(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  setTrailPainting(s: DeepReadonly<CascadeState>, v: boolean): CascadeState;
  addFlyer(
    s: DeepReadonly<CascadeState>,
    u: Suit,
    r: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    s: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    s: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  removeFlyer(s: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(s: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(s: DeepReadonly<CascadeState>, v: number): CascadeState;
  clearTrail(s: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}
export const BACKGROUND = "#07342e";
const red = (u: Suit) => u === "hearts" || u === "diamonds";
const copy = (s: DeepReadonly<CascadeState>): CascadeState => ({
  ...s,
  stock: s.stock.map((c) => ({ ...c })),
  waste: s.waste.map((c) => ({ ...c })),
  wasteSets: [...s.wasteSets],
  foundations: s.foundations.map((p) => p.map((c) => ({ ...c }))),
  tableau: s.tableau.map((p) => p.map((c) => ({ ...c }))),
  drag: s.drag
    ? { ...s.drag, cards: s.drag.cards.map((c) => ({ ...c })) }
    : null,
  dropTarget: s.dropTarget ? { ...s.dropTarget } : null,
  pointer: { ...s.pointer },
  lastPress: s.lastPress ? { ...s.lastPress } : null,
  flyers: s.flyers.map((f) => ({ ...f })),
  trail: s.trail.map((f) => ({ ...f })),
});
const blank = (muted = false): CascadeState => ({
  screen: "title",
  menuIndex: 0,
  titleIndex: 0,
  stock: [],
  waste: [],
  wasteSets: [],
  foundations: Array.from({ length: 4 }, () => []),
  tableau: Array.from({ length: 7 }, () => []),
  drag: null,
  dropTarget: null,
  pointer: { x: 0, y: 0, down: false },
  lastPress: null,
  autoFlip: true,
  winDetect: true,
  launching: true,
  trailPainting: true,
  launchClock: 0,
  launched: 0,
  flyers: [],
  cascadeDone: false,
  trailStamps: 0,
  nextId: 1,
  simTime: 0,
  muted,
  trail: [],
});
function valid(p: PileKind, i: number) {
  if (
    !Number.isInteger(i) ||
    i < 0 ||
    i > (p === "foundation" ? 3 : p === "tableau" ? 6 : 0)
  )
    throw Error(`invalid ${p} pile ${i}`);
}
function pile(s: DeepReadonly<CascadeState>, p: PileKind, i: number) {
  valid(p, i);
  return p === "stock"
    ? s.stock
    : p === "waste"
      ? s.waste
      : p === "foundation"
        ? s.foundations[i]!
        : s.tableau[i]!;
}
function put(
  s: DeepReadonly<CascadeState>,
  p: PileKind,
  i: number,
  v: readonly CardState[],
): CascadeState {
  const n = copy(s);
  return p === "stock"
    ? { ...n, stock: v }
    : p === "waste"
      ? { ...n, waste: v }
      : p === "foundation"
        ? { ...n, foundations: n.foundations.map((x, j) => (j === i ? v : x)) }
        : { ...n, tableau: n.tableau.map((x, j) => (j === i ? v : x)) };
}
const run = (a: readonly DeepReadonly<CardState>[]) =>
  a.every(
    (c, i) =>
      !i ||
      (c.rank === a[i - 1]!.rank - 1 && red(c.suit) !== red(a[i - 1]!.suit)),
  );
const acceptF = (
  p: readonly DeepReadonly<CardState>[],
  a: readonly DeepReadonly<CardState>[],
) =>
  a.length === 1 &&
  (p.length
    ? a[0]!.suit === p[p.length - 1]!.suit &&
      a[0]!.rank === p[p.length - 1]!.rank + 1
    : a[0]!.rank === 1);
const acceptT = (
  p: readonly DeepReadonly<CardState>[],
  a: readonly DeepReadonly<CardState>[],
) =>
  run(a) &&
  (p.length
    ? p[p.length - 1]!.faceUp &&
      a[0]!.rank === p[p.length - 1]!.rank - 1 &&
      red(a[0]!.suit) !== red(p[p.length - 1]!.suit)
    : a[0]!.rank === 13);
function ys(p: readonly DeepReadonly<CardState>[]) {
  let u = K.FACE_UP_OFFSET;
  const down =
      p.slice(0, -1).filter((c) => !c.faceUp).length * K.FACE_DOWN_OFFSET,
    ups = p.slice(0, -1).filter((c) => c.faceUp).length;
  if (ups)
    u = Math.max(
      K.FACE_UP_OFFSET_MIN,
      Math.min(
        u,
        (K.COLUMN_BOTTOM_LIMIT - K.TABLEAU_Y - K.CARD_H - down) / ups,
      ),
    );
  const a = [K.TABLEAU_Y];
  for (let i = 1; i < p.length; i++)
    a.push(a[i - 1]! + (p[i - 1]!.faceUp ? u : K.FACE_DOWN_OFFSET));
  return a;
}
const inside = (x: number, y: number, r: R) =>
  x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
function rect(s: DeepReadonly<CascadeState>, p: PileKind, i: number): R {
  valid(p, i);
  if (p === "stock")
    return { x: K.STOCK_X, y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H };
  if (p === "waste")
    return { x: K.WASTE_X, y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H };
  if (p === "foundation")
    return { x: K.FOUNDATION_X[i]!, y: K.TOP_ROW_Y, w: K.CARD_W, h: K.CARD_H };
  const y = ys(s.tableau[i]!);
  return {
    x: K.COLUMN_X[i]!,
    y: K.TABLEAU_Y,
    w: K.CARD_W,
    h: s.tableau[i]!.length
      ? y[y.length - 1]! + K.CARD_H - K.TABLEAU_Y
      : K.CARD_H,
  };
}
function target(
  s: DeepReadonly<CascadeState>,
  d: DeepReadonly<DragState> | null,
): DropTargetState | null {
  if (!d) return null;
  const x = d.x + 50,
    y = d.y + 70;
  for (let i = 0; i < 4; i++)
    if (
      inside(x, y, rect(s, "foundation", i)) &&
      acceptF(s.foundations[i]!, d.cards)
    )
      return { pile: "foundation", index: i };
  for (let i = 0; i < 7; i++)
    if (inside(x, y, rect(s, "tableau", i)) && acceptT(s.tableau[i]!, d.cards))
      return { pile: "tableau", index: i };
  return null;
}
function fresh(s: DeepReadonly<CascadeState>): CascadeState {
  const d: CardState[] = [];
  let id = s.nextId;
  for (const suit of K.SUITS)
    for (let rank = 1; rank <= 13; rank++)
      d.push({ id: id++, suit, rank, faceUp: false });
  for (let i = 51; i; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j]!, d[i]!];
  }
  const t: CardState[][] = Array.from({ length: 7 }, () => []);
  let q = 0;
  for (let i = 0; i < 7; i++)
    for (let j = 0; j <= i; j++) t[i]!.push({ ...d[q++]!, faceUp: j === i });
  return {
    ...copy(s),
    menuIndex: 0,
    stock: d.slice(q),
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: 4 }, () => []),
    tableau: t,
    drag: null,
    dropTarget: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    trail: [],
    nextId: id,
  };
}
function turn(s: DeepReadonly<CascadeState>): CascadeState {
  if (s.stock.length) {
    const n = copy(s),
      stock = [...n.stock],
      waste = [...n.waste],
      c = Math.min(3, stock.length);
    for (let i = 0; i < c; i++) waste.push({ ...stock.pop()!, faceUp: true });
    return { ...n, stock, waste, wasteSets: [...n.wasteSets, c] };
  }
  return s.waste.length
    ? {
        ...copy(s),
        stock: [...s.waste].reverse().map((c) => ({ ...c, faceUp: false })),
        waste: [],
        wasteSets: [],
      }
    : copy(s);
}
function finish(s: CascadeState, p: PileKind, i: number) {
  let n = s;
  if (
    p === "tableau" &&
    n.autoFlip &&
    n.tableau[i]!.length &&
    !n.tableau[i]![n.tableau[i]!.length - 1]!.faceUp
  )
    n = {
      ...n,
      tableau: n.tableau.map((x, j) =>
        j === i
          ? x.map((c, k) => (k === x.length - 1 ? { ...c, faceUp: true } : c))
          : x,
      ),
    };
  if (n.winDetect && n.foundations.reduce((a, x) => a + x.length, 0) === 52)
    n = { ...n, screen: "won", launchClock: K.LAUNCH_INTERVAL };
  return n;
}
function move(
  s: DeepReadonly<CascadeState>,
  fp: PileKind,
  fi: number,
  row: number,
  tp: PileKind,
  ti: number,
): [CascadeState, boolean] {
  const a = pile(s, fp, fi);
  valid(tp, ti);
  if (!Number.isInteger(row) || row < 0 || row >= a.length)
    throw Error("invalid fromRow");
  if (
    fp === "stock" ||
    (fp !== "tableau" && row !== a.length - 1) ||
    (fp === "waste" && !s.wasteSets.length)
  )
    return [copy(s), false];
  const cards = a.slice(row);
  if (!cards[0]!.faceUp || (tp !== "foundation" && tp !== "tableau"))
    return [copy(s), false];
  const b = pile(s, tp, ti),
    ok = tp === "foundation" ? acceptF(b, cards) : acceptT(b, cards);
  if (!ok) return [copy(s), false];
  let n = put(
    s,
    fp,
    fi,
    a.slice(0, row).map((c) => ({ ...c })),
  );
  n = put(n, tp, ti, [
    ...b.map((c) => ({ ...c })),
    ...cards.map((c) => ({ ...c })),
  ]);
  if (fp === "waste") {
    const sets = [...n.wasteSets];
    sets[sets.length - 1]!--;
    n = { ...n, wasteSets: sets.filter(Boolean) };
  }
  return [finish(n, fp, fi), true];
}
function auto(
  s: DeepReadonly<CascadeState>,
  p: PileKind,
  i: number,
): [CascadeState, boolean] {
  const a = pile(s, p, i);
  if (
    (p !== "waste" && p !== "tableau") ||
    !a.length ||
    !a[a.length - 1]!.faceUp ||
    (p === "waste" && !s.wasteSets.length)
  )
    return [copy(s), false];
  for (let j = 0; j < 4; j++) {
    const r = move(s, p, i, a.length - 1, "foundation", j);
    if (r[1]) return r;
  }
  return [copy(s), false];
}
function menu(s: DeepReadonly<CascadeState>, i: number): R | null {
  if (s.screen === "title" && i >= 0 && i < 2)
    return { x: 490, y: 390 + i * 70, w: 300, h: 52 };
  if (s.screen === "howto" && i === 0) return { x: 490, y: 610, w: 300, h: 52 };
  if (s.screen === "playing" && i >= 0 && i < 3)
    return { x: 16 + i * 142, y: 683, w: 128, h: 30 };
  return null;
}
function activate(
  s: DeepReadonly<CascadeState>,
  i: number,
  a?: UpdateApi["audio"],
) {
  if (s.screen === "title")
    return i === 0
      ? (a?.play(K.CUES.deal),
        { ...fresh(s), screen: "playing" as const, titleIndex: 0 })
      : { ...copy(s), screen: "howto" as const, menuIndex: 0, titleIndex: 1 };
  if (s.screen === "howto")
    return { ...copy(s), screen: "title" as const, menuIndex: s.titleIndex };
  if (s.screen === "playing" && i === 0) {
    a?.play(K.CUES.deal);
    return fresh(s);
  }
  if (s.screen === "playing" && i === 1)
    return { ...copy(s), screen: "title" as const, menuIndex: s.titleIndex };
  if (s.screen === "playing" && i === 2 && a) {
    a.setMuted(!a.muted());
    return { ...copy(s), muted: a.muted() };
  }
  return copy(s);
}
type Hit = {
  p: "waste" | "foundation" | "tableau";
  i: number;
  row: number;
  x: number;
  y: number;
  play: boolean;
};
function hit(s: DeepReadonly<CascadeState>, x: number, y: number): Hit | null {
  for (let i = 6; i >= 0; i--) {
    const p = s.tableau[i]!,
      yy = ys(p);
    for (let j = p.length - 1; j >= 0; j--)
      if (inside(x, y, { x: K.COLUMN_X[i]!, y: yy[j]!, w: 100, h: 140 }))
        return {
          p: "tableau",
          i,
          row: j,
          x: K.COLUMN_X[i]!,
          y: yy[j]!,
          play: p[j]!.faceUp,
        };
  }
  for (let i = 3; i >= 0; i--)
    if (s.foundations[i]!.length && inside(x, y, rect(s, "foundation", i)))
      return {
        p: "foundation",
        i,
        row: s.foundations[i]!.length - 1,
        x: K.FOUNDATION_X[i]!,
        y: 24,
        play: true,
      };
  const start = Math.max(
    0,
    s.waste.length - (s.wasteSets[s.wasteSets.length - 1] ?? 0),
  );
  for (let j = s.waste.length - 1; j >= start; j--) {
    const px = K.WASTE_X + (j - start) * K.WASTE_FAN;
    if (inside(x, y, { x: px, y: 24, w: 100, h: 140 }))
      return {
        p: "waste",
        i: 0,
        row: j,
        x: px,
        y: 24,
        play: j === s.waste.length - 1 && !!s.wasteSets.length,
      };
  }
  return null;
}
function down(s: DeepReadonly<CascadeState>, x: number, y: number) {
  if (s.screen === "won")
    return {
      ...fresh(s),
      screen: "playing" as const,
      pointer: { x, y, down: true },
    };
  let n: CascadeState = {
    ...copy(s),
    pointer: { x, y, down: true },
    lastPress: { x, y, at: s.simTime },
  };
  const mi = [0, 1, 2].find((i) => {
    const r = menu(s, i);
    return r && inside(x, y, r);
  });
  if (mi !== undefined) n = { ...n, menuIndex: mi };
  if (n.screen !== "playing") return n;
  const h = hit(n, x, y),
    last = s.lastPress;
  if (
    h?.play &&
    h.p !== "foundation" &&
    last &&
    n.simTime - last.at <= K.DOUBLE_CLICK_WINDOW &&
    Math.hypot(x - last.x, y - last.y) <= K.DOUBLE_CLICK_SLOP
  )
    return {
      ...auto(n, h.p, h.i)[0],
      pointer: { x, y, down: true },
      lastPress: { x, y, at: n.simTime },
    };
  if (!h?.play) return n;
  const p = pile(n, h.p, h.i),
    cards = p.slice(h.row).map((c) => ({ ...c }));
  n = put(
    n,
    h.p,
    h.i,
    p.slice(0, h.row).map((c) => ({ ...c })),
  );
  return {
    ...n,
    pointer: { x, y, down: true },
    lastPress: { x, y, at: n.simTime },
    drag: { cards, fromPile: h.p, fromIndex: h.i, x: h.x, y: h.y },
  };
}
function motion(s: DeepReadonly<CascadeState>, x: number, y: number) {
  let n = copy(s);
  if (n.drag) {
    const d = {
      ...n.drag,
      x: n.drag.x + x - n.pointer.x,
      y: n.drag.y + y - n.pointer.y,
    };
    n = { ...n, drag: d, dropTarget: target(n, d) };
  }
  const mi = [0, 1, 2].find((i) => {
    const r = menu(s, i);
    return r && inside(x, y, r);
  });
  return {
    ...n,
    menuIndex: mi ?? n.menuIndex,
    pointer: { x, y, down: s.pointer.down },
  };
}
function restore(s: DeepReadonly<CascadeState>) {
  if (!s.drag) return copy(s);
  return {
    ...put(s, s.drag.fromPile, s.drag.fromIndex, [
      ...pile(s, s.drag.fromPile, s.drag.fromIndex).map((c) => ({ ...c })),
      ...s.drag.cards.map((c) => ({ ...c })),
    ]),
    drag: null,
    dropTarget: null,
  };
}
function up(
  s: DeepReadonly<CascadeState>,
  x: number,
  y: number,
  a?: UpdateApi["audio"],
) {
  let n = motion(s, x, y);
  const d = n.drag,
    click =
      n.lastPress &&
      Math.hypot(x - n.lastPress.x, y - n.lastPress.y) <= K.DRAG_THRESHOLD;
  if (click) {
    n = restore(n);
    if (
      n.screen === "playing" &&
      inside(n.lastPress!.x, n.lastPress!.y, rect(n, "stock", 0))
    )
      n = turn(n);
  } else if (d) {
    const t = target(n, d);
    if (t) {
      n = put(n, t.pile, t.index, [
        ...pile(n, t.pile, t.index).map((c) => ({ ...c })),
        ...d.cards.map((c) => ({ ...c })),
      ]);
      if (d.fromPile === "waste") {
        const q = [...n.wasteSets];
        q[q.length - 1]!--;
        n = { ...n, wasteSets: q.filter(Boolean) };
      }
      n = {
        ...finish(n, d.fromPile, d.fromIndex),
        drag: null,
        dropTarget: null,
      };
    } else n = restore(n);
  }
  const r = menu(s, s.menuIndex);
  if (r && inside(s.pointer.x, s.pointer.y, r) && inside(x, y, r))
    n = activate(n, s.menuIndex, a);
  return { ...n, pointer: { x, y, down: false } };
}
const vx = () =>
  (Math.random() < 0.5 ? -1 : 1) *
  (K.LAUNCH_VX_MIN + Math.random() * (K.LAUNCH_VX_MAX - K.LAUNCH_VX_MIN));
function cascade(
  s: DeepReadonly<CascadeState>,
  dt: number,
  a: UpdateApi["audio"],
) {
  if (s.screen !== "won") return copy(s);
  let f = s.flyers.map((q) => {
      let vy = q.vy + K.GRAVITY * dt,
        y = q.y + vy * dt;
      if (y >= K.FLOOR_Y && vy > 0) {
        y = K.FLOOR_Y;
        vy = -vy * K.BOUNCE_DAMP;
      }
      return { ...q, x: q.x + q.vx * dt, y, vy };
    }),
    clock = s.launchClock,
    launched = s.launched,
    foundations = s.foundations.map((p) => p.map((c) => ({ ...c })));
  const stamps = s.trailPainting ? f.map((q) => ({ ...q })) : [];
  f = f.filter((q) => q.x + 100 >= 0 && q.x <= K.STAGE_W);
  if (s.launching) {
    clock += dt;
    while (
      clock >= K.LAUNCH_INTERVAL &&
      launched < 52 &&
      foundations.some((p) => p.length)
    ) {
      clock -= K.LAUNCH_INTERVAL;
      let i = launched % 4;
      while (!foundations[i]!.length) i = (i + 1) % 4;
      const c = foundations[i]![foundations[i]!.length - 1]!;
      foundations = foundations.map((p, j) => (j === i ? p.slice(0, -1) : p));
      f.push({
        id: c.id,
        suit: c.suit,
        rank: c.rank,
        x: K.FOUNDATION_X[i]!,
        y: 24,
        vx: vx(),
        vy: K.LAUNCH_VY,
      });
      launched++;
      a.play(K.CUES.launch);
    }
  }
  return {
    ...copy(s),
    foundations,
    flyers: f,
    launchClock: clock,
    launched,
    trail: [...s.trail, ...stamps],
    trailStamps: s.trailStamps + stamps.length,
    cascadeDone: launched === 52 && !f.length,
  };
}
const view = (c: DeepReadonly<CardState>): View => ({
  ...c,
  color: red(c.suit) ? "red" : "black",
});
function snap(s: DeepReadonly<CascadeState>): Record<string, unknown> {
  return {
    version: 1,
    screen: s.screen,
    menuIndex: s.menuIndex,
    titleIndex: s.titleIndex,
    dealMode: K.DEAL_MODE,
    turnCount: K.TURN_COUNT,
    dealModeLabel: K.DEAL_MODE_LABEL,
    muted: s.muted,
    autoFlip: s.autoFlip,
    winDetect: s.winDetect,
    launching: s.launching,
    trailPainting: s.trailPainting,
    stock: s.stock.map(view),
    waste: s.waste.map(view),
    wasteSets: [...s.wasteSets],
    wasteVisibleCount: s.wasteSets[s.wasteSets.length - 1] ?? 0,
    foundations: s.foundations.map((p) => p.map(view)),
    tableau: s.tableau.map((p) => p.map(view)),
    drag: s.drag ? { ...s.drag, cards: s.drag.cards.map(view) } : null,
    dropTarget: target(s, s.drag),
    pointer: { ...s.pointer },
    lastPress: s.lastPress ? { ...s.lastPress } : null,
    launchClock: s.launchClock,
    launched: s.launched,
    flyers: s.flyers.map((f) => ({ ...f })),
    cascadeDone: s.cascadeDone,
    trailStamps: s.trailStamps,
    simTime: s.simTime,
  };
}
function find(s: DeepReadonly<CascadeState>, id: number) {
  for (const p of ["stock", "waste", "foundation", "tableau"] as PileKind[])
    for (
      let i = 0;
      i < (p === "foundation" ? 4 : p === "tableau" ? 7 : 1);
      i++
    ) {
      const row = pile(s, p, i).findIndex((c) => c.id === id);
      if (row >= 0) return { p, i, row };
    }
  throw Error(`card ${id} not found`);
}
function debug(): CascadeDebugApi {
  return {
    version: 1,
    reset: (s) => blank(s.muted),
    snapshot: snap,
    reconcile: copy,
    menuItemRect: menu,
    setScreen: (s, screen) => ({ ...copy(s), screen }),
    setMenuIndex: (s, menuIndex) => ({ ...copy(s), menuIndex }),
    setTitleIndex: (s, titleIndex) => ({ ...copy(s), titleIndex }),
    addCard: (s, p, i, suit, rank, faceUp) => {
      valid(p, i);
      if (
        !(K.SUITS as readonly string[]).includes(suit) ||
        !Number.isInteger(rank) ||
        rank < 1 ||
        rank > 13
      )
        throw Error("invalid card");
      return {
        ...put(s, p, i, [
          ...pile(s, p, i).map((c) => ({ ...c })),
          { id: s.nextId, suit, rank, faceUp },
        ]),
        nextId: s.nextId + 1,
      };
    },
    removeCard: (s, id) => {
      const f = find(s, id);
      let n = put(
        s,
        f.p,
        f.i,
        pile(s, f.p, f.i)
          .filter((c) => c.id !== id)
          .map((c) => ({ ...c })),
      );
      if (f.p === "waste") {
        const q = [...n.wasteSets];
        for (let i = q.length - 1; i >= 0; i--)
          if (q[i]!) {
            q[i]!--;
            break;
          }
        n = { ...n, wasteSets: q.filter(Boolean) };
      }
      return n;
    },
    setCardFaceUp: (s, id, faceUp) => {
      const f = find(s, id);
      return put(
        s,
        f.p,
        f.i,
        pile(s, f.p, f.i).map((c) =>
          c.id === id ? { ...c, faceUp } : { ...c },
        ),
      );
    },
    clearPile: (s, p, i) => {
      let n = put(s, p, i, []);
      if (p === "waste") n = { ...n, wasteSets: [] };
      return n;
    },
    clearTable: (s) => ({
      ...copy(s),
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: Array.from({ length: 4 }, () => []),
      tableau: Array.from({ length: 7 }, () => []),
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (s, n) => {
      if (!Number.isInteger(n)) throw Error("count must be whole");
      return { ...copy(s), wasteSets: [...s.wasteSets, n] };
    },
    clearWasteSets: (s) => ({ ...copy(s), wasteSets: [] }),
    deal: fresh,
    turnStock: turn,
    move,
    autoMove: auto,
    pointerDown: down,
    pointerMove: motion,
    pointerUp: (s, x, y) => up(s, x, y),
    setAutoFlip: (s, autoFlip) => ({ ...copy(s), autoFlip }),
    setWinDetect: (s, winDetect) => ({ ...copy(s), winDetect }),
    setLaunching: (s, launching) => ({ ...copy(s), launching }),
    setTrailPainting: (s, trailPainting) => ({ ...copy(s), trailPainting }),
    addFlyer: (s, suit, rank, x, y, vxx, vy) => ({
      ...copy(s),
      flyers: [
        ...s.flyers.map((f) => ({ ...f })),
        { id: s.nextId, suit, rank, x, y, vx: vxx, vy },
      ],
      nextId: s.nextId + 1,
    }),
    setFlyerPosition: (s, id, x, y) => {
      if (!s.flyers.some((f) => f.id === id)) throw Error("flyer not found");
      return {
        ...copy(s),
        flyers: s.flyers.map((f) => (f.id === id ? { ...f, x, y } : { ...f })),
      };
    },
    setFlyerVelocity: (s, id, vxx, vy) => {
      if (!s.flyers.some((f) => f.id === id)) throw Error("flyer not found");
      return {
        ...copy(s),
        flyers: s.flyers.map((f) =>
          f.id === id ? { ...f, vx: vxx, vy } : { ...f },
        ),
      };
    },
    removeFlyer: (s, id) => {
      if (!s.flyers.some((f) => f.id === id)) throw Error("flyer not found");
      return {
        ...copy(s),
        flyers: s.flyers.filter((f) => f.id !== id).map((f) => ({ ...f })),
      };
    },
    clearFlyers: (s) => ({ ...copy(s), flyers: [] }),
    setLaunchClock: (s, launchClock) => ({ ...copy(s), launchClock }),
    clearTrail: (s) => ({ ...copy(s), trail: [], trailStamps: 0 }),
    drawLaunchVx: vx,
  };
}
function card(
  ctx: CanvasRenderingContext2D,
  c: { suit: Suit; rank: number; faceUp?: boolean },
  x: number,
  y: number,
  l = false,
) {
  ctx.save();
  if (l) {
    ctx.shadowColor = "#001b18";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 7;
  }
  ctx.beginPath();
  ctx.roundRect(x, y, 100, 140, 9);
  ctx.fillStyle = c.faceUp === false ? "#174d73" : "#fffaf0";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = c.faceUp === false ? "#e0b95b" : "#d5cdbd";
  ctx.stroke();
  if (c.faceUp === false) {
    ctx.strokeStyle = "#a8d6d2";
    for (let i = 10; i < 90; i += 14) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + 8);
      ctx.lineTo(x + 8, y + i);
      ctx.stroke();
    }
  } else {
    const u = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" }[c.suit],
      r =
        c.rank === 1
          ? "A"
          : c.rank === 11
            ? "J"
            : c.rank === 12
              ? "Q"
              : c.rank === 13
                ? "K"
                : String(c.rank);
    ctx.fillStyle = red(c.suit) ? "#c53748" : "#172a32";
    ctx.font = "700 22px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(r, x + 9, y + 25);
    ctx.fillText(u, x + 9, y + 51);
    ctx.font = "44px serif";
    ctx.textAlign = "center";
    ctx.fillText(u, x + 50, y + 92);
  }
  ctx.restore();
}
function slot(ctx: CanvasRenderingContext2D, x: number, y: number, h = false) {
  ctx.beginPath();
  ctx.roundRect(x, y, 100, 140, 9);
  ctx.fillStyle = h ? "#91753355" : "#ffffff0c";
  ctx.fill();
  ctx.lineWidth = h ? 4 : 2;
  ctx.strokeStyle = h ? "#ffd36c" : "#bfe1d533";
  ctx.stroke();
}
function button(ctx: CanvasRenderingContext2D, r: R, t: string, on: boolean) {
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.w, r.h, 7);
  ctx.fillStyle = on ? "#e5b959" : "#061f1dcc";
  ctx.fill();
  ctx.strokeStyle = on ? "#fff0bb" : "#5a847a";
  ctx.stroke();
  ctx.fillStyle = on ? "#14342e" : "#eee6d3";
  ctx.font = "700 15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t, r.x + r.w / 2, r.y + r.h / 2);
}
function table(s: DeepReadonly<CascadeState>, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, 1280, 720);
  for (const f of s.trail) card(ctx, { ...f, faceUp: true }, f.x, f.y);
  slot(ctx, 224, 24);
  if (s.stock.length) card(ctx, s.stock[s.stock.length - 1]!, 224, 24);
  slot(ctx, 346, 24);
  const w = Math.max(
    0,
    s.waste.length - (s.wasteSets[s.wasteSets.length - 1] ?? 0),
  );
  for (let i = w; i < s.waste.length; i++)
    card(ctx, s.waste[i]!, 346 + (i - w) * 26, 24);
  for (let i = 0; i < 4; i++) {
    slot(
      ctx,
      K.FOUNDATION_X[i]!,
      24,
      s.dropTarget?.pile === "foundation" && s.dropTarget.index === i,
    );
    if (s.foundations[i]!.length)
      card(
        ctx,
        s.foundations[i]![s.foundations[i]!.length - 1]!,
        K.FOUNDATION_X[i]!,
        24,
      );
  }
  for (let i = 0; i < 7; i++) {
    slot(
      ctx,
      K.COLUMN_X[i]!,
      180,
      s.dropTarget?.pile === "tableau" && s.dropTarget.index === i,
    );
    const y = ys(s.tableau[i]!);
    s.tableau[i]!.forEach((c, j) => card(ctx, c, K.COLUMN_X[i]!, y[j]!));
  }
  if (s.drag) {
    let y = s.drag.y;
    for (const c of s.drag.cards) {
      card(ctx, c, s.drag.x, y, true);
      y += 34;
    }
  }
  for (const f of s.flyers) card(ctx, { ...f, faceUp: true }, f.x, f.y);
}
export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>) {
    for (const [n, keys] of Object.entries(K.MENU_BINDINGS))
      api.input.register(n, { keys: [...keys] });
    Object.values(K.CUES).forEach((c, i) =>
      api.audio.define(c, {
        wave: i % 2 ? "triangle" : "sine",
        freq: 180 + i * 85,
        freqTo: 260 + i * 70,
        durationMs: 70 + i * 8,
        gain: 0.1,
      }),
    );
    api.diagnostics.register("screen", (s) => s.screen);
    api.diagnostics.register("deal", () => K.DEAL_MODE);
    api.diagnostics.register("stock", (s) => s.stock.length);
    api.diagnostics.register("waste", (s) => s.waste.length);
    for (let i = 0; i < 4; i++)
      api.diagnostics.register(
        `foundation ${i}`,
        (s) => s.foundations[i]!.length,
      );
    for (let i = 0; i < 7; i++)
      api.diagnostics.register(`column ${i}`, (s) => s.tableau[i]!.length);
    api.diagnostics.register("hand", (s) => (s.drag ? s.drag.cards.length : 0));
    api.diagnostics.register("launched", (s) => s.launched);
    api.diagnostics.register("flying", (s) => s.flyers.length);
    return [blank(), debug()];
  },
  update(s, a, dt) {
    let n = copy(s);
    const u = a.input.pressed(K.MENU_UP),
      d = a.input.pressed(K.MENU_DOWN),
      ok = a.input.pressed(K.MENU_CONFIRM),
      back = a.input.pressed(K.MENU_BACK);
    if (n.screen !== "won") {
      const count = n.screen === "title" ? 2 : n.screen === "howto" ? 1 : 3;
      if (u) n = { ...n, menuIndex: (n.menuIndex - 1 + count) % count };
      else if (d) n = { ...n, menuIndex: (n.menuIndex + 1) % count };
      else if (ok || (back && n.screen === "howto"))
        n = activate(n, n.menuIndex, a.audio);
    }
    for (const p of a.input.pointerSamples())
      if (p.primary) {
        const before = n;
        n =
          p.type === "down"
            ? down(n, p.x, p.y)
            : p.type === "move"
              ? motion(n, p.x, p.y)
              : up(n, p.x, p.y, a.audio);
        if (p.type === "down" && !before.drag && n.drag)
          a.audio.play(K.CUES.lift);
        if (
          p.type === "down" &&
          n.foundations.reduce((sum, f) => sum + f.length, 0) >
            before.foundations.reduce((sum, f) => sum + f.length, 0)
        )
          a.audio.play(K.CUES.home);
        if (p.type === "down" && before.screen !== "won" && n.screen === "won")
          a.audio.play(K.CUES.win);
        if (p.type === "up") {
          const beforeHome = before.foundations.reduce(
            (sum, foundation) => sum + foundation.length,
            0,
          );
          const afterHome = n.foundations.reduce(
            (sum, foundation) => sum + foundation.length,
            0,
          );
          if (before.drag) {
            const accepted =
              n.drag === null &&
              (afterHome !== beforeHome ||
                n.tableau.some(
                  (column, i) => column.length > before.tableau[i]!.length,
                ));
            a.audio.play(accepted ? K.CUES.drop : K.CUES.reject);
            if (afterHome > beforeHome) a.audio.play(K.CUES.home);
          }
          if (before.stock.length > n.stock.length) a.audio.play(K.CUES.turn);
          if (!before.stock.length && n.stock.length)
            a.audio.play(K.CUES.recycle);
          if (
            before.tableau.some(
              (column, i) =>
                column.length > n.tableau[i]!.length &&
                n.tableau[i]!.length > 0 &&
                !column[n.tableau[i]!.length - 1]!.faceUp &&
                n.tableau[i]![n.tableau[i]!.length - 1]!.faceUp,
            )
          )
            a.audio.play(K.CUES.flip);
          if (before.screen !== "won" && n.screen === "won")
            a.audio.play(K.CUES.win);
        }
      }
    n = cascade(n, dt, a.audio);
    return { ...n, simTime: n.simTime + dt, muted: a.audio.muted() };
  },
  render(s, a: RenderApi) {
    const c = a.ctx;
    if (s.screen === "title") {
      c.fillStyle = BACKGROUND;
      c.fillRect(0, 0, 1280, 720);
      c.fillStyle = "#e8bd61";
      c.font = "800 104px Georgia";
      c.textAlign = "center";
      c.fillText(K.TITLE_TEXT, 640, 225);
      c.fillStyle = "#dceae2";
      c.font = "600 21px sans-serif";
      c.fillText(K.TAGLINE_TEXT, 640, 275);
      c.fillStyle = "#8eb9aa";
      c.font = "700 15px sans-serif";
      c.fillText(K.DEAL_MODE_LABEL, 640, 325);
      K.TITLE_ITEMS.forEach((t, i) =>
        button(c, menu(s, i)!, t, s.menuIndex === i),
      );
      return;
    }
    if (s.screen === "howto") {
      c.fillStyle = BACKGROUND;
      c.fillRect(0, 0, 1280, 720);
      c.fillStyle = "#e8bd61";
      c.font = "700 54px Georgia";
      c.textAlign = "center";
      c.fillText("HOW TO PLAY", 640, 100);
      c.fillStyle = "#eef0e9";
      c.font = "22px sans-serif";
      [
        "Build every foundation from ACE through KING.",
        "Build columns down in alternating colors; only a KING fills an empty column.",
        "Press the STOCK to turn three cards, and press again to recycle.",
        "Drag a card or run. DOUBLE-CLICK an exposed card to send it home.",
      ].forEach((t, i) => c.fillText(t, 640, 220 + i * 82));
      button(c, menu(s, 0)!, K.HOWTO_BACK_LABEL, true);
      return;
    }
    table(s, c);
    if (s.screen === "playing") {
      c.fillStyle = "#061f1d";
      c.fillRect(0, 680, 1280, 36);
      K.HUD_ITEMS.forEach((t, i) =>
        button(c, menu(s, i)!, t, s.menuIndex === i),
      );
      c.fillStyle = "#c4d8cf";
      c.font = "700 14px sans-serif";
      c.textAlign = "right";
      c.fillText(K.DEAL_MODE_LABEL, 1260, 703);
    } else if (s.cascadeDone) {
      c.fillStyle = "#031b19bb";
      c.fillRect(410, 290, 460, 130);
      c.fillStyle = "#ffe29a";
      c.font = "800 68px Georgia";
      c.textAlign = "center";
      c.fillText(K.WIN_TEXT, 640, 375);
    }
  },
};
