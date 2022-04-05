import { Stats, Stats_PS } from "./Stats";
import { lu } from "./Localization";


export enum AIRCRAFT_TYPE {
    AIRPLANE,
    HELICOPTER,
    AUTOGYRO,
    ORNITHOPTER_BASIC,
    ORNITHOPTER_FLUTTER,
    ORNITHOPTER_BUZZER,
}
export function IsAnyOrnithopter(type: AIRCRAFT_TYPE) {
    return type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC
        || type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER
        || type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER;
}
export abstract class Part {
    abstract PartStats(): Stats;
    abstract GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] };
    protected FormatEquipment(equipment: { source: string, charge: string }[], name: string, charge: number): { source: string, charge: string }[] {
        if (Math.abs(charge) > 0.5) {
            equipment.push({
                source: lu(name),
                charge: charge.toString(),
            });
        } else if (charge > 0 && charge < 1.0e-6) {
            equipment.push({
                source: lu(name),
                charge: "-",
            });
        }
        return equipment;
    }
    abstract SetCalculateStats(callback: () => void);
    protected CalculateStats: () => void;
}

export function MergeElectrics(
    a: { storage: number, equipment: { source: string, charge: string }[] },
    b: { storage: number, equipment: { source: string, charge: string }[] }): { storage: number, equipment: { source: string, charge: string }[] } {

    for (let bi = 0; bi < b.equipment.length; bi++) {
        let merge = false;
        for (let ai = 0; ai < a.equipment.length; ai++) {
            if (a.equipment[ai].source == b.equipment[bi].source && !isNaN(parseInt(a.equipment[ai].charge))) {
                a.equipment[ai].charge = (parseInt(a.equipment[ai].charge) + parseInt(b.equipment[bi].charge)).toString();
                merge = true;
                break;
            }
        }
        if (!merge) {
            a.equipment.push(b.equipment[bi]);
        }
    }

    return { storage: a.storage + b.storage, equipment: a.equipment };
}


export interface PartStorage {
    version: string;
    era: Era_PS;
    cockpit: Cockpit_PS;
    passengers: Passengers_PS;
    engines: Engines_PS;
    propellers: Propellers_PS;
    frames: Frames_PS;
    wings: Wings_PS;
    stabilizers: Stabilizers_PS;
    controls: Controls_PS;
    reinforcement: Reinforcement_PS;
    fuel: Fuel_PS;
    cargo: Cargo_PS;
    landing_gear: LandingGear_PS;
    accessories: Accessories_PS;
    rotor: Rotor_PS;
}

export interface HeliPartStorage {
    version: string;
    era: Era_PS;
    cockpit: Cockpit_PS;
    passengers: Passengers_PS;
    engines: Engines_PS;
    propellers: Propellers_PS;
    frames: Frames_PS;
    stabilizers: Stabilizers_PS;
    reinforcement: Reinforcement_PS;
    fuel: Fuel_PS;
    cargo: Cargo_PS;
    landing_gear: LandingGear_PS;
    accessories: Accessories_PS;
    rotor: Rotor_PS;
}

export interface Accessories_PS {
    electrical: Electrical[];
    radios: Autopilot[];
    recon: Recon[];
    visibility: Visibility[];
    climate: Climate[];
    autopilots: Autopilot[];
    control: Control[];
}

export interface Autopilot extends Stats_PS {
}

export interface Climate extends Stats_PS {
    req_radiator: boolean;
}

export interface Control extends Stats_PS {
    max_mass_stress: number;
    max_total_stress: number;
}

export interface Electrical extends Stats_PS {
    cp10s: number;
    storage: number;
}

export interface Recon extends Stats_PS {
    dragpercool?: number;
}

export interface Visibility extends Stats_PS {
}

export interface Cargo_PS {
    spaces: Space[];
}

export interface Space extends Stats_PS {
}

export interface Cockpit_PS {
    options: UpgradeElement[];
    upgrades: UpgradeElement[];
    safety: Autopilot[];
    gunsights: Gunsight[];
}

export interface Gunsight extends Stats_PS {
    attack: number;
}

export interface UpgradeElement extends Stats_PS {
    exposed?: boolean;
}

