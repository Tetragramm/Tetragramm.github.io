import { LZString } from "./lz/lz-string";
import { _stringToArrayBuffer, _arrayBufferToString, SetAnimationEnabled, CreateTH, CreateCheckbox, GenerateID } from "./disp/Tools";
import { Deserialize } from "./impl/Serialize";
import { StringFmt } from "./string/index";
import { scrollToFragment } from "./scroll/scroll";



enum SizeEnum {
    None = "None",
    Tiny = "Tiny",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    Huge = "Huge"
}

enum WARNING_COLOR {
    WHITE,
    YELLOW,
    RED,
}

class Stats {
    public cost = 0;
    public upkeep = 0;
    public speed = 0;
    public torque = 0;
    public handling = 0;
    public integrity = 0;
    public safety = 0;
    public reliability = 0;
    public fuel = 0;
    public stress = 0;
    public volume = 0;
    public warnings: { source: string, warning: string, color: WARNING_COLOR }[] = [];

    constructor(obj?) {
        if (obj) {
            if (obj["cost"])
                this.cost = obj.cost;
            if (obj["upkeep"])
                this.upkeep = obj.upkeep;
            if (obj["speed"])
                this.speed = obj.speed;
            if (obj["torque"])
                this.torque = obj.torque;
            if (obj["handling"])
                this.handling = obj.handling;
            if (obj["integrity"])
                this.integrity = obj.integrity;
            if (obj["safety"])
                this.safety = obj.safety;
            if (obj["reliability"])
                this.reliability = obj.reliability;
            if (obj["fuel"])
                this.fuel = obj.fuel;
            if (obj["stress"])
                this.stress = obj.stress;
            if (obj["volume"])
                this.volume = obj.volume;
        }
    }

    public add(other: Stats) {
        this.cost += other.cost;
        this.upkeep += other.upkeep;
        this.speed += other.speed;
        this.torque += other.torque;
        this.handling += other.handling;
        this.integrity += other.integrity;
        this.safety += other.safety;
        this.reliability += other.reliability;
        this.fuel += other.fuel;
        this.stress += other.stress;
        this.volume += other.volume;
    }
}

