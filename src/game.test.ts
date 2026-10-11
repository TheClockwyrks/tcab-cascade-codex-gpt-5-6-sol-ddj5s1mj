import { describe, expect, it } from "vitest";
import type { InitApi } from "@clockwyrks/simple-2d";
import { game, type CascadeDebugApi, type CascadeState } from "./game";

function setup(): [CascadeState, CascadeDebugApi] {
  const api = {
    input: { register() {}, layout: () => null },
    audio: { define() {}, load: async () => undefined },
    diagnostics: { register() {} },
  } as unknown as InitApi<CascadeState>;
  return game.initialize(api) as [CascadeState, CascadeDebugApi];
}

describe("Cascade rules", () => {
  it("deals a complete draw-three game", () => {
    const [initial, debug] = setup();
    const state = debug.deal(initial);
    expect(state.stock).toHaveLength(24);
    expect(state.tableau.map((p) => p.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(state.tableau.every((p) => p[p.length - 1]?.faceUp)).toBe(true);
    const turned = debug.turnStock(state);
    expect(turned.stock).toHaveLength(21);
    expect(turned.wasteSets).toEqual([3]);
  });

  it("builds tableau down in alternating colors", () => {
    const [initial, debug] = setup();
    let state = initial;
    state = debug.addCard(state, "tableau", 0, "spades", 8, true);
    state = debug.addCard(state, "tableau", 1, "hearts", 7, true);
    const [moved, accepted] = debug.move(state, "tableau", 1, 0, "tableau", 0);
    expect(accepted).toBe(true);
    expect(moved.tableau[0]).toHaveLength(2);
  });

  it("builds foundations by suit and recycles the waste", () => {
    const [initial, debug] = setup();
    let state = initial;
    state = debug.addCard(state, "tableau", 0, "hearts", 1, true);
    const result = debug.autoMove(state, "tableau", 0);
    state = result[0];
    const accepted = result[1];
    expect(accepted).toBe(true);
    expect(state.foundations[0]?.[0]?.rank).toBe(1);
    state = debug.addCard(state, "waste", 0, "clubs", 4, true);
    state = debug.addWasteSet(state, 1);
    state = debug.turnStock(state);
    expect(state.stock[0]?.faceUp).toBe(false);
    expect(state.waste).toHaveLength(0);
  });

  it("keeps poses immutable and reports derived snapshot values", () => {
    const [initial, debug] = setup();
    const posed = debug.addCard(initial, "waste", 0, "diamonds", 12, true);
    const withSet = debug.addWasteSet(posed, 1);
    expect(initial.waste).toHaveLength(0);
    expect(debug.snapshot(withSet)).toMatchObject({
      dealMode: "draw-three",
      turnCount: 3,
      wasteVisibleCount: 1,
    });
  });
});
