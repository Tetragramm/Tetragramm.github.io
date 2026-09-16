# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a multi-project repository for the **Flying Circus Plane Builder** - a comprehensive tool for the Flying Circus RPG. It is also the GitHub Pages site (`Tetragramm.github.io`), so every folder below is served at `/<folder>/` and the compiled bundles are checked in.

- **PlaneBuilder/** - The primary builder. TypeScript UI layer over the Rust/WASM model. Served at `/PlaneBuilder/`.
- **Test/** - A verbatim copy of PlaneBuilder/ used for public testing before changes go live. Served at `/Test/`.
- **Helicopter/** - The helicopter builder pages. A thin wrapper (HTML + a few entry scripts) that loads its bundles, Rules pages and Engine Builder from `../Test/` and imports its TypeScript from `../Test/src/`.
- **VehicleBuilder/** - Chariots of Steel vehicle builder (separate Rust crate, `chariotsofsteelwasm`).
- **flyingcircusrust/** - The aircraft model and every stat calculation, in Rust. Includes `ui_core`/`ui_macro` (UI binding framework) and the `locales/` translations.
- **flyingcircuswasm/** - wasm-bindgen wrapper exposing `AircraftWasm` etc. to JavaScript. Built with `wasm-pack` into `<builder>/pkg/`.
- **fc_serialization/** - Versioned binary/JSON serialization shared by the Rust crates.
- **flyingcircustypst/** - Typst sources for the Rules pages.
- **server.py** - Simple HTTP server for local development (port 8080).
- **index.html** / **temp.js** - Redirects the site root to `/PlaneBuilder/index.html`.

## Key Architectural Concepts

### Rust model, TypeScript view

All game logic lives in Rust. The TypeScript in `PlaneBuilder/src/` only renders the UI and calls into the WASM object:

- **src/wasm_init.ts** - `WasmApplication`: loads the WASM module, loads the aircraft (URL `?json=` → localStorage → page default), builds every UI component, and redirects between the plane and helicopter pages when the loaded aircraft type doesn't match the page.
- **src/plane_builder.ts** - Entry point for the main page.
- **src/wasm/aircraft_bridge.ts** - `AircraftBridge`, the typed wrapper around the Rust `AircraftWasm` object. Owns auto-save to localStorage and the custom engine list load/save.
- **src/wasm/localization.ts** - Talks to the Rust i18n backend; `localization.translate(key)` replaces the old `lu()`.
- **src/wasm/deployment.ts** - Works out which copy of the builder the page is served from (PlaneBuilder, Test, Helicopter, or another branch folder) and derives the localStorage key prefix and redirect targets from it. See "Deployment copies" below.
- **src/wasm/components/** - One UI component per page section (`era_ui.ts`, `cockpits_ui.ts`, `engines_ui.ts`, `wings_ui.ts`, ...). Each clears its container and re-renders from the bindings the Rust side exposes.
- **src/wasm/builders/** - The Engine Builder page (`engine_builder_app.ts`) and its per-engine-type UIs (piston, pulsejet, turbo, electric, propeller) plus the engine list manager.
- **src/Hangar/** - The hangar page. `hangar_core.ts` is shared with the Helicopter hangar; `hangar.ts` and `Helicopter/src/Hangar/helicopter_hangar.ts` just call `runHangar(prefix)`.
- **pkg/** - wasm-pack output (generated, git-ignored).

The Rust side (`flyingcircusrust/src/`) has one module per part (`cockpits`, `engines`, `wings`, ...), `stats.rs` for the totals, `serialization.rs`/`json.rs` for save formats, and the `*_builder.rs` files for the engine builders.

### Deployment copies and localStorage

Several copies of the builder are served side by side, so nothing in the source may hardcode a folder name or a storage key. `src/wasm/deployment.ts` derives everything from `window.location.pathname`:

- `/PlaneBuilder/` uses bare localStorage keys (`aircraft`, `hangar_names`, `hangar.<name>`, `engines_names`, `engines.<name>`, `CustomParts`) so users' saved data from earlier versions keeps loading.
- `/Test/` (and any other branch folder) prefixes keys with its lower-cased folder name: `test.aircraft`, etc.
- `/Helicopter/` uses `helicopter.` for its own aircraft and hangars (set explicitly in `Helicopter/src`) and shares Test's engine lists and custom parts. It redirects to `/Test/` for non-helicopter aircraft; the builder pages redirect to `/Helicopter/` for helicopters. `HELICOPTER_HOST_DIR` in deployment.ts names the copy the Helicopter pages are bound to; keep it in sync with `Helicopter/src`, `Helicopter/*.html` and the helicopter entries in `webpack.config.js`.

Use `storageKey(name)` / `storagePrefix()` from deployment.ts for any new stored item.

### Serialization

Aircraft are stored as versioned JSON (localStorage) or a versioned LZ-compressed binary string (share links, hangars). The current version string is written in `flyingcircusrust/src/aircraft/json.rs` (`to_json`) and `flyingcircusrust/src/part_list.rs`; `fc_serialization` provides the versioned reader/writer traits. Bump it by 0.1 in both places whenever a stored field changes, and guard the new field with `if json_version > X.Y` so older saves still load. Old TypeScript-era saves must continue to load - the Helicopter page in particular handles both formats.

## Development Commands

Run `npm install` once from the repository root (node_modules is shared by every builder folder). Rust and `wasm-pack` are needed for the WASM half; see WASM_BUILD.md.

```bash
# Build the WASM module into the primary builder
cd flyingcircuswasm && wasm-pack build --target bundler --out-dir ../PlaneBuilder/pkg

# Build / watch the TypeScript bundles (from PlaneBuilder/ or Test/)
npx webpack --mode production
npx webpack watch --mode development

# Or from the root: npm run build / npm run watch (PlaneBuilder), npm run build:wasm, npm run build:test

# Local server, from the repository root
python server.py     # http://localhost:8080/PlaneBuilder, /Test, /Helicopter

# Rust tests
cd flyingcircusrust && cargo test
```

VSCode: Ctrl+Shift+B in the PlaneBuilder (or Test) folder runs the server and webpack watch.

### Webpack entry points

From `webpack.config.js` (identical in PlaneBuilder/ and Test/):

- `plane_builder` → `plane_builder.js`
- `hangar` → `Hangar/hangar.js`
- `engine_builder_app` → `EngineBuilder/engine_builder_app.js`
- `helicopter_builder` → `helicopter_builder.js` and `helicopter_hangar` → `Hangar/helicopter_hangar.js` - **only emitted by the Test/ build**, because the Helicopter pages load them from `../Test/`. The config keys this on the folder name.

Shared code is split into chunks named after the entries that use them (e.g. `hangar+plane_builder.js`), and the WASM package goes to `pkg_flyingcircuswasm.js` + `flyingcircus.module.wasm`. `console.log`/`console.debug` are stripped from production builds; `console.warn`/`console.error` survive.

## Promoting Test to PlaneBuilder / refreshing Test

The two folders are meant to be byte-identical apart from build output. After merging changes into PlaneBuilder/:

```bash
rm -rf Test && cp -r PlaneBuilder Test
cd Test && npx webpack --mode production
```

Then commit both, including the rebuilt bundles. Never edit Test/ directly and forget to port the change back.

## Important Patterns and Conventions

### Adding or changing a part

1. Model, stats and serialization in `flyingcircusrust/src/<part>/`; bump the serialization version if a stored field changes.
2. Expose what the UI needs through `flyingcircuswasm/src/lib.rs` (and the `AircraftBridge` wrapper).
3. UI component in `PlaneBuilder/src/wasm/components/`, registered in `wasm_init.ts`.
4. Translations in `flyingcircusrust/locales/`; use `localization.translate()` for every user-visible string.
5. Rebuild WASM, then webpack.

### Adding an engine type

Builders live in `flyingcircusrust/src/*_builder.rs` and take `EngineInputs`; the matching UI goes in `PlaneBuilder/src/wasm/builders/`.

### Legacy page

`PlaneBuilder/WeaponDisplay/` (weapons.html + a compiled bundle) is the last piece of the old pure-TypeScript builder. It has no source in `src/`; the source is in git history before the WASM rewrite.

## Notes on Maintenance

- Never hardcode `/Test/`, `/PlaneBuilder/` or a `test.` storage key in `PlaneBuilder/src`; go through `deployment.ts`.
- Build output is committed because GitHub Pages serves it; rebuild before committing.
- `Rules/Rules.htm` is a redirect stub for old links to the pre-localization rules page; the real pages are `Rules_<lang>.html`.
