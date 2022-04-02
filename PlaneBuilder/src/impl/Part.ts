import { Stats } from "./Stats";
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

export interface Accessories_PS {
    electrical: Electrical[];
    radios: Autopilot[];
    recon: Recon[];
    visibility: Visibility[];
    climate: Climate[];
    autopilots: Autopilot[];
    control: Control[];
}

export interface Autopilot {
    name: string;
    era: string;
    mass: number;
    warning?: string;
    charge?: number;
    cost: number;
    drag?: number;
    escape?: number;
    visibility?: number;
}

export interface Climate {
    name: string;
    era: string;
    charge: number;
    cost: number;
    req_radiator: boolean;
}

export interface Control {
    name: string;
    era: string;
    max_mass_stress: number;
    max_total_stress: number;
    mass: number;
    cost: number;
}

export interface Electrical {
    name: string;
    era: string;
    drag: number;
    cost: number;
    cp10s: number;
    storage: number;
    mass: number;
}

export interface Recon {
    name: string;
    era: string;
    cost: number;
    warning: string;
    reqsections?: number;
    mass: number;
    drag: number;
    cooling?: number;
    dragpercool?: number;
}

export interface Visibility {
    name: string;
    era: string;
    visibility: number;
    liftbleed: number;
    charge: number;
    structure: number;
    cost: number;
}

export interface Cargo_PS {
    spaces: Space[];
}

export interface Space {
    name: string;
    era: string;
    reqsections: number;
    mass: number;
    warning: string;
}

export interface Cockpit_PS {
    options: UpgradeElement[];
    upgrades: UpgradeElement[];
    safety: Autopilot[];
    gunsights: Gunsight[];
}

export interface Gunsight {
    name: string;
    era: string;
    visibility: number;
    attack: number;
    cost: number;
    warning: string;
    charge: number;
}

export interface UpgradeElement {
    name: string;
    era: string;
    mass: number;
    drag: number;
    control: number;
    escape: number;
    cost: number;
    flightstress: number;
    visibility: number;
    exposed?: boolean;
    warning: string;
    charge?: number;
}

export interface Controls_PS {
    ailerons: Aileron[];
    rudders: Elevator[];
    elevators: Elevator[];
    flaps: Flap[];
    slats: Slat[];
    drag_inducers: Autopilot[];
}

export interface Aileron {
    name: string;
    era: string;
    warping: boolean;
    warning: string;
    cost: number;
    control: number;
    drag: number;
    crashsafety: number;
}

export interface Elevator {
    name: string;
    era: string;
    pitchstab?: number;
    control: number;
    latstab?: number;
    dragfactor?: number;
}

export interface Flap {
    name: string;
    era: string;
    costfactor: number;
    control: number;
    warning: string;
    liftbleed: number;
    crashsafety: number;
}

export interface Slat {
    name: string;
    era: string;
    control: number;
    drag: number;
    liftbleed: number;
    cost: number;
}

export interface Engines_PS {
    mounts: Mount[];
    "radiator-type": Recon[];
    "radiator-mount": RadiatorMount[];
    "radiator-coolant": RadiatorCoolant[];
    cowling: Cowling[];
}

export interface Cowling {
    name: string;
    era: string;
    ed: number;
    mpd: number;
    air: boolean;
    liquid: boolean;
    rotary: boolean;
    reliability: number;
    mass: number;
    cost: number;
}

export interface Mount {
    name: string;
    era: string;
    drag: number;
    reqsections: number;
    pitchstab: number;
    visibility: number;
    liftbleed: number;
    strainfactor: number;
    dragfactor: number;
    location: string;
    powerfactor: number;
    helicopter: boolean;
    pushpull: boolean;
    turbine: boolean;
    reqTail: boolean;
    escape: number;
    reqED: boolean;
}

export interface RadiatorCoolant {
    name: string;
    era: string;
    cost: number;
    harden: boolean;
    reliability: number;
    flammable: boolean;
    warning: string;
}

export interface RadiatorMount {
    name: string;
    era: string;
    warning: string;
    reliability: number;
    drag: number;
    latstab: number;
}

export interface Era_PS {
    options: EraOption[];
}

