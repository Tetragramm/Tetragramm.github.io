/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />


class PulsejetBuilder {
    public desired_power: number;
    public valve_sel: number;
    public era_sel: number;
    public build_quality: number;
    public overall_quality: number;
    public starter: boolean;

    readonly EraTable: { name: string, cost: number, drag: number, mass: number, fuel: number, vibe: number, material: number }[] = [
        { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
        { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
        { name: "Interbellum", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
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
    }

    private TempMass() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var StarterMass = 0;
        if (this.starter)
            StarterMass = 1;

        var Mass = (this.desired_power / Era.mass) * Valve.scale + StarterMass;
        return Mass;
    }

    private CalcMass() {
        return Math.floor(1.0e-6 + this.TempMass()) + 1;
    }

    private CalcDrag() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var Drag = (this.desired_power / Era.drag) * Valve.scale + 1;
        return Math.floor(1.0e-6 + this.TempMass() + Drag + 1);
    }

    private CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var Reliability = this.desired_power / (Era.material * Valve.reliability * this.overall_quality) - 1;
        return Math.trunc(-Reliability);
    }

    private CalcFuelConsumption() {
        var Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.desired_power * Era.fuel);
    }

    private CalcRumble() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        return Math.floor(1.0e-6 + this.desired_power * Valve.rumble / (2 * Era.vibe));
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];

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
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var StarterCost = 0;
        if (this.starter)
            StarterCost = 3;

        var Cost = this.desired_power * Era.cost / Valve.designcost;
        return Math.floor(1.0e-6 + 1 + this.build_quality * (Cost + StarterCost));
    }

    public EngineInputs() {
        var ei = new EngineInputs();

        var valved = "";
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
        return ei;
    }

    public EngineStats() {
        var estats = new EngineStats();

        this.VerifyValues();

        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";

        estats.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        estats.stats.power = this.desired_power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.rumble = this.CalcRumble();
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 3;
        estats.pulsejet = true;

        return estats;
    }
}