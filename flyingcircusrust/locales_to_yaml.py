#!/usr/bin/env python3
"""
Convert locales JSON files to a single YAML file.

Converts multiple locale JSON files (one per language) into a single YAML file
with the following structure:
  _version: 2
  key_name:
    en: English value
    de: German value
    ...
"""

import json
from pathlib import Path
from typing import Dict, Any

def load_json_files(locales_dir: str) -> Dict[str, Dict[str, Any]]:
    """Load all JSON files from the locales directory.

    Args:
        locales_dir: Path to the directory containing locale JSON files

    Returns:
        Dictionary mapping locale codes to their JSON data
    """
    locales = {}
    locales_path = Path(locales_dir)

    for json_file in locales_path.glob("*.json"):
        locale_code = json_file.stem  # filename without extension
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                locales[locale_code] = json.load(f)
            print(f"Loaded {locale_code}: {len(locales[locale_code])} keys")
        except json.JSONDecodeError as e:
            print(f"Error loading {json_file}: {e}")

    return locales

def merge_locales(locales: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    """Merge individual locale dictionaries into a single structure.

    Args:
        locales: Dictionary mapping locale codes to their JSON data

    Returns:
        Merged dictionary with structure:
        {
            "_version": 2,
            "key": {
                "en": "value",
                "de": "value",
                ...
            }
        }
    """
    # Collect all keys from all locales
    all_keys = set()
    for locale_data in locales.values():
        all_keys.update(locale_data.keys())

    # Remove _version from keys since we'll handle it separately
    all_keys.discard("_version")

    # Build merged structure
    result = {"_version": 2}

    for key in sorted(all_keys):
        result[key] = {}
        for locale_code in sorted(locales.keys()):
            if key in locales[locale_code]:
                result[key][locale_code] = locales[locale_code][key]

    return result

def needs_quoting(s: str) -> bool:
    """Check if a string needs to be quoted in YAML.

    Args:
        s: String to check

    Returns:
        True if the string needs quoting
    """
    if not s:
        return True
    # Check for leading/trailing whitespace
    if s != s.strip():
        return True
    # Check for special YAML characters
    if any(c in s for c in [':', '#', '-', '{', '}', '[', ']', '&', '*', '!', '|', '>', '%', '@', '`']):
        return True
    # Check for line breaks
    if '\n' in s or '\r' in s:
        return True
    return False

def escape_yaml_string(s: str) -> str:
    """Escape a string for YAML.

    Args:
        s: String to escape

    Returns:
        Escaped string safe for YAML
    """
    # First, replace backslashes (must be done first)
    s = s.replace('\\', '\\\\')
    # Escape double quotes
    s = s.replace('"', '\\"')
    # Escape newlines and carriage returns
    s = s.replace('\r\n', '\\n')  # Handle Windows line endings first
    s = s.replace('\r', '\\n')
    s = s.replace('\n', '\\n')
    return s

def dict_to_yaml(data: Dict[str, Any], indent: int = 0) -> str:
    """Convert dictionary to YAML format (without external dependencies).

    Args:
        data: Dictionary to convert
        indent: Current indentation level

    Returns:
        YAML formatted string
    """
    lines = []
    indent_str = "  " * indent
    next_indent_str = "  " * (indent + 1)

    for key, value in data.items():
        if isinstance(value, dict):
            # Handle keys that need quoting (leading spaces, special chars, etc.)
            if needs_quoting(key):
                quoted_key = f'"{escape_yaml_string(key)}"'
                lines.append(f"{indent_str}{quoted_key}:")
            else:
                lines.append(f"{indent_str}{key}:")

            for sub_key, sub_value in value.items():
                # Convert value to string
                value_str = str(sub_value)
                escaped_value = escape_yaml_string(value_str)

                # Handle sub-keys that need quoting
                if needs_quoting(sub_key):
                    quoted_sub_key = f'"{escape_yaml_string(sub_key)}"'
                    lines.append(f'{next_indent_str}{quoted_sub_key}: "{escaped_value}"')
                elif needs_quoting(value_str):
                    lines.append(f'{next_indent_str}{sub_key}: "{escaped_value}"')
                else:
                    lines.append(f"{next_indent_str}{sub_key}: {escaped_value}")
        elif isinstance(value, str):
            # Escape the value
            escaped_value = escape_yaml_string(value)

            # Handle keys that need quoting
            if needs_quoting(key):
                quoted_key = f'"{escape_yaml_string(key)}"'
                if needs_quoting(value):
                    lines.append(f'{indent_str}{quoted_key}: "{escaped_value}"')
                else:
                    lines.append(f"{indent_str}{quoted_key}: {escaped_value}")
            elif needs_quoting(value):
                lines.append(f'{indent_str}{key}: "{escaped_value}"')
            else:
                lines.append(f"{indent_str}{key}: {escaped_value}")
        else:
            # Handle other types
            if needs_quoting(key):
                quoted_key = f'"{escape_yaml_string(key)}"'
                lines.append(f"{indent_str}{quoted_key}: {value}")
            else:
                lines.append(f"{indent_str}{key}: {value}")

    return "\n".join(lines)

def main():
    """Main function."""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    locales_dir = script_dir / "locales"
    locales_old_dir = script_dir / "locales_old"
    output_file = script_dir / "locales" / "app.yaml"

    # Check which directory has the JSON files
    if not locales_dir.exists() or not any(locales_dir.glob("*.json")):
        locales_dir = locales_old_dir

    print(f"Reading locales from: {locales_dir}")

    if not locales_dir.exists():
        print(f"Error: Neither {script_dir / 'locales'} nor {locales_old_dir} exist")
        return 1

    # Load all locale files
    locales = load_json_files(str(locales_dir))

    if not locales:
        print("Error: No JSON files found in locales directory")
        return 1

    print(f"\nFound locales: {', '.join(sorted(locales.keys()))}")

    # Merge into single structure
    merged = merge_locales(locales)
    print(f"\nMerged {len(merged) - 1} keys (excluding _version)")

    # Convert to YAML
    yaml_content = dict_to_yaml(merged)

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(yaml_content)

    print(f"\nSuccessfully wrote to: {output_file}")
    print(f"File size: {output_file.stat().st_size} bytes")

    return 0

if __name__ == "__main__":
    exit(main())
