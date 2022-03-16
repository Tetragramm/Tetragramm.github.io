/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />

class ElectricBuilder {
    readonly EraTable:
        { name: string, draw: number, drawfactor: number, massfactor: number, reliability: number, costfactor: number, overspeed: number }[] = [
            { name: "Pioneer", draw: 3, drawfactor: 2 / 5, massfactor: 2 / 5, reliability: -1, costfactor: 1 / 2.5, overspeed: 20, },
            { name: "WWI", draw: 1, drawfactor: 2 / 5, massfactor: 1 / 3, reliability: 0, costfactor: 1 / 2.25, overspeed: 25, },
            { name: "Roaring 20s", draw: 1, drawfactor: 2 / 7, massfactor: 2 / 7, reliability: 1, costfactor: 1 / 2, overspeed: 30, },
            { name: "Coming Storm", draw: 0, drawfactor: 2 / 7, massfactor: 1 / 4, reliability: 2, costfactor: 1 / 1.9, overspeed: 35, },
            { name: "WWII", draw: 0, drawfactor: 1 / 4, massfactor: 1 / 5, reliability: 3, costfactor: 1 / 1.8, overspeed: 40, },
            { name: "Last Hurrah", draw: 0, drawfactor: 1 / 5, massfactor: 1 / 6, reliability: 4, costfactor: 1 / 1.75, overspeed: 45, },
        ];

    readonly Winding: { name: string, drawmod: number, mass: number, drag: number, costfactor: number, reliabilty: number }[] = [
        { name: "Aluminum", drawmod: 1.1, mass: -2, drag: 1, costfactor: 1, reliabilty: 0 },
        { name: "Copper", drawmod: 1, mass: 0, drag: 0, costfactor: 1, reliabilty: 0 },
        { name: "Silver", drawmod: 0.95, mass: 1, drag: 0, costfactor: 1.1, reliabilty: 0 },
        { name: "Electrum", drawmod: 0.9, mass: 2, drag: 0, costfactor: 1.3, reliabilty: 1 },
        { name: "Platinum", drawmod: 0.75, mass: 3, drag: 0, costfactor: 2, reliabilty: 2 },
        { name: "Screamer Sinew", drawmod: 0.9, mass: 0, drag: 1, costfactor: 1.75, reliabilty: 4 },
        { name: "Lightning Sprite Ephemera", drawmod: 0.5, mass: -2, drag: -2, costfactor: 2, reliabilty: -3 },
    ];


    public name: string;
    public era_sel: number;
    public winding_sel: number;
    public power: number;
    public chonk: number;
    public quality_fudge: number;


    constructor() {
        this.name = "Default";
        this.era_sel = 0;
        this.winding_sel = 0;
        this.power = 1;
        this.chonk = 1;
        this.quality_fudge = 1;
    }

    private EraMass() {
        var Era = this.EraTable[this.era_sel];

        var EraMass = Math.floor(1.0e-6 + Era.massfactor * this.power);
        return EraMass;
    }

    private CalcMass() {
        var Winding = this.Winding[this.winding_sel];

        var Mass = Math.max(0, Math.floor(1.0e-6 + this.EraMass() + Winding.mass));
        return Mass;
    }

    private CalcDrag() {
        var RawDrag = this.power / 10;
        var WindingDrag = this.Winding[this.winding_sel].drag;

        return Math.max(1, Math.floor(1.0e-6 + 1 + RawDrag + this.chonk + WindingDrag));
    }

    private CalcOverspeed() {
        var ChonkSpeed = this.chonk / 2;
        var QualitySpeed = 7.5 * (this.quality_fudge - 1);
        return Math.ceil(-1.0e-6 + this.EraTable[this.era_sel].overspeed - ChonkSpeed + QualitySpeed);
    }

    private CalcDraw() {
        var Era = this.EraTable[this.era_sel];
        var Winding = this.Winding[this.winding_sel];

        var era_draw = Era.draw + Math.ceil(-1.0e-6 + this.power * Era.drawfactor);
        return Math.ceil(-1.0e-6 + era_draw * Winding.drawmod);
    }

    private CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Winding = this.Winding[this.winding_sel];

        var power_rely = this.power / 10;
        var quality_rely = 5 * (this.quality_fudge - 1);

        return Math.trunc(1.0e-6 + Era.reliability + this.chonk - power_rely + quality_rely) + Winding.reliabilty;
    }

    private CalcTorque() {
        var Torque = 1 + this.EraMass() / 10 + this.chonk / 4;
        return Math.max(1, Math.floor(1.0e-6 + Torque));
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Winding = this.Winding[this.winding_sel];

        var era_cost = Era.costfactor * this.power;
        var base_cost = Math.ceil(-1.0e-6 + era_cost * Math.max(0.5, this.quality_fudge));
        return Math.ceil(-1.0e-6 + base_cost * Winding.costfactor);
    }

    private VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.winding_sel = Math.max(0, Math.min(this.Winding.length - 1, this.winding_sel));
        this.power = Math.max(1, this.power);
        this.power = Math.floor(1.0e-6 + this.power);
        this.chonk = Math.floor(1.0e-6 + this.chonk);
        this.chonk = Math.max(-10, this.chonk);
        this.chonk = Math.min(10.0, this.chonk);
        this.quality_fudge = Math.max(0.5, this.quality_fudge);
        this.quality_fudge = Math.min(2.0, this.quality_fudge);
    }

    public EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;

        this.VerifyValues();

        estats.stats.power = this.power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.cooling = 0;
        estats.oiltank = false;
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = 0;
        estats.stats.charge = -this.CalcDraw();
        estats.altitude = 100;
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        estats.stats.era.push({ name: this.name, era: lu(num2era(this.era_sel)) });

        return estats;
    }

    public EngineInputs() {
        var ei = new EngineInputs();
        ei.engine_type = ENGINE_TYPE.ELECTRIC;
        ei.name = this.name;
        ei.power = this.power;
        ei.era_sel = this.era_sel;
        ei.winding_sel = this.winding_sel;
        ei.material_fudge = this.chonk;
        ei.quality_fudge = this.quality_fudge;
        return ei;
    }
}