/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />


class PulsejetBuilder {
    public desired_power: number;
    public valve_sel: number;
    public era_sel: number;
    public build_quality: number;
    public overall_quality: number;
    public starter: boolean;
    private technical_power: number;
    public rarity: ENGINE_RARITY;

    readonly EraTable: { name: string, cost: number, drag: number, mass: number, fuel: number, vibe: number, material: number }[] = [
        { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
        { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
        { name: "Roaring 20s", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
        { name: "Coming Storm", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
        { name: "WWII", cost: 0.25, drag: 40, mass: 100, fuel: 1, vibe: 5, material: 24 },
        { name: "Last Hurrah", cost: 0.1, drag: 50, mass: 150, fuel: 0.7, vibe: 6, material: 50 },
    ];
    readonly ValveTable: { name: string, scale: number, rumble: number, designcost: number, reliability: number }[] = [
        { name: "Valved", scale: 1, rumble: 1, designcost: 2, reliability: 1 },
        { name: "Valveless", scale: 1.1, rumble: 0.9, designcost: 1, reliability: 3 },
    ];

    constructor() {
        this.desired_power = 1;
        this.valve_sel = 0;
        this.era_sel = 0;
        this.build_quality = 1;
        this.overall_quality = 1;
        this.starter = false;
        this.rarity = ENGINE_RARITY.CUSTOM;
    }

    private TempMass() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];

        const StarterMass = 0;
        if (this.starter)
            StarterMass = 1;

        const Mass = (this.technical_power / Era.mass) * Valve.scale + StarterMass;
        return Mass;
    }

    private CalcMass() {
        return Math.floor(1.0e-6 + this.TempMass()) + 1;
    }

    private CalcDrag() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];

        const Drag = (this.technical_power / Era.drag) * Valve.scale + 1;
        return Math.floor(1.0e-6 + this.TempMass() + Drag + 1);
    }

    private CalcReliability() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];

        const Reliability = this.technical_power / (Era.material * Valve.reliability * this.overall_quality) - 1;
        return Math.trunc(-Reliability);
    }

    private CalcFuelConsumption() {
        const Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.technical_power * Era.fuel);
    }

    private CalcRumble() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];

        return Math.floor(1.0e-6 + this.technical_power * Valve.rumble / (2 * Era.vibe));
    }

    private CalcCost() {
        const Era = this.EraTable[this.era_sel];

        return Math.floor(1.0e-6 + this.TempMass() * this.build_quality * Era.cost) + 1;
    }

    private VerifyValues() {
        this.desired_power = Math.max(1, Math.floor(this.desired_power));
        this.valve_sel = Math.max(0, Math.min(this.ValveTable.length - 1, this.valve_sel));
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.build_quality = Math.max(0.01, this.build_quality);
        this.overall_quality = Math.max(0.01, this.overall_quality);
        this.build_quality = Math.max(this.build_quality, this.overall_quality);
        this.overall_quality = this.build_quality;
    }

    public DesignCost() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];

        const StarterCost = 0;
        if (this.starter)
            StarterCost = 3;

        const Cost = this.technical_power * Era.cost / Valve.designcost;
        return Math.floor(1.0e-6 + 1 + this.build_quality * (Cost + StarterCost));
    }

    public EngineInputs() {
        const ei = new EngineInputs();

        const valved = "";
        if (this.valve_sel == 0)
            valved = "V";
        ei.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        ei.engine_type = ENGINE_TYPE.PULSEJET;
        ei.era_sel = this.era_sel;
        ei.type = this.valve_sel;
        ei.power = this.desired_power;
        ei.starter = this.starter;
        ei.quality_cost = this.build_quality;
        ei.quality_rely = this.overall_quality;
        ei.rarity = this.rarity;
        return ei;
    }

    public EngineStats() {
        const estats = new EngineStats();

        this.VerifyValues();

        const valved = "";
        if (this.valve_sel == 0)
            valved = "V";

        estats.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        estats.stats.power = this.desired_power;
        // this.technical_power = Math.floor(1.0e-6 + this.desired_power * 4 / 3);
        this.technical_power = this.desired_power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.rumble = this.CalcRumble();
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 29;
        estats.pulsejet = true;
        estats.stats.era.push({ name: estats.name, era: lu(num2era(this.era_sel)) });
        estats.rarity = this.rarity;

        return estats;
    }
}