var PowerplantSize: { HP: number, name: string, speed: number, fuel: number, upkeep: number, reliability: number, cost: number, special: string[] }[] = [
    { HP: 10, name: "Motorcycle", speed: 3, fuel: 15, upkeep: 0, reliability: 2, cost: -1, special: ["Gains 3 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 20, name: "Sedan", speed: 4, fuel: 13, upkeep: 0, reliability: 2, cost: 0, special: ["Gains 3 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 40, name: "Sports Car", speed: 5, fuel: 12, upkeep: 0, reliability: 1, cost: 1, special: ["Gains 3 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 60, name: "Truck", speed: 6, fuel: 11, upkeep: 0, reliability: 1, cost: 2, special: ["Gains 3 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 80, name: "Tankette", speed: 7, fuel: 10, upkeep: 1, reliability: 0, cost: 3, special: [] },
    { HP: 100, name: "Cable Train", speed: 8, fuel: 9, upkeep: 1, reliability: 0, cost: 4, special: [] },
    { HP: 120, name: "Light Tank", speed: 9, fuel: 8, upkeep: 1, reliability: -1, cost: 5, special: [] },
    { HP: 150, name: "Medium Tank", speed: 10, fuel: 6, upkeep: 2, reliability: -1, cost: 6, special: [] },
    { HP: 180, name: "Aircraft", speed: 11, fuel: 4, upkeep: 2, reliability: -2, cost: 8, special: [] },
];
var DoubleFuel: { HP: number, name: string, speed: number, fuel: number, upkeep: number, reliability: number, cost: number, special: string[] }[] = [];
var HalfFuel: { HP: number, name: string, speed: number, fuel: number, upkeep: number, reliability: number, cost: number, special: string[] }[] = [];
for (let p of PowerplantSize) {
    let p2 = structuredClone(p);
    p2.fuel *= 2;
    DoubleFuel.push(p2);
    let p3 = structuredClone(p);
    p3.fuel = Math.floor(p3.fuel / 2);
    HalfFuel.push(p3);
}

const PowerplantType: { name: string, stress?: number, cost?: number, speed?: number, torque?: number, reliability?: number, volume?: number, integrity?: number, handling?: number, special: string[], powerplants: { HP: number, name: string, speed?: number, cost?: number, fuel?: number, reliability?: number, upkeep?: number, special: string[] }[] }[] = [
    {
        name: "Human Powered", stress: 1, powerplants: [
            { HP: 0, name: "Humans", speed: 1, cost: -2, special: ["Requires 1 human per volume.", "\"Engine\" takes Injury where they would normally take Wear.", "Reliability modifier is equal to the Higest Attribute."] }
        ], special: []
    },
    // {
    //     name: "Animal Powered", powerplants: [
    //         { HP: 10, name: "Oxen", speed: 2, fuel: 12, reliability: 2, special: ["Requires 1 Ox/2 Volume.", "Fuel is replaced with exhaustion and carrots. Reliability with recalcitrance."] },
    //         { HP: 10, name: "Elk", speed: 3, fuel: 12, reliability: 2, special: ["Requires 1 Elk/Volume.", "Fuel is replaced with exhaustion and carrots. Reliability with recalcitrance."] },
    //         { HP: 10, name: "Reindeer", speed: 3, fuel: 12, reliability: 2, special: ["Requires 1 Reindeer/Volume.", "Fuel is replaced with exhaustion and carrots. Reliability with recalcitrance."] },
    //         { HP: 10, name: "Goats", speed: 3, fuel: 12, reliability: 2, special: ["Requires 2 Goats/Volume.", "Fuel is replaced with exhaustion and carrots. Reliability with recalcitrance."] },
    //         { HP: 10, name: "Dogs", speed: 3, fuel: 12, reliability: 2, special: ["Requires 2 Dogs/Volume.", "Fuel is replaced with exhaustion and treats. Reliability with recalcitrance."] },
    //     ], special: []
    // },
    {
        name: "Wind Powered", powerplants: [
            {
                HP: 0, name: "Sails", special: ["Does not need to Crank Start", "Cannot Gun the Engine", "Does not catch fire at 7 Wear", "Max Speed is Wind strength, half that into the wind. This speed is unmodified by Volume.", "Requires 1 bold sailor per Volume to man the rigging.", "Cannot be armoured."]
            },
        ], special: []
    },
    { name: "Petrol", powerplants: PowerplantSize, special: [] },
    { name: "Diesel", cost: 2, speed: -1, torque: 1, reliability: 1, powerplants: DoubleFuel, special: [] },
    { name: "Steam", cost: -2, speed: -2, torque: 2, stress: 1, reliability: 2, volume: 1, integrity: -5, powerplants: PowerplantSize, special: ["At 7 Wear, pushes Burn Out as the boiler explodes!"] },
    {
        name: "Electric", cost: 3, speed: 1, torque: -1, handling: 5, powerplants: HalfFuel, special: ["Auto-pass Crank Start.", "Cannot Gun the Engine.", "Must recharge in town or with a generator.", "Can be Concealed with the engine on(when stationary)."]
    },
    {
        name: "Clockwork", cost: 2, integrity: 5, powerplants: HalfFuel, special: ["Auto-pass Crank Start.", "Does not burn at 7 Wear.", "On Check Engine, cannot choose to take Wear or shut down; this is replaced with \"Spend 1 Fuel Use (repeatable)\".", "Must recharge in town or with a generator."]
    }
];
const PropulsionType = [
    "Monowheel",
    "Two-Wheeled",
    "Three-Wheeled",
    "Four-Wheeled",
    "Six-Wheeled",
    "Half-Track",
    "Continuous Track",
    "Crawler",
    "Half-Walker",
    "Walker",
    "Skids",
    "Skis",
    "Boat Hull",
    "Amphibious",
    "Cable Car",
    "Sky-Line",
    "Dorandisch Earthline",
];

const Volume: { size: SizeEnum, handling: number, speedmod: number, maxHP: number, integrity: number }[] = [
    { size: SizeEnum.None, handling: 0, speedmod: 0, maxHP: 0, integrity: 0 },
    { size: SizeEnum.Small, handling: 45, speedmod: 1, maxHP: 20, integrity: 6, },
    { size: SizeEnum.Medium, handling: 40, speedmod: 1, maxHP: 40, integrity: 8, },
    { size: SizeEnum.Medium, handling: 35, speedmod: 0, maxHP: 60, integrity: 10, },
    { size: SizeEnum.Medium, handling: 30, speedmod: 0, maxHP: 80, integrity: 12, },
    { size: SizeEnum.Large, handling: 25, speedmod: -1, maxHP: 100, integrity: 14, },
    { size: SizeEnum.Large, handling: 20, speedmod: -1, maxHP: 120, integrity: 16, },
    { size: SizeEnum.Huge, handling: 15, speedmod: -1, maxHP: 150, integrity: 18, },
    { size: SizeEnum.Huge, handling: 10, speedmod: -2, maxHP: 180, integrity: 20, },
];

class Weapon {
    public name: string;
    public abbr: string;
    public cost: number;
    public loader: boolean;
    public braced: boolean;
    public heavy: number;
    public artillery: boolean;
    public indirect: boolean;

    constructor(js: { name: string, abbr: string, cost: number, loader?: boolean, braced?: boolean, heavy?: number, artillery?: boolean, indirect?: boolean }) {
        this.name = js.name;
        this.abbr = js.abbr;
        this.cost = js.cost;
        this.loader = js.loader ?? false;
        this.braced = js.braced ?? false;
        this.heavy = js.heavy ?? 0;
        this.artillery = js.artillery ?? false;
        if (this.artillery) {
            this.loader = true;
            this.braced = true;
        }
        this.indirect = js.indirect ?? false;
    }
}

var WeaponList: Weapon[] = [
    new Weapon({ name: "None", abbr: undefined, cost: undefined, loader: false }),
    new Weapon({ name: "Trench Gun", abbr: "TG", cost: 2 }),
    new Weapon({ name: "Aircraft Shotgun", abbr: "ASG", cost: 2 }),
    new Weapon({ name: "Converted Autorifle", abbr: "CAR", cost: 1 }),
    new Weapon({ name: "Machine Carbine", abbr: "MC", cost: 5 }),
    new Weapon({ name: "Heavy Submachine Gun", abbr: "HSG", cost: 2, braced: true, loader: true }),
    new Weapon({ name: "Firing Port Weapon", abbr: "FPW", cost: 2 }),
    new Weapon({ name: "Landflammenwerfer", abbr: "LFW", cost: 3 }),
    new Weapon({ name: "Static Gun", abbr: "Static Gun", cost: 4 }),
    new Weapon({ name: "Light Machine Gun", abbr: "LMG", cost: 2, loader: true, braced: true }),
    new Weapon({ name: "Water-Cooled Machine Gun", abbr: "WMG", cost: 3, loader: true, braced: true, heavy: 2 }),
    new Weapon({ name: "Automatic Rifle", abbr: "AR", cost: 3, loader: true, braced: true }),
    new Weapon({ name: "Hailstorm Shotgun", abbr: "HSS", cost: 4, loader: true, braced: true, heavy: 3 }),
    new Weapon({ name: "Rotary Machine Gun", abbr: "RMG", cost: 5, loader: true, braced: true, heavy: 2 }),
    new Weapon({ name: "PuF Machine Gun", abbr: "PMG", cost: 5, loader: true, braced: true, heavy: 3 }),
    new Weapon({ name: "Anti-Tank Rifle", abbr: "ATR", cost: 4, loader: false, braced: true }),
    new Weapon({ name: "Coilgun Rifle", abbr: "Coilgun Rifle", cost: 10, loader: false, braced: true }),
    new Weapon({ name: "Trench Mortar", abbr: "TM", cost: 1, loader: true, braced: true, indirect: true }),
    new Weapon({ name: "Repeater Cannon", abbr: "RPC", cost: 6, loader: true, braced: true, heavy: 3 }),
    new Weapon({ name: "Infantry Support Cannon", abbr: "ISC", cost: 6, heavy: 2, artillery: true }),
    new Weapon({ name: "Recoilless Cannon", abbr: "RRC", cost: 5, loader: true, braced: true, heavy: 2 }),
    new Weapon({ name: "Pom-Pom Gun", abbr: "POM", cost: 10, artillery: true, heavy: 3 }),
    new Weapon({ name: "Flak Cannon", abbr: "FLAK", cost: 5, artillery: true, heavy: 3 }),
    new Weapon({ name: "Field Cannon", abbr: "FC", cost: 8, artillery: true, heavy: 3 }),
    new Weapon({ name: "Heavy Field Cannon", abbr: "HFC", cost: 15, artillery: true, heavy: 5 }),
    new Weapon({ name: "Rocket Artillery Rail", abbr: "RAR", cost: 2, artillery: true, heavy: 0.5 }),
    new Weapon({ name: "Assault Howitzer", abbr: "AH", cost: 8, artillery: true, heavy: 4 }),
    new Weapon({ name: "Company Mortar", abbr: "Company Mortar", cost: 3, artillery: true, heavy: 3 }),
    new Weapon({ name: "Light Howitzer", abbr: "Light Howitzer", cost: 8, artillery: true, heavy: 4 }),
    new Weapon({ name: "Medium Howitzer", abbr: "Medium Howitzer", cost: 12, artillery: true, heavy: 5 }),
    new Weapon({ name: "Siege Cannon", abbr: "Siege Cannon", cost: 16, artillery: true, heavy: 6 }),
    new Weapon({ name: "Other Weapon", abbr: "Other", cost: undefined }),
]

const CrewType: { name: string }[] = [
    { name: "None" },//0
    { name: "Driver" },//1
    { name: "Commander" },//2
    { name: "Gunner" },//3
    { name: "Gun Crew" },//4
    { name: "Mechanic" },//5
    { name: "Passenger" },//6
    { name: "Passenger (Cramped)" },//7
    { name: "Stretcher" },
];

class Loader {
    public enclosed: boolean;
    public coupla: boolean;
    public sealed: boolean;
    public loop_front: boolean;
    public loop_left: boolean;
    public loop_right: boolean;
    public loop_back: boolean;
    constructor(enc: boolean, coup: boolean, seal: boolean, front: boolean, left: boolean, right: boolean, rear: boolean) {
        this.enclosed = enc;
        this.coupla = coup;
        this.sealed = seal;
        this.loop_front = front;
        this.loop_left = left;
        this.loop_right = right;
        this.loop_back = rear;
    }
};
class Crew {
    public name_txt: string;
    public enclosed: boolean;
    public coupla: boolean;
    public sealed: boolean;
    public loop_front: boolean;
    public loop_left: boolean;
    public loop_right: boolean;
    public loop_back: boolean;
    public loaders: Loader[];
    public weapon_mount: WeaponMount;
    public base_vis: number;
    public base_escape: number;
    constructor(disp: string, enc: boolean, coup: boolean, seal: boolean, lf: boolean, ll: boolean, lr: boolean, lb: boolean, ldrs: Loader[], weap: WeaponMount) {
        this.name_txt = disp;
        this.enclosed = enc;
        this.coupla = coup;
        this.sealed = seal;
        this.loop_front = lf;
        this.loop_left = ll;
        this.loop_right = lr;
        this.loop_back = lb;
        this.loaders = ldrs;
        this.weapon_mount = weap;
    }

    public IsEnclosed(): boolean {
        let is = false;
        is = is || this.enclosed;
        for (let idx = 0; idx < this.loaders.length; idx++) {
            is = is || this.loaders[idx].enclosed;
        }
        return is;
    }

    public GetVisibility(l: number | undefined = undefined) {
        let seat;
        if (l == undefined) {
            seat = this;
        } else {
            seat = this.loaders[l];
        }
        if (seat.sealed)
            return undefined;
        if (seat.enclosed) {
            if (seat.coupla) {
                return this.base_vis + 1;
            }
            return this.base_vis
        }
        return undefined;
    }
    public GetEscape(l: number | undefined = undefined) {
        let seat;
        if (l == undefined) {
            seat = this;
        } else {
            seat = this.loaders[l];
        }
        if (seat.sealed)
            return undefined;
        if (seat.enclosed) {
            if (seat.coupla) {
                return this.base_escape + 1;
            }
            return this.base_escape
        }
        return undefined;
    }

    public GetLoopholes(): { f: number, l: number, r: number, b: number } {
        let result = { f: 0, l: 0, r: 0, b: 0 };
        for (let seat of [this, ...this.loaders]) {
            if (seat.loop_front)
                result.f += 1;
            if (seat.loop_left)
                result.l += 1;
            if (seat.loop_right)
                result.r += 1;
            if (seat.loop_back)
                result.b += 1;
        }
        return result;
    }

    public CalcStats(armour: number[]): Stats {
        let stat = new Stats();
        if (this.name_txt == CrewType[7].name) {
            stat.volume += 0.25;
        } else if (this.name_txt == CrewType[8].name) {
            stat.volume += 1;
        } else {
            stat.volume += 0.5;
        }

        if (this.enclosed && this.coupla)
            stat.cost += 1;

        for (let idx = 0; idx < this.loaders.length; idx++) {
            stat.volume += 0.5;
            if (this.loaders[idx].enclosed && this.loaders[idx].coupla)
                stat.cost += 1;
        }

        stat.add(this.weapon_mount.CalcStats(this.enclosed, armour));
        return stat;
    }
}

class WeaponMount {
    public main_idx: number;
    public directions: boolean[];
    public secondary_idx: number[];
    public shield: boolean;

    // wrow.f.checked = witm.directions[0];
    // wrow.r.checked = witm.directions[1];
    // wrow.b.checked = witm.directions[2];
    // wrow.l.checked = witm.directions[3];
    // wrow.u.checked = witm.directions[4];

    constructor(m: number, dir: boolean[], sec: number[], sh: boolean) {
        this.main_idx = m;
        this.directions = dir;
        this.secondary_idx = sec;
        this.shield = sh;
        this.secondary_idx = this.secondary_idx.filter((value) => { return value > 0 });
        if (this.main_idx == 0 && this.secondary_idx.length > 0) {
            this.main_idx = this.secondary_idx[0]
            this.secondary_idx.splice(0, 1);
        }
    }

    public GetNumLoaders() {
        let count = 0;
        if (WeaponList[this.main_idx].loader)
            count++;
        for (let sec of this.secondary_idx) {
            if (WeaponList[sec].loader)
                count++;
        }
        return count;
    }

    public CalcStats(closed: boolean, armour: number[]): Stats {
        let stat = new Stats();
        if (this.main_idx > 0) {
            stat.add(this.WeapStats(this.main_idx));
            for (let sidx of this.secondary_idx) {
                stat.add(this.WeapStats(sidx));
            }
            if (closed && this.IsArty()) {
                stat.cost += this.ArmourCost(armour);
                if (this.directions[4])
                    stat.cost += 3;
            } else {
                stat.cost += this.DirCount() - 1;
            }
            if (this.shield)
                stat.cost += 3;
        }
        return stat;
    }

    private WeapStats(idx: number): Stats {
        let stat = new Stats();
        let w = WeaponList[idx];
        stat.cost += w.cost;
        if (w.artillery && w.abbr != "ISC") {
            stat.volume = Math.ceil(w.heavy / 2.0);
            stat.cost += 2;
            stat.integrity -= 3;
        }
        return stat;
    }

    public IsArty(): boolean {
        if (WeaponList[this.main_idx].artillery && WeaponList[this.main_idx].abbr != "ISC")
            return true;
        for (let sidx of this.secondary_idx) {
            if (WeaponList[sidx].artillery && WeaponList[sidx].abbr != "ISC")
                return true;
        }
        return false;
    }

    private DirCount(): number {
        let count = 0;
        for (let i = 0; i < this.directions.length; i++) {
            if (this.directions[i])
                count++;
        }
        return count;
    }

    private ArmourCost(armour: number[]): number {
        let cost = [0];
        if (this.directions[0])
            cost.push(armour[0]);
        if (this.directions[1])
            cost.push(armour[1]);
        if (this.directions[3])
            cost.push(armour[1]);
        if (this.directions[2])
            cost.push(armour[2]);
        cost.sort();
        cost.pop();
        let sum = 0;
        cost.map((sum = 0, n => sum += n));
        return sum;
    }
}

class Vehicle {
    private powerplant_idx: number = 3;
    private powerplant_size_idx: number = 1;
    private propulsion_idx: number = 3;
    private armour_front: number = 0;
    private armour_side: number = 0;
    private armour_rear: number = 0;
    private extra_fuel: number = 0;
    private extra_tiny: boolean = false;
    private enlarged_engine: number = 0;
    private propeller = false;
    private crew: Crew[] = [
        new Crew("Driver", true, true, false, false, false, false, false, [], new WeaponMount(0, [true, false, false, false, false], [], false)),
        new Crew("Commander", true, true, false, false, false, false, false, [], new WeaponMount(0, [true, false, false, false, false], [], false)),
    ];
    private cargo = [0, 0, 0, 0];

    private ValidateArmour() {
        if (PowerplantType[this.powerplant_idx].name == "Wind Powered" && this.SumArmour() != 0) {
            this.armour_front = 0;
            this.armour_side = 0;
            this.armour_rear = 0;
        }
        this.armour_front = Math.min(5, this.armour_front);
        this.armour_side = Math.min(5, this.armour_side);
        this.armour_rear = Math.min(5, this.armour_rear);
        while (this.SumArmour() > 10) {
            if (this.armour_rear != 0) {
                this.armour_rear--;
            } else if (this.armour_side != 0) {
                this.armour_side--;
            } else {
                this.armour_front--;
            }
        }
    }
    private SumArmour(): number {
        return this.armour_front + this.armour_side + this.armour_rear;
    }

    public SetCargo(s: number, m: number, l: number, h: number) {
        this.cargo = [s, m, l, h];
        this.CalculateStats();
    }

    public GetCargo() {
        let tiny = 0;
        if (this.extra_tiny) {
            tiny += 1;
        }
        return [tiny, ...this.cargo];
    }

    public SetPowerplant(idx: number) {
        if (PowerplantType[this.powerplant_idx].powerplants.length != PowerplantType[idx].powerplants.length) {
            this.powerplant_size_idx = Math.min(1, PowerplantType[idx].powerplants.length - 1);
        }
        this.powerplant_idx = idx;
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetPowerplantIdx(): number {
        return this.powerplant_idx;
    }
    public GetPowerplant() {
        return structuredClone(PowerplantType[this.powerplant_idx]);
    }
    public GetPowerplantList() {
        return PowerplantType;
    }
    public GetPowerplantSizeIdx(): number {
        return this.powerplant_size_idx;
    }
    public SetPowerplantSize(idx: number) {
        this.powerplant_size_idx = idx;
        this.CalculateStats();
    }
    public GetPowerplantSize() {
        return PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx];
    }
    public GetPowerplantSizeList() {
        return PowerplantType[this.powerplant_idx].powerplants;
    }
    public GetPropulsionList(): string[] {
        return PropulsionType;
    }
    public SetPropulsion(idx: number) {
        this.propulsion_idx = idx;
        this.CalculateStats();
    }
    public GetPropulsionIdx(): number {
        return this.propulsion_idx;
    }
    public GetPropulsion(): string {
        return PropulsionType[this.propulsion_idx];
    }
    public SetPropeller(has: boolean) {
        this.propeller = has;
        this.CalculateStats();
    }
    public CanPropeller() {
        switch (PropulsionType[this.propulsion_idx]) {
            case "Half-Track":
            case "Continuous Track":
            case "Crawler":
            case "Half-Walker":
            case "Walker":
                return false;
            case "Monowheel":
            case "Two-Wheeled":
            case "Three-Wheeled":
            case "Four-Wheeled":
            case "Six-Wheeled":
                if (this.GetVolume() > 4)
                    return false;
            case "Skids":
            case "Skis":
            case "Boat Hull":
            case "Amphibious":
            case "Cable Car":
            case "Sky-Line":
            case "Dorandisch Earthline":
                if (PowerplantType[this.powerplant_idx].name == "Wind Powered")
                    return false;
        }
        return true;
    }
    private ValidateLocomotion() {
        let volume = this.GetVolume();
        switch (PropulsionType[this.propulsion_idx]) {
            case "Monowheel":
            case "Two-Wheeled":
                return volume <= 1;
            case "Three-Wheeled":
            case "Four-Wheeled":
            case "Six-Wheeled":
            case "Half-Track":
            case "Continuous Track":
            case "Crawler":
            case "Half-Walker":
            case "Walker":
                return volume <= 8
            case "Skids":
            case "Skis":
                return volume <= 6;
            case "Boat Hull":
            case "Amphibious":
            case "Cable Car":
            case "Sky-Line":
            case "Dorandisch Earthline":
                return true;
            default:
                console.error("Unknonw Locomotion in ValidateLocomotion");
                return false;
        }
    }
    public SetArmourFront(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_front = amount;
        while (this.SumArmour() > 10) {
            this.armour_front--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourFront(): number {
        return this.armour_front;
    }
    public SetArmourSide(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_side = amount;
        while (this.SumArmour() > 10) {
            this.armour_side--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourSide(): number {
        return this.armour_side;
    }
    public SetArmourRear(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_rear = amount;
        while (this.SumArmour() > 10) {
            this.armour_rear--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourRear(): number {
        return this.armour_rear;
    }
    public CanExtraFuel(): boolean {
        let fuel = this.GetPowerplantSize().fuel ?? 0;
        return (fuel > 0);
    }
    public SetExtraFuel(val: number) {
        val = Math.floor(1.0e-6 + val);
        val = Math.max(0, val);
        this.extra_fuel = val;
        this.CalculateStats();
    }
    public GetExtraFuel(): number {
        return this.extra_fuel;
    }
    public SetEnlargeEngine(count: number) {
        this.enlarged_engine = count;
        this.CalculateStats();
    }
    public GetEnlargedEngine(): number {
        return this.enlarged_engine;
    }

    public GetVolume(): number {
        let stat = new Stats();
        stat.volume += this.extra_fuel;

        let armour_list = [this.armour_front, this.armour_side, this.armour_rear];
        let is_enclosed = false;
        for (let idx = 0; idx < this.crew.length; idx++) {
            is_enclosed = is_enclosed || this.crew[idx].IsEnclosed();
            stat.add(this.crew[idx].CalcStats(armour_list));
        }
        if (is_enclosed) {
            stat.volume += 1;
        }
        if (PropulsionType[this.propulsion_idx] == "Amphibious") {
            stat.volume += 1;
        }
        if (this.enlarged_engine > 0) {
            stat.volume += this.enlarged_engine;
        }
        stat.volume += this.cargo[0] * 1;
        stat.volume += this.cargo[1] * 2;
        stat.volume += this.cargo[2] * 4;
        stat.volume += this.cargo[3] * 8;
        stat.add(new Stats(PowerplantType[this.powerplant_idx]));
        return stat.volume;
    }
    public CalculateStats() {
        let armour_list = [this.armour_front, this.armour_rear, this.armour_side];
        if (!this.CanExtraFuel()) {
            this.extra_fuel = 0;
        }
        let stat = new Stats();
        stat.cost = 3;
        stat.torque = -1;
        stat.volume += this.extra_fuel;
        let is_enclosed = false;
        for (let idx = 0; idx < this.crew.length; idx++) {
            is_enclosed = is_enclosed || this.crew[idx].IsEnclosed();
            stat.add(this.crew[idx].CalcStats(armour_list));
        }
        if (is_enclosed) {
            stat.volume += 1;
            if (this.SumArmour() > 0) {
                stat.stress += 1;
            }
        }
        this.extra_tiny = (stat.volume - Math.floor(stat.volume)) >= 0.45;
        stat.volume = Math.ceil(stat.volume);

        //Loopholes
        stat.cost += this.GetLoopholes();


        if (!this.ValidateLocomotion()) {
            stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "Too much Volume for this locomotion type.", color: WARNING_COLOR.RED });
        }
        if (PropulsionType[this.propulsion_idx] == "Amphibious") {
            stat.volume += 1;
            stat.cost += 1;
            stat.warnings.push({ source: "Amphibious", warning: "Allows use on calm water at -1 Speed.", color: WARNING_COLOR.WHITE });
        }

        stat.volume += this.cargo[0] * 1;
        stat.volume += this.cargo[1] * 2;
        stat.volume += this.cargo[2] * 4;
        stat.volume += this.cargo[3] * 8;


        stat.add(new Stats(PowerplantType[this.powerplant_idx]));
        for (let text of PowerplantType[this.powerplant_idx].special) {
            stat.warnings.push({ source: PowerplantType[this.powerplant_idx].name, warning: text, color: WARNING_COLOR.WHITE });
        }


        let volMaxHP = stat.volume;
        if (this.enlarged_engine) {
            stat.volume += this.enlarged_engine;
            stat.reliability -= this.enlarged_engine;
            volMaxHP += 2 * this.enlarged_engine;
        }
        volMaxHP = Math.min(Volume.length - 1, volMaxHP);

        stat.handling += Volume[Math.min(Volume.length - 1, stat.volume)].handling;
        stat.speed += Volume[Math.min(Volume.length - 1, stat.volume)].speedmod;
        stat.integrity += Volume[Math.min(Volume.length - 1, stat.volume)].integrity;

        console.log([volMaxHP, Volume[volMaxHP], PowerplantSize[this.powerplant_size_idx].HP, this.GetVolume()])
        while (PowerplantSize[this.powerplant_size_idx].HP > Volume[volMaxHP].maxHP) {
            this.powerplant_size_idx -= 1;
        }

        stat.add(new Stats(PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx]));
        for (let text of PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx].special) {
            stat.warnings.push({ source: PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx].name, warning: text, color: WARNING_COLOR.WHITE });
        }
        stat.fuel *= (this.extra_fuel + 1);

        let armour_total = this.SumArmour();
        //Armour effects
        stat.cost += armour_total;
        stat.handling -= 2 * armour_total;
        stat.safety += Math.floor((Math.max(...armour_list) + Math.min(...armour_list)) / 2);
        armour_list.forEach((value) => {
            if (value >= 3) {
                stat.safety += 1;
                stat.speed -= 1;
                stat.torque -= 1;
            }
        });
        if (armour_total > 0) {
            stat.speed -= 1;
            stat.torque -= 1;
            stat.integrity += 2 + armour_total;
            if (armour_total >= 5) {
                stat.speed -= 1;
                stat.torque -= 1;
                if (armour_total >= 10) {
                    stat.speed -= 1;
                    stat.torque -= 1;
                }
            }
        }
        stat.reliability -= Math.floor(1.0e-6 + armour_total / 3.0);
        let ve = 0;
        if (armour_total >= 1) {
            ve -= 1;
            if (armour_total >= 4) {
                ve -= 1;
                if (armour_total >= 7) {
                    ve -= 1;
                    if (armour_total >= 10) {
                        ve -= 1;
                    }
                }
            }
        }
        for (let c of this.crew) {
            c.base_vis = ve;
            c.base_escape = ve;
        }

        if (this.propeller && this.CanPropeller()) {
            stat.torque -= 2;
            stat.speed += 1;
            stat.reliability += 1;
            stat.stress += 1;
            stat.warnings.push({ source: "Propeller", warning: "Double Injury on a Crash.", color: WARNING_COLOR.WHITE });
        }

        switch (PropulsionType[this.propulsion_idx]) {
            case "Monowheel":
            case "Two-Wheeled":
                stat.speed += 1;
                stat.torque -= armour_total;
                stat.cost -= 1;
                break;
            case "Three-Wheeled":
            case "Four-Wheeled":
                if (stat.volume >= 6) {
                    stat.torque -= 1;
                }
                stat.torque -= Math.floor(armour_total / 3);
                break;
            case "Six-Wheeled":
                stat.handling -= 5;
                stat.torque -= Math.floor(armour_total / 5);
                break;
            case "Half-Track":
                stat.torque += 2;
                stat.speed -= 1;
                stat.cost += 1;
                break;
            case "Continuous Track":
                stat.torque += 4;
                stat.speed -= 2;
                stat.handling -= 5;
                if (Volume[stat.volume].size == "Large") {
                    stat.torque += 1;
                } else if (Volume[stat.volume].size == "Huge") {
                    stat.torque += 2;
                }
                stat.cost += 2;
                break;
            case "Crawler":
            case "Half-Walker":
                stat.speed -= 2;
                stat.handling -= 5;
                stat.torque = 3;
                stat.speed = Math.min(stat.speed, 4);
                stat.cost += 2;
                break;
            case "Walker":
                stat.speed -= 3;
                stat.reliability -= 1;
                stat.handling += 5;
                stat.upkeep += 1;
                stat.torque = 5;
                stat.speed = Math.min(stat.speed, 3);
                stat.cost += 4;
                stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "Gains the Gyro-Stabilized & Standing Tall special rules.", color: WARNING_COLOR.WHITE });
                break;
            case "Skids":
            case "Skis":
                stat.speed -= 2;
                stat.torque -= 2;
                stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "+3 Speed bonus on Snow & Ice.", color: WARNING_COLOR.WHITE });
                break;
            case "Boat Hull":
                stat.speed = Math.min(stat.speed, 4);
                stat.cost += 1;
                stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "Limited to Water.", color: WARNING_COLOR.WHITE });
                break;
            case "Amphibious":
                //Note: Done earlier
                break;
            case "Cable Car":
            case "Sky-Line":
                stat.reliability += 4;
                stat.speed += 1;
                stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "Limited to cable lines.", color: WARNING_COLOR.WHITE });
                break;
            case "Dorandisch Earthline":
                stat.reliability += 6;
                stat.speed += 3;
                stat.warnings.push({ source: PropulsionType[this.propulsion_idx], warning: "Limited to ground rails.", color: WARNING_COLOR.WHITE });
                break;
        }

        if (vehicle_display) {
            vehicle_display.UpdateDisplay(stat);
        }
    }
    public SetCrew(idx: number, crew: Crew) {
        if (idx == this.crew.length) {
            this.crew.push(crew);
        } else if (idx >= 0 && idx < this.crew.length) {
            crew.loaders = this.crew[idx].loaders;
            crew.weapon_mount = this.crew[idx].weapon_mount;
            this.crew[idx] = crew;
        } else {
            console.error("SetCrew index out of range.");
        }
        this.CalculateStats();
    }
    public DeleteCrew(idx: number) {
        this.crew.splice(idx, 1);
        this.CalculateStats();
    }
    public DuplicateCrew(idx: number) {
        let c = this.crew[idx];
        let w = c.weapon_mount;
        let dupw = new WeaponMount(w.main_idx, structuredClone(w.directions), structuredClone(w.secondary_idx), w.shield);
        let dup = new Crew(c.name_txt, c.enclosed, c.coupla, c.sealed, c.loop_front, c.loop_left, c.loop_right, c.loop_back, structuredClone(c.loaders), dupw);
        this.crew.splice(idx, 0, dup);
        this.CalculateStats();
    }
    public SetLoader(idx: number, ldr_idx: number, ldr: Loader) {
        if (idx >= this.crew.length) {
            console.error("SetLoader crew index out of range.");
        }
        let crew = this.crew[idx];
        if (ldr_idx >= crew.loaders.length) {
            console.error("SetLoader loader index out of range.");
        } else {
            crew.loaders[ldr_idx] = ldr;
        }
        this.CalculateStats();
    }
    public SetNumLoaders(idx: number, num: number) {
        if (idx >= this.crew.length) {
            console.error("SetNumLoaders crew index out of range.");
        }
        if (num <= 0) {
            this.crew[idx].loaders = [];
        } else {
            num = Math.min(num, this.crew[idx].weapon_mount.GetNumLoaders());
            while (this.crew[idx].loaders.length > num) {
                this.crew[idx].loaders.pop();
            }
            while (this.crew[idx].loaders.length < num) {
                this.crew[idx].loaders.push(new Loader(false, false, false, false, false, false, false));
            }
        }
        this.CalculateStats();
    }
    public GetCrewList(): Crew[] {
        return this.crew;
    }
    public SetWeapon(idx: number, mount: WeaponMount) {
        if (idx >= this.crew.length) {
            console.error("SetWeapon crew index out of range.");
        }
        this.crew[idx].weapon_mount = mount;
        this.CalculateStats();
    }
    private GetLoopholes(): number {
        let result = { f: 0, s: 0, b: 0 };
        for (let c of this.crew) {
            let r = c.GetLoopholes();
            result.f += r.f;
            result.s += r.l;
            result.s += r.r;
            result.b += r.b;
        }
        let cost = 0;
        while (result.f > 4) {
            result.f -= 4;
            cost += this.armour_front;
        }
        while (result.s > 4) {
            result.s -= 4;
            cost += this.armour_side;
        }
        while (result.b > 4) {
            result.b -= 4;
            cost += this.armour_rear;
        }
        let lh = [
            ...Array<number>(result.f).fill(this.armour_front),
            ...Array<number>(result.s).fill(this.armour_side),
            ...Array<number>(result.b).fill(this.armour_rear),
        ];
        lh.sort();
        while (lh.length > 0) {
            let gcost = lh.pop();
            if (lh.length > 0)
                lh.pop();
            if (lh.length > 0)
                lh.pop();
            if (lh.length > 0)
                lh.pop();
            cost += gcost;
        }

        return cost;
    }
}

