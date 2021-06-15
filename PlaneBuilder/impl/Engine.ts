/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />

class Engine extends Part {
    private elist_idx: string;
    private etype_stats: EngineStats;
    private etype_inputs: EngineInputs;

    private cooling_count: number;
    private radiator_index: number;
    private num_radiators: number;

    private mount_list: { name: string, stats: Stats, strainfactor: number, dragfactor: number, mount_type: string, powerfactor: number, reqED: boolean, reqTail: boolean, helicopter: boolean }[];
    private selected_mount: number;

    private use_pp: boolean;
    private torque_to_struct: boolean;

    private intake_fan: boolean;
    private use_ds: boolean;
    private gp_count: number;
    private gpr_count: number;

    private cowl_list: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[];
    private cowl_sel: number;

    private is_generator: boolean;
    private has_alternator: boolean;
    private is_internal: boolean;

    private total_reliability: number;

    constructor(
        ml: { name: string, stats: Stats, strainfactor: number, dragfactor: number, mount_type: string, powerfactor: number, reqED: boolean, reqTail: boolean, helicopter: boolean }[],
        cl: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[]) {

        super();
        this.elist_idx = "Custom";
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(0);
        this.etype_inputs = engine_list.get(this.elist_idx).get(0);

        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;

        this.mount_list = ml;
        this.selected_mount = 0;

        this.intake_fan = false;
        this.use_pp = false;
        this.torque_to_struct = false;

        this.cowl_list = cl;
        this.cowl_sel = 0;

        this.gp_count = 0;
        this.gpr_count = 0;

        this.total_reliability = 0;

        this.is_generator = false;
        this.has_alternator = false;

        if (engine_list.get(this.elist_idx).length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }

    public toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            selected_inputs: this.etype_inputs.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.selected_mount,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
            is_generator: this.is_generator,
            has_alternator: this.has_alternator,
            intake_fan: this.intake_fan,
        };
    }

    private oldJSON(js: JSON, json_version: number): EngineInputs {
        var stats = js["selected_stats"];
        this.etype_stats.fromJSON(stats, json_version);
        this.etype_inputs = new EngineInputs();
        if (this.etype_stats.pulsejet && stats["input_pj"]) {
            this.etype_inputs = new EngineInputs();
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;

            var ipj = stats["input_pj"];
            this.etype_inputs.type = ipj["type"];
            this.etype_inputs.power = ipj["power"];
            this.etype_inputs.era_sel = ipj["era_sel"];
            this.etype_inputs.quality_cost = ipj["quality_cost"];
            this.etype_inputs.quality_rely = ipj["quality_rely"];
            this.etype_inputs.starter = ipj["starter"];
        } else if (stats["input_eb"]) {
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PROPELLER;

            var ieb = stats["input_eb"];
            this.etype_inputs.displacement = ieb["displacement"];
            this.etype_inputs.compression = ieb["compression"];
            this.etype_inputs.type = ieb["type"];
            this.etype_inputs.cyl_per_row = ieb["cyl_per_row"];
            this.etype_inputs.rows = ieb["rows"];
            this.etype_inputs.RPM_boost = ieb["RPM_boost"];
            this.etype_inputs.era_sel = ieb["era_sel"];
            this.etype_inputs.material_fudge = ieb["material_fudge"];
            this.etype_inputs.quality_fudge = ieb["quality_fudge"];
            this.etype_inputs.upgrades = ieb["upgrades"];
            if (this.etype_inputs.upgrades.length == 6) {
                this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                if (this.etype_inputs.upgrades[0]) {
                    this.etype_inputs.compressor_type = 2;
                    this.etype_inputs.compressor_count = 1;
                }
                if (this.etype_inputs.upgrades[1]) {
                    this.etype_inputs.compressor_type = 3;
                    this.etype_inputs.compressor_count = 1;
                }
                this.etype_inputs.upgrades.splice(0, 2);
            } else {
                this.etype_inputs.compressor_type = ieb["compressor_type"];
                this.etype_inputs.compressor_count = ieb["compressor_count"];
                this.etype_inputs.min_IAF = ieb["min_IAF"];
            }
        } else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }

        return this.etype_inputs;
    }

    public fromJSON(js: JSON, json_version: number) {
        var elist_idx = "";
        if (json_version > 10.55) {
            this.etype_stats.fromJSON(js["selected_stats"], json_version);
            var e_inputs = new EngineInputs(js["selected_inputs"]);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        } else {
            var e_inputs = this.oldJSON(js, json_version);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }
        this.elist_idx = elist_idx;

        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.selected_mount = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.is_generator = js["is_generator"];
        this.has_alternator = js["has_alternator"];
        this.intake_fan = js["intake_fan"];
    }

    public serialize(s: Serialize) {
        this.etype_stats.serialize(s);
        this.etype_inputs.serialize(s);
        s.PushNum(this.cooling_count);
        s.PushNum(this.radiator_index);
        s.PushNum(this.selected_mount);
        s.PushBool(this.use_pp);
        s.PushBool(this.torque_to_struct);
        s.PushBool(this.use_ds);
        s.PushNum(this.gp_count);
        s.PushNum(this.gpr_count);
        s.PushNum(this.cowl_sel);
        s.PushBool(this.is_generator);
        s.PushBool(this.has_alternator);
        s.PushBool(this.intake_fan);
    }

    private oldDeserialize(d: Deserialize): EngineInputs {
        this.etype_stats.name = d.GetString();
        this.etype_stats.overspeed = d.GetNum();
        this.etype_stats.altitude = d.GetNum();
        this.etype_stats.torque = d.GetNum();
        this.etype_stats.rumble = d.GetNum();
        this.etype_stats.oiltank = d.GetBool();
        this.etype_stats.pulsejet = d.GetBool();
        this.etype_inputs = new EngineInputs();
        if (d.version > 10.45) {
            this.etype_inputs.name = this.etype_stats.name;
            if (this.etype_stats.pulsejet) {
                this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
                this.etype_inputs.power = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.quality_cost = d.GetNum();
                this.etype_inputs.quality_rely = d.GetNum();
                this.etype_inputs.starter = d.GetBool();
            } else {
                this.etype_inputs.displacement = d.GetNum();
                this.etype_inputs.compression = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.cyl_per_row = d.GetNum();
                this.etype_inputs.rows = d.GetNum();
                this.etype_inputs.RPM_boost = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.material_fudge = d.GetNum();
                this.etype_inputs.quality_fudge = d.GetNum();
                this.etype_inputs.upgrades = d.GetBoolArr(0);//Put 0, because we don't have a minimum, and below checks the actual length to decide which version
                if (this.etype_inputs.upgrades.length == 6) {
                    this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                    if (this.etype_inputs.upgrades[0]) {
                        this.etype_inputs.compressor_type = 2;
                        this.etype_inputs.compressor_count = 1;
                    }
                    if (this.etype_inputs.upgrades[1]) {
                        this.etype_inputs.compressor_type = 3;
                        this.etype_inputs.compressor_count = 1;
                    }
                    this.etype_inputs.upgrades.splice(0, 2);
                } else {
                    this.etype_inputs.compressor_type = d.GetNum();
                    this.etype_inputs.compressor_count = d.GetNum();
                    this.etype_inputs.min_IAF = d.GetNum();
                }
            }
        } else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }

        this.etype_stats.stats.deserialize(d);

        return this.etype_inputs;
    }

    public deserialize(d: Deserialize) {
        var elist_idx = "";
        if (d.version > 10.55) {
            this.etype_stats.deserialize(d);
            var e_inputs = new EngineInputs();
            e_inputs.deserialize(d);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        } else {
            var e_inputs = this.oldDeserialize(d);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }

        this.cooling_count = d.GetNum();
        this.radiator_index = d.GetNum();
        this.selected_mount = d.GetNum();
        this.use_pp = d.GetBool();
        this.torque_to_struct = d.GetBool();
        this.use_ds = d.GetBool();
        this.gp_count = d.GetNum();
        this.gpr_count = d.GetNum();
        this.cowl_sel = d.GetNum();
        this.is_generator = d.GetBool();
        this.has_alternator = d.GetBool();
        this.intake_fan = d.GetBool();

        this.elist_idx = elist_idx;
    }

    public GetMaxAltitude() {
        return this.GetMinIAF() + this.etype_stats.altitude;
    }

    public GetMinIAF() {
        return this.etype_inputs.min_IAF;
    }

    public CanSelectIndex() {
        var elist_temp = engine_list.get(this.elist_idx);
        var can = [...Array(elist_temp.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < elist_temp.length; i++) {
                if (elist_temp.get(i).engine_type == ENGINE_TYPE.PULSEJET)
                    can[i] = false;
            }
        }
        return can;
    }

    public SetSelectedIndex(num: number) {
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(num);
        this.etype_inputs = engine_list.get(this.elist_idx).get(num);
        if (this.use_pp)
            this.cooling_count = 2 * this.etype_stats.stats.cooling;
        else
            this.cooling_count = this.etype_stats.stats.cooling;
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }

    public GetSelectedIndex(): number {
        return engine_list.get(this.elist_idx).find_name(this.etype_stats.name);
    }

    public GetCurrentStats(): EngineStats {
        return this.etype_stats.Clone();
    }

    public NeedCooling(): boolean {
        return this.etype_stats.stats.cooling > 0;
    }

    public WarnCoolingReliability(): boolean {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }

    public SetCooling(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.cooling_count = num;
        if (this.NeedCooling()) {
            this.cooling_count = Math.max(1, this.cooling_count);
        }
        this.CalculateStats();
    }

    public GetCooling(): number {
        return this.cooling_count;
    }

    public GetMaxCooling(): number {
        if (this.use_pp)
            return 2 * this.etype_stats.stats.cooling;
        return this.etype_stats.stats.cooling;
    }

    public SetNumRadiators(num: number) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }

    public GetNumRadiators(): number {
        return this.num_radiators;
    }

    public SetRadiator(num: number) {
        this.radiator_index = num;
        this.CalculateStats();
    }

    public GetRadiator(): number {
        return this.radiator_index;
    }

    public CanIntakeFan() {
        return this.IsAirCooled();
    }

    public SetIntakeFan(use: boolean) {
        this.intake_fan = use;
        this.CalculateStats();
    }

    public GetIntakeFan() {
        return this.intake_fan;
    }

    public SetSelectedList(n: string) {
        if (n != this.elist_idx) {
            this.elist_idx = n;
            this.SetSelectedIndex(0); //This calls CalculateStats
        }
    }

    public GetSelectedList() {
        return this.elist_idx;
    }

    public GetListOfEngines(): EngineList {
        return engine_list.get(this.elist_idx);
    }

    public RequiresExtendedDriveshafts(): boolean {
        if (this.is_internal)
            return false;
        return this.mount_list[this.selected_mount].reqED;
    }

    public SetTailMods(forb: boolean, swr: boolean) {
        if (this.mount_list[this.selected_mount].reqTail && !(forb || swr) && !this.GetGenerator())
            this.use_ds = true;
    }

    public CanMountIndex() {
        var can = [...Array(this.mount_list.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].helicopter;
            }
        } else if (this.use_pp) {
            for (let i = 0; i < can.length; ++i) {
                if (this.mount_list[i].mount_type == "fuselage"
                    && this.mount_list[i].name != "Fuselage Push-Pull") {
                    can[i] = false;
                }
            }
        } else {
            for (let i = 0; i < can.length; ++i) {
                if (this.mount_list[i].name == "Fuselage Push-Pull") {
                    can[i] = false;
                }
            }
        }
        return can;
    }

    public SetMountIndex(num: number) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.selected_mount = num;
        if (this.mount_list[this.selected_mount].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }

    public GetMountIndex(): number {
        if (this.GetIsPulsejet())
            return -1;
        return this.selected_mount;
    }

    public CanUsePushPull() {
        return !(this.is_generator || (this.GetNumPropellers() == 0) || this.is_internal);
    }

    public SetUsePushPull(use: boolean) {
        this.use_pp = use;
        if (use) {
            this.cooling_count *= 2;
            if (this.mount_list[this.selected_mount].mount_type == "fuselage") {
                this.selected_mount = 8;
            }
        }
        else {
            this.cooling_count = Math.floor(1.0e-6 + this.cooling_count / 2);
            if (this.mount_list[this.selected_mount].name == "Fuselage Push-Pull") {
                this.selected_mount = 0;
            }
        }
        this.CalculateStats();
    }

    public GetUsePushPull(): boolean {
        return this.use_pp;
    }

    public GetMountList() {
        return this.mount_list;
    }

    public CanUseExtendedDriveshaft() {
        return !((this.GetNumPropellers() == 0) || this.is_internal || this.GetGenerator());
    }

    public SetUseExtendedDriveshaft(use: boolean) {
        if (!this.GetGenerator()) {
            this.use_ds = use || this.RequiresExtendedDriveshafts();
        } else {
            this.use_ds = false;
        }
        this.CalculateStats();
    }

    public GetUseExtendedDriveshaft(): boolean {
        return this.use_ds;
    }

    public CanUseGears() {
        return !((this.GetNumPropellers() == 0) || this.GetGenerator());
    }

    public SetGearCount(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }

    public GetGearCount(): number {
        return this.gp_count;
    }

    public SetGearReliability(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }

    public GetGearReliability(): number {
        return this.gpr_count;
    }

    public SetTorqueToStruct(use: boolean) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }

    public GetTorqueToStruct() {
        return this.torque_to_struct;
    }

    public CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0;
    }

    public UpdateReliability(num: number) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        this.total_reliability += this.cowl_list[this.cowl_sel].stats.reliability;
        if (this.NeedCooling()) {
            this.total_reliability -= (this.GetMaxCooling() - this.cooling_count);
        }
        if (this.GetIntakeFan()) {
            this.total_reliability += 6;
        }
        this.total_reliability += num;
    }

    public GetReliability(): number {
        return this.total_reliability;
    }

    public GetOverspeed(): number {
        if (this.is_generator)
            return 100;
        return this.etype_stats.overspeed + Math.floor(1.0e-6 + this.gp_count * this.etype_stats.overspeed / 2);
    }

    public GetIsPulsejet(): boolean {
        return this.etype_stats.pulsejet;
    }

    private PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            this.has_alternator = false;
            this.is_generator = false;
            this.cowl_sel = 0;
            if (this.mount_list[this.selected_mount].mount_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].mount_type != "fuselage")
                        break;
                }
            }
        }
    }

    public GetIsTurbine(): boolean {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY;
    }

    private GetIsTurboprop(): boolean {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY && this.etype_inputs.type == 3;
    }

    private TurbineCheck() {
        if (this.GetIsTurbine()) {
            if (this.GetNumPropellers() == 0) {
                this.use_ds = false;
                this.gp_count = 0;
                this.gpr_count = 0;
                this.selected_mount = 5;
            }
            this.use_pp = false;
            this.cooling_count = 0;
            this.cowl_sel = 0;
        }
    }

    public GetNumPropellers() {
        if (!(this.GetIsPulsejet() || this.GetIsTurbine() || this.GetGenerator()) || this.GetIsTurboprop()) {
            if (this.use_pp) {
                return 2;
            }
            return 1;
        }
        return 0;
    }

    public GetIsTractorNacelle() {
        if (this.GetNumPropellers() > 0
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].powerfactor == 0.8
            && !this.is_internal)
            return true;
        return false;
    }

    public IsLiquidCooled() {
        return this.NeedCooling();
    }

    public IsRotary() {
        return this.etype_stats.oiltank;
    }

    public IsContraRotary() {
        if (!this.GetIsPulsejet()) {
            if (this.elist_idx != ""
                && this.etype_inputs.type == 3) {
                return true;
            }
        }
        return false;
    }

    public IsAirCooled() {
        return !this.GetIsPulsejet() && !this.GetIsTurbine() && !this.IsLiquidCooled() && !this.IsRotary();
    }

    public GetCowlList() {
        return this.cowl_list;
    }

    public GetCowl() {
        return this.cowl_sel;
    }

    public GetCowlEnabled() {
        let lst = [];
        for (let c of this.cowl_list) {
            if (this.GetIsPulsejet() || this.GetIsTurbine()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
            }
            else if (this.IsLiquidCooled()) {
                lst.push(c.liquid);
            }
            else if (this.IsRotary()) {
                lst.push(c.rotary);
            }
            else { //Means air cooled
                lst.push(c.air);
            }
        }
        return lst;
    }

    public GetHasOilTank() {
        return this.etype_stats.oiltank;
    }

    public GetHasOilCooler() {
        return this.etype_stats.stats.cooling > 0;
    }

    public GetHasOilPan() {
        return this.IsAirCooled();
    }

    private VerifyCowl(num: number) {
        var can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }

    public SetCowl(num: number) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }

    public GetGeneratorEnabled() {
        return !(this.GetIsPulsejet() || this.use_pp);
    }

    public GetGenerator() {
        return this.is_generator;
    }

    public SetGenerator(use: boolean) {
        if (this.GetGeneratorEnabled()) {
            this.is_generator = use;
        } else {
            this.is_generator = false;
        }
        if (this.is_generator) {
            this.gp_count = 0;
            this.gpr_count = 0;
            this.use_ds = false;
        }
        this.CalculateStats();
    }

    public GetAlternatorEnabled() {
        return !this.GetIsPulsejet() && !this.is_generator;
    }

    public GetAlternator() {
        return this.has_alternator;
    }

    public SetAlternator(use: boolean) {
        if (this.GetAlternatorEnabled()) {
            this.has_alternator = use;
        } else {
            this.has_alternator = false;
        }
        this.CalculateStats();
    }

    public GetRumble() {
        return this.etype_stats.rumble;
    }

    public IsTractor() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.selected_mount].name == "Tractor"
            || this.mount_list[this.selected_mount].name == "Center-Mounted Tractor"
            || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull";
    }

    public GetTractorSpinner() {
        return {
            has: this.IsTractor(),
            spinner: this.GetSpinner()
        };
    }

    public IsPusher() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.selected_mount].name == "Rear-Mounted Pusher"
            || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
            || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull";
    }

    public GetPusherSpinner() {
        return {
            has: this.IsPusher(),
            spinner: this.GetSpinner()
        };
    }

    private GetSpinner() {
        if (this.gp_count > 0 && !this.GetGenerator()) {
            if (this.use_ds &&
                (this.mount_list[this.selected_mount].name == "Center-Mounted Tractor"
                    || this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
                    || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull"
                )) { //Uses Extended Driveshafts, can be arty, and rotary engine
                return [true, true];
            }
            else if (!this.etype_stats.oiltank) { //Not rotary, so room for gun but not arty.
                return [true, false];
            }
        }
        //No spinner weapons
        return [false, false];
    }

    public IsElectrics() {
        return this.has_alternator || this.GetGenerator();
    }

    public GetEngineHeight() {
        if (!this.GetGenerator()) {
            if (this.mount_list[this.selected_mount].name == "Pod" || this.etype_stats.pulsejet || this.is_internal)
                return 2;
            else if (this.mount_list[this.selected_mount].name == "Nacelle (Offset)")
                return 1;
            else if (this.mount_list[this.selected_mount].name == "Nacelle (Inside)"
                || this.mount_list[this.selected_mount].name == "Channel Tractor")
                return 0;
            else
                return -1;
        } else {
            return 5;
        }
    }

    public IsTractorRotary() {
        if (this.GetGenerator())
            return false;
        return this.IsRotary() &&
            (this.mount_list[this.selected_mount].name == "Tractor"
                || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull");
    }

    public IsDiesel() {
        return this.etype_inputs.upgrades[3];
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public SetInternal(is: boolean) {
        this.is_internal = is;
        if (is) {
            this.use_ds = false;
            if (!this.CanMountIndex()[this.selected_mount])
                this.selected_mount = 1;
        }
    }

    public PartStats(): Stats {
        this.PulseJetCheck();
        this.TurbineCheck();
        let stats = new Stats;
        stats = stats.Add(this.etype_stats.stats);

        stats.upkeep = stats.power / 10;

        if (this.etype_stats.oiltank)
            stats.mass += 1;

        if (this.torque_to_struct)
            stats.structure -= this.etype_stats.torque;
        else {
            if (this.mount_list[this.selected_mount].mount_type == "wing")
                stats.maxstrain -= this.etype_stats.torque;
            else if (this.mount_list[this.selected_mount].mount_type == "fuselage")
                stats.latstab -= this.etype_stats.torque;
        }

        //ContraRotary Engines need geared propellers to function.
        if (this.IsContraRotary()) {
            this.gp_count = Math.max(1, this.gp_count);
        }
        stats.cost += this.gp_count + this.gpr_count;
        if (this.gp_count > 0) {
            stats.era.add({ name: "Propeller Gearing", era: "WWI" });
        }
        if (this.gpr_count > 0) {
            stats.era.add({ name: "Reliable Gearing", era: "Roaring 20s" });
        }

        //Extended Driveshafts
        if (this.use_ds) {
            stats.mass += 1;
        }

        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].ed);

        //Push-pull
        if (this.use_pp) {
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.upkeep *= 2;
            stats.reqsections *= 2;
            stats.power = Math.floor(1.0e-6 + this.mount_list[this.selected_mount].powerfactor * stats.power);
        }

        //If there is a cowl, and it's a pusher (or push-pull), add the engineering cost
        if (this.cowl_sel != 0 &&
            (this.mount_list[this.selected_mount].name == "Rear-Mounted Pusher" ||
                this.mount_list[this.selected_mount].name == "Center-Mounted Pusher"
                || this.mount_list[this.selected_mount].name == "Fuselage Push-Pull")) {
            stats.cost += 2;
        }

        //Air Cooling Fan (only 1 / push-pull)
        if (this.IsAirCooled() && this.intake_fan) {
            stats.mass += 3;
            //Double Effect of Torque
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.cost += 4;
            stats.era.add({ name: "Air Cooling Fan", era: "WWII" });
        }
        else {
            this.intake_fan = false;
        }

        //Move here so it doesn't get affected by cowl.
        if (this.GetHasOilCooler()) {
            stats.drag += Math.floor(stats.power / 15);
        }

        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!(this.GetIsPulsejet())) {
            stats = stats.Add(this.mount_list[this.selected_mount].stats);
            stats.maxstrain -= Math.floor(1.0e-6 + this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(1.0e-6 + this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }

        // Power Generation
        if (this.is_generator) {
            stats.charge = Math.floor(1.0e-6 + 2 * stats.power / 10) + 2;
            stats.power = 0;
        } else if (this.has_alternator) {
            stats.charge = Math.floor(1.0e-6 + stats.power / 10) + 1;
            stats.mass += 1;
            stats.cost += 2;
        }


        //Reliability is a part local issue.
        stats.reliability = 0;

        return stats;
    }
}