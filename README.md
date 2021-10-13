# Flying Circus Plane Builder

This is the website and repo for the Flying Circus Plane Builder.  Flying Circus is an in-depth, highly detailed Powered by the Apocalypse-derived roleplaying game of aviation fantasy, set in a world of machines and magic inspired by the works of Hayao Miyazaki.  If you haven't already, go buy it [HERE](https://opensketch.itch.io/flying-circus).

## Organization of the Repo

The primary code is in the PlaneBuilder folder.  Other folders may exist for temporary testing purposes.  The repository is actually also the website, through the magic of Github Pages, so branches meant to be tested by other people are unfortunately required to be present in the repo.  Also there's the Helicopter folder, which I'll get around to finishing someday.

index.html just immediately redirects to PlaneBuilder/index.html.  Someday I may add a personal website here and change that, but for now, no.

Inside /PlaneBuilder there are folders for code, for libraries, for resources, and a separate folder for each sub-page's code.  At some point I will rearrange the *.json files into their own folder and the main plane_builder.js into it's own folder, but for now they're top level.

- .vscode
  - vscode settings that define "tasks" that automate annoying console commands.
- Cards
  - The printable blank cards that get automatically filled out.
- disp
  - The *.ts files that are used to create the main page's display.
- EngineBuilder
  - The *.ts files and compiled .js for the Engine Builder.
  - Piston engines, Pulsejets, Turbines, and possibly soon electric engines.
- Hangar
  - A page for saving planes and comparing them to each other
- Helicopter
  - Now defunct. Redirects to the main page.  Will be removed eventually
- impl
  - The model code.  A bit of data saving and such has crept in, but it's _almost_ display and browser independent.
- lz
  - The Lz-string library, for compressing strings in the link creation.
- page
  - Display resources, one image and the CSS files.
- Rules
  - The Rules for the plane builder.  Converted from a .docx saved as a .rtf  TODO: check that in here
- scroll
  - The Scroll-to-fragment library.  How it jumps to the right portion of the page after loading.  Why is this hard enough it needs a library?
- string
  - The StringFmt library.  Useful things like Join and Fmt.
- WeaponDisplay
  - A page that shows the stats of all the weapons, and associated code.

## How to use and edit

For the easy way, you'll need vscode, python, and typescript installed, and the repository cloned.

In vscode, open the /PlaneBuilder folder and you should see the above folders.  I have already set up a task to compile each individual page, and start a webserver to test with.  Hit Ctrl+Shift+B to execute the task.  Now, whenever you make changes, hit save, and typescript's watch will see the change and recompile.

The webserver can be accessed from <localhost:8080>, via any browser.  If you are working on a specific "branch" you may need to append that folder name, eg. <localhost:8080/Test>

## Key Concepts

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

If you make your own test branch you'll want to modify the places where localstorage is used to add a prefix to the variables things get stored in.  IE: `Test.engine_lists`  That keeps any changes or mistakes you make from breaking the stored data as you swap back and forth between test branch and regular.

## Licenses

This code is licensed under GPLV3, and if you need another license, ask.  I'm kinda curious what commercial work might use this.

The dashboard and cards are use with the permission of Erika Chappell, the author and artist of Flying Circus.

LZ-String is Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>, distributed under the WTFPL version 2 license.

reset.css is from <http://meyerweb.com/eric/tools/css/reset/> and is licensed public domain.

W3.CSS 4.13 is by Jan Egil and Borge Refsnes and is free to use. No license is necessary.

Scroll-to-Fragment is Copyright(c) 2020 David Császár, distributed under the MIT License.

StringFmt is Copyright(c) 2017 Sven Ulrich, distributed under the MIT License.