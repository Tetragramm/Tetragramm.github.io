#!/usr/bin/env python3
"""
Convert YAML translation format to organized language output.

Input format:
  Key Name:
    en: English Value
    de: German Value
    fr: French Value

Output format:
  ("Key Name", "English Value"),
  ("Key Name", "German Value"),

  ("Key Name", "French Value"),
"""

import yaml
import sys
from pathlib import Path


def yaml_to_translations(input_file, output_file=None):
    """
    Convert YAML translations to organized language output.

    Args:
        input_file: Path to input YAML file
        output_file: Path to output file (if None, prints to stdout)
    """

    # Read YAML file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if not data:
        print("Error: Empty or invalid YAML file", file=sys.stderr)
        return

    # Organize by language
    languages = {}
    for key, translations in data.items():
        if not isinstance(translations, dict):
            print(f"Warning: '{key}' does not have language translations, skipping", file=sys.stderr)
            continue

        for lang, value in translations.items():
            if lang not in languages:
                languages[lang] = []
            languages[lang].append((key, value))

    # Generate output
    output_lines = []
    for i, lang in enumerate(sorted(languages.keys())):
        pairs = languages[lang]
        for key, value in pairs:
            output_lines.append(f'("{key}", "{value}"),')

        # Add blank line between languages (except after last one)
        if i < len(languages) - 1:
            output_lines.append('')

    # Write to file or stdout
    output_text = '\n'.join(output_lines)

    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output_text)
        print(f"✓ Translations written to {output_file}")
    else:
        print(output_text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python yaml_to_translations.py <input_yaml> [output_file]")
        print("\nIf output_file is not specified, output is printed to stdout")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if not Path(input_file).exists():
        print(f"Error: Input file '{input_file}' not found", file=sys.stderr)
        sys.exit(1)

    yaml_to_translations(input_file, output_file)