export interface EraOption {
    name: string;
    liftbleed: number;
    maxbomb: number;
    cost: number;
    cant_lift: number;
    pitchstab: number;
}

export interface Frames_PS {
    frames: Frame[];
    skin: Skin[];
    tail: Tail[];
}

export interface Frame {
    name: string;
    era: string;
    basestructure: number;
    basecost: number;
    mass: number;
    structure: number;
    cost: number;
    geodesic: boolean;
    warning: string;
}

export interface Skin {
    name: string;
    era: string;
    dragfactor: number;
    massfactor: number;
    visibility: number;
    flammable: boolean;
    monocoque: boolean;
    monocoque_structure: number;
    toughness: number;
    cost: number;
}

export interface Tail {
    name: string;
    era: string;
    reqsections: number;
    pitchstab: number;
    visibility: number;
}

export interface Fuel_PS {
    tanks: Tank[];
}

export interface Tank {
    name: string;
    era: string;
    mass: number;
    wetmass: number;
    fuel: number;
    reqsections: number;
    internal: boolean;
    cantilever: boolean;
    control: number;
    drag: number;
}

export interface LandingGear_PS {
    gear: Gear[];
    extras: Extra[];
}

export interface Extra {
    name: string;
    era: string;
    mass: number;
    MpLMP: number;
    warning: string;
    drag: number;
    crashsafety: number;
}

export interface Gear {
    name: string;
    era: string;
    DpLMP: number;
    SpLMP: number;
    can_retract: boolean;
    mass: number;
    warning: string;
}

export interface Passengers_PS {
}

export interface Propellers_PS {
    props: Prop[];
    upgrades: Prop[];
}

export interface Prop {
    name: string;
    era: string;
    pitchspeed: number;
    pitchboost: number;
    cost: number;
    energy: number;
    turn: number;
    warning?: string;
    mass?: number;
}

export interface Reinforcement_PS {
    external_wood: Cabane[];
    external_steel: Cabane[];
    cabane: Cabane[];
    cantilever: Cantilever[];
}

export interface Cabane {
    name: string;
    era: string;
    tension: number;
    structure: number;
    config: boolean;
    drag: number;
    mass: number;
    cost: number;
    maxstrain: number;
    first?: boolean;
    small_sqp?: boolean;
    ornith?: boolean;
}

export interface Cantilever {
    name: string;
    era: string;
    mass: number;
    maxstrain: number;
    toughness: number;
    cost: number;
    limited: boolean;
    liftbleed: number;
}

export interface Rotor_PS {
    blade_count: BladeCount[];
    arrangement: Arrangement[];
}

export interface Arrangement {
    name: string;
    count: number;
    powerfactor: number;
    blades: number;
    reliability: number;
    latstab: number;
    pitchstab: number;
    cost: number;
}

export interface BladeCount {
    name: string;
    sizing: number;
    flightstress: number;
    rotor_bleed: number;
    cost: number;
}

export interface Stabilizers_PS {
    hstab: Hstab[];
    vstab: Vstab[];
}

export interface Hstab {
    name: string;
    era: string;
    dragfactor: number;
    is_canard: boolean;
    increment: number;
    is_vtail: boolean;
    is_tail: boolean;
    warning: string;
    liftbleed: number;
    latstab: number;
    pitchstab: number;
    cost: number;
}

export interface Vstab {
    name: string;
    era: string;
    dragfactor: number;
    increment: number;
    is_vtail: boolean;
    is_tail: boolean;
    control: number;
}

export interface Wings_PS {
    decks: Deck[];
    largest: Elevator[];
    surface: Surface[];
    stagger: Stagger[];
}

export interface Deck {
    name: string;
    era: string;
    pitchstab: number;
    maxstrain: number;
    liftbleed: number;
    visibility: number;
    limited: boolean;
    crashsafety: number;
}

export interface Stagger {
    name: string;
    era: string;
    inline: boolean;
    wing_count: number;
    hstab: boolean;
    pitchstab: number;
    liftbleed: number;
}

export interface Surface {
    name: string;
    era: string;
    flammable: boolean;
    strainfactor: number;
    dragfactor: number;
    metal: boolean;
    transparent: boolean;
    charge: number;
    toughness: number;
    control: number;
    mass: number;
    cost: number;
}
