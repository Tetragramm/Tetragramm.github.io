# Flying Circus Plane Builder

This is the website and repo for the Flying Circus Plane Builder.  Flying Circus is an in-depth, highly detailed Powered by the Apocalypse-derived roleplaying game of aviation fantasy, set in a world of machines and magic inspired by the works of Hayao Miyazaki.  If you haven't already, go buy it [HERE](https://opensketch.itch.io/flying-circus).

## Organization of the Repo

The primary code is in the PlaneBuilder folder.  The repository is actually also the website, through the magic of Github Pages, so branches meant to be tested by other people are unfortunately required to be present in the repo.  The Test folder is a verbatim copy of PlaneBuilder used for exactly that (see "Testing branch conventions" below).  The Helicopter folder holds the helicopter builder pages, which are a thin wrapper that loads the bundles and shared assets from ../Test/.  VehicleBuilder is the Chariots of Steel vehicle builder.

index.html just immediately redirects to PlaneBuilder/index.html.  Someday I may add a personal website here and change that, but for now, no.

The aircraft model and all the stat calculations live in Rust (`flyingcircusrust`), compiled to WebAssembly by `flyingcircuswasm`, and the TypeScript in PlaneBuilder/src is the UI layer on top of it.  See WASM_BUILD.md for how to build the two halves.

Inside /PlaneBuilder there are folders for each sub-page's code, and /src, which contains all the source code.

- .vscode
  - vscode settings that define "tasks" that automate annoying console commands.
- Cards
  - The printable blank cards that get automatically filled out.
- EngineBuilder
  - The compiled .js for the Engine Builder.
  - Also the instructional guide on how to use it, in PDF form.
- Hangar
  - A page for saving planes and comparing them to each other
- page
  - Display resources, one image and the CSS files.
- pkg
  - The wasm-pack output (JS bindings, .wasm, .d.ts) for `flyingcircuswasm`.  Generated, not checked in.
- Rules
  - The Rules for the plane builder, one HTML page per language, generated from the .typ (Typst) sources.  Rules.htm redirects old links to Rules_en.html.
- src
  - plane_builder.ts / wasm_init.ts
    - The main page's entry point and the `WasmApplication` class that wires the components to the WASM module.
  - wasm
    - aircraft_bridge.ts wraps the Rust `AircraftWasm` object; localization.ts talks to the Rust i18n backend; deployment.ts works out which copy of the builder (PlaneBuilder, Test, Helicopter) the page is served from.
    - components/ - one UI component per section of the page (era, cockpits, engines, wings, ...).
    - builders/ - the Engine Builder page and its per-engine-type UIs.
  - Hangar
    - The hangar page (hangar_core.ts is shared with the Helicopter hangar).
  - JSON2CSV, scroll
    - Small libraries: CSV export for the hangar, and scroll-to-fragment.
- WeaponDisplay
  - A standalone page that shows the stats of all the weapons.  This is the last piece of the old pure-TypeScript builder; it has no source in src/ any more.

## How to use and edit

For the easy way, you'll need vscode, python, and typescript installed, and the repository cloned.
Added April, 2022: In addition, install webpack, webpack-cli and ts-loader.  If you are installing them globally, you will need to use your shell to call 
`npm link webpack`
`npm link typescript`
`npm link ts-loader`
In the end, you should have a folder named `node_modules` in your directory structure, at the same level as webpack.config.js, or higher.  Running `npm install` from the root of the repo will create one folder shared by the PlaneBuilder, Test, and Helicopter folders, which is good.  You also need Rust and wasm-pack to build the WebAssembly module; see WASM_BUILD.md.

In vscode, open the /PlaneBuilder folder and you should see the folders described .  I have already set up a task to compile the typescript, and start a webserver to test with.  Hit Ctrl+Shift+B to execute the task.  Now, whenever you make changes, hit save, and webpacks's watch will see the change and recompile.  It does take a few seconds without any visible progress though.

The webserver can be accessed from <localhost:8080>, via any browser.  If you are working on a specific "branch" you may need to append that folder name, eg. <localhost:8080/Test>

## Key Concepts

The model code these concepts describe now lives in the Rust crate (`flyingcircusrust`); the code samples below are from the earlier TypeScript version, but the ideas carry over unchanged.

