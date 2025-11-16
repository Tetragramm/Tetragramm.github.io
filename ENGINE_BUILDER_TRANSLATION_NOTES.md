# Engine Builder Translation Notes

## Overview
The Engine Builder (Test/src/EngineBuilder/engine_builder.ts) needs to be translated to use WASM/Rust methods. This document outlines the required WASM functions and missing localization keys.

## Current State
The TypeScript implementation has 4 separate engine builders:
1. **EngineBuilder** (Propeller engines) - Test/src/EngineBuilder/EngineBuilder.ts
2. **PulsejetBuilder** - Test/src/EngineBuilder/PulsejetBuilder.ts
3. **TurboBuilder** - Test/src/EngineBuilder/TurboBuilder.ts
4. **ElectricBuilder** - Test/src/EngineBuilder/ElectricBuilder.ts

Each builder:
- Has input parameters (displacement, compression, etc.)
- Calculates engine stats (power, mass, drag, reliability, etc.)
- Returns EngineInputs and EngineStats objects

## Required WASM Functions

### **SIMPLIFIED APPROACH** - Single Calculation Function

Instead of creating separate WASM wrappers for each builder, we can use a much simpler approach:

**ALREADY IMPLEMENTED**: `calculateEngineStats(engine_data: JsValue) -> Result<JsValue, JsValue>`

This single function:
1. Accepts `EngineInputs` as JSON (via JsValue)
2. Calls `EngineInputs.part_stats()` which internally dispatches to the correct builder based on `etype`
3. Returns `EngineStats` as JSON (via JsValue)

```rust
/// Calculate engine stats from EngineInputs
/// This is a standalone function that can be used by the engine builder UI
/// without needing to add the engine to the aircraft.
/// Accepts EngineInputs as JSON and returns EngineStats as JSON.
#[wasm_bindgen(js_name = calculateEngineStats)]
pub fn calculate_engine_stats(&self, engine_data: JsValue) -> Result<JsValue, JsValue> {
    let engine: flyingcircusrust::engine::EngineInputs =
        serde_wasm_bindgen::from_value(engine_data).map_err(|e| {
            JsValue::from_str(&format!("Failed to deserialize engine: {:?}", e))
        })?;

    let stats = engine.part_stats();
    Ok(serde_wasm_bindgen::to_value(&stats).unwrap())
}
```

### EngineInputs Structure

The TypeScript UI will construct `EngineInputs` objects directly:

```typescript
interface EngineInputs {
    name: string;
    etype: number;  // 0=Propeller, 1=Pulsejet, 2=Turbine, 3=Electric
    era_sel: number;
    rarity: number | string;  // 0=CUSTOM, 1=COMMON, etc. or "CUSTOM", "COMMON", etc.
    inputs: TypedInputs;
}

type TypedInputs = PropellerInputs | PulsejetInputs | TurbineInputs | ElectricInputs;

interface PropellerInputs {
    Propeller: {
        displacement: number;
        compression: number;
        cyl_per_row: number;
        rows: number;
        rpm_boost: number;
        material_fudge: number;
        quality_fudge: number;
        compressor_type: number;
        compressor_count: number;
        min_ideal_alt: number;
        upgrades: boolean[];
    }
}

interface PulsejetInputs {
    Pulsejet: {
        power: number;
        quality_cost: number;
        quality_reliability: number;
        starter: boolean;
    }
}

interface TurbineInputs {
    Turbine: {
        flow_adjustment: number;
        diameter: number;
        compression_ratio: number;
        bypass_ratio: number;
        upgrades: boolean[];
    }
}

interface ElectricInputs {
    Electric: {
        power: number;
        winding_sel: number;
        chonk: number;
        quality_fudge: number;
    }
}
```

### Additional Helper Functions Needed

For table data (eras, types, upgrades), we'll need static helper functions to get options without instantiating builders:

