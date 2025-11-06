#!/usr/bin/env python3
"""
Generate TypeScript UI components for WASM plane builder.

This script generates:
1. TypeScript bridge methods for aircraft_bridge.ts
2. UI component files (e.g., passengers_ui.ts)
3. Import/instantiation code for wasm_init.ts
"""

import os
import re

# Component definitions
# Format: (ComponentName, container_id, section_title_key, has_stats)
COMPONENTS = [
    ("Passengers", "Passengers", "Passengers Section Title", True),
    ("Fuel", "Load", "Load Section Title", True),
    ("Accessories", "Accessories", "Accessories Section Title", True),
    ("Cargo", "Load", "Load Section Title", True),
    ("ControlSurfaces", "ControlSurfaces", "Control Surfaces Section Title", True),
    ("LandingGear", "LandingGear", "Landing Gear Section Title", True),
    ("Munitions", "Load", "Load Section Title", True),
    ("Optimization", "Optimization", "Optimization Section Title", True),
    ("Reinforcements", "Reinforcements", "Reinforcements Section Title", True),
    ("Stabilizers", "Stabilizers", "Stabilizers Section Title", True),
]

BASE_DIR = "/home/user/Tetragramm.github.io/Test"
COMPONENTS_DIR = os.path.join(BASE_DIR, "src/wasm/components")

def to_snake_case(name):
    """Convert ComponentName to component_name"""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def to_camel_case(name):
    """Convert ComponentName to componentName"""
    return name[0].lower() + name[1:]

def generate_bridge_methods(component_name):
    """Generate TypeScript bridge methods for a component"""
    camel = to_camel_case(component_name)

    return f'''    /**
     * Get {component_name} UI bindings (includes localized strings from Rust)
     */
    get{component_name}Bindings(): any {{
        this.ensureInitialized();
        return this.wasm!.get{component_name}Bindings();
    }}

    /**
     * Update {component_name} from UI bindings
     * Automatically recalculates stats
     */
    set{component_name}Bindings(bindings: any): void {{
        this.ensureInitialized();
        this.wasm!.set{component_name}Bindings(bindings);
    }}

    /**
     * Get stats for {component_name}
     */
    get{component_name}Stats(): Stats {{
        this.ensureInitialized();
        return this.wasm!.get{component_name}Stats();
    }}
'''