### Storing planes

The airplanes can be saved as JSON, or a packed binary serialization.  Each section has a pair of methods for writing and reading JSON, and serializing and deserializing data.  These also include the "part version", defined at the top of parts.json.  With this, you can add additional data, modify the fields, ect, so long as you increment the part version by 0.1 per step.  It's fractional because it started as a map to another number, which no longer exists.  Be sure to keep the code so it can read older planes.  

Example where the field `rocket_count` was added in version 10.8.  Before that there was nothing, so there is no `else` statement.
```ts
public fromJSON(js: JSON, json_version: number) {
    this.bomb_count = js["bomb_count"];
    this.internal_bay_count = js["bay_count"];
    this.internal_bay_1 = js["bay1"];
    this.internal_bay_2 = js["bay2"];
    if (json_version > 10.75) {
        this.rocket_count = js["rocket_count"];
    }
}
```

### Display Strings

There was a plan to translate the builder into other languages.  So now there is a string indirection system, where the code names and the display names can be different.  This is _mostly_ in the display layer, but it ended up in the stats warnings because some of them need to be formatted with internal data.  This would be a good thing to clean up at some point, but it's probably a lot of effort for little reward.  Use the `lu` or lookup function to take the key and return the matching value from strings.json.

```ts
stats.warnings.push({
    source: lu(this.weapon_type.name) + " " + lu("No Interference"),
    warning: lu("No Interference Warning"),
});
```

### Engines

Engines started out the same as normal parts, stored as `Stats` objects, but then we had to make a change to the engine builder and realized they needed to be stored as engine builder inputs.  So there's a really messy bit of deserialization code to handle that transition, and now they're stored as `EngineInputs`.  The way it works now is that when needed, and `EngineBuilder`, `PulsejetBuilder`, `TurboBuilder`, or possible future type is created, the inputs are fed in, and it returns the final stats.  

### Local Storage

The active plane, planes in the hangars, custom parts, and engines are all stored in browser localstorage.  They are saved there as JSON, so they're human readable if necessary.  The default engine lists are overwritten on every load, to make sure nobody tries to modify canon engines.  Everything except Custom Parts can be saved to a file, say, if you need to move it from your test branch to the real builder.

### Testing branch conventions

The primary builder uses bare localstorage keys (`aircraft`, `hangar_names`, `engines_names`, `CustomParts`, ...).  Any other copy of the builder namespaces its keys by the folder it is served from, so the Test copy uses `test.aircraft` and so on.  That keeps any changes or mistakes you make from breaking the stored data as you swap back and forth between test branch and regular.  The Helicopter pages use `helicopter.` for their own aircraft and hangars, and share Test's engine lists and custom parts.

This is all derived at runtime from the page URL in `src/wasm/deployment.ts`, together with the redirect targets between the plane and helicopter builders, so nothing in the source needs editing when a copy is made.  To refresh the Test copy after merging something into PlaneBuilder:

```bash
rm -rf Test && cp -r PlaneBuilder Test
cd Test && npx webpack --mode production
```

The build outputs (the `.js` bundles and `flyingcircus.module.wasm`) are checked in because Github Pages serves them as-is, so rebuild in the copy after copying.  The Test copy's build also emits the Helicopter bundles (`helicopter_builder.js`, `Hangar/helicopter_hangar.js`), since the Helicopter pages load them from `../Test/`; the PlaneBuilder build skips them.  If you make your own branch folder, copy PlaneBuilder the same way; the storage prefix follows the folder name automatically.

## Licenses

This code is licensed under GPLV3, and if you need another license, ask.  I'm kinda curious what commercial work might use this.

The dashboard and cards are use with the permission of Erika Chappell, the author and artist of Flying Circus.

LZ-String is Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>, distributed under the WTFPL version 2 license.

reset.css is from <http://meyerweb.com/eric/tools/css/reset/> and is licensed public domain.

W3.CSS 4.13 is by Jan Egil and Borge Refsnes and is free to use. No license is necessary.

Scroll-to-Fragment is Copyright(c) 2020 David Császár, distributed under the MIT License.

StringFmt is Copyright(c) 2017 Sven Ulrich, distributed under the MIT License.

JSON2CSV is Copyright (c) 2014 Martin Drapeau, distributed under the MIT License.