class VehDisp {
    private stats: StatsDisp;
    private armour: MachineryDisp;
    private crew: CrewDisp;
    private weps: WeaponDisp;

    constructor(veh: Vehicle) {
        this.stats = new StatsDisp(veh);
        this.armour = new MachineryDisp(veh);
        this.crew = new CrewDisp(veh);
        this.weps = new WeaponDisp(veh);
    }

    public UpdateDisplay(final_stats: Stats) {
        this.stats.UpdateDisplay(final_stats);
        this.armour.UpdateDisplay();
        this.crew.UpdateDisplay();
        this.weps.UpdateDisplay();
    }
}

class StatsDisp {
    private vehicle: Vehicle;
    private name_lbl: HTMLLabelElement;
    private nick_lbl: HTMLLabelElement;
    private spd: HTMLTableCellElement;
    private trq: HTMLTableCellElement;
    private hnd: HTMLTableCellElement;
    private amr: HTMLTableCellElement;
    private int: HTMLTableCellElement;
    private sft: HTMLTableCellElement;
    private rel: HTMLTableCellElement;
    private ful: HTMLTableCellElement;
    private str: HTMLTableCellElement;
    private sze: HTMLTableCellElement;
    private crg: HTMLTableCellElement;
    private crw: HTMLTableElement;
    private special: HTMLTableCellElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.name_lbl = document.getElementById("lbl_name") as HTMLLabelElement;
        this.nick_lbl = document.getElementById("lbl_nickname") as HTMLLabelElement;
        this.CreateStatTable();
        this.CreateCrewTable();
    }

    private CreateStatTable() {
        var tbl = document.getElementById("tbl_derived") as HTMLTableElement;
        var h1 = tbl.insertRow();
        this.AddHeader(h1, "Speed").classList.add("thirdwidth");
        this.AddHeader(h1, "Torque").classList.add("thirdwidth");
        this.AddHeader(h1, "Handling").classList.add("thirdwidth");
        var r1 = tbl.insertRow();
        this.spd = this.AddData(r1);
        this.trq = this.AddData(r1);
        this.hnd = this.AddData(r1);
        var h2 = tbl.insertRow();
        this.AddHeader(h2, "Armour");
        this.AddHeader(h2, "Integrity");
        this.AddHeader(h2, "Safety");
        var r2 = tbl.insertRow();
        this.amr = this.AddData(r2);
        this.int = this.AddData(r2);
        this.sft = this.AddData(r2);
        var h3 = tbl.insertRow();
        this.AddHeader(h3, "Reliability");
        this.AddHeader(h3, "Fuel Uses");
        this.AddHeader(h3, "Stress");
        var r3 = tbl.insertRow();
        this.rel = this.AddData(r3);
        this.ful = this.AddData(r3);
        this.str = this.AddData(r3);
        var r4 = tbl.insertRow();
        this.sze = r4.insertCell();
        this.sze.colSpan = 3;
        this.crg = r4.insertCell();
        this.crg.colSpan = 3;
        var r5 = tbl.insertRow();
        this.special = r5.insertCell();
        this.special.colSpan = 6;
    }

    private CreateCrewTable() {
        this.crw = document.getElementById("tbl_crew") as HTMLTableElement;
        var first_row = this.crw.insertRow();
        var fcol = this.AddData(first_row);
        fcol.colSpan = 4;
        fcol.classList.add("tl");
        this.AddHeader(first_row, "Type").colSpan = 1;
        this.AddHeader(first_row, "Vis.").colSpan = 1;
        this.AddHeader(first_row, "Escape").colSpan = 1;
        this.AddHeader(first_row, "Notes").colSpan = 1;
    }

    private AddHeader(row: HTMLTableRowElement, txt: string) {
        var h = document.createElement("TH") as HTMLTableHeaderCellElement;
        row.appendChild(h);
        h.colSpan = 2;
        h.textContent = txt;
        return h;
    }

    private AddData(row: HTMLTableRowElement) {
        var h = row.insertCell();
        h.colSpan = 2;
        return h;
    }

    private CrewLine(name: string, type: string, vis: number, escape: number, notes: string, indent: boolean = false) {
        var r = this.crw.insertRow();
        if (indent) {
            var indent_cell = r.insertCell();
            indent_cell.classList.add("borderless");
        }
        var name_cell = r.insertCell();
        name_cell.textContent = name;
        if (indent) {
            name_cell.colSpan = 3;
        } else {
            name_cell.colSpan = 4;
        }
        r.insertCell().textContent = type;
        r.insertCell().textContent = (vis ?? "-").toString();
        r.insertCell().textContent = (escape ?? "-").toString();
        r.insertCell().textContent = notes;
    }

    public UpdateDisplay(final_stats: Stats) {
        this.name_lbl.innerHTML = StringFmt.Format("<p><span style=\"float:left;\">{0}</span> <span style=\"float:right\">{1}þ</span></p>", "Wandelburg Ausf. I", final_stats.cost);
        this.nick_lbl.innerHTML = StringFmt.Format("<p><span style=\"float:left;\">{0}</span> <span style=\"float:right\">Upkeep {1}þ</span></p>", "The First Tank", final_stats.upkeep);
        this.spd.textContent = final_stats.speed.toString();
        this.trq.textContent = final_stats.torque.toString();
        this.hnd.textContent = final_stats.handling.toString();
        this.amr.textContent = StringFmt.Format("{0}/{1}/{2}", this.vehicle.GetArmourFront(), this.vehicle.GetArmourSide(), this.vehicle.GetArmourRear());
        this.int.textContent = final_stats.integrity.toString();
        this.sft.textContent = final_stats.safety.toString();
        this.rel.textContent = final_stats.reliability.toString();
        this.ful.textContent = final_stats.fuel.toString();
        this.str.textContent = final_stats.stress.toString();
        this.sze.textContent = Volume[Math.min(final_stats.volume, Volume.length - 1)].size.toString() + StringFmt.Format(" ({0} Volume)", final_stats.volume);
        let cargo = this.vehicle.GetCargo();
        let cstring = [];
        if (cargo[0] > 0) {
            cstring.push(StringFmt.Format("{0} Tiny Cargo", cargo[0]));
        }
        if (cargo[1] > 0) {
            cstring.push(StringFmt.Format("{0} Small Cargo", cargo[1]));
        }
        if (cargo[2] > 0) {
            cstring.push(StringFmt.Format("{0} Medium Cargo", cargo[2]));
        }
        if (cargo[3] > 0) {
            cstring.push(StringFmt.Format("{0} Large Cargo", cargo[3]));
        }
        if (cargo[4] > 0) {
            cstring.push(StringFmt.Format("{0} Huge Cargo", cargo[4]));
        }
        if (cstring.length == 0) {
            cstring.push("No Cargo Space");
        }
        this.crg.textContent = StringFmt.Join(", ", cstring);

        final_stats.warnings.sort((a, b) => { return a.color - b.color });
        var warnhtml = "";
        for (let w of final_stats.warnings) {
            switch (w.color) {
                case WARNING_COLOR.RED:
                    warnhtml += "<div style=\"color:#FF0000;\">";
                    break;
                case WARNING_COLOR.YELLOW:
                    warnhtml += "<div style=\"color:#FFFF00;\">";
                    break;
                case WARNING_COLOR.WHITE:
                default:
                    warnhtml += "<div style=\"color:var(--inp_txt_color);;\">";
                    break;
            }
            warnhtml += w.source + ":  " + w.warning + "</div>";
        }
        this.special.innerHTML = warnhtml;

        while (this.crw.rows.length > 1) {
            this.crw.deleteRow(1);
        }
        var crewlist = this.vehicle.GetCrewList();
        for (let c of crewlist) {
            let enclosure = "Exposed";
            if (c.enclosed) {
                enclosure = "Closed";
                if (c.sealed) {
                    enclosure = "Sealed"
                }
            }
            let notes = [];
            // TODO: New Notes
            // if (c.weapon_idx >= 0) {
            //     notes.push(StringFmt.Format("Weapon Set {0}", c.weapon_idx));
            // }
            if (c.enclosed && c.coupla) {
                notes.push("Hatch");
            }
            //TODO: Vis & Escape
            this.CrewLine(c.name_txt, enclosure, c.GetVisibility(), c.GetEscape(), StringFmt.Join(", ", notes));
            for (let l = 0; l < c.loaders.length; l++) {
                let enclosure = "Exposed";
                if (c.loaders[l].enclosed) {
                    enclosure = "Closed";
                    if (c.loaders[l].sealed) {
                        enclosure = "Sealed"
                    }
                }
                let notes = [];
                if (c.loaders[l].enclosed && c.loaders[l].coupla) {
                    notes.push("Hatch");
                }
                //TODO: Vis & Escape
                this.CrewLine("Loader", enclosure, c.GetVisibility(l), c.GetEscape(l), StringFmt.Join(", ", notes), true);
            }
        }

        // this.CrewLine("Driver", "Closed", -1, -1, "Hatch", false);
        // this.CrewLine("Commander", "Closed", -1, -1, "Hatch", false);
        // this.CrewLine("Gunner", "Closed", -2, -3, "*F. Cannon (Fore)", false);
        // this.CrewLine("Loader", "Closed", -2, -3, "", true);
        // this.CrewLine("x6 MG Crew", "Closed", -3, -3, "x1 WMG each\n(x2 Left, x2 Right, x2 Rear)", false);
        // this.CrewLine("Mechanic", "Sealed", undefined, -2, "Engine Access", false);
    }
}

