import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
import { SearchAllEngineLists, GetEngineLists } from "./EngineList.js";
import { EngineInputs, ENGINE_TYPE } from "./EngineInputs.js";
export class Engine extends Part {
    constructor(ml, cl) {
        super();
        const engine_list = GetEngineLists();
        this.elist_idx = "Custom";
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(0);
        this.etype_inputs = engine_list.get(this.elist_idx).get(0);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.mount_sel = 0;
        this.intake_fan = false;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.cowl_list = cl;
        this.cowl_sel = 0;
        this.use_ds = false;
        this.outboard_prop = false;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        this.is_generator = false;
        this.has_alternator = false;
        if (engine_list.get(this.elist_idx).length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            selected_inputs: this.etype_inputs.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.mount_sel,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
            is_generator: this.is_generator,
            has_alternator: this.has_alternator,
            intake_fan: this.intake_fan,
            outboard_prop: this.outboard_prop,
        };
    }
    oldJSON(js, json_version) {
        const stats = js["selected_stats"];
        this.etype_stats.fromJSON(stats, json_version);
        this.etype_inputs = new EngineInputs();
        if (this.etype_stats.pulsejet && stats["input_pj"]) {
            this.etype_inputs = new EngineInputs();
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
            const ipj = stats["input_pj"];
            this.etype_inputs.type = ipj["type"];
            this.etype_inputs.power = ipj["power"];
            this.etype_inputs.era_sel = ipj["era_sel"];
            this.etype_inputs.quality_cost = ipj["quality_cost"];
            this.etype_inputs.quality_rely = ipj["quality_rely"];
            this.etype_inputs.starter = ipj["starter"];
        }
        else if (stats["input_eb"]) {
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PROPELLER;
            const ieb = stats["input_eb"];
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
            }
            else {
                this.etype_inputs.compressor_type = ieb["compressor_type"];
                this.etype_inputs.compressor_count = ieb["compressor_count"];
                this.etype_inputs.min_IdealAlt = ieb["min_IAF"];
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        return this.etype_inputs;
    }
    fromJSON(js, json_version) {
        const engine_list = GetEngineLists();
        let elist_idx = "";
        if (json_version > 10.55) {
            this.etype_stats.fromJSON(js["selected_stats"], json_version);
            const e_inputs = new EngineInputs(js["selected_inputs"]);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        }
        else {
            const e_inputs = this.oldJSON(js, json_version);
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
        this.mount_sel = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.is_generator = js["is_generator"];
        this.has_alternator = js["has_alternator"];
        this.intake_fan = js["intake_fan"];
        if (json_version >= 12.15) {
            this.outboard_prop = js["outboard_prop"];
        }
        else {
            this.outboard_prop = false;
        }
    }
    serialize(s) {
        this.etype_stats.serialize(s);
        this.etype_inputs.serialize(s);
        s.PushNum(this.cooling_count);
        s.PushNum(this.radiator_index);
        s.PushNum(this.mount_sel);
        s.PushBool(this.use_pp);
        s.PushBool(this.torque_to_struct);
        s.PushBool(this.use_ds);
        s.PushNum(this.gp_count);
        s.PushNum(this.gpr_count);
        s.PushNum(this.cowl_sel);
        s.PushBool(this.is_generator);
        s.PushBool(this.has_alternator);
        s.PushBool(this.intake_fan);
        s.PushBool(this.outboard_prop);
    }
    oldDeserialize(d) {
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
            }
            else {
                this.etype_inputs.displacement = d.GetNum();
                this.etype_inputs.compression = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.cyl_per_row = d.GetNum();
                this.etype_inputs.rows = d.GetNum();
                this.etype_inputs.RPM_boost = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.material_fudge = d.GetNum();
                this.etype_inputs.quality_fudge = d.GetNum();
                this.etype_inputs.upgrades = d.GetBoolArr(0); //Put 0, because we don't have a minimum, and below checks the actual length to decide which version
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
                }
                else {
                    this.etype_inputs.compressor_type = d.GetNum();
                    this.etype_inputs.compressor_count = d.GetNum();
                    this.etype_inputs.min_IdealAlt = d.GetNum();
                }
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        this.etype_stats.stats.deserialize(d);
        return this.etype_inputs;
    }
    deserialize(d) {
        const engine_list = GetEngineLists();
        var elist_idx = "";
        if (d.version > 10.55) {
            this.etype_stats.deserialize(d);
            const e_inputs = new EngineInputs();
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
        }
        else {
            const e_inputs = this.oldDeserialize(d);
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
        this.mount_sel = d.GetNum();
        this.use_pp = d.GetBool();
        this.torque_to_struct = d.GetBool();
        this.use_ds = d.GetBool();
        this.gp_count = d.GetNum();
        this.gpr_count = d.GetNum();
        this.cowl_sel = d.GetNum();
        this.is_generator = d.GetBool();
        this.has_alternator = d.GetBool();
        this.intake_fan = d.GetBool();
        if (d.version >= 12.15) {
            this.outboard_prop = d.GetBool();
        }
        else {
            this.outboard_prop = false;
        }
        this.elist_idx = elist_idx;
    }
    GetMinAltitude() {
        return this.etype_inputs.min_IdealAlt;
    }
    GetMaxAltitude() {
        return this.GetMinAltitude() + this.etype_stats.altitude;
    }
    GetMinIAF() {
        return Math.floor(1.0e-6 + this.GetMinAltitude() / 10);
    }
    GetMaxIAF() {
        return Math.floor(1.0e-6 + this.GetMaxAltitude() / 10);
    }
    CanSelectIndex() {
        const elist_temp = GetEngineLists().get(this.elist_idx);
        const can = [...Array(elist_temp.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < elist_temp.length; i++) {
                if (elist_temp.get(i).engine_type == ENGINE_TYPE.PULSEJET
                    || (elist_temp.get(i).engine_type == ENGINE_TYPE.TURBOMACHINERY && (elist_temp.get(i).type == 1 || elist_temp.get(i).type == 2))) //If Turbofan or Turboprop
                    can[i] = false;
            }
        }
        return can;
    }
    SetSelectedIndex(num) {
        const engine_list = GetEngineLists();
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(num);
        this.etype_inputs = engine_list.get(this.elist_idx).get(num);
        if (this.use_pp)
            this.cooling_count = 2 * this.etype_stats.stats.cooling;
        else
            this.cooling_count = this.etype_stats.stats.cooling;
        if (this.radiator_index < 0)
            this.radiator_index = 0;
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return GetEngineLists().get(this.elist_idx).find_name(this.etype_stats.name);
    }
    GetCurrentStats() {
        return this.etype_stats.Clone();
    }
    NeedCooling() {
        return this.etype_stats.stats.cooling > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.cooling_count = num;
        if (this.NeedCooling()) {
            this.cooling_count = Math.max(1, this.cooling_count);
        }
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
    }
    GetMaxCooling() {
        if (this.use_pp)
            return 2 * this.etype_stats.stats.cooling;
        return this.etype_stats.stats.cooling;
    }
    SetNumRadiators(num) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }
    GetNumRadiators() {
        return this.num_radiators;
    }
    SetRadiator(num) {
        this.radiator_index = num;
        this.CalculateStats();
    }
    GetRadiator() {
        return this.radiator_index;
    }
    CanIntakeFan() {
        return this.IsAirCooled();
    }
    SetIntakeFan(use) {
        this.intake_fan = use;
        this.CalculateStats();
    }
    GetIntakeFan() {
        return this.intake_fan;
    }
    CanOutboardProp() {
        return this.use_ds && (this.IsTractor() || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull");
    }
    GetOutboardProp() {
        return this.outboard_prop;
    }
    SetOutboardProp(use) {
        if (use && this.use_ds) {
            this.outboard_prop = true;
        }
        else {
            this.outboard_prop = false;
        }
        this.CalculateStats();
    }
    SetSelectedList(n) {
        if (n != this.elist_idx) {
            this.elist_idx = n;
            this.SetSelectedIndex(0); //This calls CalculateStats
        }
    }
    GetSelectedList() {
        return this.elist_idx;
    }
    GetListOfEngines() {
        return GetEngineLists().get(this.elist_idx);
    }
    RequiresExtendedDriveshafts() {
        if (this.is_internal)
            return false;
        return this.mount_list[this.mount_sel].reqED;
    }
    SetTailMods(forb, swr, canard) {
        if (this.mount_list[this.mount_sel].reqTail && !(forb || swr) && !this.GetGenerator())
            this.use_ds = true;
        if (this.mount_list[this.mount_sel].reqED && !this.GetGenerator() && !(canard && (forb || swr)))
            this.use_ds = true;
    }
    CanMountIndex() {
        var can = [...Array(this.mount_list.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].helicopter;
            }
        }
        else if (this.GetIsTurbine() && !this.GetIsTurboprop()) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].turbine;
            }
        }
        else if (this.is_generator) {
            can = [...Array(this.mount_list.length).fill(false)];
            can[0] = true;
        }
        else {
            if (this.use_pp) {
                for (let i = 0; i < can.length; ++i) {
                    if (this.mount_list[i].mount_type == "fuselage"
                        && this.mount_list[i].name != "Fuselage Push-Pull") {
                        can[i] = false;
                    }
                    if (this.mount_list[i].turbine) {
                        can[i] = false;
                    }
                }
            }
            else {
                for (let i = 0; i < can.length; ++i) {
                    if (this.mount_list[i].name == "Fuselage Push-Pull") {
                        can[i] = false;
                    }
                    if (this.mount_list[i].turbine) {
                        can[i] = false;
                    }
                }
            }
        }
        return can;
    }
    SetMountIndex(num) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.mount_sel = num;
        if (this.mount_list[this.mount_sel].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }
    GetMountIndex() {
        if (this.GetIsPulsejet())
            return -1;
        return this.mount_sel;
    }
    CanUsePushPull() {
        return !(this.is_generator || this.GetIsJet() || this.is_internal || this.mount_list[this.mount_sel].helicopter);
    }
    SetUsePushPull(use) {
        this.use_pp = use;
        if (use) {
            this.cooling_count *= 2;
            if (this.mount_list[this.mount_sel].mount_type == "fuselage") {
                this.mount_sel = 8;
            }
        }
        else {
            this.cooling_count = Math.floor(1.0e-6 + this.cooling_count / 2);
            if (this.mount_list[this.mount_sel].name == "Fuselage Push-Pull") {
                this.mount_sel = 0;
            }
        }
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    CanUseExtendedDriveshaft() {
        return !((this.GetNumPropellers() == 0) || this.is_internal || this.GetGenerator() || this.mount_list[this.mount_sel].helicopter);
    }
    SetUseExtendedDriveshaft(use) {
        if (this.GetGenerator() || this.is_internal) {
            this.use_ds = false;
        }
        else {
            this.use_ds = use;
        }
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    CanUseGears() {
        return !((this.GetNumPropellers() == 0) || this.GetGenerator());
    }
    SetGearCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }
    GetGearReliability() {
        return this.gpr_count;
    }
    SetTorqueToStruct(use) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }
    GetTorqueToStruct() {
        return this.torque_to_struct;
    }
    CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.mount_sel].mount_type != "pod";
    }
    UpdateReliability(num) {
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
    GetReliability() {
        if (this.use_pp) {
            if (this.outboard_prop) {
                return this.total_reliability.toString() + '/' + (this.total_reliability - 2).toString();
            }
            return this.total_reliability.toString() + '/' + this.total_reliability.toString();
        }
        //else
        if (this.outboard_prop) {
            return (this.total_reliability - 2).toString();
        }
        return this.total_reliability.toString();
    }
    GetOverspeed() {
        if (this.is_generator)
            return 1000;
        return this.etype_stats.overspeed + Math.floor(1.0e-6 + this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    GetIsJet() {
        return this.GetIsPulsejet() || (this.GetIsTurbine() && !this.GetIsTurboprop());
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            this.has_alternator = false;
            this.is_generator = false;
            this.cowl_sel = 0;
            this.radiator_index = -1;
        }
    }
    GetIsTurbine() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY;
    }
    GetIsTurboprop() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY && this.etype_inputs.type == 3;
    }
    TurbineCheck() {
        if (this.GetIsTurbine()) {
            if (this.GetNumPropellers() == 0) {
                this.use_ds = false;
                this.gp_count = 0;
                this.gpr_count = 0;
            }
            this.cooling_count = 0;
            this.cowl_sel = 0;
            this.radiator_index = -1;
        }
    }
    GetNumPropellers() {
        if (!(this.GetIsPulsejet() || this.GetIsTurbine() || this.GetGenerator()) || this.GetIsTurboprop() || this.is_internal) {
            if (this.use_pp) {
                return 2;
            }
            return 1;
        }
        return 0;
    }
    GetIsTractorNacelle() {
        if (this.GetNumPropellers() > 0
            && !this.GetUsePushPull()
            && this.mount_list[this.mount_sel].powerfactor == 0.8
            && !this.is_internal)
            return true;
        return false;
    }
    IsLiquidCooled() {
        return this.NeedCooling();
    }
    IsRotary() {
        return this.etype_stats.oiltank;
    }
    IsContraRotary() {
        if (!this.GetIsPulsejet() && !this.GetIsTurbine()) {
            if (this.elist_idx != ""
                && this.etype_inputs.type == 3) {
                return true;
            }
        }
        return false;
    }
    IsAirCooled() {
        return !this.GetIsPulsejet() && !this.GetIsTurbine() && !this.IsLiquidCooled() && !this.IsRotary();
    }
    GetCowlList() {
        return this.cowl_list;
    }
    GetCowl() {
        return this.cowl_sel;
    }
    GetCowlEnabled() {
        const lst = [];
        for (const c of this.cowl_list) {
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
    GetHasOilTank() {
        return this.etype_stats.oiltank;
    }
    GetHasOilCooler() {
        return this.etype_stats.stats.cooling > 0;
    }
    GetHasOilPan() {
        return this.IsAirCooled();
    }
    VerifyCowl(num) {
        const can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }
    SetCowl(num) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }
    GetGeneratorEnabled() {
        return !(this.GetIsPulsejet() || this.use_pp);
    }
    GetGenerator() {
        return this.is_generator;
    }
    SetGenerator(use) {
        if (this.GetGeneratorEnabled()) {
            this.is_generator = use;
        }
        else {
            this.is_generator = false;
        }
        if (this.is_generator) {
            this.gp_count = 0;
            this.gpr_count = 0;
            this.use_ds = false;
        }
        this.CalculateStats();
    }
    GetAlternatorEnabled() {
        return !this.GetIsPulsejet() && !this.is_generator && this.etype_inputs.engine_type != ENGINE_TYPE.ELECTRIC;
    }
    GetAlternator() {
        return this.has_alternator;
    }
    SetAlternator(use) {
        if (this.GetAlternatorEnabled()) {
            this.has_alternator = use;
        }
        else {
            this.has_alternator = false;
        }
        this.CalculateStats();
    }
    GetRumble() {
        return this.etype_stats.rumble;
    }
    IsTractor() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.mount_sel].name == "Tractor"
            || this.mount_list[this.mount_sel].name == "Center-Mounted Tractor"
            || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull";
    }
    GetTractorSpinner() {
        return {
            has: this.IsTractor() && !(this.outboard_prop && !this.use_pp),
            spinner: this.GetSpinner()
        };
    }
    IsPusher() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.mount_sel].name == "Rear-Mounted Pusher"
            || this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
            || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull";
    }
    GetPusherSpinner() {
        return {
            has: this.IsPusher() && !this.outboard_prop,
            spinner: this.GetSpinner()
        };
    }
    GetSpinner() {
        if (this.gp_count > 0 && !this.GetGenerator() && !this.outboard_prop) {
            if (this.use_ds &&
                (this.mount_list[this.mount_sel].name == "Center-Mounted Tractor"
                    || this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
                    || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull")) { //Uses Extended Driveshafts, can be arty, and rotary engine
                return [true, true];
            }
            else if (!this.etype_stats.oiltank) { //Not rotary, so room for gun but not arty.
                return [true, false];
            }
        }
        //No spinner weapons
        return [false, false];
    }
    IsElectrics() {
        return this.has_alternator || this.GetGenerator();
    }
    GetEngineHeight() {
        if (!this.GetGenerator()) {
            if (this.mount_list[this.mount_sel].name == "Pod" || this.etype_stats.pulsejet || this.is_internal || this.outboard_prop)
                return 2;
            else if (this.mount_list[this.mount_sel].name == "Nacelle (Offset)")
                return 1;
            else if (this.mount_list[this.mount_sel].name == "Nacelle (Inside)"
                || this.mount_list[this.mount_sel].name == "Channel Tractor"
                || this.mount_list[this.mount_sel].name == "Wing Pod")
                return 0;
            else
                return -1;
        }
        else {
            return 5;
        }
    }
    IsTractorRotary() {
        if (this.GetGenerator())
            return false;
        return this.IsRotary() &&
            (this.mount_list[this.mount_sel].name == "Tractor"
                || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull");
    }
    IsDiesel() {
        return this.etype_inputs.upgrades[3];
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    SetInternal(is) {
        this.is_internal = is;
        if (is) {
            this.use_ds = false;
        }
    }
    VerifyMount() {
        if (this.GetIsTurbine() && !this.GetIsTurboprop()) {
            while (!this.mount_list[this.mount_sel].turbine) {
                this.mount_sel++;
            }
        }
        else if (this.GetIsPulsejet()) {
            if (this.mount_list[this.mount_sel].mount_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.mount_sel = i;
                    if (this.mount_list[this.mount_sel].mount_type != "fuselage")
                        break;
                }
            }
        }
        else if (this.is_internal) {
            if (!this.CanMountIndex()[this.mount_sel])
                this.mount_sel = 1;
        }
        else if (this.is_generator) {
            this.mount_sel = 0;
        }
        else {
            if (this.mount_list[this.mount_sel].turbine) {
                if (this.use_pp) {
                    this.mount_sel = 8;
                }
                else {
                    this.mount_sel = 0;
                }
            }
        }
    }
    VerifyCooling() {
        if (this.NeedCooling() && this.radiator_index < 0) {
            this.radiator_index = 0;
        }
        else if (!this.NeedCooling()) {
            this.radiator_index = -1;
        }
    }
    ElectricCheck() {
        if (this.etype_inputs.engine_type == ENGINE_TYPE.ELECTRIC) {
            this.has_alternator = false;
        }
    }
    PartStats() {
        this.VerifyMount();
        this.VerifyCooling();
        this.PulseJetCheck();
        this.TurbineCheck();
        this.ElectricCheck();
        if (!this.CanUseExtendedDriveshaft()) {
            this.use_ds = false;
        }
        if (!this.CanOutboardProp()) {
            this.outboard_prop = false;
        }
        let stats = new Stats;
        stats = stats.Add(this.etype_stats.stats);
        stats.upkeep = stats.power / 10;
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        var torque = this.etype_stats.torque;
        if (this.mount_list[this.mount_sel].helicopter) {
            if (this.IsRotary())
                torque = Math.floor(1.0e-6 + torque / 2);
            else
                torque = 0;
        }
        if (this.torque_to_struct)
            stats.structure -= this.etype_stats.torque;
        else {
            if (this.mount_list[this.mount_sel].mount_type == "wing")
                stats.maxstrain -= this.etype_stats.torque;
            else if (this.mount_list[this.mount_sel].mount_type == "fuselage")
                stats.latstab -= this.etype_stats.torque;
        }
        //ContraRotary Engines need geared propellers to function.
        if (this.IsContraRotary()) {
            this.gp_count = Math.max(1, this.gp_count);
        }
        stats.cost += this.gp_count + this.gpr_count;
        if (this.gp_count > 0) {
            stats.era.push({ name: "Propeller Gearing", era: "WWI" });
        }
        if (this.gpr_count > 0) {
            stats.era.push({ name: "Reliable Gearing", era: "Roaring 20s" });
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
            stats.power = Math.floor(1.0e-6 + this.mount_list[this.mount_sel].powerfactor * stats.power);
        }
        //If there is a cowl, and it's a pusher (or push-pull), add the engineering cost
        if (this.cowl_sel != 0 &&
            (this.mount_list[this.mount_sel].name == "Rear-Mounted Pusher" ||
                this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
                || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull")) {
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
            stats.era.push({ name: "Air Cooling Fan", era: "WWII" });
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
            stats = stats.Add(this.mount_list[this.mount_sel].stats);
            stats.maxstrain -= Math.floor(1.0e-6 + this.mount_list[this.mount_sel].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(1.0e-6 + this.mount_list[this.mount_sel].dragfactor * this.etype_stats.stats.mass);
        }
        // Power Generation
        if (this.is_generator) {
            stats.charge = Math.floor(1.0e-6 + 2 * stats.power / 10) + 2;
            stats.power = 0;
        }
        else if (this.has_alternator) {
            stats.charge = Math.floor(1.0e-6 + stats.power / 10) + 1;
            stats.mass += 1;
            stats.cost += 2;
        }
        if (this.outboard_prop) {
            stats.drag += 3;
            if (this.use_pp) {
                stats.escape += 2;
            }
        }
        stats.pitchspeed = 0;
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
