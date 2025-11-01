#!/usr/bin/env python3
"""
Generate Rust code for default engine lists from engines.json
This script reads engines.json and generates Rust initialization code
for the EngineList HashMap.
"""

import json
import sys
from pathlib import Path


def escape_string(s):
    """Escape a string for use in Rust code"""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')


def format_float(f):
    """Format a float for Rust, ensuring it has a decimal point"""
    s = str(float(f))
    if '.' not in s:
        s += '.0'
    return s


def generate_engine_inputs(engine, indent='            '):
    """Generate Rust code to create an EngineInputs from JSON data"""
    name = escape_string(engine['name'])
    engine_type = engine['engine_type']
    etype = engine['type']
    era_sel = engine.get('era_sel', 0)
    rarity = engine.get('rarity', 0)

    rarity_str = ['CUSTOM', 'COMMON', 'RARE', 'LEGENDARY'][rarity]

    lines = [
        f'{indent}EngineInputs {{',
        f'{indent}    name: "{name}".to_string(),',
        f'{indent}    etype: {etype},',
        f'{indent}    era_sel: {era_sel},',
        f'{indent}    rarity: EngineRarity::{rarity_str},',
    ]

    if engine_type == 0:  # PROPELLER
        displacement = format_float(engine.get('displacement', 0))
        compression = format_float(engine.get('compression', 5))
        cyl_per_row = engine.get('cyl_per_row', 1)
        rows = engine.get('rows', 1)
        rpm_boost = format_float(engine.get('RPM_boost', 1))
        material_fudge = format_float(engine.get('material_fudge', 1))
        quality_fudge = format_float(engine.get('quality_fudge', 1))
        compressor_type = engine.get('compressor_type', 0)
        compressor_count = engine.get('compressor_count', 0)
        min_iaf = engine.get('min_IAF', 0)
        upgrades = engine.get('upgrades', [False, False, False, False])
        upgrades_str = ', '.join('true' if u else 'false' for u in upgrades)

        lines.extend([
            f'{indent}    inputs: TypedInputs::Propeller {{',
            f'{indent}        displacement: {displacement},',
            f'{indent}        compression: {compression},',
            f'{indent}        cyl_per_row: {cyl_per_row},',
            f'{indent}        rows: {rows},',
            f'{indent}        rpm_boost: {rpm_boost},',
            f'{indent}        material_fudge: {material_fudge},',
            f'{indent}        quality_fudge: {quality_fudge},',
            f'{indent}        compressor_type: {compressor_type},',
            f'{indent}        compressor_count: {compressor_count},',
            f'{indent}        min_ideal_alt: {min_iaf},',
            f'{indent}        upgrades: vec![{upgrades_str}],',
            f'{indent}    }},',
        ])

    elif engine_type == 1:  # PULSEJET
        power = engine.get('power', 0)
        quality_cost = format_float(engine.get('quality_cost', 1))
        quality_rely = format_float(engine.get('quality_rely', 1))
        starter = engine.get('starter', False)
        starter_str = 'true' if starter else 'false'

        lines.extend([
            f'{indent}    inputs: TypedInputs::Pulsejet {{',
            f'{indent}        power: {power},',
            f'{indent}        quality_cost: {quality_cost},',
            f'{indent}        quality_reliability: {quality_rely},',
            f'{indent}        starter: {starter_str},',
            f'{indent}    }},',
        ])

    elif engine_type == 2:  # TURBOMACHINERY
        flow_adjustment = format_float(engine.get('flow_adjustment', 1))
        diameter = format_float(engine.get('diameter', 1))
        compression_ratio = format_float(engine.get('compression_ratio', 1))
        bypass_ratio = format_float(engine.get('bypass_ratio', 0))
        upgrades = engine.get('upgrades', [False, False, False, False])
        upgrades_str = ', '.join('true' if u else 'false' for u in upgrades)

        lines.extend([
            f'{indent}    inputs: TypedInputs::Turbine {{',
            f'{indent}        flow_adjustment: {flow_adjustment},',
            f'{indent}        diameter: {diameter},',
            f'{indent}        compression_ratio: {compression_ratio},',
            f'{indent}        bypass_ratio: {bypass_ratio},',
            f'{indent}        upgrades: vec![{upgrades_str}],',
            f'{indent}    }},',
        ])

    elif engine_type == 3:  # ELECTRIC
        power = engine.get('power', 0)
        winding_sel = engine.get('winding_sel', 0)
        chonk = engine.get('material_fudge', 0)  # Note: material_fudge maps to chonk for electric
        quality_fudge = format_float(engine.get('quality_fudge', 1))

        lines.extend([
            f'{indent}    inputs: TypedInputs::Electric {{',
            f'{indent}        power: {power},',
            f'{indent}        winding_sel: {winding_sel},',
            f'{indent}        chonk: {chonk},',
            f'{indent}        quality_fudge: {quality_fudge},',
            f'{indent}    }},',
        ])

    lines.append(f'{indent}}}')

    return '\n'.join(lines)


def generate_rust_code(json_data):
    """Generate complete Rust initialization code"""
    lines = [
        '/// Initialize the global engine lists with default engines from engines.json',
        '/// This code is auto-generated by generate_engine_lists.py',
        'pub fn init_engine_lists() {',
        '    ENGINE_LISTS.get_or_init(|| {',
        '        let mut map = HashMap::new();',
        '',
    ]

    for engine_list in json_data['lists']:
        list_name = escape_string(engine_list['name'])
        engines = engine_list['engines']

        lines.append(f'        // Initialize {list_name} list')
        lines.append(f'        {{')
        lines.append(f'            let mut list = EngineList::new("{list_name}".to_string());')

        for engine in engines:
            lines.append('')
            lines.append('            let engine = {')
            lines.append(generate_engine_inputs(engine, indent='                '))
            lines.append('            };')
            lines.append('            let _ = list.push(engine, false);')

        # Mark non-Custom lists as constant
        if list_name != 'Custom':
            lines.append('            list.set_constant();')

        lines.append(f'            map.insert("{list_name}".to_string(), list);')
        lines.append('        }')
        lines.append('')

    lines.extend([
        '        Mutex::new(map)',
        '    });',
        '}',
    ])

    return '\n'.join(lines)


def main():
    # Find engines.json
    script_dir = Path(__file__).parent
    engines_json_path = script_dir / '..' / 'Test' / 'src' / 'engines.json'

    if not engines_json_path.exists():
        print(f"Error: engines.json not found at {engines_json_path}", file=sys.stderr)
        sys.exit(1)

    # Load JSON
    with open(engines_json_path, 'r') as f:
        data = json.load(f)

    # Generate Rust code
    rust_code = generate_rust_code(data)

    # Output to stdout or file
    output_path = script_dir / 'src' / 'engine_list_generated.rs'

    print(f"Generating Rust code from {engines_json_path}")
    print(f"Found {len(data['lists'])} engine lists")

    with open(output_path, 'w') as f:
        f.write(rust_code)

    print(f"Generated code written to {output_path}")
    print("\nTo use this code, replace the init_engine_lists() function in engine_list.rs")
    print("with the generated function from engine_list_generated.rs")


if __name__ == '__main__':
    main()