def generate_ui_component(component_name, container_id, section_title_key, has_stats):
    """Generate a complete UI component TypeScript file"""
    snake = to_snake_case(component_name)
    camel = to_camel_case(component_name)
    class_name = f"{component_name}UI"

    # Determine rules link based on component
    rules_href = f"./Rules/Rules.htm#_{component_name}"

    return f'''/**
 * {component_name} UI Component
 *
 * Displays the {component_name} section using UIBindings from Rust
 */

import {{ AircraftBridge }} from '../aircraft_bridge';
import {{ BindingRenderer }} from '../binding_renderer';
import {{ localization }} from '../localization';

export class {class_name} {{
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private cachedElements: Map<string, HTMLElement> = new Map();

    constructor(
        private getBridge: () => AircraftBridge | null,
        containerId: string,
        private onUpdate?: () => void
    ) {{
        const container = document.getElementById(containerId);
        if (!container) {{
            throw new Error(`Container element '${{containerId}}' not found`);
        }}
        this.container = container;

        // Get the initial bridge for renderer
        const bridge = this.getBridge();
        if (!bridge) {{
            throw new Error('Bridge not available during {class_name} construction');
        }}

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {{
            if (this.onUpdate) {{
                this.onUpdate();
            }}
        }});

        // Listen for locale changes and do full rebuild (text changes)
        localization.onLocaleChange(() => this.rebuildFull());

        this.render();
    }}

    /**
     * Render the {component_name} UI - intelligently updates or rebuilds
     */
    render(): void {{
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {{
            console.warn('[{class_name}] Bridge not initialized, skipping render');
            return;
        }}

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.cachedElements.size > 0) {{
            this.updateValues();
        }} else {{
            this.rebuildFull();
        }}
    }}

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    private rebuildFull(): void {{
        // Clear cache
        this.cachedElements.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {{
            console.warn('[{class_name}] Bridge not initialized, skipping rebuild');
            return;
        }}

        const bindings = bridge.get{component_name}Bindings();

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Render UI bindings dynamically
        this.renderBindings(contentDiv, bindings, bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('{section_title_key}');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesSpan = document.createElement('span');
        rulesSpan.textContent = '(';
        const rulesLink = document.createElement('a');
        rulesLink.href = '{rules_href}';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesSpan.appendChild(rulesLink);
        rulesSpan.appendChild(document.createTextNode(')'));
        rulesLine.appendChild(rulesSpan);
        rulesLine.appendChild(document.createElement('br'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[{class_name}] Full rebuild complete');
    }}

    /**
     * Render UI bindings dynamically based on their structure
     */
    private renderBindings(container: HTMLElement, bindings: any, bridge: AircraftBridge): void {{
        // Iterate through all properties in bindings
        for (const key in bindings) {{
            if (!bindings.hasOwnProperty(key)) continue;

            const binding = bindings[key];

            // Handle different binding types
            if (binding && typeof binding === 'object') {{
                if ('options' in binding && 'selected' in binding) {{
                    // This is a Select binding
                    const selectElement = this.renderer.renderSelect(
                        binding,
                        (selectedIndex) => {{
                            const updatedBindings = bridge.get{component_name}Bindings();
                            updatedBindings[key].selected = selectedIndex;
                            bridge.set{component_name}Bindings(updatedBindings);
                            this.render();
                        }}
                    ) as HTMLSelectElement;

                    const label = document.createElement('label');
                    label.textContent = binding.name || key;
                    label.style.marginRight = '10px';

                    const span = document.createElement('span');
                    span.appendChild(label);
                    span.appendChild(selectElement);
                    container.appendChild(span);
                    container.appendChild(document.createElement('br'));

                    this.cachedElements.set(`select_${{key}}`, selectElement);
                }} else if ('selected' in binding && 'enabled' in binding && typeof binding.selected === 'boolean') {{
                    // This is a Check binding
                    const checkElement = this.renderer.renderCheck(
                        binding,
                        (checked) => {{
                            const updatedBindings = bridge.get{component_name}Bindings();
                            updatedBindings[key].selected = checked;
                            bridge.set{component_name}Bindings(updatedBindings);
                            this.render();
                        }}
                    );

                    container.appendChild(checkElement);
                    container.appendChild(document.createElement('br'));

                    const checkbox = checkElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
                    if (checkbox) {{
                        this.cachedElements.set(`check_${{key}}`, checkbox);
                    }}
                }} else if ('value' in binding && 'enabled' in binding && typeof binding.value === 'number') {{
                    // This is a Number binding
                    const numberElement = this.renderer.renderNumber(
                        binding,
                        (value) => {{
                            const updatedBindings = bridge.get{component_name}Bindings();
                            updatedBindings[key].value = value;
                            bridge.set{component_name}Bindings(updatedBindings);
                            this.render();
                        }}
                    );

                    container.appendChild(numberElement);
                    container.appendChild(document.createElement('br'));

                    const input = numberElement.querySelector('input[type="number"]') as HTMLInputElement;
                    if (input) {{
                        this.cachedElements.set(`number_${{key}}`, input);
                    }}
                }}
            }}
        }}
    }}

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {{
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {{
            return;
        }}

        const bindings = bridge.get{component_name}Bindings();

        // Update all cached elements
        for (const key in bindings) {{
            if (!bindings.hasOwnProperty(key)) continue;

            const binding = bindings[key];

            // Update based on element type
            const selectKey = `select_${{key}}`;
            const checkKey = `check_${{key}}`;
            const numberKey = `number_${{key}}`;

            if (this.cachedElements.has(selectKey)) {{
                const select = this.cachedElements.get(selectKey) as HTMLSelectElement;
                select.selectedIndex = binding.selected;
                select.disabled = !binding.enabled;
            }} else if (this.cachedElements.has(checkKey)) {{
                const check = this.cachedElements.get(checkKey) as HTMLInputElement;
                check.checked = binding.selected;
                check.disabled = !binding.enabled;
            }} else if (this.cachedElements.has(numberKey)) {{
                const number = this.cachedElements.get(numberKey) as HTMLInputElement;
                number.value = binding.value.toString();
                number.disabled = !binding.enabled;
            }}
        }}
    }}

    /**
     * Update the UI (e.g., when data changes externally)
     */
    update(): void {{
        this.render();
    }}

    /**
     * Destroy the component and clean up listeners
     */
    destroy(): void {{
        this.container.innerHTML = '';
        this.cachedElements.clear();
    }}
}}
'''

def generate_wasm_init_imports(components):
    """Generate import statements for wasm_init.ts"""
    imports = []
    for comp_name, _, _, _ in components:
        class_name = f"{comp_name}UI"
        imports.append(f"import {{ {class_name} }} from './wasm/components/{to_snake_case(comp_name)}_ui';")
    return "\n".join(imports)

