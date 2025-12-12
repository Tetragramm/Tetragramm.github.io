# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a multi-project repository for the **Flying Circus Plane Builder** - a comprehensive tool for the Flying Circus RPG. The main projects are:

- **PlaneBuilder/** - TypeScript/JavaScript web application for building and managing aircraft
- **flyingcircuswasm/** - Rust/WebAssembly module (currently in development) that provides backend calculations for the plane builder
- **Helicopter/** - Similar builder for helicopters (mostly dormant)
- **Test/** - Testing branch for new features
- **VehicleBuilder/** - Vehicle builder (incomplete)
- **InteractiveDash/** - Interactive dashboard component
- **server.py** - Simple HTTP server for local development (serves on port 8080)

## Key Architectural Concepts

### PlaneBuilder (TypeScript)

The TypeScript application follows a **Model-View separation**:

- **src/impl/** - Model/business logic layer
  - `Aircraft.ts` - Core aircraft data structure and serialization
  - `EngineInputs.ts`, `EngineList.ts`, `EngineStats.ts` - Engine handling system
  - `Stats.ts` - Calculate aircraft performance/stats
  - `Part.ts`, `Cockpit.ts`, `Wings.ts`, etc. - Individual component implementations
  - `Serialize.ts` - Serialization/deserialization with versioning support

- **src/disp/** - Display/UI layer
  - `Display.ts` - Main UI controller
  - `*.ts` files (Engines.ts, Wings.ts, etc.) - UI components for each part type
  - Uses the `strings.json` localization system for display text

- **src/EngineBuilder/** - Specialized engine configuration system
  - `ElectricBuilder.ts`, `PulsejetBuilder.ts`, `TurboBuilder.ts` - Engine-specific builders
  - `engine_builder.ts` - Main entry point

- **src/** Root level entries
  - `plane_builder.ts` - Main application entry point
  - `Hangar/hangar.ts` - Aircraft comparison/storage UI
  - `WeaponDisplay/weapon_display.ts` - Weapon statistics display
  - `JSON2CSV/json2csv.ts` - Export functionality

- **JSON Data Files**
  - `parts.json` - Aircraft parts database with version tracking
  - `engines.json` - Engine definitions and stats
  - `weapons.json` - Weapon definitions
  - `strings.json` - Localization strings for all UI text

### Serialization Architecture

Aircraft data uses a **versioning system** to maintain backward compatibility:

- Each time data structure changes, increment the version in `parts.json` by 0.1
- Serialization/deserialization code checks version numbers to handle format changes
- Both JSON format (human-readable) and binary format (compact) are supported
- Example: If a new field is added, wrap it with `if (json_version > X.Y)`
- See `Serialize.ts` and individual `fromJSON()`/`toJSON()` methods in impl files

### Engine System

Engines have a special architecture:

- Stored as `EngineInputs` objects (user configuration)
- When needed, an `EngineBuilder`, `PulsejetBuilder`, `TurboBuilder`, or future builder is instantiated
- Builder consumes the inputs and returns calculated `Stats`
- This separation allows engines to have complex configuration without duplicating builder logic

### Localization System

Display strings are indirected through `strings.json`:

- Use `lu(key)` function to look up display strings
- Allows future translation without code changes
- Internal code uses consistent naming (e.g., `weapon_type.name` is the internal key)
- Display names come from looking up these keys in strings.json

### Local Storage

Browser localStorage is used to persist:

- Active aircraft being edited
- Saved aircraft in "hangars"
- Custom engine lists
- Custom parts (if implemented)

Default engines are overwritten on each load to prevent desync with canonical data.

## Development Commands

### TypeScript/JavaScript Setup

All commands should be run from the repository root or PlaneBuilder folder:

```bash
# Install dependencies (once)
npm install

# Watch and compile TypeScript (in PlaneBuilder/)
webpack watch -c webpack.config.js

# Or use VSCode task: Ctrl+Shift+B (runs both local server and webpack watch)
```

### Start Development Server

```bash
# From repository root
python server.py
# Server runs on http://localhost:8080
# Access PlaneBuilder at http://localhost:8080/PlaneBuilder
```

### Rust/WebAssembly Setup

```bash
# From flyingcircuswasm/ directory

# Build WebAssembly
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# The output WASM is generated in target/wasm32-unknown-unknown/release/
```

### Webpack Configuration

- **Entry points** (from webpack.config.js):
  - `plane_builder.ts` → `plane_builder.js`
  - `weapon_display.ts` → `WeaponDisplay/weapon_display.js`
  - `hangar.ts` → `Hangar/hangar.js`
  - `engine_builder.ts` → `EngineBuilder/engine_builder.js`

## Important Patterns and Conventions

### Adding New Aircraft Parts

1. Create data structure in `src/impl/Parts.ts` (or similar)
2. Add model methods: `toJSON()`, `fromJSON(json, version)`, `serialize()`, `deserialize()`
3. Create display component in `src/disp/Parts.ts`
4. Add part definitions to `parts.json` with all stats
5. Update `Stats.ts` if the part affects aircraft statistics
6. Add localization strings to `strings.json`
7. **Increment version in parts.json** if data structure changes

### Adding New Engine Types

1. Create builder class (e.g., `src/EngineBuilder/FutureBuilder.ts`)
2. Implement to accept `EngineInputs` and return `Stats`
3. Register in engine factory (likely in `Engines.ts`)
4. Add engine definitions to `engines.json`

### Modifying Data Structures

When changing how aircraft data is stored:

1. Increment `partVersion` in `parts.json` by 0.1
2. Update serialization code with version checks
3. Ensure old version data can still be read (backward compatibility)
4. Update any related display or UI components

## Testing Branch Conventions

- The **Test/** folder mirrors PlaneBuilder for testing new features
- Local storage keys should be prefixed (e.g., `Test.engine_lists`) to avoid data conflicts when switching between branches
- Always test on a branch before merging to main

## Build Output

- Compiled JavaScript goes to the folder level (not `src/`), e.g., `plane_builder.js`
- Source maps may be generated (if configured in webpack)
- No build output should be committed unless explicitly needed

## Dependencies

### TypeScript/JavaScript

- **webpack** + **webpack-cli** - Bundler
- **ts-loader** - TypeScript loader for webpack
- **typescript** - Language compiler
- **lz-string** - String compression (for link generation)
- **scroll-to-fragment** - Scroll to section on page load
- **StringFmt** - String utilities (Join, Fmt)

### Rust/WebAssembly

- **wasm-bindgen** - JavaScript ↔ Rust bindings
- **serde_json** - JSON parsing
- **itertools** - Iterator utilities
- **byteorder** - Byte order handling
- **encoding_rs** - Character encoding
- **formatx** - Formatting utilities
- **ui_core** - Local UI framework (path dependency)
- **ui_macro** - UI procedural macros (path dependency)

## Notes on Maintenance

- **Parts versioning** is critical - always increment when changing data structures to maintain save compatibility
- **Localization** is partially implemented but incomplete - new UI elements should use `lu()` for consistency
- **Deserialization is complex** due to version handling - test thoroughly when modifying it
- The repository serves as both a codebase and a GitHub Pages website
- Keep node_modules organized at the repository root level (shared across PlaneBuilder, Test, Helicopter)