class MachineryDisp {
    private vehicle: Vehicle;
    private locomotion: HTMLSelectElement;
    private pp_size: HTMLSelectElement;
    private update_type: boolean = true;
    private pp_type: HTMLSelectElement;
    private enlarged_engine: HTMLInputElement;
    private extra_fuel: HTMLInputElement;
    private front_armour: HTMLInputElement;
    private side_armour: HTMLInputElement;
    private rear_armour: HTMLInputElement;
    private prop_span: HTMLSpanElement;
    private propeller: HTMLInputElement;
    private s_cargo: HTMLInputElement;
    private m_cargo: HTMLInputElement;
    private l_cargo: HTMLInputElement;
    private h_cargo: HTMLInputElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;

        this.locomotion = document.getElementById("sel_loco") as HTMLSelectElement;
        for (let pp of this.vehicle.GetPropulsionList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = pp;
            opt.text = pp;
            this.locomotion.append(opt);
        }
        this.locomotion.onchange = () => { this.vehicle.SetPropulsion(this.locomotion.selectedIndex); };

        this.prop_span = document.getElementById("prop_span") as HTMLSpanElement;
        this.propeller = document.getElementById("inp_prop") as HTMLInputElement;
        this.propeller.onchange = () => { this.vehicle.SetPropeller(this.propeller.checked); };

