/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />


class TurboBuilder {
    public name: string;
    public era_sel: number; //Era
    public type_sel: number;
    private fuel_heat_value: number; // kJ/kg
    public flow_adjustment: number; // 0-1
    public diameter: number; // m
    public compression_ratio: number; //1+
    public bypass_ratio: number;//0+
    public afterburner: boolean;

    public kN: number;
    public tsfc: number;

    readonly TypeTable: { name: string, efficiency: number, massfactor: number, costfactor: number, }[] = [
        { name: "Turbojet", efficiency: 0, massfactor: 0.8, costfactor: 1 },
        { name: "Turbofan", efficiency: 0, massfactor: 1., costfactor: 1 },
        { name: "Propfan", efficiency: -9, massfactor: 0.8, costfactor: 1 },
        { name: "Turboprop", efficiency: -3, massfactor: 0.8, costfactor: 1 },
    ];

    readonly EraTable: { name: string, max_temp: number, efficiency: number, costfactor: number, }[] = [
        { name: "Gen 1 1945-1955", max_temp: 1100, efficiency: -2, costfactor: 0.5 },
        { name: "Gen 1.5 1955-1965", max_temp: 1100, efficiency: -1, costfactor: 0.6 },
        { name: "Gen 2 1965-1975", max_temp: 1400, efficiency: -1, costfactor: 0.7 },
        { name: "Gen 2.5 1975-1985", max_temp: 1400, efficiency: 0, costfactor: 0.8 },
        { name: "Gen 3 1985-1995", max_temp: 1800, efficiency: 0, costfactor: 0.9 },
        { name: "Gen 3.5 1995-2005", max_temp: 1800, efficiency: 1, costfactor: 1.0 },
        { name: "Gen 4 2005-2015", max_temp: 2000, efficiency: 1, costfactor: 1.1 },
        { name: "Gen 4.5 2015-2025", max_temp: 2000, efficiency: 2, costfactor: 1.2 },
        { name: "Gen 0 Himmilgard", max_temp: 800, efficiency: -10, costfactor: 0.5 },
    ];

    constructor() {
        this.name = "Default";
        this.era_sel = 0;
        this.type_sel = 0;
        this.fuel_heat_value = 43020;
        this.flow_adjustment = 0;
        this.diameter = 0.89;
        this.compression_ratio = 3.5;
        this.bypass_ratio = 0;
        this.afterburner = false;
    }

