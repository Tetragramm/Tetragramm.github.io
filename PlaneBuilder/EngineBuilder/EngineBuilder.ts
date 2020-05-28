/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />

enum CompressorEnum {
    NONE,
    ALTITUDE_THROTTLE,
    SUPERCHARGER,
    TURBOCHARGER,
}
class EngineBuilder {
    readonly EraTable: { name: string, materials: number, cost: number, maxRPM: number, powerdiv: number, fuelfactor: number, IAF: number }[] = [
        { name: "Pioneer", materials: 3, cost: 0.5, maxRPM: 30, powerdiv: 8, fuelfactor: 10, IAF: 29 },
        { name: "WWI", materials: 2, cost: 1, maxRPM: 35, powerdiv: 7, fuelfactor: 8, IAF: 39 },
        { name: "Interbellum", materials: 1.5, cost: 2, maxRPM: 40, powerdiv: 6, fuelfactor: 6, IAF: 49 },
        { name: "WWII", materials: 1.25, cost: 2.5, maxRPM: 45, powerdiv: 5, fuelfactor: 4, IAF: 49 },
        { name: "Last Hurrah", materials: 1, cost: 3, maxRPM: 50, powerdiv: 4, fuelfactor: 2, IAF: 49 },
    ];
    readonly CoolingTable: { name: string, forcefactor: number, RPMoff: number, thrustfactor: number, radiator: number, massfactor: number }[] = [
        { name: "Liquid Cooled", forcefactor: 1.2, RPMoff: 0, thrustfactor: 1, radiator: 1, massfactor: 1 },
        { name: "Air Cooled", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
        { name: "Rotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.5, radiator: 0, massfactor: 1 },
        { name: "Contrarotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.25, radiator: 0, massfactor: 1 },
        { name: "Semi-Radial", forcefactor: 0.8, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
        { name: "Liquid Radial", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 2.5, massfactor: 1.3 },
    ];
    readonly CompressorTable: { name: string }[] = [
        { name: "None" },
        { name: "Altitude Throttle" },
        { name: "Supercharger" },
        { name: "Turbocharger" },
    ]
    readonly Upgrades: { name: string, powerfactor: number, fuelfactor: number, massfactor: number, dragfactor: number, idealalt: number, costfactor: number, reqsection: boolean }[] = [
        //{ name: "Supercharger", powerfactor: 0.1, fuelfactor: 0.25, massfactor: 0.2, dragfactor: 0.5, idealalt: 3, costfactor: 6, reqsection: false },
        //{ name: "Turbocharger", powerfactor: 0.25, fuelfactor: 0, massfactor: 0.5, dragfactor: 0.5, idealalt: 4, costfactor: 8, reqsection: true },
        { name: "Asperator Boost", powerfactor: 0.11, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: -1, costfactor: 3, reqsection: false },
        { name: "War Emergency Power", powerfactor: 0, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 5, reqsection: false },
        { name: "Fuel Injector", powerfactor: 0, fuelfactor: -0.1, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 2, reqsection: false },
        { name: "Diesel", powerfactor: -0.2, fuelfactor: -0.5, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 0, reqsection: false },
    ];


    public name: string;
    public era_sel: number;
    public cool_sel: number;
    public compressor_type: CompressorEnum;
    public compressor_count: number;
    public min_IAF: number;
    public upg_sel: boolean[];
    public engine_displacement: number;
    public num_cyl_per_row: number;
    public num_rows: number;
    public compression_ratio: number;
    public rpm_boost: number;
    public material_fudge: number;
    public quality_fudge: number;


    constructor() {
        this.name = "Default Name";
        this.era_sel = 0;
        this.cool_sel = 0;
        this.upg_sel = [...Array(this.Upgrades.length).fill(false)];
        this.engine_displacement = 1;
        this.num_cyl_per_row = 2;
        this.num_rows = 2;
        this.compression_ratio = 2;
        this.rpm_boost = 1;
        this.material_fudge = 1;
        this.quality_fudge = 1;

        this.compressor_type = CompressorEnum.NONE;
        this.compressor_count = 0;
        this.min_IAF = 0;
    }

    public CanUpgrade() {
        var can_upg = [...Array(this.Upgrades.length).fill(true)];
        if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            can_upg[0] = false;
            can_upg[1] = false;
            can_upg[2] = false;
        }
        return can_upg;
    }

    private UpgradePower() {
        var power = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                power += this.Upgrades[i].powerfactor;
        }
        if (this.upg_sel[0]) {
            power *= 1 + this.Upgrades[0].powerfactor;
        }
        return power;
    }

    private RPM() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        return (Era.maxRPM - Cool.RPMoff) * (this.compression_ratio / 10);
    }

    public GearedRPM() {
        var GearedRPM = this.RPM() * this.rpm_boost;
        return GearedRPM;
    }

    private CalcPower() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        //Calculate Force
        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var RawForce = EngineForce * this.UpgradePower();
        //Output Force
        var OutputForce = RawForce * (this.GearedRPM() / 10);
        return Math.floor(1.0e-6 + OutputForce / Era.powerdiv);
    }