def generate_wasm_init_properties(components):
    """Generate class properties for wasm_init.ts"""
    props = []
    for comp_name, _, _, _ in components:
        camel = to_camel_case(comp_name)
        class_name = f"{comp_name}UI"
        props.append(f"    private {camel}UI: {class_name} | null = null;")
    return "\n".join(props)

def generate_wasm_init_instantiations(components):
    """Generate component instantiation code for wasm_init.ts"""
    insts = []
    for comp_name, container_id, _, _ in components:
        camel = to_camel_case(comp_name)
        class_name = f"{comp_name}UI"
        insts.append(f'''            // Create {comp_name} UI component
            this.{camel}UI = new {class_name}(() => this.bridge, '{container_id}', () => {{
                this.onStatsUpdate();
            }});
            console.log('[WasmApp] {comp_name} UI created');
''')
    return "\n".join(insts)

def main():
    print("Generating UI components...")

    # Create components directory if it doesn't exist
    os.makedirs(COMPONENTS_DIR, exist_ok=True)

    # Generate UI component files
    for comp_name, container_id, section_title_key, has_stats in COMPONENTS:
        snake = to_snake_case(comp_name)
        filename = os.path.join(COMPONENTS_DIR, f"{snake}_ui.ts")

        print(f"  Generating {filename}...")
        content = generate_ui_component(comp_name, container_id, section_title_key, has_stats)

        with open(filename, 'w') as f:
            f.write(content)

    # Generate bridge methods (append to aircraft_bridge.ts)
    print("\n  Generating bridge methods for aircraft_bridge.ts...")
    bridge_file = os.path.join(BASE_DIR, "src/wasm/aircraft_bridge.ts")

    # Read existing file
    with open(bridge_file, 'r') as f:
        bridge_content = f.read()

    # Find insertion point (before the last closing brace of the class)
    # Insert new methods before "getCockpitsBindings"
    insertion_marker = "    /**\n     * Get Cockpits UI bindings"

    if insertion_marker in bridge_content:
        parts = bridge_content.split(insertion_marker)

        # Generate all new methods
        new_methods = []
        for comp_name, _, _, _ in COMPONENTS:
            new_methods.append(generate_bridge_methods(comp_name))

        new_content = parts[0] + "\n".join(new_methods) + "\n    /**\n     * Get Cockpits UI bindings" + parts[1]

        with open(bridge_file, 'w') as f:
            f.write(new_content)

        print(f"    Added {len(COMPONENTS)} component methods to aircraft_bridge.ts")
    else:
        print("    WARNING: Could not find insertion point in aircraft_bridge.ts")

    # Generate code snippets for wasm_init.ts (print to console for manual insertion)
    print("\n" + "="*80)
    print("Code to add to wasm_init.ts:")
    print("="*80)
    print("\n// Add these imports at the top:")
    print(generate_wasm_init_imports(COMPONENTS))
    print("\n// Add these properties to WasmApplication class:")
    print(generate_wasm_init_properties(COMPONENTS))
    print("\n// Add these instantiations in initialize() method:")
    print(generate_wasm_init_instantiations(COMPONENTS))
    print("="*80)

    # Update TypeScript interface in aircraft_bridge.ts
    print("\n  Updating AircraftWasmAPI interface...")

    # Generate interface method signatures
    interface_methods = []
    for comp_name, _, _, _ in COMPONENTS:
        interface_methods.append(f"    get{comp_name}Bindings(): any;")
        interface_methods.append(f"    set{comp_name}Bindings(bindings: any): void;")
        interface_methods.append(f"    get{comp_name}Stats(): Stats;")

    # Find and update the interface
    interface_marker = "export interface AircraftWasmAPI {"
    if interface_marker in bridge_content:
        # Read the updated bridge content
        with open(bridge_file, 'r') as f:
            bridge_content = f.read()

        # Find the interface and insert before getCockpitsBindings
        interface_insertion = "    getCockpitsBindings(): any;"
        if interface_insertion in bridge_content:
            parts = bridge_content.split(interface_insertion)
            new_content = parts[0] + "\n".join(interface_methods) + "\n    getCockpitsBindings(): any;" + parts[1]

            with open(bridge_file, 'w') as f:
                f.write(new_content)

            print(f"    Added {len(COMPONENTS)} interface methods to AircraftWasmAPI")
        else:
            print("    WARNING: Could not find interface insertion point")

    print("\nGeneration complete!")
    print(f"Generated {len(COMPONENTS)} UI component files in {COMPONENTS_DIR}")

if __name__ == "__main__":
    main()