    private TempMass() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];

        var tmass = Math.log2(this.compression_ratio) * Math.PI * Math.pow(this.diameter / 2, 2) * 1.75 * 361.75 / (1 + this.bypass_ratio / 3) * Type.massfactor;
        return 0.75 * tmass;
    }

    private CalcMass() {
        var tmass = this.TempMass();
        //Turbofan fit.  Using list from jet-engines.net and an excel curve to align them.
        if (this.type_sel == 1) {
            tmass = tmass * (0.4833 * Math.log(this.compression_ratio) - 0.3168);
        }
        var mass = tmass / 25 + 95.684 * this.flow_adjustment
        //Turboprop fit.  Using list from jet-engines.net and an excel curve to align them.
        //Because turboprops have too much variation, some end up negative. So needs to be done here.
        if (this.type_sel == 2 || this.type_sel == 3) {
            var x = 0.5 - this.flow_adjustment;
            mass = Math.abs(mass) * (19.74 * Math.pow(x, 3) - 11.462 * x * x + 1.0666 * x + 0.4333);
        }
        return Math.max(1, Math.floor(1.0e-6 + mass));
    }

    private CalcDrag() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];

        return Math.floor(1.0e-6 + 5 * Math.PI * Math.pow(this.diameter / 2.0, 2));
    }

    private CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];

        var Reliability = - Math.log2(this.compression_ratio) - 20 * this.flow_adjustment;
        return Math.trunc(Reliability + 1);
    }

    private CalcStages() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];
        const M = 0.0;
        const a0 = 340.3;
        const Pa = 108.9; //Ambient Pressure
        const Ta = 288.15; //Ambient Temp
        const Cp = 1.006; //Specific Heat at Constant Pressure
        const y = 1.4; //Specific Heat
        const fan_pressure_ratio = 1.6;
        const area = Math.PI * Math.pow(this.diameter / 2, 2);
        const net_efficiency = 0.8 + (Era.efficiency + Type.efficiency) / 20.0 + this.flow_adjustment;

        var P3 = Pa * this.compression_ratio;
        var T3 = Ta * Math.pow(P3 / Pa, (y - 1) / y);

        var Tr = 1 + (y - 1) / 2 * M * M;
        var Ty = Era.max_temp / Ta;
        var Tc = Math.pow(this.compression_ratio, 1 - 1 / y);
        var ST11 = a0 * (Math.sqrt((2 * Tr) / (y - 1) * (Ty / (Tr * Tc) - 1) * (Tc - 1) + Ty / (Tr * Tc) * M * M) - M) * net_efficiency / 1000;
        var Tcp = Math.pow(fan_pressure_ratio, 1 - 1 / y);
        var ST13 = a0 * (Math.sqrt(2 / (y - 1) * (Tr * Tcp - 1)) - M) * net_efficiency / 1000;
        var f = (Cp * Ta / this.fuel_heat_value) * (Era.max_temp / Ta - T3 / Ta);
        var ST = ST11 / (1 + this.bypass_ratio) + this.bypass_ratio * ST13 / (1 + this.bypass_ratio);
        var TSFC11 = f / ((1 + this.bypass_ratio) * ST) * 1000;

        var C2 = Pa * area * this.MFP(1) / ((1 + f));
        var mc2 = this.compression_ratio * C2 * Math.sqrt(1 / Era.max_temp) * net_efficiency;
        if (!isFinite(ST) || !isFinite(mc2) || !isFinite(TSFC11)) {
            ST = 0;
            mc2 = 0;
            TSFC11 = 0;
        }
        console.log(Era.max_temp);
        return { thrust: ST * mc2, fuel: TSFC11 * ST * mc2 };
    }

    private MFP(M: number) {
        const R = 287.058 / 1000; //Gas Constant
        const y = 1.4; //Specific Heat
        return Math.sqrt(y / R) * M * Math.pow(1 + (y - 1) / 2 * M * M, (y + 1) / (2 * (y - 1)));
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Type = this.TypeTable[this.type_sel];

        return Math.floor(1.0e-6 + this.TempMass() * 0.5 * (1 + this.flow_adjustment) * Era.costfactor * Type.costfactor) + 1;
    }

    private VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.type_sel = Math.max(0, Math.min(this.TypeTable.length - 1, this.type_sel));
        this.flow_adjustment = Math.max(-0.5, Math.min(0.5, this.flow_adjustment));
        this.diameter = Math.max(0.1, this.diameter);
        this.compression_ratio = Math.max(1, this.compression_ratio);
        this.bypass_ratio = Math.max(0, this.bypass_ratio);
        this.bypass_ratio = Math.min(20, this.bypass_ratio);
        if (this.type_sel > 2) {
            this.afterburner = false;
        }
    }

    public EngineInputs() {
        var ei = new EngineInputs();

        ei.name = this.name;
        ei.engine_type = ENGINE_TYPE.TURBOMACHINERY;
        ei.era_sel = this.era_sel;
        ei.type = this.type_sel;
        ei.flow_adjustment = this.flow_adjustment;
        ei.diameter = this.diameter;
        ei.compression_ratio = this.compression_ratio;
        ei.bypass_ratio = this.bypass_ratio;
        ei.upgrades[0] = this.afterburner;
        return ei;
    }

    private GetPitchSpeed() {
        if (this.bypass_ratio >= 8)
            return 1;
        if (this.bypass_ratio >= 3.5)
            return 1.1;
        if (this.bypass_ratio >= 1)
            return 1.2;
        return 1.3;
    }

    public EngineStats() {
        var estats = new EngineStats();

        this.VerifyValues();
        var tf = this.CalcStages();
        this.kN = tf.thrust;
        this.tsfc = tf.fuel / tf.thrust;
        estats.name = this.name;
        estats.stats.power = Math.round(tf.thrust * 1000 / 89);
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = Math.round(10 * 20 * tf.fuel / 1000);
        estats.rumble = 0;
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 59;
        if (this.era_sel == 8) {
            estats.stats.era.push({ name: estats.name, era: lu(num2era(-1)) });
        } else {
            estats.stats.era.push({ name: estats.name, era: lu(num2era(5)) });
        }
        estats.stats.pitchspeed = this.GetPitchSpeed();

        return estats;
    }
}