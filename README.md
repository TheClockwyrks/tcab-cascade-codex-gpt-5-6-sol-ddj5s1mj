# Cascade

Cascade is a polished browser implementation of Draw Three Klondike solitaire. Build alternating-color tableau runs, turn cards from the stock, send each suit home from Ace to King, and finish with a jubilant card cascade across the felt.

## Run it

```sh
npm ci
npm run dev
```

Open the local address Vite prints. To create the self-contained static site in `dist/`:

```sh
npm run build
```

## Controls

Click or touch the stock to turn three cards. Drag exposed cards and valid runs; double-click an exposed tableau or waste card to send it to a foundation. The title, help screen, and in-game HUD also support Arrow keys or W/S plus Enter/Space; Escape returns from help. The HUD starts a new deal, returns to the menu, or toggles sound. Press backtick to show the read-only diagnostics overlay.

Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run format` for the project checks.