        this.pp_type = document.getElementById("sel_pptype") as HTMLSelectElement;
        this.pp_type.onchange = () => { this.update_type = true; this.vehicle.SetPowerplant(this.pp_type.selectedIndex); };
        for (let pp of this.vehicle.GetPowerplantList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = pp.name;
            opt.text = pp.name;
            this.pp_type.append(opt);
        }

        this.pp_size = document.getElementById("sel_ppsize") as HTMLSelectElement;
        this.pp_size.onchange = () => { this.vehicle.SetPowerplantSize(this.pp_size.selectedIndex); };
        this.SetSizeSel();

        this.enlarged_engine = document.getElementById("inp_enlarge") as HTMLInputElement;
        this.enlarged_engine.min = "0";
        this.enlarged_engine.step = "1";
        this.enlarged_engine.onchange = () => { this.vehicle.SetEnlargeEngine(this.enlarged_engine.valueAsNumber); };

        this.extra_fuel = document.getElementById("inp_fuel") as HTMLInputElement;
        this.extra_fuel.min = "0";
        this.extra_fuel.step = "1";
        this.extra_fuel.onchange = () => { this.vehicle.SetExtraFuel(this.extra_fuel.valueAsNumber); };

        this.front_armour = document.getElementById("inp_farm") as HTMLInputElement;
        this.front_armour.min = "0";
        this.front_armour.step = "1";
        this.front_armour.onchange = () => { this.vehicle.SetArmourFront(this.front_armour.valueAsNumber); };