```rust
// These would be module-level functions or static methods

/// Get era table for propeller engines
#[wasm_bindgen(js_name = getPropellerEraTable)]
pub fn get_propeller_era_table() -> JsValue;

/// Get cooling type table for propeller engines
#[wasm_bindgen(js_name = getPropellerCoolingTable)]
pub fn get_propeller_cooling_table() -> JsValue;

/// Get compressor type table for propeller engines
#[wasm_bindgen(js_name = getPropellerCompressorTable)]
pub fn get_propeller_compressor_table() -> JsValue;

/// Get upgrade table for propeller engines
#[wasm_bindgen(js_name = getPropellerUpgradeTable)]
pub fn get_propeller_upgrade_table() -> JsValue;

/// Get valve type table for pulsejet engines
#[wasm_bindgen(js_name = getPulsejetValveTable)]
pub fn get_pulsejet_valve_table() -> JsValue;

/// Get turbine type table
#[wasm_bindgen(js_name = getTurbineTypeTable)]
pub fn get_turbine_type_table() -> JsValue;

/// Get electric winding table
#[wasm_bindgen(js_name = getElectricWindingTable)]
pub fn get_electric_winding_table() -> JsValue;
```

These functions can read from the builder structs' static data or from JSON files.

## Missing Localization Keys

The following keys are needed but may not exist in `flyingcircusrust/locales/app.yaml`:

### Engine Builder Section
```yaml
Engine Builder Title:
  en: Engine Builder
  de: Motorbauer
  es: Constructor de Motores
  fr: Constructeur de Moteur

Engine Builder Name:
  en: Name
  de: Name
  es: Nombre
  fr: Nom

Engine Builder Era:
  en: Era
  de: Ära
  es: Era
  fr: Ère

Engine Builder Type:
  en: Engine Type
  de: Motortyp
  es: Tipo de Motor
  fr: Type de Moteur

Engine Builder Displacement:
  en: Engine Displacement (L)
  de: Hubraum (L)
  es: Cilindrada del Motor (L)
  fr: Cylindrée du Moteur (L)

Engine Builder Compression Ratio:
  en: Compression Ratio (N:1)
  de: Verdichtungsverhältnis (N:1)
  es: Relación de Compresión (N:1)
  fr: Rapport de Compression (N:1)

Engine Builder Cylinders Per Row:
  en: Cylinders per Row
  de: Zylinder pro Reihe
  es: Cilindros por Fila
  fr: Cylindres par Rangée

Engine Builder Number of Rows:
  en: Number of Rows
  de: Anzahl der Reihen
  es: Número de Filas
  fr: Nombre de Rangées

Engine Builder RPM Boost:
  en: RPM Boost
  de: Drehzahl-Boost
  es: Impulso de RPM
  fr: Augmentation du Régime

Engine Builder Material Fudge:
  en: Material Fudge Factor
  de: Material-Korrekturfaktor
  es: Factor de Corrección de Material
  fr: Facteur de Correction de Matériau

Engine Builder Quality Fudge:
  en: Quality Fudge Factor
  de: Qualitäts-Korrekturfaktor
  es: Factor de Corrección de Calidad
  fr: Facteur de Correction de Qualité

Engine Builder Compressor Type:
  en: Compressor Type
  de: Kompressortyp
  es: Tipo de Compresor
  fr: Type de Compresseur

Engine Builder Compressor Count:
  en: Compressor Count
  de: Kompressorzahl
  es: Número de Compresores
  fr: Nombre de Compresseurs

Engine Builder Min Ideal Altitude:
  en: Minimum Ideal Altitude
  de: Minimale Idealhöhe
  es: Altitud Ideal Mínima
  fr: Altitude Idéale Minimale

Engine Builder Power:
  en: Power
  de: Leistung
  es: Potencia
  fr: Puissance

Engine Builder Mass:
  en: Mass
  de: Masse
  es: Masa
  fr: Masse

Engine Builder Drag:
  en: Drag
  de: Luftwiderstand
  es: Resistencia
  fr: Traînée

Engine Builder Reliability:
  en: Reliability
  de: Zuverlässigkeit
  es: Confiabilidad
  fr: Fiabilité

Engine Builder Required Cooling:
  en: Required Cooling
  de: Erforderliche Kühlung
  es: Refrigeración Requerida
  fr: Refroidissement Requis

Engine Builder Overspeed:
  en: Overspeed
  de: Überdrehzahl
  es: Sobrevelocidad
  fr: Survitesse

Engine Builder Fuel Consumption:
  en: Fuel Consumption
  de: Kraftstoffverbrauch
  es: Consumo de Combustible
  fr: Consommation de Carburant

Engine Builder Altitude:
  en: Altitude
  de: Höhe
  es: Altitud
  fr: Altitude

Engine Builder Torque:
  en: Torque
  de: Drehmoment
  es: Torque
  fr: Couple

Engine Builder Cost:
  en: Cost
  de: Kosten
  es: Costo
  fr: Coût

Engine Builder Oil Tank:
  en: Oil Tank
  de: Öltank
  es: Tanque de Aceite
  fr: Réservoir d'Huile

Engine Builder Geared RPM:
  en: Geared RPM
  de: Getriebe-Drehzahl
  es: RPM con Engranajes
  fr: Régime avec Engrenage

Engine Builder Yes:
  en: Yes
  de: Ja
  es: Sí
  fr: Oui

Engine Builder No:
  en: No
  de: Nein
  es: No
  fr: Non
```

