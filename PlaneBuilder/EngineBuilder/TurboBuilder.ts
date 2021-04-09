/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />


class TurboBuilder {
    public name: string;
    public era_sel: number; //ERa
    public fuel_heat_value: number; // kJ/kg
    public max_turbine_temp: number; // K
    public base_efficiency: number; // 0-1
    public diameter: number; // m
    public compression_ratio: number; //1+
    public fan_pressure_ratio: number; //0+
    public bypass_ratio: number;//0+
    public quality_fudge: number;


    readonly EraTable: { name: string, cost: number, drag: number, mass: number, fuel: number, vibe: number, material: number }[] = [
        { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
        { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
        { name: "Roaring 20s", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
        { name: "Coming Storm", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
        { name: "WWII", cost: 0.25, drag: 40, mass: 100, fuel: 1, vibe: 5, material: 24 },
        { name: "Last Hurrah", cost: 0.1, drag: 50, mass: 150, fuel: 0.7, vibe: 6, material: 50 },
    ];

    constructor() {
        this.era_sel = 0;
        this.fuel_heat_value = 43020;
        this.max_turbine_temp = 1023;
        this.base_efficiency = 0.8;
        this.diameter = 0.89;
        this.compression_ratio = 3.5;
        this.fan_pressure_ratio = 0;
        this.bypass_ratio = 0;
        this.quality_fudge = 1;
    }

    private TempMass() {
        var Era = this.EraTable[this.era_sel];

        return this.compression_ratio * this.diameter * 60.515;
    }

    private CalcMass() {
        return Math.max(1, Math.floor(1.0e-6 + this.TempMass()));
    }

    private CalcDrag() {
        var Era = this.EraTable[this.era_sel];

        return Math.floor(1.0e-6 + 10 * Math.PI * Math.pow(this.diameter / 2.0, 2));
    }

    private CalcReliability() {
        var Era = this.EraTable[this.era_sel];

        var Reliability = 10 - this.compression_ratio / 4 - Math.PI * Math.pow(this.diameter / 2.0, 2);
        return Math.trunc(Reliability + this.quality_fudge);
    }

    private CalcStages() {
        const M = 0.0;
        const a0 = 340.3;
        const Pa = 108.9; //Ambient Pressure
        const Ta = 288.15; //Ambient Temp
        const Cp = 1.006; //Specific Heat at Constant Pressure
        const R = 287.058; //Gas Constant
        const y = 1.4; //Specific Heat
        const Lambda = Math.sqrt(y) * Math.pow(2 / (y + 1), (y + 1) / (2 * (y - 1)));
        const area = Math.PI * Math.pow(this.diameter / 2, 2);

        var P3 = Pa * this.compression_ratio;
        var T3 = Ta * Math.pow(P3 / Pa, (y - 1) / y);

        var TT = (this.max_turbine_temp - Ta) + Ta;
        var ST11 = a0 * (Math.sqrt((2 / (y - 1)) * Math.pow(Math.sqrt(TT / Ta) - 1, 2) + M * M) - M) / 1000;
        var Tr = 1 + (y - 1) / 2 * M * M;
        var Ty = TT / Ta;
        var Tc = Math.pow(this.compression_ratio, 1 - 1 / y);
        ST11 = a0 * (Math.sqrt((2 * Tr) / (y - 1) * (Ty / (Tr * Tc) - 1) * (Tc - 1) + Ty / (Tr * Tc) * M * M) - M) * this.base_efficiency / 1000;
        var f = (Cp * Ta / this.fuel_heat_value) * (this.max_turbine_temp / Ta - T3 / Ta);
        var TSFC11 = f / ST11 * 1000;

        var A4 = area * this.fan_pressure_ratio;

        var FRtest = P3 / Math.sqrt(this.max_turbine_temp) * A4 * this.MFP(1);
        console.log(FRtest);
        var FR = this.CalcFlowRate();
        // FR = FR * area;
        return { thrust: ST11 * FR, fuel: TSFC11 * FR };
    }

    private MFP(M: number) {
        const g = 1; // Gravity
        const R = 287.058 / 1000; //Gas Constant
        const y = 1.4; //Specific Heat
        return Math.sqrt(y * g / R) * M * Math.pow(1 + (y - 1) / 2 * M * M, (y + 1) / (2 * (y - 1)));
    }

    private CalcFlowRate() {
        const M = 0.8;
        const V0 = M * 340.3;
        // return 77;
        return 12;
        return 19.3; //BMW 003
        // return 42; //GE J47
        // return 22.78; //F.2
        // return 70; //GE J73
        // return 1.2985 * Math.PI * Math.pow(this.diameter / 2, 2) * V0;
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];

        return Math.floor(1.0e-6 + this.TempMass() * this.quality_fudge * Era.cost) + 1;
    }

    private VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.quality_fudge = Math.max(1, this.quality_fudge);
        this.fuel_heat_value = Math.max(1, this.fuel_heat_value);
        this.max_turbine_temp = Math.max(1, this.max_turbine_temp);
        this.base_efficiency = Math.max(0.05, Math.min(1, this.base_efficiency));
        this.diameter = Math.max(0.1, this.diameter);
        this.compression_ratio = Math.max(1, this.compression_ratio);
        this.fan_pressure_ratio = Math.max(0, this.fan_pressure_ratio);
        this.bypass_ratio = Math.max(0, this.bypass_ratio);
        this.quality_fudge = Math.trunc(Math.max(0, this.quality_fudge));
    }

    public EngineInputs() {
        var ei = new EngineInputs();

        ei.name = this.name;
        ei.engine_type = ENGINE_TYPE.TURBO_X;
        ei.era_sel = this.era_sel;
        ei.fuel_heat_value = this.fuel_heat_value;
        ei.max_turbine_temp = this.max_turbine_temp;
        ei.base_efficiency = this.base_efficiency;
        ei.diameter = this.diameter;
        ei.compression_ratio = this.compression_ratio;
        ei.fan_pressure_ratio = this.fan_pressure_ratio;
        ei.bypass_ratio = this.bypass_ratio;
        ei.quality_cost = this.quality_fudge;
        return ei;
    }

    public EngineStats() {
        var estats = new EngineStats();

        this.VerifyValues();
        var tf = this.CalcStages();
        estats.name = this.name;
        estats.stats.power = tf.thrust;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = tf.fuel;
        estats.rumble = 0;
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 59;
        estats.pulsejet = true;
        estats.stats.era.add({ name: estats.name, era: lu(num2era(this.era_sel)) });

        return estats;
    }
}