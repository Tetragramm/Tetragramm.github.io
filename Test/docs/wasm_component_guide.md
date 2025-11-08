# WASM Component Development Guide

This guide documents patterns and best practices for developing UI components that interface with Rust WASM bindings in the Flying Circus Plane Builder.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [BaseComponentUI Pattern](#basecomponentui-pattern)
3. [Helper Functions](#helper-functions)
4. [Binding Types](#binding-types)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

## Component Architecture

### Overview

All WASM-powered UI components follow a consistent architecture:

1. **Extend BaseComponentUI** - Provides lifecycle methods and rendering logic
2. **Define Cache Interface** - Type-safe cache for DOM elements
3. **Implement Abstract Methods** - `shouldUpdate()`, `clearCache()`, `rebuildFull()`, `updateValues()`
4. **Use Helper Functions** - Leverage `dom_utils.ts` helpers to reduce duplication

### File Structure

```
Test/src/wasm/
├── components/
│   ├── accessories_ui.ts       # Accessories component
│   ├── cockpits_ui.ts          # Cockpits component
│   ├── control_surfaces_ui.ts  # Control surfaces component
│   ├── landing_gear_ui.ts      # Landing gear component
│   ├── load_ui.ts              # Load (fuel, munitions, cargo) component
│   └── stabilizers_ui.ts       # Stabilizers component
├── base_component_ui.ts        # Abstract base class
├── dom_utils.ts                # Reusable DOM creation helpers
├── aircraft_bridge.ts          # TypeScript-Rust bridge
└── localization.ts             # Internationalization support
```

## BaseComponentUI Pattern

### Abstract Base Class

`BaseComponentUI` provides the foundation for all components:

```typescript
export abstract class BaseComponentUI {
    protected abstract shouldUpdate(): boolean;
    protected abstract clearCache(): void;
    protected abstract rebuildFull(): void;
    protected abstract updateValues(): void;

    public render(): void {
        // Orchestrates update vs rebuild decision
    }
}
```

### Key Methods

#### `shouldUpdate(): boolean`

Returns `true` if the component can do a fast update (cache exists), `false` if it needs a full rebuild.

**Pattern:**
```typescript
protected shouldUpdate(): boolean {
    return this.cache !== undefined;
}
```

**Special Cases:**
- **Cockpits**: Also checks if cockpit count changed, which requires rebuild
```typescript
const currentCount = cockpitsBindings.positions.length;
return currentCount === this.lastCockpitCount && this.mainTable !== undefined;
```

#### `clearCache(): void`

Clears all cached DOM elements, forcing a rebuild on next render.

**Pattern:**
```typescript
protected clearCache(): void {
    this.cache = undefined;
}
```

#### `rebuildFull(): void`

Creates the entire DOM structure from scratch. Called on:
- First render
- Locale changes
- Structural changes (e.g., cockpit count changes)

**Pattern:**
```typescript
protected rebuildFull(): void {
    this.clearCache();
    this.container.innerHTML = '';

    const bridge = this.getBridgeIfInitialized();
    if (!bridge) return;

    const bindings = bridge.getComponentBindings();

    // Create table structure
    const mainTable = document.createElement('table');
    // ... build UI sections

    // Create stats table
    const stats = bridge.getComponentStats();
    const statsTable = createStatsTable(stats, COMPONENT_STATS);

    // Cache elements
    this.cache = { /* DOM references */, statsTable };

    // Create collapsible section
    this.sectionElement = createCollapsibleSection(title, mainTable, true);

    // Add rules link
    const rulesLine = createRulesLink('_Section_Name');
    this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

    this.container.appendChild(this.sectionElement);
}
```

#### `updateValues(): void`

Updates existing DOM elements with new values (fast path). No DOM creation.

**Pattern:**
```typescript
protected updateValues(): void {
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cache) return;

    const bindings = bridge.getComponentBindings();

    // Update cached elements
    updateSelectElement(this.cache.someSelect, bindings.some_sel);
    this.cache.someInput.value = bindings.some_value.value.toString();
    // ... update other elements

    // Update stats table
    const stats = bridge.getComponentStats();
    updateStatsTable(this.cache.statsTable, stats, COMPONENT_STATS);
}
```

### Cache Interface Pattern

Define a TypeScript interface for type-safe caching:

```typescript
interface ComponentCache {
    selectElement: HTMLSelectElement;
    numberInputs: HTMLInputElement[];
    checkboxes: HTMLInputElement[];
    statsTable: HTMLTableElement;
}

export class ComponentUI extends BaseComponentUI {
    private cache: ComponentCache = undefined;
    // ...
}
```

**Why `undefined` instead of `null`?**
- TypeScript strictness: `undefined` is the natural uninitialized state
- Allows simple truthiness checks: `if (!this.cache)`

## Helper Functions

All helper functions are in `dom_utils.ts` to promote code reuse.

### Creating Flex Layouts

#### `createFlexSection()`

Creates a two-column flex layout container.

**Usage:**
```typescript
const flexContainer = createFlexSection();
// flexContainer.div0 - outer container
// flexContainer.div1 - labels column
// flexContainer.div2 - inputs column
```

#### `createFlexNumberInput()`

Creates a labeled number input in a flex layout.

**Signature:**
```typescript
createFlexNumberInput(
    binding: any,  // Binding with name, value, enabled
    flexContainer: { div1: HTMLDivElement, div2: HTMLDivElement },
    onChange: (value: number) => void,
    min?: string,
    max?: string,
    step?: string
): HTMLInputElement
```

**Usage:**
```typescript
const input = createFlexNumberInput(
    binding,
    flexContainer,
    (value) => {
        const bindings = bridge.getBindings();
        bindings.field.value = value;
        bridge.setBindings(bindings);
        this.render();
    },
    '0',   // min
    '20',  // max
    '1'    // step
);
```

#### `createFlexNumberInputs()`

Creates multiple number inputs from an array binding.

**Usage:**
```typescript
const inputs = createFlexNumberInputs(
    flexContainer,
    bindingArray,  // Array of number bindings
    (idx) => (value) => {
        const bindings = bridge.getBindings();
        bindings.array[idx].value = value;
        bridge.setBindings(bindings);
        this.render();
    }
);
```

**Pattern: Callback-returning-callback**
```typescript
(idx) => (value) => { /* use idx and value */ }
```
This pattern captures the index for each callback while avoiding closure issues.

#### `createFlexCheckbox()`

Creates a labeled checkbox in a flex layout.

**Usage:**
```typescript
const checkbox = createFlexCheckbox(
    binding,
    flexContainer,
    (checked) => {
        const bindings = bridge.getBindings();
        bindings.field.selected = checked;
        bridge.setBindings(bindings);
        this.render();
    }
);
```

#### `createFlexCheckboxes()`

Creates multiple checkboxes from an array binding.

**Usage:**
```typescript
const checkboxes = createFlexCheckboxes(
    flexContainer,
    bindingArray,
    (idx) => (checked) => {
        const bindings = bridge.getBindings();
        bindings.array[idx].selected = checked;
        bridge.setBindings(bindings);
        this.render();
    }
);
```

### Creating Selects

#### `createSelectElement()`

Creates a standalone select element (no label, no flex layout).

**Usage:**
```typescript
const select = createSelectElement(
    binding,
    (selectedIndex) => {
        const bindings = bridge.getBindings();
        bindings.field.selected = selectedIndex;
        bridge.setBindings(bindings);
        this.render();
    }
);
```

**When to use:**
- Select needs custom positioning
- Select is the only element in a cell
- Select needs a separate label element

#### `createFlexSelect()`

Creates a labeled select in a flex layout.

**Usage:**
```typescript
const select = createFlexSelect(
    binding,
    flexContainer,
    (selectedIndex) => {
        const bindings = bridge.getBindings();
        bindings.field.selected = selectedIndex;
        bridge.setBindings(bindings);
        this.render();
    },
    'Custom Label'  // Optional, defaults to binding.name
);
```

#### `updateSelectElement()`

Updates an existing select element's state (for fast path updates).

**Usage:**
```typescript
updateSelectElement(this.cache.someSelect, bindings.some_sel);
```

**What it updates:**
- `selectedIndex`
- `disabled` state
- Individual option `disabled` states

### Creating Tables

#### `createFlexCell()`

Creates a table cell with a flex container pre-attached.

**Usage:**
```typescript
const { cell, flex } = createFlexCell();
// Add elements to flex.div1 and flex.div2
row.appendChild(cell);
```

### Creating and Updating Stats Tables

Stats tables use a consistent pattern across all components.

#### `StatDisplayConfig` Interface

Located in `dom_utils.ts`, defines how to display each stat:

```typescript
interface StatDisplayConfig {
    key: string;              // Key in the Stats object
    label: string;            // Localization key for the header
    positiveIsGood?: boolean; // Whether positive change is good (for highlighting)
    isDerived?: boolean;      // Whether this is a derived stat (special background)
}
```

#### `createStatsTable()`

Creates a stats table from a Stats object and configuration.

**Signature:**
```typescript
createStatsTable(
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any
): HTMLTableElement
```

**Usage:**
```typescript
// Define stats configuration at top of component file
const COMPONENT_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
];

// In rebuildFull()
const stats = bridge.getComponentStats();
const statsTable = createStatsTable(stats, COMPONENT_STATS);
statsCell.appendChild(statsTable);

// Cache the table
this.cache = { /* ... */, statsTable };
```

**What it does:**
- Groups stats into rows of 3 columns
- Creates alternating header/value rows
- Translates header labels using localization
- Applies `part_local` class to derived stats
- Handles special cases (like flight stress range)

#### `updateStatsTable()`

Updates an existing stats table with new values.

**Signature:**
```typescript
updateStatsTable(
    table: HTMLTableElement,
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any
): void
```

**Usage:**
```typescript
// In updateValues()
const stats = bridge.getComponentStats();
updateStatsTable(this.cache.statsTable, stats, COMPONENT_STATS);
```

**Optimization:** Only updates cell content if the value changed, preventing unnecessary DOM operations.

#### `createCollapsibleSection()`

Creates a collapsible section with header and content.

**Signature:**
```typescript
createCollapsibleSection(
    title: string,
    content: HTMLElement,
    initiallyOpen: boolean
): HTMLElement
```

**Usage:**
```typescript
const sectionTitle = localization.translate('Component Section Title');
this.sectionElement = createCollapsibleSection(sectionTitle, mainTable, true);
```

### Other Utilities

#### `createRulesLink()`

Creates a formatted rules link.

**Usage:**
```typescript
const rulesLine = createRulesLink('_Section_Name');
// Returns <h4>(<a href="./Rules/Rules.htm#_Section_Name"><u>Rules</u></a>)</h4>
```

#### `blinkIfChanged()`

Updates a cell's text content (with optional future animation support).

**Usage:**
```typescript
blinkIfChanged(cell, newValue.toString(), positiveIsGood);
```

## Binding Types

Rust UI bindings are generated by the `ui_macro::UIBindings` proc macro. Understanding the binding types is crucial.

### Common Binding Structures

#### Select Binding

**Rust:**
```rust
#[ui(select, source = "option_list", set_fn = "set_selection")]
pub(super) selection: usize,
```

**TypeScript (from bridge):**
```typescript
{
    name: "Selection Name",
    enabled: true,
    selected: 0,  // Current selection index
    options: [
        { name: "Option 1", enabled: true },
        { name: "Option 2", enabled: false },
        // ...
    ]
}
```

**Key to access:** `bindings.selection` (the Rust field name without type decorations)

#### Number Binding

**Rust:**
```rust
#[ui(number, set_fn = "set_count")]
pub(super) count: i16,
```

**TypeScript:**
```typescript
{
    name: "Count",
    enabled: true,
    value: 5
}
```

#### Number List Binding

**Rust:**
```rust
#[ui(number_list, source = "item_list", set_fn = "set_counts")]
pub(super) counts: Vec<i16>,
```

**TypeScript:**
```typescript
[
    { name: "Item 1", enabled: true, value: 0 },
    { name: "Item 2", enabled: true, value: 3 },
    // ... one per item in source list
]
```

**Access:** `bindings.counts` (array)

#### Check Binding

**Rust:**
```rust
#[ui(check, set_fn = "set_enabled")]
pub(super) enabled: bool,
```

**TypeScript:**
```typescript
{
    name: "Enabled",
    enabled: true,
    selected: false
}
```

#### Check List Binding

**Rust:**
```rust
#[ui(check_list, source = "option_list", set_fn = "set_selections")]
pub(super) selections: Vec<bool>,
```

**TypeScript:**
```typescript
[
    { name: "Option 1", enabled: true, selected: false },
    { name: "Option 2", enabled: true, selected: true },
    // ... one per item in source list
]
```

### Non-UI Fields

**Fields without `#[ui(...)]` attributes are NOT included in bindings.**

**Example: Armour Coverage in Accessories**
```rust
pub(super) armour_coverage: Vec<i16>,  // No #[ui(...)] attribute
```

This field is **not** in `getAccessoriesBindings()`. You need separate bridge methods:
```typescript
// TODO: Add to aircraft_bridge.ts
getArmourCoverage(): number[];
setArmourCoverage(index: number, value: number): void;
```

### Binding Key Names

**IMPORTANT:** The binding key in TypeScript matches the Rust field name exactly.

**Rust:**
```rust
#[ui(select, ...)]
pub(super) radio_sel: usize,
```

**TypeScript:**
```typescript
const radioBinding = bindings.radio_sel;  // Exact match
```

**Common mistake:**
```typescript
const radioBinding = bindings.radioSel;  // WRONG - camelCase conversion doesn't happen
```

## Common Patterns

### Event Handlers

#### Always Get Fresh Bindings

**WRONG:**
```typescript
// Captures bindings at creation time - can become stale
select.addEventListener('change', () => {
    bindings.field.selected = select.selectedIndex;  // stale bindings!
    bridge.setBindings(bindings);
});
```

**CORRECT:**
```typescript
select.addEventListener('change', () => {
    const bindings = bridge.getBindings();  // Get fresh bindings
    bindings.field.selected = select.selectedIndex;
    bridge.setBindings(bindings);
    this.render();
});
```

#### Use event.target for Inputs

**CORRECT:**
```typescript
input.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const bindings = bridge.getBindings();
    bindings.field.value = parseInt(target.value);
    bridge.setBindings(bindings);
    this.render();
});
```

**Also correct (simpler):**
```typescript
input.addEventListener('change', () => {
    const bindings = bridge.getBindings();
    bindings.field.value = parseInt(input.value);
    bridge.setBindings(bindings);
    this.render();
});
```

Both work, but using `event.target` is more explicit about avoiding closures over stale DOM references.

#### Closure Capture for Indices

When creating multiple elements in a loop, capture the index:

**WRONG:**
```typescript
for (let i = 0; i < items.length; i++) {
    input.addEventListener('change', () => {
        bindings.items[i].value = input.value;  // i might be wrong!
    });
}
```

**CORRECT:**
```typescript
items.forEach((item, idx) => {
    const index = idx;  // Capture for closure
    input.addEventListener('change', () => {
        const bindings = bridge.getBindings();
        bindings.items[index].value = parseInt(input.value);
        bridge.setBindings(bindings);
        this.render();
    });
});
```

**BEST (using helpers):**
```typescript
// Helper handles this automatically
createFlexNumberInputs(
    flexContainer,
    items,
    (idx) => (value) => {  // Callback-returning-callback pattern
        const bindings = bridge.getBindings();
        bindings.items[idx].value = value;
        bridge.setBindings(bindings);
        this.render();
    }
);
```

### Explicit Key Selection

**ALWAYS** use explicit binding keys instead of blindly looping.

**WRONG:**
```typescript
// Blindly iterates over all keys - loses control over UI order and structure
for (const key in bindings) {
    const binding = bindings[key];
    // Create UI element for binding...
}
```

**CORRECT:**
```typescript
// Explicitly select keys in desired order
const fuelInputs = createFlexNumberInputs(flexContainer, bindings.tank_count, ...);
const sealCheckbox = createFlexCheckbox(bindings.self_sealing, flexContainer, ...);
const extinguisherCheckbox = createFlexCheckbox(bindings.fire_extinguisher, flexContainer, ...);
```

**Why?**
- **Control:** Determines exact UI order and grouping
- **Type Safety:** Can add proper TypeScript types
- **Maintainability:** Easy to see what's being displayed
- **Robustness:** Adding new Rust fields won't break existing UI

### Handling Optional Bindings

Some bindings may not exist depending on aircraft state.

**Pattern:**
```typescript
const checkbox = binding ? createFlexCheckbox(
    binding,
    flexContainer,
    (checked) => { /* ... */ }
) : undefined;
```

**Cache handling:**
```typescript
interface Cache {
    optionalCheckbox?: HTMLInputElement;  // Optional field
}

// In updateValues:
if (this.cache.optionalCheckbox && bindings.field) {
    this.cache.optionalCheckbox.checked = bindings.field.selected;
    this.cache.optionalCheckbox.disabled = !bindings.field.enabled;
}
```

### Stats Updates

Stats tables are now handled consistently using helper functions from `dom_utils.ts`.

#### StatDisplayConfig Interface

Define which stats to display and how to display them:

```typescript
interface StatDisplayConfig {
    key: string;              // Key in the Stats object
    label: string;            // Localization key for the label
    positiveIsGood?: boolean; // Whether positive change is good (for future highlighting)
    isDerived?: boolean;      // Whether this is a derived stat (gets special background)
}
```

#### Component Stats Configuration

Each component defines a constant array at the top of the file:

```typescript
// Stabilizer stats configuration
const STABILIZER_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: true },
];
```

**Empty Cells:** Use an empty config to create empty cells for alignment:
```typescript
{ key: '', label: '', positiveIsGood: undefined }
```

**Table Layout:**
- Stats are automatically grouped into rows of 3
- Creates alternating header/value rows
- Handles empty cells for alignment

#### Creating Stats Table

In `rebuildFull()`, use `createStatsTable()`:

```typescript
// Get stats from bridge
const stats = bridge.getComponentStats();

// Create table using helper
const statsTable = createStatsTable(stats, COMPONENT_STATS);

// Add to cell
statsCell.appendChild(statsTable);

// Cache the table element
this.cache = {
    // ... other elements
    statsTable
};
```

**Signature:**
```typescript
createStatsTable(
    stats: any,                  // Stats object from Rust
    statConfig: StatDisplayConfig[],  // Configuration array
    derivedStats?: any          // Optional derived stats (for special cases)
): HTMLTableElement
```

#### Updating Stats

In `updateValues()`, use `updateStatsTable()`:

```typescript
protected updateValues(): void {
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cache) return;

    // ... update other UI elements

    // Update stats table
    const stats = bridge.getComponentStats();
    updateStatsTable(this.cache.statsTable, stats, COMPONENT_STATS);
}
```

**Signature:**
```typescript
updateStatsTable(
    table: HTMLTableElement,    // Cached table element
    stats: any,                 // Stats object from Rust
    statConfig: StatDisplayConfig[],  // Same config used to create
    derivedStats?: any          // Optional derived stats (for special cases)
): void
```

**Optimization:** `updateStatsTable()` only updates cells if values changed, preventing unnecessary DOM writes.

### Multi-Component Stats

When a component combines multiple sub-components (e.g., Load UI = Fuel + Munitions + Cargo):

#### Using addStats() Utility

```typescript
import { addStats } from '../aircraft_bridge';

protected updateValues(): void {
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cache) return;

    // Get stats from all sub-components
    const fuelStats = bridge.getFuelStats();
    const munitionsStats = bridge.getMunitionsStats();
    const cargoStats = bridge.getCargoStats();

    // Combine stats using helper
    const combinedStats = addStats(fuelStats, munitionsStats, cargoStats);

    // Update table with combined stats
    updateStatsTable(this.cache.statsTable, combinedStats, LOAD_STATS);
}
```

**`addStats()` Signature:**
```typescript
addStats(...statsList: Stats[]): Stats
```

**What it does:**
- Takes variable number of Stats objects
- Returns new Stats object with all numeric properties summed
- Verifies extra properties are numbers before adding
- Handles missing/undefined properties gracefully

**Example:**
```typescript
const stat1 = { drag: 5, mass: 10, cost: 100 };
const stat2 = { drag: 3, mass: 7, cost: 50 };
const combined = addStats(stat1, stat2);
// Result: { drag: 8, mass: 17, cost: 150 }
```

### Localization

All user-visible strings must go through `localization.translate()`:

```typescript
const label = localization.translate('Component Field Name');
```

**String keys** are defined in `JSON/strings.json` and sourced from Rust via the bridge.

**Pattern:**
- Rust provides the canonical string key
- `strings.json` maps key to display text
- TypeScript uses `localization.translate(key)` to get display text

### Table Layouts

Most components use a table-based layout:

```typescript
const mainTable = document.createElement('table');
mainTable.style.width = '100%';
mainTable.id = 'tbl_component';

// Header row
const headerRow = document.createElement('tr');
headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = localization.translate(headerText);
    headerRow.appendChild(th);
});
mainTable.appendChild(headerRow);

// Data row
const dataRow = document.createElement('tr');
// ... create cells
mainTable.appendChild(dataRow);
```

**Common column layouts:**
- 2 columns: Configuration | Stats
- 3 columns: Type/Config | Extras | Stats
- 4 columns: Section 1 | Section 2 | Section 3 | Stats

### Collapsible Sections

All components use collapsible sections:

```typescript
const sectionTitle = localization.translate('Component Section Title');
this.sectionElement = createCollapsibleSection(
    sectionTitle,
    contentElement,
    true  // initially open
);

// Add rules link
const rulesLine = createRulesLink('_Section_Anchor');
this.sectionElement.insertBefore(
    rulesLine,
    this.sectionElement.children[1]  // Insert before content, after header
);

this.container.appendChild(this.sectionElement);
```

**Signature:**
```typescript
createCollapsibleSection(
    title: string,           // Section title
    content: HTMLElement,    // Content element
    initiallyOpen: boolean   // Whether section starts expanded
): HTMLElement
```

## Troubleshooting

### Component Doesn't Update

**Symptom:** UI shows stale values after changes.

**Causes:**
1. `shouldUpdate()` returns false when it should return true
2. `cache` is not being set properly in `rebuildFull()`
3. `updateValues()` is not updating all cached elements

**Debug:**
```typescript
protected shouldUpdate(): boolean {
    console.log('[ComponentUI] shouldUpdate, cache =', this.cache);
    return this.cache !== undefined;
}
```

### Bindings Are Undefined

**Symptom:** `bindings.field` is `undefined`.

**Causes:**
1. Field name mismatch (check exact Rust field name)
2. Field doesn't have `#[ui(...)]` attribute in Rust
3. Bridge not initialized

**Debug:**
```typescript
const bindings = bridge.getComponentBindings();
console.log('[ComponentUI] bindings =', bindings);
console.log('[ComponentUI] field =', bindings.field_name);
```

### Event Handlers Don't Work

**Symptom:** Clicking buttons/changing inputs has no effect.

**Causes:**
1. Event listener not attached
2. Binding update not calling `this.render()`
3. Closure over stale bindings

**Check:**
```typescript
input.addEventListener('change', () => {
    console.log('[ComponentUI] input changed');
    const bindings = bridge.getComponentBindings();  // Fresh bindings!
    bindings.field.value = parseInt(input.value);
    bridge.setComponentBindings(bindings);
    this.render();  // Must call render!
});
```

### Helpers Create Wrong Layout

**Symptom:** Elements appear in wrong order or position.

**Cause:** Mixing flex layout helpers incorrectly.

**Check:**
- Selects with labels: Use `createFlexSelect()`
- Standalone selects: Use `createSelectElement()` and position manually
- All checkboxes in one section: Use `createFlexCheckboxes()` with one flex container
- Mixed types: Create multiple flex containers or use manual layout

### Stats Don't Update

**Symptom:** Stats always show "0" or stale values.

**Causes:**
1. `updateStatValues()` not called from `updateValues()`
2. Stat keys don't match between cache and Stats object
3. Bridge method returns wrong stats

**Check:**
```typescript
private updateStatValues(bridge: AircraftBridge): void {
    const stats = bridge.getComponentStats();
    console.log('[ComponentUI] stats =', stats);

    for (const [key, cell] of this.cache.statCells) {
        console.log(`[ComponentUI] stat ${key} = ${stats[key]}`);
        // ...
    }
}
```

### Locale Changes Don't Update UI

**Symptom:** Changing language doesn't translate component.

**Cause:** Not listening to locale changes.

**Solution:** BaseComponentUI handles this automatically - no action needed if extending BaseComponentUI.

**If using custom component:**
```typescript
localization.onLocaleChange(() => this.rebuildFull());
```

## Component Checklist

When creating a new component:

- [ ] Extends `BaseComponentUI`
- [ ] Defines stats configuration constant at top of file (if component has stats)
  ```typescript
  const COMPONENT_STATS: StatDisplayConfig[] = [ /* ... */ ];
  ```
- [ ] Defines cache interface with all element types
  - [ ] Cache stores `statsTable: HTMLTableElement` (not Map of cells)
- [ ] Implements `shouldUpdate()` (usually just `return this.cache !== undefined`)
- [ ] Implements `clearCache()` (set cache to `undefined`)
- [ ] Implements `rebuildFull()`:
  - [ ] Clears cache and container
  - [ ] Gets bridge and bindings
  - [ ] Creates table structure
  - [ ] Uses helper functions from `dom_utils`
  - [ ] Uses explicit binding keys (no blind loops)
  - [ ] Creates stats table with `createStatsTable(stats, COMPONENT_STATS)`
  - [ ] Caches all interactive elements including `statsTable`
  - [ ] Creates collapsible section with `createCollapsibleSection()`
  - [ ] Adds rules link with `createRulesLink()`
- [ ] Implements `updateValues()`:
  - [ ] Checks for cache and bridge
  - [ ] Updates all cached elements from fresh bindings
  - [ ] Updates stats table with `updateStatsTable(cache.statsTable, stats, COMPONENT_STATS)`
- [ ] Event handlers:
  - [ ] Get fresh bindings at start
  - [ ] Update bindings
  - [ ] Set bindings on bridge
  - [ ] Call `this.render()`
- [ ] All user strings use `localization.translate()`
- [ ] Imports needed helpers from `dom_utils`:
  - [ ] `createStatsTable`, `updateStatsTable`, `StatDisplayConfig` (if has stats)
  - [ ] `createCollapsibleSection`
  - [ ] `createFlexSection`, `createFlexNumberInput`, etc. (as needed)
- [ ] TSDoc comments for public methods
- [ ] No custom `createStatsSection()` or `updateStatValues()` methods

## Future Improvements

### Potential Helper Functions

- `createTable()` - Standardize table structure creation with headers
- `createFlexRadioButtons()` - For mutually exclusive options

### Binding Type Definitions

Create TypeScript interfaces for each binding type:

```typescript
interface SelectBinding {
    name: string;
    enabled: boolean;
    selected: number;
    options: Array<{ name: string; enabled: boolean }>;
}

interface NumberBinding {
    name: string;
    enabled: boolean;
    value: number;
}

// Use in components:
const radioBinding: SelectBinding = bindings.radio_sel;
```

### Bridge Method Generation

Auto-generate TypeScript bridge methods from Rust annotations to ensure type safety and consistency.

## Additional Resources

- **Rust UI Macro Documentation**: See `ui_macro` crate in `flyingcircusrust`
- **DOM Utilities**: `dom_utils.ts` for all helper functions
- **Aircraft Bridge**: `aircraft_bridge.ts` for WASM interface and `addStats()` utility
- **Example Components**:
  - `stabilizers_ui.ts` - Simple component with stats
  - `load_ui.ts` - Multi-section component using `addStats()`
  - `cockpits_ui.ts` - Dynamic rows based on data
  - `accessories_ui.ts` - Complex multi-section component

## Version History

- **v1.1** (2025-01-XX): Updated stats table handling to use consistent helper functions
  - Moved `createCollapsibleSection` from BindingRenderer to dom_utils
  - Added `createStatsTable()` and `updateStatsTable()` helper functions
  - Added `StatDisplayConfig` interface for consistent stats configuration
  - Added `addStats()` utility in aircraft_bridge for combining stats
  - Removed BindingRenderer dependency from BaseComponentUI
  - Updated all components to use new stats table pattern
- **v1.0** (2025-01-XX): Initial guide created during Accessories component rewrite