    private UpgradeMass() {
        var mass = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                mass += this.Upgrades[i].massfactor;
        }
        return mass;
    }

    private CalcMass() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        var CylMass = this.engine_displacement ** 2 * this.compression_ratio / 1000;
        var CrankMass = (this.engine_displacement * this.num_rows) / 10 + 1;
        var PistMass = this.engine_displacement / 5;

        var Mass = Math.floor(1.0e-6 + (CylMass + CrankMass + PistMass) * this.UpgradeMass() * this.material_fudge * Cool.massfactor);
        return Mass;
    }

    private UpgradeDrag() {
        var drag = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                drag += this.Upgrades[i].dragfactor;
        }
        return drag;
    }

    private CoolDrag() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 1;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return this.GearedRPM() / 10;
            case "Contrarotary":
                return this.GearedRPM() / 8;
            case "Semi-Radial":
                return 1;
            case "Liquid Radial":
                return 1.2;
        }
        throw "Error in CoolDrag, no valid switch case.";
    }

    private CalcDrag() {
        var RawDrag = 3 + (this.engine_displacement / this.num_rows) / 3;
        return Math.floor(1.0e-6 + RawDrag * this.CoolDrag() * this.UpgradeDrag());
    }

    private CoolReliability() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return (this.num_rows / 2 + 5 * this.num_cyl_per_row) / 10;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return 1;
            case "Contrarotary":
                return 1.1;
            case "Semi-Radial":
                return 0.8;
            case "Liquid Radial":
                return 1;
        }
        throw "Error in CoolReliability, no valid switch case.";
    }

    private CoolBurnout() {
        var EraBurnout = this.EraTable[this.era_sel].materials / 2;
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 2;
            case "Air Cooled":
                return (2 + (this.num_rows ** 2)) * EraBurnout;
            case "Rotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Contrarotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Semi-Radial":
                return (2 + (this.num_rows ** 2) / 2) * EraBurnout;
            case "Liquid Radial":
                return 0.5;
        }
        throw "Error in CoolBurnout, no valid switch case.";
    }

    private MaterialModifier() {
        var EraBurnout = this.EraTable[this.era_sel].materials;
        var num_cyl = this.num_cyl_per_row * this.num_rows;
        var CylinderBurnout = this.engine_displacement / num_cyl * (this.compression_ratio ** 2) * EraBurnout;
        var GearingBurnout = this.rpm_boost * CylinderBurnout * this.CoolBurnout();
        return GearingBurnout * this.rpm_boost / (this.material_fudge + this.quality_fudge - 1);
    }

    private CalcReliability() {
        var Reliability = 6 - this.MaterialModifier() * this.CoolReliability() / 25;
        return Math.trunc(Reliability);
    }

    private IsRotary() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary"
            || this.CoolingTable[this.cool_sel].name == "Contrarotary")
            return true;
        return false;
    }

    private CalcCooling() {
        if (this.IsRotary())
            return 0;

        return Math.floor(1.0e-6 + this.MaterialModifier() / 20 * this.CoolingTable[this.cool_sel].radiator);
    }

    private CalcOverspeed() {
        return Math.round(1.5 * this.RPM())
    }

    private UpgradeFuel() {
        var fuel = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                fuel += this.Upgrades[i].fuelfactor;
        }
        return fuel * this.EraTable[this.era_sel].fuelfactor;
    }

    private CalcFuelConsumption() {
        var FuelConsumption = this.engine_displacement * this.RPM() / 100;
        return Math.floor(1.0e-6 + FuelConsumption * this.UpgradeFuel());
    }

    private CalcAltitude() {
        var alt = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                alt += this.Upgrades[i].idealalt;
        }
        return (3 + alt) * 10 - 1;
    }

    private CoolTorque() {
        if (this.IsRotary()) {
            return this.CalcMass();
        }
        return 1;
    }

    private CalcTorque() {
        return Math.floor(1.0e-6 + (this.CoolTorque() * this.GearedRPM() / 5) / 4);
    }

    private UpgradeCost() {
        var cost = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                cost += this.Upgrades[i].costfactor;
        }
        return cost;
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var CylinderForce = EngineForce / (this.num_rows * this.num_cyl_per_row);
        var Cost = this.UpgradeCost() + (CylinderForce / 10 * (this.num_cyl_per_row + (this.num_rows * 1.3)));

        return Math.floor(1.0e-6 + this.quality_fudge * Era.cost * Cost);
    }

    private VerifyValues() {
        this.engine_displacement = Math.max(0.01, this.engine_displacement);
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.cool_sel = Math.max(0, Math.min(this.CoolingTable.length - 1, this.cool_sel));
        this.num_cyl_per_row = Math.floor(Math.max(1, this.num_cyl_per_row));
        this.num_rows = Math.floor(Math.max(1, this.num_rows));
        this.compression_ratio = Math.max(0.01, this.compression_ratio);
        this.rpm_boost = Math.max(0.01, this.rpm_boost);
        this.material_fudge = Math.max(0.5, this.material_fudge);
        this.quality_fudge = Math.max(0.5, this.quality_fudge);


        this.min_IAF = 10 * Math.round(1.0e-6 + this.min_IAF / 10);
        this.compressor_count = Math.floor(1.0e-6 + this.compressor_count);

        if (this.compressor_type == CompressorEnum.NONE) {
            this.compressor_count = 0;
            this.min_IAF = 0;
        } else if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            this.compressor_count = 1;
            this.min_IAF = 0;
            this.upg_sel[0] = false;
            this.upg_sel[1] = false;
            this.upg_sel[2] = false;
        } else {
            this.min_IAF = Math.max(0, this.min_IAF);
            this.compressor_count = Math.max(1, this.compressor_count);
        }
    }

    public EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;

        this.VerifyValues();

        estats.stats.power = this.CalcPower();
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.cooling = this.CalcCooling();
        estats.oiltank = this.IsRotary();
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.altitude = this.CalcAltitude();
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;

        switch (this.compressor_type) {
            case CompressorEnum.NONE: {
                break;
            }
            case CompressorEnum.ALTITUDE_THROTTLE: {
                estats.stats.cost += 3;
                estats.altitude = 49;
                estats.stats.warnings.push({
                    source: "Altitude Throttle",
                    warning: "This engine has the WEP upgrade at Altitudes 0-10."
                });
                break;
            }
            case CompressorEnum.SUPERCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.fuelconsumption = Math.floor(1.0e-6 + 1.25 * estats.stats.fuelconsumption);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += this.min_IAF / 10;
                estats.stats.cost += Math.floor(1.0e-6 + estats.stats.power / 50);
                var extra = this.compressor_count - 1;
                estats.altitude = 29 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                break;
            }
            case CompressorEnum.TURBOCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += 2 * (this.min_IAF / 10);
                estats.stats.cost += Math.floor(1.0e-6 + estats.stats.power / 50);
                var extra = this.compressor_count - 1;
                estats.altitude = 49 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                estats.stats.reqsections += 1;
                break;
            }
        }

        estats.input_eb.RPM_boost = this.rpm_boost;
        estats.input_eb.compression = this.compression_ratio;
        estats.input_eb.compressor_count = this.compressor_count;
        estats.input_eb.compressor_type = this.compressor_type;
        estats.input_eb.cyl_per_row = this.num_cyl_per_row;
        estats.input_eb.rows = this.num_rows;
        estats.input_eb.displacement = this.engine_displacement;
        estats.input_eb.era_sel = this.era_sel;
        estats.input_eb.material_fudge = this.material_fudge;
        estats.input_eb.min_IAF = this.min_IAF;
        estats.input_eb.quality_fudge = this.quality_fudge;
        estats.input_eb.type = this.cool_sel;
        estats.input_eb.upgrades = this.upg_sel;

        return estats;
    }
}