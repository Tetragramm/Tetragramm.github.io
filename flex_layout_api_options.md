# Flex Layout API Options for Reducing Duplication

## Current Duplication Pattern

In `cockpits_ui.ts::buildCockpitRow`, we have three nearly identical blocks:
1. **Column 2: Upgrades** - Array of checkboxes
2. **Column 3: Safety Options** - Array of checkboxes
3. **Column 4: Gunsights** - Array of checkboxes + a number input

Each follows this pattern:
```typescript
const cell = document.createElement('td');
const flex = createFlexSection();
const checks: HTMLInputElement[] = [];
bindingArray.forEach((binding, idx) => {
    const checkbox = createFlexCheckbox(binding, flex, (checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].FIELD_NAME[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    });
    checks.push(checkbox);
});
cell.appendChild(flex.div0);
row.appendChild(cell);
```

---

## Option 1: High-Level "Smart Cell" Function

**Philosophy**: Hide all complexity behind a single function call that does everything.

### API Design
```typescript
/**
 * Create a table cell with flex layout of checkboxes from bindings array
 * @param bindingArray - Array of checkbox bindings to render
 * @param onUpdate - Callback to update binding at given index and re-render
 * @returns Object with cell, flex container, and checkbox array
 */
export function createFlexCheckboxCell(
    bindingArray: any[],
    onUpdate: (index: number, checked: boolean) => void
): {
    cell: HTMLTableCellElement;
    flex: { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement };
    checkboxes: HTMLInputElement[];
}
```

### Usage in cockpits_ui.ts
```typescript
// Column 2: Upgrades
const { cell: upgradesCell, checkboxes: upgradeChecks } = createFlexCheckboxCell(
    cockpitOptions.selected_upgrades,
    (idx, checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_upgrades[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }
);
row.appendChild(upgradesCell);

// Column 3: Safety Options
const { cell: safetyCell, checkboxes: safetyChecks } = createFlexCheckboxCell(
    cockpitOptions.selected_safety,
    (idx, checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_safety[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }
);
row.appendChild(safetyCell);
```

**Pros**:
- Most concise usage - single function call
- Hides all DOM creation details
- Easy to understand for simple cases

**Cons**:
- Less flexible - what if you need to add extra elements (like bombsight)?
- Hard to customize the flex layout structure
- Difficult to extend for mixed content (checkboxes + number inputs)

---

## Option 2: Flex Layout Builder Pattern

**Philosophy**: Chainable builder that constructs the layout step by step, giving control while reducing boilerplate.

### API Design
```typescript
/**
 * Builder for creating flex layouts with multiple controls
 */
export class FlexCellBuilder {
    private cell: HTMLTableCellElement;
    private flex: ReturnType<typeof createFlexSection>;
    private elements: HTMLInputElement[] = [];

    constructor() {
        this.cell = document.createElement('td');
        this.flex = createFlexSection();
    }

    /**
     * Add checkboxes from a binding array
     */
    addCheckboxes(
        bindingArray: any[],
        onUpdate: (index: number, checked: boolean) => void
    ): this {
        bindingArray.forEach((binding, idx) => {
            const checkbox = createFlexCheckbox(binding, this.flex, (checked) => {
                onUpdate(idx, checked);
            });
            this.elements.push(checkbox);
        });
        return this;
    }

    /**
     * Add a number input
     */
    addNumberInput(
        binding: any,
        onUpdate: (value: number) => void,
        min?: string,
        max?: string,
        step?: string
    ): this {
        const input = createFlexNumberInput(binding, this.flex, onUpdate, min, max, step);
        this.elements.push(input);
        return this;
    }

    /**
     * Build and return the cell and elements
     */
    build(): {
        cell: HTMLTableCellElement;
        elements: HTMLInputElement[];
    } {
        this.cell.appendChild(this.flex.div0);
        return { cell: this.cell, elements: this.elements };
    }
}
```

### Usage in cockpits_ui.ts
```typescript
// Column 2: Upgrades
const { cell: upgradesCell, elements: upgradeChecks } = new FlexCellBuilder()
    .addCheckboxes(cockpitOptions.selected_upgrades, (idx, checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_upgrades[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    })
    .build();
row.appendChild(upgradesCell);

// Column 4: Gunsights + Bombsight (mixed content)
const gunsightsBuilder = new FlexCellBuilder()
    .addCheckboxes(cockpitOptions.selected_gunsights, (idx, checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_gunsights[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    })
    .addNumberInput(cockpitOptions.bombsight, (value) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].bombsight.value = value;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }, '0', '20', '1');

const { cell: gunsightsCell, elements: gunsightElements } = gunsightsBuilder.build();
const gunsightChecks = gunsightElements.slice(0, -1); // All but last
const bombsightInput = gunsightElements[gunsightElements.length - 1]; // Last one
row.appendChild(gunsightsCell);
```

