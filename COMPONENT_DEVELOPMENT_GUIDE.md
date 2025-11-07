# Component Development Guide

**Guide for creating WASM-powered UI Components in the Flying Circus Plane Builder**

This document explains how to create new display components using the `BaseComponentUI` framework, localization system, and `dom_utils` helpers.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start Checklist](#quick-start-checklist)
3. [BaseComponentUI Lifecycle](#basecomponentui-lifecycle)
4. [Building Your Component](#building-your-component)
5. [Using dom_utils Helpers](#using-dom_utils-helpers)
6. [Localization Integration](#localization-integration)
7. [Common Patterns](#common-patterns)
8. [Best Practices](#best-practices)
9. [Complete Example](#complete-example)

---

## Architecture Overview

### Component Stack

```
┌─────────────────────────────────────┐
│   YourComponent extends             │
│   BaseComponentUI                   │
├─────────────────────────────────────┤
│   Uses:                             │
│   - AircraftBridge (data in/out)    │
│   - BindingRenderer (stats, select) │
│   - localization (translate)        │
│   - dom_utils (DOM helpers)         │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Rust WASM Backend                 │
│   (flyingcircusrust)                │
│   - Component logic                 │
│   - UIBindings generation           │
│   - Stats calculation               │
└─────────────────────────────────────┘
```

### Data Flow

1. **Component → Rust**: User interacts with UI → Component updates bindings → `bridge.setComponentBindings()` → Rust processes
2. **Rust → Component**: Rust calculates stats/updates state → Component calls `bridge.getComponentBindings()` → UI updates

---

## Quick Start Checklist

Creating a new component? Follow these steps:

- [ ] Create `your_component_ui.ts` in `Test/src/wasm/components/`
- [ ] Import required dependencies
- [ ] Define stats configuration constants
- [ ] Extend `BaseComponentUI`
- [ ] Implement 4 required abstract methods
- [ ] Define cache structure for DOM elements
- [ ] Register component in `wasm_init.ts`
- [ ] Add container element to HTML (e.g., `<div id="your_component"></div>`)

---

## BaseComponentUI Lifecycle

### Abstract Methods (Must Implement)

#### 1. `shouldUpdate(): boolean`
Determines whether to use fast update path or full rebuild.

```typescript
protected shouldUpdate(): boolean {
    // Return true if cached elements exist and can be updated
    // Return false if elements need to be rebuilt
    return this.cachedElement !== undefined;
}
```

**When to return `true`**: DOM structure is built, just need to update values
**When to return `false`**: First render, locale change, or structural change needed

---

#### 2. `rebuildFull(): void`
Completely rebuild the DOM structure from scratch.

```typescript
protected rebuildFull(): void {
    // 1. Clear cache and container
    this.clearCache();
    this.container.innerHTML = '';

    // 2. Get bridge and validate
    const bridge = this.getBridgeIfInitialized();
    if (!bridge) return;

    // 3. Get bindings from bridge
    const bindings = bridge.getYourComponentBindings();

    // 4. Build DOM structure
    const content = document.createElement('div');
    // ... create and cache elements ...

    // 5. Create collapsible section
    const title = localization.translate('Your Component Title');
    this.sectionElement = this.renderer.createCollapsibleSection(
        title,
        content,
        true // initially open
    );

    // 6. Add rules link
    const rulesLine = createRulesLink('_YourSection');
    this.sectionElement.insertBefore(
        rulesLine,
        this.sectionElement.children[1]
    );

    // 7. Append to container
    this.container.appendChild(this.sectionElement);
}
```

**Called when**:
- First render
- Locale changes (text needs to be retranslated)
- `render(forceFull: true)` is called
- `shouldUpdate()` returns `false`

---

#### 3. `updateValues(): void`
Update values in existing DOM elements (fast path).

```typescript
protected updateValues(): void {
    // 1. Validate bridge and cache
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cachedElement) return;

    // 2. Get fresh bindings
    const bindings = bridge.getYourComponentBindings();

    // 3. Update cached elements
    this.cachedInput.value = bindings.someValue.toString();
    this.cachedCheckbox.checked = bindings.someFlag;

    // 4. Update stats if needed
    const stats = bridge.getYourComponentStats();
    this.updateStatCells(stats);
}
```

**Called when**:
- User changes a value in the UI
- Another component triggers an update
- `shouldUpdate()` returns `true`

---

#### 4. `clearCache(): void`
Reset all cached DOM references.

```typescript
protected clearCache(): void {
    this.cachedElement = undefined;
    this.cachedArray = [];
    this.statCells = new Map();
}
```

**Called when**:
- Beginning of `rebuildFull()`
- Component is destroyed

---

## Building Your Component

### Step 1: File Structure

```typescript
/**
 * YourComponent UI Component
 *
 * Brief description of what this component does
 */

import { AircraftBridge } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, createFlexCell, createFlexCheckboxes } from '../dom_utils';

// Stats configuration
const YOUR_COMPONENT_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    // ... more stats
];

// Cache interface (optional but recommended for clarity)
interface YourComponentCache {
    element: HTMLElement;
    inputs: HTMLInputElement[];
    // ... other cached elements
}

export class YourComponentUI extends BaseComponentUI {
    // Cache properties
    private cache: YourComponentCache | null = null;

    protected shouldUpdate(): boolean {
        return this.cache !== null;
    }

    protected clearCache(): void {
        this.cache = null;
    }

    protected rebuildFull(): void {
        // Implementation...
    }

    protected updateValues(): void {
        // Implementation...
    }

    // Private helper methods
    private buildElement(): HTMLElement {
        // ...
    }
}
```

---

### Step 2: Define Stats Configuration

Stats are displayed in tables. Define them at the top of your file:

```typescript
const YOUR_STATS: StatDisplayConfig[] = [
    {
        key: 'mass',                      // Key in stats object from Rust
        label: 'Stat Mass',               // Translation key
        positiveIsGood: false             // For future color coding
    },
    {
        key: 'control',
        label: 'Stat Control',
        positiveIsGood: true
    },
    {
        key: 'derivedValue',
        label: 'Stat Derived Value',
        positiveIsGood: true,
        isDerived: true                   // Shows this is calculated stat
    },
];
```

---

### Step 3: Implement rebuildFull()

#### Basic Pattern

```typescript
protected rebuildFull(): void {
    // 1. Clear cache and DOM
    this.clearCache();
    this.container.innerHTML = '';

    // 2. Get bridge
    const bridge = this.getBridgeIfInitialized();
    if (!bridge) return;

    // 3. Get bindings
    const bindings = bridge.getYourComponentBindings();

    // 4. Build content
    const content = this.buildContent(bindings, bridge);

    // 5. Create section
    const title = localization.translate('Your Section Title');
    this.sectionElement = this.renderer.createCollapsibleSection(
        title,
        content,
        true
    );

    // 6. Add rules link
    const rulesLine = createRulesLink('_YourAnchor');
    this.sectionElement.insertBefore(
        rulesLine,
        this.sectionElement.children[1]
    );

    // 7. Append
    this.container.appendChild(this.sectionElement);
}
```

#### Building Content

**Simple select dropdown:**

```typescript
private buildContent(bindings: YourBindings, bridge: AircraftBridge): HTMLElement {
    const div = document.createElement('div');

    const select = this.renderer.renderSelect(
        bindings.selected_option,
        (selectedIndex) => {
            const updated = bridge.getYourComponentBindings();
            updated.selected_option.selected = selectedIndex;
            bridge.setYourComponentBindings(updated);
            this.render();
        }
    ) as HTMLSelectElement;

    this.cache = { element: select };
    div.appendChild(select);
    return div;
}
```

**Table with stats:**

```typescript
private buildTable(bindings: YourBindings, bridge: AircraftBridge): HTMLTableElement {
    const table = document.createElement('table');
    table.style.width = '100%';

    // Header row
    const headerRow = document.createElement('tr');
    const headers = [
        'Column 1',
        ...YOUR_STATS.map(s => localization.translate(s.label))
    ];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Data row
    const dataRow = document.createElement('tr');

    // First column: control
    const controlCell = document.createElement('td');
    // ... add controls
    dataRow.appendChild(controlCell);

    // Stat columns
    const statCells: HTMLTableCellElement[] = [];
    YOUR_STATS.forEach(() => {
        const cell = document.createElement('td');
        cell.textContent = '0';
        statCells.push(cell);
        dataRow.appendChild(cell);
    });

    table.appendChild(dataRow);

    // Update stats
    const stats = bridge.getYourComponentStats();
    YOUR_STATS.forEach((config, idx) => {
        statCells[idx].textContent = stats[config.key]?.toString() || '0';
    });

    this.cache = { statCells };
    return table;
}
```

---

### Step 4: Implement updateValues()

Update cached elements with new data:

```typescript
protected updateValues(): void {
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cache) return;

    const bindings = bridge.getYourComponentBindings();

    // Update controls
    if (this.cache.select) {
        updateSelectElement(this.cache.select, bindings.selected_option);
    }

    if (this.cache.input) {
        this.cache.input.value = bindings.someValue.value.toString();
        this.cache.input.disabled = !bindings.someValue.enabled;
    }

    // Update stats
    const stats = bridge.getYourComponentStats();
    YOUR_STATS.forEach((config, idx) => {
        if (this.cache.statCells && this.cache.statCells[idx]) {
            this.cache.statCells[idx].textContent =
                stats[config.key]?.toString() || '0';
        }
    });
}
```

---

## Using dom_utils Helpers

### createFlexCell()

Creates a table cell with a flex layout container already appended.

```typescript
import { createFlexCell, createFlexCheckboxes } from '../dom_utils';

// In buildContent()
const { cell, flex } = createFlexCell();

// Add checkboxes
const checkboxes = createFlexCheckboxes(
    flex,
    bindings.options,
    (idx) => (checked) => {
        const updated = bridge.getYourComponentBindings();
        updated.options[idx].selected = checked;
        bridge.setYourComponentBindings(updated);
        this.render();
    }
);

row.appendChild(cell);
```

**Benefits**:
- Eliminates boilerplate for flex layouts
- Consistent styling across components
- No need to manually append `flex.div0`

---

### createFlexCheckboxes()

Creates an array of checkboxes from a binding array.

```typescript
const checkboxes = createFlexCheckboxes(
    flex,                    // Flex container from createFlexCell()
    bindingArray,            // Array of checkbox bindings
    (idx) => (checked) => {  // Callback creator
        // Update logic using idx
        const bindings = bridge.getYourComponentBindings();
        bindings.options[idx].selected = checked;
        bridge.setYourComponentBindings(bindings);
        this.render();
    }
);
```

**Pattern**: Callback-returning-callback
- Outer function: receives `idx` - the index in the array
- Inner function: receives `checked` - the new checkbox state
- This pattern avoids closure issues and ensures you have the correct index

---

### createFlexNumberInput()

Add a number input to a flex layout.

```typescript
const input = createFlexNumberInput(
    binding,          // NumberBinding with name, value, enabled
    flex,             // Flex container
    (value) => {      // Update callback
        const bindings = bridge.getYourComponentBindings();
        bindings.count.value = value;
        bridge.setYourComponentBindings(bindings);
        this.render();
    },
    '0',              // min (optional)
    '100',            // max (optional)
    '1'               // step (optional)
);
```

---

### createRulesLink()

Add a link to the rules documentation.

```typescript
const rulesLine = createRulesLink('_SectionAnchor');
this.sectionElement.insertBefore(
    rulesLine,
    this.sectionElement.children[1]  // Insert after section header
);
```

The anchor should match the ID in `Rules/Rules.htm` (e.g., `#_Cockpits`, `#_Era`).

---

### updateSelectElement()

Update a select dropdown from a binding (in `updateValues()`).

```typescript
import { updateSelectElement } from '../dom_utils';

protected updateValues(): void {
    const bridge = this.getBridgeIfInitialized();
    if (!bridge || !this.cache?.select) return;

    const bindings = bridge.getYourComponentBindings();
    updateSelectElement(this.cache.select, bindings.selected_option);
}
```

Updates:
- Selected index
- Enabled state
- Individual option enabled states

---

## Localization Integration

### Translation Keys

All user-facing text must use translation keys:

```typescript
// ✅ GOOD
const title = localization.translate('Your Section Title');
const label = localization.translate('Your Field Label');

// ❌ BAD
const title = 'Your Section Title';  // Hard-coded English
```

### Common Translation Keys

- Section titles: `'Component Section Title'` (e.g., `'Era Section Title'`, `'Cockpit Section Title'`)
- Field labels: Rust bindings provide pre-translated `binding.name`
- Stats: `'Stat Mass'`, `'Stat Cost'`, `'Stat Control'`, etc.
- Headers: `'Component Option'`, `'Component Stats'`, etc.

### Automatic Re-rendering on Locale Change

`BaseComponentUI` automatically listens for locale changes:

```typescript
// In BaseComponentUI constructor:
localization.onLocaleChange(() => this.rebuildFull());
```

When the user changes language:
1. `localization.onLocaleChange()` fires
2. `rebuildFull()` is called
3. All text is re-fetched with `localization.translate()`
4. UI displays in new language

**You don't need to do anything** - just use `localization.translate()` everywhere.

---

## Common Patterns

### Pattern 1: Simple Select Dropdown

Use when component has a single selection:

```typescript
protected rebuildFull(): void {
    this.clearCache();
    this.container.innerHTML = '';

    const bridge = this.getBridgeIfInitialized();
    if (!bridge) return;

    const bindings = bridge.getYourComponentBindings();

    const select = this.renderer.renderSelect(
        bindings.selected_option,
        (selectedIndex) => {
            const updated = bridge.getYourComponentBindings();
            updated.selected_option.selected = selectedIndex;
            bridge.setYourComponentBindings(updated);
            this.render();
        }
    ) as HTMLSelectElement;

    this.cache = { select };

    const title = localization.translate('Your Title');
    this.sectionElement = this.renderer.createCollapsibleSection(
        title,
        select,
        true
    );

    const rulesLine = createRulesLink('_Anchor');
    this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

    this.container.appendChild(this.sectionElement);
}
```

**Example**: `era_ui.ts`

---

### Pattern 2: Table with Multiple Rows

Use when component has repeating data:

```typescript
protected rebuildFull(): void {
    this.clearCache();
    this.container.innerHTML = '';

    const bridge = this.getBridgeIfInitialized();
    if (!bridge) return;

    const bindings = bridge.getYourComponentBindings();

    const table = document.createElement('table');
    table.style.width = '100%';

    // Header
    const headerRow = document.createElement('tr');
    ['Column 1', 'Column 2', 'Column 3'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = localization.translate(text);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Rows
    const rows: RowCache[] = [];
    bindings.items.forEach((item, idx) => {
        const row = this.buildRow(item, idx, bridge);
        rows.push(row);
        table.appendChild(row.element);
    });

    this.cache = { rows };

    const title = localization.translate('Your Title');
    this.sectionElement = this.renderer.createCollapsibleSection(
        title,
        table,
        true
    );

    const rulesLine = createRulesLink('_Anchor');
    this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

    this.container.appendChild(this.sectionElement);
}

private buildRow(item: ItemBinding, index: number, bridge: AircraftBridge): RowCache {
    const row = document.createElement('tr');

    // Build cells...

    return { element: row, /* other cached elements */ };
}
```

**Example**: `cockpits_ui.ts`

---

### Pattern 3: Flex Layout with Checkboxes

Use for groups of related checkboxes:

```typescript
const { cell, flex } = createFlexCell();

const checkboxes = createFlexCheckboxes(
    flex,
    bindings.options,
    (idx) => (checked) => {
        const updated = bridge.getYourComponentBindings();
        updated.options[idx].selected = checked;
        bridge.setYourComponentBindings(updated);
        this.render();
    }
);

row.appendChild(cell);
this.cache = { checkboxes };
```

**Example**: `cockpits_ui.ts` (upgrades, safety, gunsights columns)

---

### Pattern 4: Mixed Content (Checkboxes + Number Input)

Combine multiple controls in one flex cell:

```typescript
const { cell, flex } = createFlexCell();

// Add checkboxes
const checkboxes = createFlexCheckboxes(
    flex,
    bindings.options,
    (idx) => (checked) => {
        const updated = bridge.getYourComponentBindings();
        updated.options[idx].selected = checked;
        bridge.setYourComponentBindings(updated);
        this.render();
    }
);

// Add number input to same flex
const numberInput = createFlexNumberInput(
    bindings.count,
    flex,
    (value) => {
        const updated = bridge.getYourComponentBindings();
        updated.count.value = value;
        bridge.setYourComponentBindings(updated);
        this.render();
    },
    '0', '20', '1'
);

row.appendChild(cell);
this.cache = { checkboxes, numberInput };
```

**Example**: `cockpits_ui.ts` (gunsights + bombsight)

---

## Best Practices

### 1. Always Get Fresh Bindings

```typescript
// ✅ GOOD
const callback = (checked: boolean) => {
    const bindings = bridge.getYourComponentBindings();  // Fresh!
    bindings.option.selected = checked;
    bridge.setYourComponentBindings(bindings);
    this.render();
};

// ❌ BAD - Stale closure
const bindings = bridge.getYourComponentBindings();
const callback = (checked: boolean) => {
    bindings.option.selected = checked;  // Old bindings!
    bridge.setYourComponentBindings(bindings);
    this.render();
};
```

**Why**: Bindings can change between when you create the callback and when it fires. Always fetch fresh data.

---

### 2. Use Event Target Instead of Cached References

```typescript
// ✅ GOOD
input.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    // ...
});

// ❌ BAD - this.input can become undefined
this.input.addEventListener('change', () => {
    const value = parseFloat(this.input.value);  // May be undefined!
    // ...
});
```

**Why**: Cached references can be cleared during `rebuildFull()` while event handlers are still active.

---

### 3. Cache Only What You Update

```typescript
// ✅ GOOD - Cache elements you'll update
private cache: {
    select: HTMLSelectElement;
    input: HTMLInputElement;
    statCells: HTMLTableCellElement[];
} | null = null;

// ❌ BAD - Caching static elements wastes memory
private cache: {
    table: HTMLTableElement;
    headerRow: HTMLTableRowElement;
    // ... static elements
} | null = null;
```

**Why**: Cache is for `updateValues()` fast path. Static elements don't need caching.

---

### 4. Validate Bridge Before Use

```typescript
// ✅ GOOD
const bridge = this.getBridgeIfInitialized();
if (!bridge) return;

// ❌ BAD - Will throw if bridge is null
const bridge = this.getBridge()!;  // Unsafe!
```

**Why**: Bridge might not be initialized during early lifecycle.

---

### 5. Use Type-Safe Cache Interfaces

```typescript
// ✅ GOOD
interface YourCache {
    select: HTMLSelectElement;
    inputs: HTMLInputElement[];
}

private cache: YourCache | null = null;

// Now TypeScript helps you:
this.cache.select.value  // ✓ Type-safe

// ❌ BAD - Untyped
private cache: any = null;
this.cache.anythingGoes  // No type checking
```

---

### 6. Separate Building from Caching

```typescript
// ✅ GOOD - Clear responsibilities
private buildRow(item: Item, index: number, bridge: AircraftBridge): RowCache {
    const row = document.createElement('tr');
    const input = document.createElement('input');
    // ... build DOM ...
    return { row, input };  // Return cache
}

protected rebuildFull(): void {
    const rows = items.map((item, idx) => this.buildRow(item, idx, bridge));
    this.cache = { rows };
}

// ❌ BAD - Side effects
private buildRow(item: Item, index: number): HTMLTableRowElement {
    const row = document.createElement('tr');
    this.cache.rows.push(row);  // Side effect!
    return row;
}
```

---

### 7. Use Consistent Naming

**For bindings getter/setter**:
- `bridge.getYourComponentBindings()`
- `bridge.setYourComponentBindings(bindings)`

**For stats**:
- `bridge.getYourComponentStats()`
- If multiple types: `bridge.getYourComponentDerivedStats()`

**For translation keys**:
- Section title: `'YourComponent Section Title'`
- Stats: `'Stat YourStatName'`
- Options: `'YourComponent Option'`

---

## Complete Example

Here's a complete, minimal component:

```typescript
/**
 * Example UI Component
 *
 * Demonstrates a simple component with one select and stats
 */

import { AircraftBridge } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, updateSelectElement } from '../dom_utils';

const EXAMPLE_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
];

interface ExampleCache {
    select: HTMLSelectElement;
    statCells: HTMLTableCellElement[];
}

export class ExampleUI extends BaseComponentUI {
    private cache: ExampleCache | null = null;

    protected shouldUpdate(): boolean {
        return this.cache !== null;
    }

    protected clearCache(): void {
        this.cache = null;
    }

    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getExampleBindings();

        // Build table
        const table = document.createElement('table');
        table.style.width = '100%';

        // Header
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Example Option'),
            ...EXAMPLE_STATS.map(s => localization.translate(s.label))
        ];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Select cell
        const selectCell = document.createElement('td');
        const select = this.renderer.renderSelect(
            bindings.selected_option,
            (selectedIndex) => {
                const updated = bridge.getExampleBindings();
                updated.selected_option.selected = selectedIndex;
                bridge.setExampleBindings(updated);
                this.render();
            }
        ) as HTMLSelectElement;
        selectCell.appendChild(select);
        dataRow.appendChild(selectCell);

        // Stat cells
        const statCells: HTMLTableCellElement[] = [];
        const stats = bridge.getExampleStats();
        EXAMPLE_STATS.forEach(config => {
            const cell = document.createElement('td');
            cell.textContent = stats[config.key]?.toString() || '0';
            statCells.push(cell);
            dataRow.appendChild(cell);
        });

        table.appendChild(dataRow);

        // Cache elements
        this.cache = { select, statCells };

        // Create section
        const title = localization.translate('Example Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            title,
            table,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Example');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);
    }

    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getExampleBindings();

        // Update select
        updateSelectElement(this.cache.select, bindings.selected_option);

        // Update stats
        const stats = bridge.getExampleStats();
        EXAMPLE_STATS.forEach((config, idx) => {
            this.cache.statCells[idx].textContent =
                stats[config.key]?.toString() || '0';
        });
    }
}
```

### Registering in wasm_init.ts

```typescript
// Add to imports
import { ExampleUI } from './wasm/components/example_ui';

// Add to class properties
private exampleUI: ExampleUI | null = null;

// Add to initialize() method
this.exampleUI = new ExampleUI(
    () => this.bridge,
    'example_section',  // HTML container ID
    () => {
        // Optional: callback when stats should update globally
        console.log('[WasmApp] Example updated');
    }
);
```

### Adding to HTML

```html
<div id="example_section"></div>
```

---

## Summary

**Golden Rules**:

1. **Extend `BaseComponentUI`** - Implement 4 abstract methods
2. **Cache what you update** - In `updateValues()`, not static elements
3. **Get fresh bindings** - Always call `bridge.getXxxBindings()` in callbacks
4. **Use event.target** - Don't rely on cached references in event handlers
5. **Translate everything** - Use `localization.translate()` for all text
6. **Use dom_utils** - Reduce boilerplate with helpers
7. **Validate the bridge** - Use `getBridgeIfInitialized()`
8. **Separate concerns** - Build functions return cache objects

**Questions?** Look at existing components:
- Simple: `era_ui.ts`
- Complex table: `cockpits_ui.ts`
- Flex layouts: `cockpits_ui.ts` (columns 2-4)

---

*Last updated: 2025-11-07*