        this.side_armour = document.getElementById("inp_sarm") as HTMLInputElement;
        this.side_armour.min = "0";
        this.side_armour.step = "1";
        this.side_armour.onchange = () => { this.vehicle.SetArmourSide(this.side_armour.valueAsNumber); };

        this.rear_armour = document.getElementById("inp_rarm") as HTMLInputElement;
        this.rear_armour.min = "0";
        this.rear_armour.step = "1";
        this.rear_armour.onchange = () => { this.vehicle.SetArmourRear(this.rear_armour.valueAsNumber); };

        this.s_cargo = document.getElementById("inp_scargo") as HTMLInputElement;
        this.m_cargo = document.getElementById("inp_mcargo") as HTMLInputElement;
        this.l_cargo = document.getElementById("inp_lcargo") as HTMLInputElement;
        this.h_cargo = document.getElementById("inp_hcargo") as HTMLInputElement;
        this.s_cargo.min = "0";
        this.m_cargo.min = "0";
        this.l_cargo.min = "0";
        this.h_cargo.min = "0";
        this.s_cargo.step = "1";
        this.m_cargo.step = "1";
        this.l_cargo.step = "1";
        this.h_cargo.step = "1";
        this.s_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.m_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.l_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.h_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
    }

    private SetSizeSel() {
        this.update_type = false;
        while (this.pp_size.options.length) {
            this.pp_size.options.remove(0);
        }
        for (let pps of this.vehicle.GetPowerplantSizeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = StringFmt.Format("{0}HP {1}", pps.HP, pps.name);
            opt.text = StringFmt.Format("{0}HP {1}", pps.HP, pps.name);
            this.pp_size.append(opt);
        }
    }

    public UpdateLocomotion() {
        let volume = this.vehicle.GetVolume();
        for (let opt of this.locomotion.options) {
            switch (opt.text) {
                case "Monowheel":
                case "Two-Wheeled":
                    if (volume > 1) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Three-Wheeled":
                case "Four-Wheeled":
                case "Six-Wheeled":
                case "Half-Track":
                case "Continuous Track":
                case "Crawler":
                case "Half-Walker":
                case "Walker":
                    if (volume > 8) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Skids":
                case "Skis":
                    if (volume > 6) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Boat Hull":
                case "Amphibious":
                case "Cable Car":
                case "Sky-Line":
                case "Dorandisch Earthline":
                    break;
                default:
                    console.error("Unknonw Locomotion in MachineryDisp");
            }
            opt.disabled = false;
        }
    }

    public UpdateDisplay() {
        this.locomotion.selectedIndex = this.vehicle.GetPropulsionIdx();
        if (this.vehicle.CanPropeller()) {
            this.prop_span.hidden = false;
        } else {
            this.prop_span.hidden = true;
        }

        this.pp_type.selectedIndex = this.vehicle.GetPowerplantIdx();
        if (this.update_type) {
            this.SetSizeSel();
        }
        this.pp_size.selectedIndex = this.vehicle.GetPowerplantSizeIdx();

        this.enlarged_engine.valueAsNumber = this.vehicle.GetEnlargedEngine();
        this.extra_fuel.disabled = !this.vehicle.CanExtraFuel();
        this.extra_fuel.valueAsNumber = this.vehicle.GetExtraFuel();
        this.front_armour.valueAsNumber = this.vehicle.GetArmourFront();
        this.side_armour.valueAsNumber = this.vehicle.GetArmourSide();
        this.rear_armour.valueAsNumber = this.vehicle.GetArmourRear();

        let cargo = this.vehicle.GetCargo();
        this.s_cargo.valueAsNumber = cargo[1];
        this.m_cargo.valueAsNumber = cargo[2];
        this.l_cargo.valueAsNumber = cargo[3];
        this.h_cargo.valueAsNumber = cargo[4];
        this.UpdateLocomotion();
    }
}

// class Crew {
//     public name: number;
//     public name_txt: string;
//     public enclosed: boolean;
//     public coupla: boolean;
//     public weapon_idx: number;
//     public has_loader: boolean;
//     public is_loader: boolean;
// }

function CreateLabel(txt: string, fore: HTMLElement): HTMLSpanElement {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.textContent = txt;
    fore.id = GenerateID();
    lbl.htmlFor = fore.id;
    span.append(lbl);
    span.append(fore);
    return span;
}