### Pulsejet Builder Section
```yaml
Pulsejet Builder Title:
  en: Pulsejet Builder
  de: Strahltriebwerkbauer
  es: Constructor de Pulsejet
  fr: Constructeur de Pulsejet

Pulsejet Builder Desired Power:
  en: Desired Power
  de: Gewünschte Leistung
  es: Potencia Deseada
  fr: Puissance Souhaitée

Pulsejet Builder Quality:
  en: Quality
  de: Qualität
  es: Calidad
  fr: Qualité

Pulsejet Builder Starter:
  en: Starter
  de: Anlasser
  es: Arranque
  fr: Démarreur

Pulsejet Builder Rumble:
  en: Rumble
  de: Lärm
  es: Estruendo
  fr: Grondement

Pulsejet Builder Design Cost:
  en: Design Cost
  de: Entwicklungskosten
  es: Costo de Diseño
  fr: Coût de Conception
```

### Turbo Builder Section
```yaml
Turbo Builder Title:
  en: Turbine Builder
  de: Turbinenbauer
  es: Constructor de Turbina
  fr: Constructeur de Turbine

Turbo Builder Diameter:
  en: Engine Diameter (m)
  de: Triebwerksdurchmesser (m)
  es: Diámetro del Motor (m)
  fr: Diamètre du Moteur (m)

Turbo Builder Overall Pressure Ratio:
  en: Overall Pressure Ratio
  de: Gesamtdruckverhältnis
  es: Relación de Presión General
  fr: Rapport de Pression Global

Turbo Builder Bypass Ratio:
  en: Bypass Ratio
  de: Bypassverhältnis
  es: Relación de Derivación
  fr: Taux de Dilution

Turbo Builder Mass Flow Adjustment:
  en: Mass Flow Adjustment
  de: Massenstrom-Anpassung
  es: Ajuste de Flujo Másico
  fr: Ajustement du Débit Massique

Turbo Builder Afterburner:
  en: Afterburner
  de: Nachbrenner
  es: Postquemador
  fr: Postcombustion

Turbo Builder Thrust:
  en: Thrust
  de: Schub
  es: Empuje
  fr: Poussée
```

### Electric Builder Section
```yaml
Electric Builder Title:
  en: Electric Motor Builder
  de: Elektromotorbauer
  es: Constructor de Motor Eléctrico
  fr: Constructeur de Moteur Électrique

Electric Builder Winding:
  en: Winding
  de: Wicklung
  es: Bobinado
  fr: Enroulement

Electric Builder Chonk:
  en: Chonk
  de: Größe
  es: Tamaño
  fr: Taille

Electric Builder Charge Draw:
  en: Charge Draw
  de: Ladeverbrauch
  es: Consumo de Carga
  fr: Consommation de Charge
```

