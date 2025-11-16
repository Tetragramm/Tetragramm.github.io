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

### PropellerBuilder WASM Wrapper
The Rust `propeller_builder.rs` exists but needs WASM bindings:

```rust
#[wasm_bindgen]
pub struct PropellerBuilderWasm {
    inner: PropellerBuilder,
}

#[wasm_bindgen]
impl PropellerBuilderWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PropellerBuilderWasm;

    // Setters
    #[wasm_bindgen(js_name = setName)]
    pub fn set_name(&mut self, name: String);

    #[wasm_bindgen(js_name = setEra)]
    pub fn set_era(&mut self, era_sel: i16);

    #[wasm_bindgen(js_name = setCoolingType)]
    pub fn set_cooling_type(&mut self, cool_sel: i16);

    #[wasm_bindgen(js_name = setDisplacement)]
    pub fn set_displacement(&mut self, liters: f32);

    #[wasm_bindgen(js_name = setCompression)]
    pub fn set_compression(&mut self, ratio: f32);

    #[wasm_bindgen(js_name = setCylindersPerRow)]
    pub fn set_cylinders_per_row(&mut self, count: i16);

    #[wasm_bindgen(js_name = setRows)]
    pub fn set_rows(&mut self, count: i16);

    #[wasm_bindgen(js_name = setRPMBoost)]
    pub fn set_rpm_boost(&mut self, boost: f32);

    #[wasm_bindgen(js_name = setMaterialFudge)]
    pub fn set_material_fudge(&mut self, fudge: f32);

    #[wasm_bindgen(js_name = setQualityFudge)]
    pub fn set_quality_fudge(&mut self, fudge: f32);

    #[wasm_bindgen(js_name = setCompressorType)]
    pub fn set_compressor_type(&mut self, type_sel: i16);

    #[wasm_bindgen(js_name = setCompressorCount)]
    pub fn set_compressor_count(&mut self, count: i16);

    #[wasm_bindgen(js_name = setMinIdealAltitude)]
    pub fn set_min_ideal_altitude(&mut self, altitude: i16);

    #[wasm_bindgen(js_name = setUpgrade)]
    pub fn set_upgrade(&mut self, index: usize, enabled: bool);

    // Getters
    #[wasm_bindgen(js_name = getName)]
    pub fn get_name(&self) -> String;

    #[wasm_bindgen(js_name = getEra)]
    pub fn get_era(&self) -> i16;

    // ... similar getters for all fields ...

    // Get available options
    #[wasm_bindgen(js_name = getEraTable)]
    pub fn get_era_table(&self) -> JsValue; // Returns array of {name, ...}

    #[wasm_bindgen(js_name = getCoolingTable)]
    pub fn get_cooling_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = getCompressorTable)]
    pub fn get_compressor_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = getUpgrades)]
    pub fn get_upgrades(&self) -> JsValue;

    #[wasm_bindgen(js_name = canUpgrade)]
    pub fn can_upgrade(&self) -> JsValue; // Returns array of booleans

    // Calculate results
    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&self) -> JsValue; // Returns EngineStats

    #[wasm_bindgen(js_name = getEngineInputs)]
    pub fn get_engine_inputs(&self) -> JsValue; // Returns EngineInputs for saving

    #[wasm_bindgen(js_name = getGearedRPM)]
    pub fn get_geared_rpm(&self) -> f32;
}
```

### PulsejetBuilder WASM Wrapper
```rust
#[wasm_bindgen]
pub struct PulsejetBuilderWasm {
    inner: PulsejetBuilder,
}

#[wasm_bindgen]
impl PulsejetBuilderWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PulsejetBuilderWasm;

    #[wasm_bindgen(js_name = setDesiredPower)]
    pub fn set_desired_power(&mut self, power: i16);

    #[wasm_bindgen(js_name = setValveType)]
    pub fn set_valve_type(&mut self, valve_sel: i16);

    #[wasm_bindgen(js_name = setEra)]
    pub fn set_era(&mut self, era_sel: i16);

    #[wasm_bindgen(js_name = setBuildQuality)]
    pub fn set_build_quality(&mut self, quality: f32);

    #[wasm_bindgen(js_name = setOverallQuality)]
    pub fn set_overall_quality(&mut self, quality: f32);

    #[wasm_bindgen(js_name = setStarter)]
    pub fn set_starter(&mut self, has_starter: bool);

    #[wasm_bindgen(js_name = getValveTable)]
    pub fn get_valve_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = getEraTable)]
    pub fn get_era_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&self) -> JsValue; // Returns EngineStats

    #[wasm_bindgen(js_name = getEngineInputs)]
    pub fn get_engine_inputs(&self) -> JsValue;

    #[wasm_bindgen(js_name = getDesignCost)]
    pub fn get_design_cost(&self) -> i16;
}
```