**Pros**:
- Very flexible - can mix different control types
- Chainable API is clear and readable
- Easy to extend with new control types (addRadioButtons, addTextInput, etc.)
- Maintains separation of concerns

**Cons**:
- More verbose than Option 1 for simple cases
- Builder pattern might be overkill for this use case
- Requires understanding of builder pattern
- Awkward separation of checkbox array vs bombsight input (need to slice)

---

## Option 3: Helper Function with Callback-per-Binding

**Philosophy**: Provide a helper that handles the iteration pattern, but let caller provide the callback for each binding.

### API Design
```typescript
/**
 * Create checkboxes in a flex section from binding array
 * @param flex - The flex container to add checkboxes to
 * @param bindingArray - Array of checkbox bindings
 * @param createCallback - Function that returns callback for a specific index
 * @returns Array of created checkbox elements
 */
export function createFlexCheckboxes(
    flex: ReturnType<typeof createFlexSection>,
    bindingArray: any[],
    createCallback: (index: number) => (checked: boolean) => void
): HTMLInputElement[] {
    const checkboxes: HTMLInputElement[] = [];
    bindingArray.forEach((binding, idx) => {
        const checkbox = createFlexCheckbox(binding, flex, createCallback(idx));
        checkboxes.push(checkbox);
    });
    return checkboxes;
}

/**
 * Create a table cell with flex section for building custom layouts
 * @returns Object with cell and flex container
 */
export function createFlexCell(): {
    cell: HTMLTableCellElement;
    flex: ReturnType<typeof createFlexSection>;
} {
    const cell = document.createElement('td');
    const flex = createFlexSection();
    return { cell, flex };
}

/**
 * Finalize flex cell by appending flex container
 */
export function finalizeFlexCell(
    cell: HTMLTableCellElement,
    flex: ReturnType<typeof createFlexSection>
): void {
    cell.appendChild(flex.div0);
}
```

### Usage in cockpits_ui.ts
```typescript
// Column 2: Upgrades
const { cell: upgradesCell, flex: upgradesFlex } = createFlexCell();
const upgradeChecks = createFlexCheckboxes(
    upgradesFlex,
    cockpitOptions.selected_upgrades,
    (idx) => (checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_upgrades[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }
);
finalizeFlexCell(upgradesCell, upgradesFlex);
row.appendChild(upgradesCell);

// Column 3: Safety Options
const { cell: safetyCell, flex: safetyFlex } = createFlexCell();
const safetyChecks = createFlexCheckboxes(
    safetyFlex,
    cockpitOptions.selected_safety,
    (idx) => (checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_safety[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }
);
finalizeFlexCell(safetyCell, safetyFlex);
row.appendChild(safetyCell);

// Column 4: Gunsights + Bombsight (mixed content)
const { cell: gunsightsCell, flex: gunsightsFlex } = createFlexCell();
const gunsightChecks = createFlexCheckboxes(
    gunsightsFlex,
    cockpitOptions.selected_gunsights,
    (idx) => (checked) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].selected_gunsights[idx].selected = checked;
        bridge.setCockpitsBindings(bindings);
        this.render();
    }
);
const bombsightInput = createFlexNumberInput(
    cockpitOptions.bombsight,
    gunsightsFlex,
    (value) => {
        const bindings = bridge.getCockpitsBindings();
        bindings.positions[index].bombsight.value = value;
        bridge.setCockpitsBindings(bindings);
        this.render();
    },
    '0', '20', '1'
);
finalizeFlexCell(gunsightsCell, gunsightsFlex);
row.appendChild(gunsightsCell);
```

**Pros**:
- Good balance between flexibility and simplicity
- Handles mixed content naturally (checkboxes + number input)
- Easy to understand - just splitting existing code into helpers
- Most aligned with existing function-based utilities
- Clear separation: checkbox array stored separately from bombsight input

**Cons**:
- More verbose than Option 1
- Requires three function calls (create, populate, finalize) instead of one
- The callback-returning-callback pattern `(idx) => (checked) => {}` might be confusing

---

## Comparison Summary

| Aspect | Option 1: Smart Cell | Option 2: Builder | Option 3: Helpers |
|--------|---------------------|-------------------|-------------------|
| **Code reduction** | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Very Good |
| **Flexibility** | ⭐⭐ Limited | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good |
| **Clarity** | ⭐⭐⭐⭐⭐ Very Clear | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Clear |
| **Mixed content** | ❌ Difficult | ✅ Natural | ✅ Natural |
| **Consistent style** | 🔧 New pattern | 🔧 New pattern | ✅ Matches existing |
| **Learning curve** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Easy |

## Recommendation Considerations

- **Option 1** is best if the pattern is *always* a simple array of checkboxes
- **Option 2** is best if you want maximum flexibility and plan to use this pattern extensively
- **Option 3** is best as an incremental improvement that fits existing code style