class CrewDisp {
    private vehicle: Vehicle;
    private crewdiv: HTMLDivElement;
    private datalist: HTMLDataListElement;
    private crewline: {
        span: HTMLSpanElement,
        rem: HTMLButtonElement, add: HTMLButtonElement,
        name_span: HTMLSpanElement, name: HTMLInputElement,
        enc_span: HTMLSpanElement, enclosed: HTMLInputElement, coup_span: HTMLSpanElement,
        coupla: HTMLInputElement, seal_span: HTMLSpanElement, seal: HTMLInputElement,
        load_span: HTMLSpanElement, has_loader: HTMLInputElement, loop_front: HTMLInputElement,
        loop_left: HTMLInputElement, loop_right: HTMLInputElement, loop_back: HTMLInputElement, br: HTMLBRElement,
        loader: {
            span: HTMLSpanElement, enc_span: HTMLSpanElement,
            enclosed: HTMLInputElement, coup_span: HTMLSpanElement,
            coupla: HTMLInputElement, seal_span: HTMLSpanElement,
            seal: HTMLInputElement, loop_front: HTMLInputElement,
            loop_left: HTMLInputElement, loop_right: HTMLInputElement, loop_back: HTMLInputElement,
            br: HTMLBRElement
        }[]
    }[] = [];
    private lastline: HTMLSelectElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.crewdiv = document.getElementById("div_crew") as HTMLDivElement;
        this.datalist = document.createElement("DATALIST") as HTMLDataListElement;
        for (let n of CrewType) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = n.name;
            opt.text = n.name;
            this.datalist.append(opt);
        }
        this.datalist.id = "Crew_DataList";
        this.crewdiv.append(this.datalist);
        this.crewdiv.append(document.createElement("BR"));
        this.lastline = document.createElement("SELECT") as HTMLSelectElement;
        for (let n of CrewType) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = n.name;
            opt.text = n.name;
            this.lastline.append(opt);
        }
        this.lastline.onchange = () => {
            this.vehicle.SetCrew(this.vehicle.GetCrewList().length, new Crew(
                this.lastline.options[this.lastline.selectedIndex].text,
                false, false, false, false, false, false, false, [],
                new WeaponMount(0, [false, false, false, false, false], [], false)));
        };
    }

    public UpdateDisplay() {
        this.lastline.remove();
        var list = this.vehicle.GetCrewList();
        while (list.length > this.crewline.length) {
            let idx = this.crewline.length;
            this.crewline.push(this.CreateLine(idx));
        }
        while (this.crewline.length > list.length) {
            let line = this.crewline.pop();
            line.span.remove();
            line.br.remove();
            // for(let ldr of line.loader){
            //     ldr.span.remove();
            //     ldr.br.remove();
            // }
        }

        for (let idx = 0; idx < list.length; idx++) {
            let line = this.crewline[idx];
            let crew = list[idx];

            while (crew.loaders.length > line.loader.length) {
                let loader_idx = line.loader.length;
                let ldr = this.CreateLoader(idx, loader_idx);
                if (line.loader.length == 0) {
                    line.br.insertAdjacentElement("afterend", ldr.span);
                    ldr.span.insertAdjacentElement("afterend", ldr.br);
                } else {
                    line.loader[line.loader.length - 1].br.insertAdjacentElement("afterend", ldr.span);
                    ldr.span.insertAdjacentElement("afterend", ldr.br);
                }
                line.loader.push(ldr);
            }
            while (line.loader.length > crew.loaders.length) {
                let ldr = line.loader.pop();
                ldr.span.remove();
                ldr.br.remove();
            }

            line.name_span.hidden = false;
            line.name.value = crew.name_txt;
            line.enclosed.checked = crew.enclosed;
            if (crew.enclosed) {
                line.coup_span.hidden = false;
                line.seal_span.hidden = false;
                line.coupla.checked = crew.coupla;
                line.seal.checked = crew.sealed;
            } else {
                line.coup_span.hidden = true;
                line.seal_span.hidden = true;
            }
            line.loop_front.checked = crew.loop_front;
            line.loop_left.checked = crew.loop_left;
            line.loop_right.checked = crew.loop_right;
            line.loop_back.checked = crew.loop_back;
            if (crew.weapon_mount.GetNumLoaders() == 0) {
                line.has_loader.disabled = true;
            } else {
                line.has_loader.disabled = false;
            }
            if (crew.weapon_mount.main_idx != 0) {
                line.has_loader.valueAsNumber = crew.loaders.length;
                for (let idx = 0; idx < crew.loaders.length; idx++) {
                    line.loader[idx].span.hidden = false;
                    line.loader[idx].br.hidden = false;
                    line.loader[idx].enclosed.checked = crew.loaders[idx].enclosed;
                    if (crew.loaders[idx].enclosed) {
                        line.loader[idx].coup_span.hidden = false;
                        line.loader[idx].seal_span.hidden = false;
                        line.loader[idx].coupla.checked = crew.loaders[idx].coupla;
                        line.loader[idx].seal.checked = crew.loaders[idx].sealed;
                        line.loader[idx].loop_front.checked = crew.loaders[idx].loop_front;
                        line.loader[idx].loop_left.checked = crew.loaders[idx].loop_left;
                        line.loader[idx].loop_right.checked = crew.loaders[idx].loop_right;
                        line.loader[idx].loop_back.checked = crew.loaders[idx].loop_back;
                    } else {
                        line.loader[idx].coup_span.hidden = true;
                        line.loader[idx].seal_span.hidden = true;
                    }
                }
            }
        }
        this.crewdiv.append(this.lastline);
        this.lastline.selectedIndex = 0;
    }

    private CreateLoader(crew_idx: number, idx: number) {
        let line = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            enc_span: undefined,
            enclosed: document.createElement("INPUT") as HTMLInputElement,
            coup_span: undefined,
            coupla: document.createElement("INPUT") as HTMLInputElement,
            seal_span: undefined,
            seal: document.createElement("INPUT") as HTMLInputElement,
            loop_front: document.createElement("INPUT") as HTMLInputElement,
            loop_left: document.createElement("INPUT") as HTMLInputElement,
            loop_right: document.createElement("INPUT") as HTMLInputElement,
            loop_back: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement,
        };

        line.enc_span = CreateLabel("\u00A0\u00A0Enclosed:", line.enclosed);
        line.coup_span = CreateLabel("\u00A0\u00A0Coupla/Hatch:", line.coupla);
        line.seal_span = CreateLabel("\u00A0Sealed:", line.seal);
        let name = document.createElement("LABEL") as HTMLLabelElement;
        name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Loader&nbsp;";
        let loop_span = CreateLabel("\u00A0\u00A0Loopholes F/L/R/B:", line.loop_front);
        loop_span.append(line.loop_left);
        loop_span.append(line.loop_right);
        loop_span.append(line.loop_back);
        line.span.append(name);
        line.span.append(line.enc_span);
        line.span.append(line.coup_span);
        line.span.append(line.seal_span);
        line.span.append(loop_span);
        line.enclosed.type = "checkbox";
        line.coupla.type = "checkbox";
        line.seal.type = "checkbox";
        line.loop_front.type = "checkbox";
        line.loop_left.type = "checkbox";
        line.loop_right.type = "checkbox";
        line.loop_back.type = "checkbox";
        let oc = () => {
            this.vehicle.SetLoader(crew_idx, idx,
                new Loader(line.enclosed.checked, line.coupla.checked, line.seal.checked,
                    line.loop_front.checked, line.loop_left.checked, line.loop_right.checked, line.loop_back.checked));
        };
        line.enclosed.onchange = oc;
        line.coupla.onchange = oc;
        line.seal.onchange = oc;
        line.loop_front.onchange = oc;
        line.loop_left.onchange = oc;
        line.loop_right.onchange = oc;
        line.loop_back.onchange = oc;
        return line;
    }

    private CreateLine(idx: number) {
        let line = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            name_span: undefined,
            rem: document.createElement("BUTTON") as HTMLButtonElement,
            add: document.createElement("BUTTON") as HTMLButtonElement,
            name: document.createElement("INPUT") as HTMLInputElement,
            enc_span: undefined,
            enclosed: document.createElement("INPUT") as HTMLInputElement,
            coup_span: undefined,
            coupla: document.createElement("INPUT") as HTMLInputElement,
            seal_span: undefined,
            seal: document.createElement("INPUT") as HTMLInputElement,
            loop_front: document.createElement("INPUT") as HTMLInputElement,
            loop_left: document.createElement("INPUT") as HTMLInputElement,
            loop_right: document.createElement("INPUT") as HTMLInputElement,
            loop_back: document.createElement("INPUT") as HTMLInputElement,
            load_span: undefined,
            has_loader: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement,
            loader: []
        };
        line.name_span = CreateLabel("\u00A0\u00A0Name:", line.name);
        line.name.setAttribute("list", this.datalist.id);
        line.rem.textContent = "-";
        line.rem.onclick = () => { this.vehicle.DeleteCrew(idx); };
        line.add.textContent = "+";
        line.add.onclick = () => { this.vehicle.DuplicateCrew(idx); };
        if (idx == 0) {
            line.rem.disabled = true;
            line.add.disabled = true;
        }
        line.name_span.insertAdjacentElement("afterbegin", line.add);
        line.name_span.insertAdjacentElement("afterbegin", line.rem);
        line.enc_span = CreateLabel("\u00A0\u00A0Enclosed:", line.enclosed);
        line.coup_span = CreateLabel("\u00A0\u00A0Coupla/Hatch:", line.coupla);
        line.seal_span = CreateLabel("\u00A0\u00A0Sealed:", line.seal);
        line.load_span = CreateLabel("\u00A0\u00A0Loader:", line.has_loader);
        let loop_span = CreateLabel("\u00A0\u00A0Loopholes F/L/R/B:", line.loop_front);
        loop_span.append(line.loop_left);
        loop_span.append(line.loop_right);
        loop_span.append(line.loop_back);
        line.span.append(line.name_span);
        line.span.append(line.enc_span);
        line.span.append(line.coup_span);
        line.span.append(line.seal_span);
        line.span.append(loop_span);
        line.span.append(line.load_span);
        line.name.type = "text";
        line.enclosed.type = "checkbox";
        line.coupla.type = "checkbox";
        line.seal.type = "checkbox";
        line.loop_front.type = "checkbox";
        line.loop_left.type = "checkbox";
        line.loop_right.type = "checkbox";
        line.loop_back.type = "checkbox";
        line.has_loader.type = "number";
        line.has_loader.step = "1";
        line.has_loader.min = "0";
        let oc = () => {
            this.vehicle.SetCrew(idx, new Crew(line.name.value, line.enclosed.checked,
                line.coupla.checked, line.seal.checked,
                line.loop_front.checked, line.loop_left.checked, line.loop_right.checked, line.loop_back.checked, undefined, undefined));
        };
        let setnum = () => { this.vehicle.SetNumLoaders(idx, line.has_loader.valueAsNumber); };
        line.name.onchange = oc;
        line.enclosed.onchange = oc;
        line.coupla.onchange = oc;
        line.seal.onchange = oc;
        line.loop_front.onchange = oc;
        line.loop_left.onchange = oc;
        line.loop_right.onchange = oc;
        line.loop_back.onchange = oc;
        line.has_loader.onchange = setnum;
        this.crewdiv.append(line.span);
        this.crewdiv.append(line.br);
        return line;
    }
}

