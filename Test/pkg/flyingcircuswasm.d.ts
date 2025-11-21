/* tslint:disable */
/* eslint-disable */
/**
 * Get propeller upgrade names
 */
export function getPropellerUpgrades(): any;
/**
 * Get electric motor winding names
 */
export function getElectricWindings(): any;
/**
 * Get turbine type names
 */
export function getTurbineTypes(): any;
/**
 * Get propeller cooling type names
 */
export function getPropellerCoolingTypes(): any;
/**
 * Get propeller engine era names
 */
export function getTurbineEras(): any;
export function init_panic_hook(): void;
/**
 * Get pulsejet valve type names
 */
export function getPulsejetValveTypes(): any;
export function getPropellerEras(): any;
/**
 * Calculate engine stats from EngineInputs
 * This is a standalone function that can be used by the engine builder UI
 * without needing to add the engine to the aircraft.
 * Accepts EngineInputs as JSON and returns EngineStats as JSON.
 */
export function calculateEngineStats(engine_data: any): any;
/**
 * Get propeller compressor type names
 */
export function getPropellerCompressorTypes(): any;
/**
 * Main Aircraft wrapper for WASM
 */
export class AircraftWasm {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get the name of the currently selected era
   */
  getEraText(): string;
  /**
   * Get electrical systems data
   */
  getElectrics(): any;
  /**
   * Get stats for the selected era
   */
  getEraStats(): any;
  /**
   * Get landing gear type name
   */
  getGearName(): string;
  /**
   * Get wing deck at index
   */
  getWingDeck(index: number): number | undefined;
  /**
   * Delete a section at the given index
   */
  deleteSection(index: number): void;
  /**
   * Get bomb count
   */
  getBombCount(): number;
  /**
   * Get stats for fuel
   */
  getFuelStats(): any;
  /**
   * Get stats for used part
   */
  getUsedStats(): any;
  /**
   * Get number of wings
   */
  getWingCount(): number;
  reset(): void;
  /**
   * Add or update a custom part
   */
  addCustomPart(name: string, stats_js: any): void;
  /**
   * Calculate all aircraft statistics
   */
  calculateStats(): void;
  /**
   * Get attack modifier values from all cockpit positions
   */
  getAttackList(): Int16Array;
  /**
   * Get stats for cargo
   */
  getCargoStats(): any;
  /**
   * Get escape values from all cockpit positions
   */
  getEscapeList(): Int16Array;
  /**
   * Get stats for rotor
   */
  getRotorStats(): any;
  /**
   * Get flight stress values from all cockpit positions
   */
  getStressList(): any;
  /**
   * Get stats for wings
   */
  getWingsStats(): any;
  /**
   * Get list of all custom parts
   */
  getCustomParts(): any;
  /**
   * Get stats for a specific engine
   */
  getEngineStats(index: number): any;
  /**
   * Get Era UI bindings (includes localized strings)
   */
  getEraBindings(): any;
  /**
   * Get stats for frames
   */
  getFramesStats(): any;
  /**
   * Check if aircraft has flammable components
   */
  getIsFlammable(): boolean;
  /**
   * Get maximum operational altitude
   */
  getMaxAltitude(): number;
  /**
   * Get minimum operational altitude
   */
  getMinAltitude(): number;
  /**
   * Get rocket count
   */
  getRocketCount(): number;
  /**
   * Get stats for a specific weapon
   */
  getWeaponStats(system_index: number, weapon_index: number): any;
  /**
   * Check if wings are closed
   */
  getWingsClosed(): boolean;
  /**
   * Check if wings are in tandem configuration
   */
  getWingsTandem(): boolean;
  /**
   * Update Era from UI bindings
   */
  setEraBindings(js_options: any): void;
  /**
   * Clear all engines from a non-constant list
   */
  clearEngineList(list_name: string): void;
  /**
   * Duplicate a section at the given index
   */
  duplicateSection(index: number): void;
  /**
   * Get current aircraft type
   */
  getAircraftType(): number;
  /**
   * Get stats for a specific cockpit
   */
  getCockpitStats(index: number): any;
  /**
   * Get derived stats (performance characteristics)
   */
  getDerivedStats(): any;
  /**
   * Get stats for a all engines
   */
  getEnginesStats(): any;
  /**
   * Get Fuel UI bindings
   */
  getFuelBindings(): any;
  /**
   * Get maximum bomb size
   */
  getMaxBombSize(): number;
  /**
   * Get Used Part UI bindings
   */
  getUsedBindings(): any;
  /**
   * Get stats for weapons
   */
  getWeaponsStats(): any;
  /**
   * Remove a weapon set at the given index
   */
  removeWeaponSet(idx: number): void;
  /**
   * Serialize to JSON string (for saved data)
   */
  toJSON(): string;
  /**
   * Set aircraft type (0=Airplane, 1=Helicopter, 2=Autogyro, 3=OrnithopterBasic, 4=OrnithopterFlutter, 5=OrnithopterBuzzer)
   */
  setAircraftType(acft_type: number): void;
  /**
   * Update Fuel from UI bindings
   */
  setFuelBindings(js_options: any): void;
  /**
   * Update Used Part from UI bindings
   */
  setUsedBindings(js_options: any): void;
  /**
   * Add an engine to a specific list
   * Creates the list if it doesn't exist
   */
  addEngineToList(list_name: string, engine_data: any): void;
  /**
   * Get Cargo UI bindings
   */
  getCargoBindings(): any;
  /**
   * Get number of cockpit positions
   */
  getCockpitsCount(): number;
  /**
   * Get stats for a specific radiator
   */
  getRadiatorStats(index: number): any;
  /**
   * Get Rotor UI bindings
   */
  getRotorBindings(): any;
  /**
   * Get Wings UI bindings
   */
  getWingsBindings(): any;
  /**
   * Remove a custom part by name
   */
  removeCustomPart(name: string): void;
  /**
   * Update Cargo from UI bindings
   */
  setCargoBindings(js_options: any): void;
  /**
   * Update Rotor from UI bindings
   */
  setRotorBindings(js_options: any): void;
  /**
   * Update Wings from UI bindings
   */
  setWingsBindings(js_options: any): void;
  /**
   * Get Engine UI bindings for a specific engine
   */
  getEngineBindings(index: number): any;
  /**
   * Get all engines in a specific list with full data
   */
  getEnginesInList(list_name: string): any;
  /**
   * Get Frames UI bindings
   */
  getFramesBindings(): any;
  /**
   * Get stats for munitions
   */
  getMunitionsStats(): any;
  /**
   * Get stats for the selected propeller
   */
  getPropellerStats(): any;
  /**
   * Check if used modifiers are at default (no damage/wear)
   */
  getUsedIsDefault(): boolean;
  /**
   * Get visibility values from all cockpit positions
   */
  getVisibilityList(): Int16Array;
  /**
   * Get Weapon UI bindings for a specific weapon in a weapon system
   */
  getWeaponBindings(system_index: number, weapon_index: number): any;
  /**
   * Set quantity for a custom part by index
   */
  setCustomPartQty(idx: number, qty: number): void;
  /**
   * Update Engine from UI bindings
   */
  setEngineBindings(index: number, js_options: any): void;
  /**
   * Update Frames from UI bindings
   */
  setFramesBindings(js_options: any): void;
  /**
   * Update Weapon from UI bindings
   */
  setWeaponBindings(system_index: number, weapon_index: number, js_options: any): void;
  /**
   * Duplicate a weapon set at the given index
   */
  duplicateWeaponSet(idx: number): void;
  /**
   * Get Engines UI bindings (container with asymmetric flag and counts)
   */
  getEnginesBindings(): any;
  /**
   * Get Frames Flammability
   */
  getFramesFlammable(): any;
  /**
   * Get total passenger capacity (seats + beds)
   */
  getPassengersCount(): number;
  /**
   * Get stats for passengers
   */
  getPassengersStats(): any;
  /**
   * Get reliability strings from all engines
   */
  getReliabilityList(): string[];
  /**
   * Get Weapons UI bindings (container with weapon system count and brace count)
   */
  getWeaponsBindings(): any;
  /**
   * Update Engines from UI bindings
   */
  setEnginesBindings(js_options: any): void;
  /**
   * Update Weapons from UI bindings
   */
  setWeaponsBindings(js_options: any): void;
  /**
   * Get list of vital component names
   */
  vitalComponentList(): string[];
  /**
   * Deserialize from JSON string (for saved data)
   */
  fromJSON(js_str: string): void;
  /**
   * Get stats for accessories
   */
  getAccessoriesStats(): any;
  /**
   * Get Cockpits UI bindings (includes localized strings)
   */
  getCockpitsBindings(): any;
  /**
   * Get full EngineStats for a specific engine (includes rarity, overspeed, altitude, etc.)
   */
  getEngineFullStats(index: number): any;
  /**
   * Get all available engine list names
   */
  getEngineNamesOfLists(): any;
  /**
   * Get the number of engines
   */
  getNumberOfEngines(): any;
  /**
   * Get Radiator UI bindings for a specific radiator
   */
  getRadiatorBindings(index: number): any;
  /**
   * Get stats for stabilizers
   */
  getStabilizersStats(): any;
  /**
   * Get number of weapon sets
   */
  getWeaponSetsCount(): number;
  /**
   * Get sesquiplane info: (is_sesquiplane, biggest_deck, super_small)
   */
  getWingsSesquiplane(): any;
  /**
   * Update Cockpits from UI bindings
   */
  setCockpitsBindings(js_options: any): void;
  /**
   * Set the number of engines
   */
  setNumberOfEngines(num: number): void;
  /**
   * Update Radiator from UI bindings
   */
  setRadiatorBindings(index: number, js_options: any): void;
  /**
   * Get communication system name
   */
  getCommunicationName(): string;
  /**
   * Get custom parts stats
   */
  getCustomPartsStats(): any;
  /**
   * Check if frames are flying wing
   */
  getFramesFlyingWing(): boolean;
  /**
   * Get stats for landing gear
   */
  getLandingGearStats(): any;
  /**
   * Get Munitions UI bindings
   */
  getMunitionsBindings(): any;
  /**
   * Get stats for optimization
   */
  getOptimizationStats(): any;
  /**
   * Get Propeller UI bindings (includes localized strings)
   */
  getPropellerBindings(): any;
  /**
   * Get Radiator flammability
   */
  getRadiatorFlammable(index: number): any;
  /**
   * Serialize to LZ-compressed string (for URLs)
   */
  serializeToLZString(): string;
  /**
   * Update Munitions from UI bindings
   */
  setMunitionsBindings(js_options: any): void;
  /**
   * Update Propeller from UI bindings
   */
  setPropellerBindings(js_options: any): void;
  /**
   * Get aircraft type names for UI dropdown
   */
  static getAircraftTypeNames(): any;
  /**
   * Get internal bomb storage count
   */
  getInternalBombCount(): number;
  /**
   * Get the number of radiators
   */
  getNumberOfRadiators(): any;
  /**
   * Get Passengers UI bindings
   */
  getPassengersBindings(): any;
  /**
   * Get stats for a specific weapon system
   */
  getWeaponSystemStats(index: number): any;
  /**
   * Check if custom parts are in default state (all quantities zero)
   */
  isCustomPartsDefault(): boolean;
  /**
   * Set the number of radiators
   */
  setNumberOfRadiators(num: number): void;
  /**
   * Update Passengers from UI bindings
   */
  setPassengersBindings(js_options: any): void;
  /**
   * Get Accessories UI bindings
   */
  getAccessoriesBindings(): any;
  /**
   * Get derived stats for a specific engine (calculated values like reliability)
   */
  getEngineDerivedStats(index: number): any;
  /**
   * Get all engine names in a specific list
   */
  getEngineNamesInList(list_name: string): any;
  /**
   * Get the selected engine list name for a specific engine
   */
  getEngineSelectedList(index: number): string;
  /**
   * Get the selected engine name for a specific engine
   */
  getEngineSelectedName(index: number): string;
  /**
   * Get stats for reinforcements
   */
  getReinforcementsStats(): any;
  /**
   * Get Stabilizers UI bindings
   */
  getStabilizersBindings(): any;
  /**
   * Update Accessories from UI bindings
   */
  setAccessoriesBindings(js_options: any): void;
  /**
   * Set the selected engine list for a specific engine
   */
  setEngineSelectedList(index: number, list_name: string): void;
  /**
   * Update Stabilizers from UI bindings
   */
  setStabilizersBindings(js_options: any): void;
  /**
   * Get derived stats for a specific cockpit (flight stress, escape, visibility)
   */
  getCockpitDerivedStats(index: number): any;
  /**
   * Get LandingGear UI bindings
   */
  getLandingGearBindings(): any;
  /**
   * Get Optimization UI bindings
   */
  getOptimizationBindings(): any;
  /**
   * Set the selected engine by index within its current list
   */
  setEngineSelectedIndex(index: number, engine_index: number): void;
  /**
   * Update LandingGear from UI bindings
   */
  setLandingGearBindings(js_options: any): void;
  /**
   * Update Optimization from UI bindings
   */
  setOptimizationBindings(js_options: any): void;
  /**
   * Deserialize from LZ-compressed string (for URLs)
   */
  static deserializeFromLZString(lz_str: string): AircraftWasm;
  /**
   * Get stats for control surfaces
   */
  getControlSurfacesStats(): any;
  /**
   * Check if frames can be flying wing (lifting body)
   */
  getFramesCanFlyingWing(): boolean;
  /**
   * Get number of available optimizations
   */
  getOptimizationAvailable(): any;
  /**
   * Get WeaponSystem UI bindings for a specific weapon system
   */
  getWeaponSystemBindings(index: number): any;
  /**
   * Update WeaponSystem from UI bindings
   */
  setWeaponSystemBindings(index: number, js_options: any): void;
  /**
   * Get Reinforcements UI bindings
   */
  getReinforcementsBindings(): any;
  /**
   * Update Reinforcements from UI bindings
   */
  setReinforcementsBindings(js_options: any): void;
  /**
   * Get ControlSurfaces UI bindings
   */
  getControlSurfacesBindings(): any;
  /**
   * Update ControlSurfaces from UI bindings
   */
  setControlSurfacesBindings(js_options: any): void;
  /**
   * Get flap cost based on dry MP (for display purposes)
   */
  getControlSurfacesFlapCost(dry_mp: number): number;
  /**
   * Get WeaponSystem display information for derived stats UI
   */
  getWeaponSystemDisplayInfo(index: number): any;
  /**
   * Get WeaponSystem derived stats for display
   */
  getWeaponSystemDerivedStats(index: number): any;
  /**
   * Create a new aircraft
   */
  constructor();
  /**
   * Get aircraft name
   */
  getName(): string;
  /**
   * Set aircraft name
   */
  setName(name: string): void;
  /**
   * Get base stats
   */
  getStats(): any;
}
/**
 * Localization API for managing translations
 *
 * This is a pass-through wrapper for the localization functions in flyingcircusrust
 */