### TurboBuilder WASM Wrapper
```rust
#[wasm_bindgen]
pub struct TurboBuilderWasm {
    inner: TurboBuilder,
}

#[wasm_bindgen]
impl TurboBuilderWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> TurboBuilderWasm;

    #[wasm_bindgen(js_name = setName)]
    pub fn set_name(&mut self, name: String);

    #[wasm_bindgen(js_name = setEra)]
    pub fn set_era(&mut self, era_sel: i16);

    #[wasm_bindgen(js_name = setType)]
    pub fn set_type(&mut self, type_sel: i16);

    #[wasm_bindgen(js_name = setDiameter)]
    pub fn set_diameter(&mut self, meters: f32);

    #[wasm_bindgen(js_name = setCompressionRatio)]
    pub fn set_compression_ratio(&mut self, ratio: f32);

    #[wasm_bindgen(js_name = setBypassRatio)]
    pub fn set_bypass_ratio(&mut self, ratio: f32);

    #[wasm_bindgen(js_name = setFlowAdjustment)]
    pub fn set_flow_adjustment(&mut self, adjustment: f32);

    #[wasm_bindgen(js_name = setAfterburner)]
    pub fn set_afterburner(&mut self, enabled: bool);

    #[wasm_bindgen(js_name = getEraTable)]
    pub fn get_era_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = getTypeTable)]
    pub fn get_type_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&self) -> JsValue;

    #[wasm_bindgen(js_name = getEngineInputs)]
    pub fn get_engine_inputs(&self) -> JsValue;

    #[wasm_bindgen(js_name = getThrust)]
    pub fn get_thrust(&self) -> f32; // kN

    #[wasm_bindgen(js_name = getTSFC)]
    pub fn get_tsfc(&self) -> f32; // g/(kN*s)
}
```

### ElectricBuilder WASM Wrapper
```rust
#[wasm_bindgen]
pub struct ElectricBuilderWasm {
    inner: ElectricBuilder,
}

#[wasm_bindgen]
impl ElectricBuilderWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ElectricBuilderWasm;

    #[wasm_bindgen(js_name = setName)]
    pub fn set_name(&mut self, name: String);

    #[wasm_bindgen(js_name = setEra)]
    pub fn set_era(&mut self, era_sel: i16);

    #[wasm_bindgen(js_name = setWinding)]
    pub fn set_winding(&mut self, winding_sel: i16);

    #[wasm_bindgen(js_name = setPower)]
    pub fn set_power(&mut self, power: i16);

    #[wasm_bindgen(js_name = setChonk)]
    pub fn set_chonk(&mut self, chonk: i16);

    #[wasm_bindgen(js_name = setQualityFudge)]
    pub fn set_quality_fudge(&mut self, fudge: f32);

    #[wasm_bindgen(js_name = getEraTable)]
    pub fn get_era_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = getWindingTable)]
    pub fn get_winding_table(&self) -> JsValue;

    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&self) -> JsValue;

    #[wasm_bindgen(js_name = getEngineInputs)]
    pub fn get_engine_inputs(&self) -> JsValue;
}
```

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

1. **Phase 1: WASM Wrapper Implementation**
   - Create WASM wrappers for all 4 builders in `flyingcircuswasm/src/lib.rs`
   - Expose builder methods through wasm_bindgen
   - Ensure all table data (eras, types, upgrades) can be retrieved

2. **Phase 2: TypeScript Bridge**
   - Create TypeScript interface types for each builder
   - Add bridge methods to interact with WASM builders

3. **Phase 3: UI Components**
   - Create 4 separate UI components (one per builder)
   - Create a list management component
   - Wire up event handlers and state management

4. **Phase 4: Localization**
   - Add all missing keys to app.yaml
   - Update UI components to use localization

5. **Phase 5: Integration**
   - Create main engine builder page/component
   - Wire up to localStorage for persistence
   - Test save/load functionality

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