class WeaponDisp {
    private vehicle: Vehicle;
    private tbl: HTMLTableElement;
    private wrows: {
        row: HTMLTableRowElement, crew: HTMLLabelElement, main: HTMLSelectElement,
        f: HTMLInputElement, r: HTMLInputElement, b: HTMLInputElement, l: HTMLInputElement, u: HTMLInputElement,
        sec_cell: HTMLTableCellElement, secondary: HTMLSelectElement[], pspan: HTMLSpanElement, shield: HTMLInputElement
    }[];
    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.tbl = document.getElementById("table_weapons") as HTMLTableElement;
        var header = this.tbl.insertRow();
        CreateTH(header, "Crew Position");
        CreateTH(header, "Main Weapon");
        CreateTH(header, "Firing Arcs");
        CreateTH(header, "Secondary Weapons");
        CreateTH(header, "Accessories");
        this.wrows = [];
    }

    public UpdateDisplay() {
        let clist = this.vehicle.GetCrewList();
        while (this.wrows.length > clist.length) {
            let wrow = this.wrows.pop();
            this.tbl.deleteRow(this.tbl.rows.length - 1);
        }
        for (let idx = 0; idx < clist.length; idx++) {
            let citm = clist[idx];
            let witm = citm.weapon_mount;
            if (idx >= this.wrows.length) {
                this.CreateRow(this.wrows.length);
            }
            let wrow = this.wrows[idx];
            wrow.crew.textContent = citm.name_txt;
            wrow.main.selectedIndex = witm.main_idx;
            wrow.f.checked = witm.directions[0];
            wrow.r.checked = witm.directions[1];
            wrow.b.checked = witm.directions[2];
            wrow.l.checked = witm.directions[3];
            wrow.u.checked = witm.directions[4];
            while (wrow.secondary.length > witm.secondary_idx.length + 1) {
                wrow.sec_cell.removeChild(this.wrows[idx].secondary.pop());
                wrow.sec_cell.removeChild(wrow.sec_cell.children[wrow.sec_cell.children.length - 1]);
            }
            for (let idx2 = 0; idx2 < witm.secondary_idx.length; idx2++) {
                if (idx2 == wrow.secondary.length) {
                    let newsec = this.CreateSecondary();
                    newsec.onchange = wrow.f.onchange;
                    wrow.sec_cell.append(newsec);
                    wrow.sec_cell.append(document.createElement("BR"));
                    wrow.secondary.push(newsec);
                }
                wrow.secondary[idx2].selectedIndex = witm.secondary_idx[idx2];
            }
            if (wrow.secondary.length == witm.secondary_idx.length) {
                let newsec = this.CreateSecondary();
                newsec.onchange = wrow.f.onchange;
                wrow.sec_cell.append(newsec);
                wrow.sec_cell.append(document.createElement("BR"));
                wrow.secondary.push(newsec);
            }
            wrow.secondary[witm.secondary_idx.length].selectedIndex = 0;
            wrow.shield.checked = witm.shield;
            if (witm.main_idx == 0) {
                wrow.secondary[0].disabled = true;
                wrow.f.disabled = true;
                wrow.l.disabled = true;
                wrow.r.disabled = true;
                wrow.b.disabled = true;
                wrow.u.disabled = true;
                wrow.shield.disabled = true;
            } else {
                wrow.secondary[0].disabled = false;
                wrow.f.disabled = false;
                wrow.l.disabled = false;
                wrow.r.disabled = false;
                wrow.b.disabled = false;
                wrow.u.disabled = false;
                wrow.shield.disabled = false;
            }
        }
    }

    private CreateSecondary() {
        let sel = document.createElement("SELECT") as HTMLSelectElement;
        for (let w of WeaponList) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = w.name;
            opt.text = w.name;
            sel.append(opt);
        }
        sel.selectedIndex = 0;
        return sel;
    }

    private CreateRow(idx: number) {
        let wrow = {
            row: this.tbl.insertRow(),
            crew: document.createElement("LABEL") as HTMLLabelElement,
            main: document.createElement("SELECT") as HTMLSelectElement,
            f: document.createElement("INPUT") as HTMLInputElement,
            r: document.createElement("INPUT") as HTMLInputElement,
            b: document.createElement("INPUT") as HTMLInputElement,
            l: document.createElement("INPUT") as HTMLInputElement,
            u: document.createElement("INPUT") as HTMLInputElement,
            sec_cell: undefined,
            secondary: [],
            pspan: document.createElement("SPAN") as HTMLSpanElement,
            shield: document.createElement("INPUT") as HTMLInputElement,
        };
        let oc = () => {
            this.vehicle.SetWeapon(idx, new WeaponMount(wrow.main.selectedIndex,
                [wrow.f.checked, wrow.r.checked, wrow.b.checked, wrow.l.checked, wrow.u.checked],
                wrow.secondary.map((value) => { return value.selectedIndex; }), wrow.shield.checked))
        };
        let cell0 = wrow.row.insertCell();
        cell0.append(wrow.crew);
        let cell1 = wrow.row.insertCell();
        cell1.append(wrow.main);
        for (let w of WeaponList) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = w.name;
            opt.text = w.name;
            wrow.main.append(opt);
        }
        let cell2 = wrow.row.insertCell();
        CreateCheckbox("Forward", wrow.f, cell2, true);
        CreateCheckbox("Left", wrow.l, cell2, false);
        CreateCheckbox("Right", wrow.r, cell2, true);
        CreateCheckbox("Backward", wrow.b, cell2, true);
        CreateCheckbox("Upward", wrow.u, cell2, false);
        wrow.main.onchange = oc;
        wrow.f.onchange = oc;
        wrow.r.onchange = oc;
        wrow.b.onchange = oc;
        wrow.l.onchange = oc;
        wrow.u.onchange = oc;
        wrow.sec_cell = wrow.row.insertCell();
        let cell4 = wrow.row.insertCell();
        cell4.append(wrow.pspan);
        CreateCheckbox("Gun Shield", wrow.shield, wrow.pspan, false);
        wrow.shield.onchange = oc;
        this.wrows.push(wrow);

    }
}

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var test = sp.get("test");

    //Weapons bit2
    vehicle_model = new Vehicle();
    vehicle_display = new VehDisp(vehicle_model);
    vehicle_model.CalculateStats();

    SetAnimationEnabled(true);

    window.addEventListener("load", () => {
        scrollToFragment();
        setTimeout(() => { window.onscroll = debounce(SetScroll, 250); }, 1000);
    });

    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            var active = this.classList.toggle("active");
            var content = this.nextElementSibling;
            content = content.nextElementSibling;
            if (!active) {
                content.style.maxHeight = "0px";
            } else {
                content.style.maxHeight = "inherit";
            }
        });
    }
}
window.addEventListener("DOMContentLoaded", init);

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}

var hash = "";
function SetScroll(ev) {
    const IDs = ["Fight", "Machinery", "Crew", "Weapons", "Accessories", "Stats"];
    var newhash = "";
    var off = window.pageYOffset;
    for (let id of IDs) {
        if (document.getElementById(id).offsetTop != 0) {
            if (off > document.getElementById(id).offsetTop) {
                newhash = id;
            } else {
                break;
            }
        }
    }
    if (hash != newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}

var vehicle_model: Vehicle;
var vehicle_display: VehDisp;