export interface Controls_PS {
    ailerons: Aileron[];
    rudders: Elevator[];
    elevators: Elevator[];
    flaps: Flap[];
    slats: Slat[];
    drag_inducers: Autopilot[];
}

export interface Aileron extends Stats_PS {
    warping: boolean;
}

export interface Elevator extends Stats_PS {
}

export interface Flap extends Stats_PS {
    costfactor: number;
}

export interface Slat extends Stats_PS {
}

export interface Engines_PS {
    mounts: Mount[];
    "radiator-type": Recon[];
    "radiator-mount": RadiatorMount[];
    "radiator-coolant": RadiatorCoolant[];
    cowling: Cowling[];
}

export interface Cowling extends Stats_PS {
    ed: number;
    mpd: number;
    air: boolean;
    liquid: boolean;
    rotary: boolean;
}

export interface Mount extends Stats_PS {
    strainfactor: number;
    dragfactor: number;
    location: string;
    powerfactor: number;
    helicopter: boolean;
    pushpull: boolean;
    turbine: boolean;
    reqTail: boolean;
    reqED: boolean;
}

export interface RadiatorCoolant extends Stats_PS {
    harden: boolean;
    flammable: boolean;
}

export interface RadiatorMount extends Stats_PS {
}

export interface Era_PS {
    options: EraOption[];
}

export interface EraOption extends Stats_PS {
    maxbomb: number;
    cant_lift: number;
}

export interface Frames_PS {
    frames: Frame[];
    skin: Skin[];
    tail: Tail[];
}

export interface Frame extends Stats_PS {
    basestructure: number;
    basecost: number;
    geodesic: boolean;
}

export interface Skin extends Stats_PS {
    dragfactor: number;
    massfactor: number;
    flammable: boolean;
    monocoque: boolean;
    monocoque_structure: number;
}

export interface Tail extends Stats_PS {
}

export interface Fuel_PS {
    tanks: Tank[];
}

export interface Tank extends Stats_PS {
    internal: boolean;
    cantilever: boolean;
}

export interface LandingGear_PS {
    gear: Gear[];
    extras: Extra[];
}

export interface Extra extends Stats_PS {
    MpLMP: number;
}

export interface Gear extends Stats_PS {
    DpLMP: number;
    SpLMP: number;
    can_retract: boolean;
}

export interface Passengers_PS {
}

export interface Propellers_PS {
    props: Prop[];
    upgrades: Prop[];
}

export interface Prop extends Stats_PS {
    energy: number;
    turn: number;
}

export interface Reinforcement_PS {
    external_wood: Cabane[];
    external_steel: Cabane[];
    cabane: Cabane[];
    cantilever: Cantilever[];
}

export interface Cabane extends Stats_PS {
    tension: number;
    config: boolean;
    first?: boolean;
    small_sqp?: boolean;
    ornith?: boolean;
}

export interface Cantilever extends Stats_PS {
    limited: boolean;
}

export interface Rotor_PS {
    blade_count: BladeCount[];
    arrangement: Arrangement[];
}

export interface Arrangement extends Stats_PS {
    count: number;
    powerfactor: number;
    blades: number;
}

export interface BladeCount extends Stats_PS {
    sizing: number;
    rotor_bleed: number;
}

export interface Stabilizers_PS {
    hstab: Hstab[];
    vstab: Vstab[];
}

export interface Hstab extends Stats_PS {
    dragfactor: number;
    is_canard: boolean;
    increment: number;
    is_vtail: boolean;
    is_tail: boolean;
}

export interface Vstab extends Stats_PS {
    dragfactor: number;
    increment: number;
    is_vtail: boolean;
    is_tail: boolean;
}

export interface LargestWing extends Elevator {
    dragfactor: number;
}

export interface Wings_PS {
    decks: Deck[];
    largest: LargestWing[];
    surface: Surface[];
    stagger: Stagger[];
}

export interface Deck extends Stats_PS {
    limited: boolean;
}

export interface Stagger extends Stats_PS {
    inline: boolean;
    wing_count: number;
    hstab: boolean;
}

export interface Surface extends Stats_PS {
    flammable: boolean;
    strainfactor: number;
    dragfactor: number;
    metal: boolean;
    transparent: boolean;
}
