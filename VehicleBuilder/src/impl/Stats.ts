enum SizeEnum {
    None = "None",
    Tiny = "Tiny",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    Huge = "Huge"
}

export enum WARNING_COLOR {
    WHITE,
    YELLOW,
    RED,
}

export class Stats {
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
    public walker_torque = 0;

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

export var PowerplantSize: { HP: number, name: string, speed: number, fuel: number, upkeep: number, reliability: number, cost: number, special: string[] }[] = [
    { HP: 10, name: "Motorcycle", speed: 3, fuel: 15, upkeep: 0, reliability: 2, cost: -1, special: ["Gains 2 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 20, name: "Sedan", speed: 4, fuel: 13, upkeep: 0, reliability: 2, cost: 0, special: ["Gains 2 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 40, name: "Sports Car", speed: 5, fuel: 12, upkeep: 0, reliability: 1, cost: 1, special: ["Gains 2 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
    { HP: 60, name: "Truck", speed: 6, fuel: 11, upkeep: 0, reliability: 1, cost: 2, special: ["Gains 2 Fuel Uses instead of 1 when refuelling from jerry cans and other sources."] },
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

export const PowerplantType: { name: string, stress?: number, cost?: number, speed?: number, torque?: number, reliability?: number, volume?: number, integrity?: number, handling?: number, special: string[], powerplants: { HP: number, name: string, speed?: number, cost?: number, fuel?: number, reliability?: number, upkeep?: number, special: string[] }[] }[] = [
    {
        name: "Human Powered", stress: 1, integrity: 5, powerplants: [
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
    { name: "Steam", cost: -2, speed: -2, torque: 2, stress: 1, reliability: 2, volume: 1, integrity: -5, powerplants: HalfFuel, special: ["At 7 Wear, pushes Burn Out as the boiler explodes!", "1 Capacity of coal is 3 Fuel Uses."] },
    {
        name: "Electric", cost: 3, speed: 1, torque: -1, handling: 5, powerplants: HalfFuel, special: ["Auto-pass Crank Start.", "Cannot Gun the Engine.", "Must recharge in town or with a generator.", "Can be Concealed with the engine on(when stationary)."]
    },
    {
        name: "Clockwork", cost: 2, integrity: 5, powerplants: HalfFuel, special: ["Auto-pass Crank Start.", "Does not burn at 7 Wear.", "On Check Engine, cannot choose to take Wear or shut down; this is replaced with \"Spend 1 Fuel Use (repeatable)\".", "Must recharge in town or with a generator."]
    }
];
export const PropulsionType = [
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

export const Volume: { size: SizeEnum, handling: number, speedmod: number, maxHP: number, integrity: number }[] = [
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