### List Management Section
```yaml
Engine Builder Lists:
  en: Lists
  de: Listen
  es: Listas
  fr: Listes

Engine Builder Engines:
  en: Engines
  de: Motoren
  es: Motores
  fr: Moteurs

Engine Builder Save List:
  en: Save Engine List
  de: Motorliste speichern
  es: Guardar Lista de Motores
  fr: Enregistrer la Liste de Moteurs

Engine Builder Load List:
  en: Load Engine List
  de: Motorliste laden
  es: Cargar Lista de Motores
  fr: Charger la Liste de Moteurs

Engine Builder Add From Propeller:
  en: Add From Engine Builder
  de: Aus Motorbauer hinzufügen
  es: Agregar desde Constructor de Motores
  fr: Ajouter depuis le Constructeur de Moteur

Engine Builder Add From Pulsejet:
  en: Add From Pulsejet Builder
  de: Aus Strahltriebwerkbauer hinzufügen
  es: Agregar desde Constructor de Pulsejet
  fr: Ajouter depuis le Constructeur de Pulsejet

Engine Builder Add From Turbine:
  en: Add From Turbine Builder
  de: Aus Turbinenbauer hinzufügen
  es: Agregar desde Constructor de Turbina
  fr: Ajouter depuis le Constructeur de Turbine

Engine Builder Add From Electric:
  en: Add From Electric Builder
  de: Aus Elektromotorbauer hinzufügen
  es: Agregar desde Constructor Eléctrico
  fr: Ajouter depuis le Constructeur Électrique

Engine Builder Delete Engine:
  en: Delete Engine
  de: Motor löschen
  es: Eliminar Motor
  fr: Supprimer le Moteur

Engine Builder Create List:
  en: Create List
  de: Liste erstellen
  es: Crear Lista
  fr: Créer une Liste

Engine Builder Delete List:
  en: Delete List
  de: Liste löschen
  es: Eliminar Lista
  fr: Supprimer la Liste
```

## Implementation Strategy

### **REVISED - Simplified Approach**

1. **Phase 1: WASM Helper Functions** ✅ PARTIALLY COMPLETE
   - ✅ `calculateEngineStats()` - Already implemented
   - ⬜ Add table data functions (eras, types, upgrades, etc.)
   - The main calculation is already done via `EngineInputs.part_stats()`

2. **Phase 2: TypeScript Interfaces**
   - Create TypeScript interfaces for `EngineInputs` structure
   - Create helper functions to construct properly-formatted `EngineInputs` objects
   - No need for separate builder classes - just construct the data structure

3. **Phase 3: UI Components**
   - Create 4 separate UI components (one per engine type)
   - Each component manages its own form state
   - On change, constructs `EngineInputs` object and calls `bridge.calculateEngineStats()`
   - Display returned `EngineStats`
   - Create a list management component

4. **Phase 4: Localization**
   - Add all missing keys to app.yaml
   - Update UI components to use localization

5. **Phase 5: Integration**
   - Create main engine builder page/component
   - Wire up to localStorage for persistence (already works via engine list system)
   - Test save/load functionality

### Advantages of This Approach

1. **Much Simpler**: One WASM function instead of 4 complex builder wrappers
2. **Stateless**: UI constructs data, calls function, gets result - no state management in WASM
3. **Easier to Test**: Just need to verify EngineInputs → EngineStats conversion
4. **Smaller Bundle**: Less WASM code to ship
5. **Uses Existing Code**: `EngineInputs.part_stats()` already exists and is well-tested

## Notes

- The "Save as CSV" button was specifically excluded per user request
- Manual engine entry can be omitted or simplified
- Focus on the 4 main builders and list management
- Engine list storage format is already compatible (see localStorage implementation in aircraft_bridge.ts)

## Files to Create/Modify

### Rust/WASM
- `flyingcircuswasm/src/lib.rs` - Add builder wrappers
- `flyingcircusrust/locales/app.yaml` - Add localization keys

### TypeScript
- `Test/src/wasm/builders/propeller_builder_ui.ts` - New component
- `Test/src/wasm/builders/pulsejet_builder_ui.ts` - New component
- `Test/src/wasm/builders/turbo_builder_ui.ts` - New component
- `Test/src/wasm/builders/electric_builder_ui.ts` - New component
- `Test/src/wasm/builders/engine_list_manager_ui.ts` - New component
- `Test/src/wasm/engine_builder_app.ts` - Main app entry point
- `Test/engine.html` - Update to use new WASM app

## Dependencies

This translation depends on:
- Existing Rust builder implementations (propeller_builder.rs, etc.)
- Engine list management (already working via localStorage)
- Localization system (already set up)
