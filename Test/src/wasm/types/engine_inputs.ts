/**
 * TypeScript interfaces for EngineInputs
 *
 * These interfaces match the Rust EngineInputs structure and are used
 * to construct engine data for the calculateEngineStats() WASM function.
 */

import { Stats } from "../aircraft_bridge";

/**
 * Main EngineInputs structure
 */
export interface EngineInputs {
    name: string;
    etype: number;  // 0=Propeller, 1=Pulsejet, 2=Turbine, 3=Electric
    era_sel: number;
    rarity: number | string;  // 0=CUSTOM, 1=COMMON, etc. or "CUSTOM", "COMMON", etc.
    inputs: TypedInputs;
}

/**
 * Union type for engine-specific inputs
 */
export type TypedInputs = PropellerInputs | PulsejetInputs | TurbineInputs | ElectricInputs;

/**
 * Propeller engine inputs (etype = 0)
 */
export interface PropellerInputs {
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
    };
}

/**
 * Pulsejet engine inputs (etype = 1)
 */
export interface PulsejetInputs {
    Pulsejet: {
        power: number;
        quality_cost: number;
        quality_reliability: number;
        starter: boolean;
    };
}

/**
 * Turbine engine inputs (etype = 2)
 */
export interface TurbineInputs {
    Turbine: {
        flow_adjustment: number;
        diameter: number;
        compression_ratio: number;
        bypass_ratio: number;
        upgrades: boolean[];
    };
}

/**
 * Electric motor inputs (etype = 3)
 */
export interface ElectricInputs {
    Electric: {
        power: number;
        winding_sel: number;
        chonk: number;
        quality_fudge: number;
    };
}

/**
 * EngineStats returned by calculateEngineStats()
 */
export interface EngineStats {
    name: string;
    torque: number;
    overspeed: number;
    altitude: number;
    oil_tank: number;
    geared_rpm: number;
    rumble: number;
    stats: Stats;
    es1: number;
    es2: number;
}

/**
 * Helper function to create a Propeller EngineInputs object
 */
export function createPropellerEngine(
    name: string,
    era_sel: number,
    etype: number,
    rarity: number | string,
    displacement: number,
    compression: number,
    cyl_per_row: number,
    rows: number,
    rpm_boost: number,
    material_fudge: number,
    quality_fudge: number,
    compressor_type: number,
    compressor_count: number,
    min_ideal_alt: number,
    upgrades: boolean[]
): EngineInputs {
    return {
        name,
        etype,
        era_sel,
        rarity,
        inputs: {
            Propeller: {
                displacement,
                compression,
                cyl_per_row,
                rows,
                rpm_boost,
                material_fudge,
                quality_fudge,
                compressor_type,
                compressor_count,
                min_ideal_alt,
                upgrades,
            },
        },
    };
}

/**
 * Helper function to create a Pulsejet EngineInputs object
 */
export function createPulsejetEngine(
    name: string,
    etype: number,
    era_sel: number,
    rarity: number | string,
    power: number,
    quality_cost: number,
    quality_reliability: number,
    starter: boolean
): EngineInputs {
    return {
        name,
        etype,
        era_sel,
        rarity,
        inputs: {
            Pulsejet: {
                power,
                quality_cost,
                quality_reliability,
                starter,
            },
        },
    };
}

/**
 * Helper function to create a Turbine EngineInputs object
 */
export function createTurbineEngine(
    name: string,
    era_sel: number,
    etype: number,
    rarity: number | string,
    flow_adjustment: number,
    diameter: number,
    compression_ratio: number,
    bypass_ratio: number,
    upgrades: boolean[]
): EngineInputs {
    return {
        name,
        etype,
        era_sel,
        rarity,
        inputs: {
            Turbine: {
                flow_adjustment,
                diameter,
                compression_ratio,
                bypass_ratio,
                upgrades,
            },
        },
    };
}

/**
 * Helper function to create an Electric EngineInputs object
 */
export function createElectricEngine(
    name: string,
    era_sel: number,
    rarity: number | string,
    power: number,
    winding_sel: number,
    chonk: number,
    quality_fudge: number
): EngineInputs {
    return {
        name,
        etype: 3,
        era_sel,
        rarity,
        inputs: {
            Electric: {
                power,
                winding_sel,
                chonk,
                quality_fudge,
            },
        },
    };
}