export class Localization {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get current locale
   */
  static getLocale(): string;
  /**
   * Set the current locale
   */
  static setLocale(locale: string): void;
  /**
   * Translate a key with one parameter substitution
   * The translation string should contain %{A} which will be replaced with the value
   */
  static translateWithParam(key: string, value: string): string;
  /**
   * Get list of available languages
   */
  static getAvailableLanguages(): string[];
  /**
   * Translate a single key
   */
  static translate(key: string): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_aircraftwasm_free: (a: number, b: number) => void;
  readonly __wbg_localization_free: (a: number, b: number) => void;
  readonly aircraftwasm_addCustomPart: (a: number, b: number, c: number, d: any) => void;
  readonly aircraftwasm_addEngineToList: (a: number, b: number, c: number, d: any) => [number, number];
  readonly aircraftwasm_calculateStats: (a: number) => void;
  readonly aircraftwasm_clearEngineList: (a: number, b: number, c: number) => [number, number];
  readonly aircraftwasm_deleteSection: (a: number, b: number) => void;
  readonly aircraftwasm_deserializeFromLZString: (a: number, b: number) => [number, number, number];
  readonly aircraftwasm_duplicateSection: (a: number, b: number) => void;
  readonly aircraftwasm_duplicateWeaponSet: (a: number, b: number) => void;
  readonly aircraftwasm_fromJSON: (a: number, b: number, c: number) => void;
  readonly aircraftwasm_getAccessoriesBindings: (a: number) => any;
  readonly aircraftwasm_getAccessoriesStats: (a: number) => any;
  readonly aircraftwasm_getAircraftType: (a: number) => number;
  readonly aircraftwasm_getAircraftTypeNames: () => any;
  readonly aircraftwasm_getAttackList: (a: number) => [number, number];
  readonly aircraftwasm_getBombCount: (a: number) => number;
  readonly aircraftwasm_getCargoBindings: (a: number) => any;
  readonly aircraftwasm_getCargoStats: (a: number) => any;
  readonly aircraftwasm_getCockpitDerivedStats: (a: number, b: number) => any;
  readonly aircraftwasm_getCockpitStats: (a: number, b: number) => any;
  readonly aircraftwasm_getCockpitsBindings: (a: number) => any;
  readonly aircraftwasm_getCockpitsCount: (a: number) => number;
  readonly aircraftwasm_getCommunicationName: (a: number) => [number, number];
  readonly aircraftwasm_getControlSurfacesBindings: (a: number) => any;
  readonly aircraftwasm_getControlSurfacesFlapCost: (a: number, b: number) => number;
  readonly aircraftwasm_getControlSurfacesStats: (a: number) => any;
  readonly aircraftwasm_getCustomParts: (a: number) => any;
  readonly aircraftwasm_getCustomPartsStats: (a: number) => any;
  readonly aircraftwasm_getDerivedStats: (a: number) => any;
  readonly aircraftwasm_getElectrics: (a: number) => any;
  readonly aircraftwasm_getEngineBindings: (a: number, b: number) => any;
  readonly aircraftwasm_getEngineDerivedStats: (a: number, b: number) => any;
  readonly aircraftwasm_getEngineFullStats: (a: number, b: number) => any;
  readonly aircraftwasm_getEngineNamesInList: (a: number, b: number, c: number) => any;
  readonly aircraftwasm_getEngineNamesOfLists: (a: number) => any;
  readonly aircraftwasm_getEngineSelectedList: (a: number, b: number) => [number, number];
  readonly aircraftwasm_getEngineSelectedName: (a: number, b: number) => [number, number];
  readonly aircraftwasm_getEngineStats: (a: number, b: number) => any;
  readonly aircraftwasm_getEnginesBindings: (a: number) => any;
  readonly aircraftwasm_getEnginesInList: (a: number, b: number, c: number) => any;
  readonly aircraftwasm_getEnginesStats: (a: number) => any;
  readonly aircraftwasm_getEraBindings: (a: number) => any;
  readonly aircraftwasm_getEraStats: (a: number) => any;
  readonly aircraftwasm_getEraText: (a: number) => [number, number];
  readonly aircraftwasm_getEscapeList: (a: number) => [number, number];
  readonly aircraftwasm_getFramesBindings: (a: number) => any;
  readonly aircraftwasm_getFramesCanFlyingWing: (a: number) => number;
  readonly aircraftwasm_getFramesFlammable: (a: number) => any;
  readonly aircraftwasm_getFramesFlyingWing: (a: number) => number;
  readonly aircraftwasm_getFramesStats: (a: number) => any;
  readonly aircraftwasm_getFuelBindings: (a: number) => any;
  readonly aircraftwasm_getFuelStats: (a: number) => any;
  readonly aircraftwasm_getGearName: (a: number) => [number, number];
  readonly aircraftwasm_getInternalBombCount: (a: number) => number;
  readonly aircraftwasm_getIsFlammable: (a: number) => number;
  readonly aircraftwasm_getLandingGearBindings: (a: number) => any;
  readonly aircraftwasm_getLandingGearStats: (a: number) => any;
  readonly aircraftwasm_getMaxAltitude: (a: number) => number;
  readonly aircraftwasm_getMaxBombSize: (a: number) => number;
  readonly aircraftwasm_getMinAltitude: (a: number) => number;
  readonly aircraftwasm_getMunitionsBindings: (a: number) => any;
  readonly aircraftwasm_getMunitionsStats: (a: number) => any;
  readonly aircraftwasm_getName: (a: number) => [number, number];
  readonly aircraftwasm_getNumberOfEngines: (a: number) => any;
  readonly aircraftwasm_getNumberOfRadiators: (a: number) => any;
  readonly aircraftwasm_getOptimizationAvailable: (a: number) => any;
  readonly aircraftwasm_getOptimizationBindings: (a: number) => any;
  readonly aircraftwasm_getOptimizationStats: (a: number) => any;
  readonly aircraftwasm_getPassengersBindings: (a: number) => any;
  readonly aircraftwasm_getPassengersCount: (a: number) => number;
  readonly aircraftwasm_getPassengersStats: (a: number) => any;
  readonly aircraftwasm_getPropellerBindings: (a: number) => any;
  readonly aircraftwasm_getPropellerStats: (a: number) => any;
  readonly aircraftwasm_getRadiatorBindings: (a: number, b: number) => any;
  readonly aircraftwasm_getRadiatorFlammable: (a: number, b: number) => any;
  readonly aircraftwasm_getRadiatorStats: (a: number, b: number) => any;
  readonly aircraftwasm_getReinforcementsBindings: (a: number) => any;
  readonly aircraftwasm_getReinforcementsStats: (a: number) => any;
  readonly aircraftwasm_getReliabilityList: (a: number) => [number, number];
  readonly aircraftwasm_getRocketCount: (a: number) => number;
  readonly aircraftwasm_getRotorBindings: (a: number) => any;
  readonly aircraftwasm_getRotorStats: (a: number) => any;
  readonly aircraftwasm_getStabilizersBindings: (a: number) => any;
  readonly aircraftwasm_getStabilizersStats: (a: number) => any;
  readonly aircraftwasm_getStats: (a: number) => any;
  readonly aircraftwasm_getStressList: (a: number) => any;
  readonly aircraftwasm_getUsedBindings: (a: number) => any;
  readonly aircraftwasm_getUsedIsDefault: (a: number) => number;
  readonly aircraftwasm_getUsedStats: (a: number) => any;
  readonly aircraftwasm_getVisibilityList: (a: number) => [number, number];
  readonly aircraftwasm_getWeaponBindings: (a: number, b: number, c: number) => any;
  readonly aircraftwasm_getWeaponSetsCount: (a: number) => number;
  readonly aircraftwasm_getWeaponStats: (a: number, b: number, c: number) => any;
  readonly aircraftwasm_getWeaponSystemBindings: (a: number, b: number) => any;
  readonly aircraftwasm_getWeaponSystemDerivedStats: (a: number, b: number) => any;
  readonly aircraftwasm_getWeaponSystemDisplayInfo: (a: number, b: number) => any;
  readonly aircraftwasm_getWeaponSystemStats: (a: number, b: number) => any;
  readonly aircraftwasm_getWeaponsBindings: (a: number) => any;
  readonly aircraftwasm_getWeaponsStats: (a: number) => any;
  readonly aircraftwasm_getWingCount: (a: number) => number;
  readonly aircraftwasm_getWingDeck: (a: number, b: number) => number;
  readonly aircraftwasm_getWingsBindings: (a: number) => any;
  readonly aircraftwasm_getWingsClosed: (a: number) => number;
  readonly aircraftwasm_getWingsSesquiplane: (a: number) => any;
  readonly aircraftwasm_getWingsStats: (a: number) => any;
  readonly aircraftwasm_getWingsTandem: (a: number) => number;
  readonly aircraftwasm_isCustomPartsDefault: (a: number) => number;
  readonly aircraftwasm_new: () => [number, number, number];
  readonly aircraftwasm_removeCustomPart: (a: number, b: number, c: number) => void;
  readonly aircraftwasm_removeWeaponSet: (a: number, b: number) => void;
  readonly aircraftwasm_reset: (a: number) => void;
  readonly aircraftwasm_serializeToLZString: (a: number) => [number, number, number, number];
  readonly aircraftwasm_setAccessoriesBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setAircraftType: (a: number, b: number) => void;
  readonly aircraftwasm_setCargoBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setCockpitsBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setControlSurfacesBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setCustomPartQty: (a: number, b: number, c: number) => void;
  readonly aircraftwasm_setEngineBindings: (a: number, b: number, c: any) => void;
  readonly aircraftwasm_setEngineSelectedIndex: (a: number, b: number, c: number) => void;
  readonly aircraftwasm_setEngineSelectedList: (a: number, b: number, c: number, d: number) => void;
  readonly aircraftwasm_setEnginesBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setEraBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setFramesBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setFuelBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setLandingGearBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setMunitionsBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setName: (a: number, b: number, c: number) => void;
  readonly aircraftwasm_setNumberOfEngines: (a: number, b: number) => void;
  readonly aircraftwasm_setNumberOfRadiators: (a: number, b: number) => void;
  readonly aircraftwasm_setOptimizationBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setPassengersBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setPropellerBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setRadiatorBindings: (a: number, b: number, c: any) => void;
  readonly aircraftwasm_setReinforcementsBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setRotorBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setStabilizersBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setUsedBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setWeaponBindings: (a: number, b: number, c: number, d: any) => void;
  readonly aircraftwasm_setWeaponSystemBindings: (a: number, b: number, c: any) => void;
  readonly aircraftwasm_setWeaponsBindings: (a: number, b: any) => void;
  readonly aircraftwasm_setWingsBindings: (a: number, b: any) => void;
  readonly aircraftwasm_toJSON: (a: number) => [number, number, number, number];
  readonly aircraftwasm_vitalComponentList: (a: number) => [number, number];
  readonly calculateEngineStats: (a: any) => [number, number, number];
  readonly getElectricWindings: () => any;
  readonly getPropellerCompressorTypes: () => any;
  readonly getPropellerCoolingTypes: () => any;
  readonly getPropellerEras: () => any;
  readonly getPropellerUpgrades: () => any;
  readonly getPulsejetValveTypes: () => any;
  readonly getTurbineEras: () => any;
  readonly getTurbineTypes: () => any;
  readonly init_panic_hook: () => void;
  readonly localization_getAvailableLanguages: () => [number, number];
  readonly localization_getLocale: () => [number, number];
  readonly localization_setLocale: (a: number, b: number) => void;
  readonly localization_translate: (a: number, b: number) => [number, number];
  readonly localization_translateWithParam: (a: number, b: number, c: number, d: number) => [number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
