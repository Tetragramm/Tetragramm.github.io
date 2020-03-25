// export { Engine };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
// import { EngineStats } from "./EngineStats";
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />

class Engine extends Part {
    private engine_list: EngineStats[];
    private selected_index: number;
    private etype_stats: EngineStats;

    private cooling_count: number;
    private radiator_index: number;
    private num_radiators: number;

    private mount_list: { name: string, stats: Stats, strainfactor: number, dragfactor: number, pp_type: string, reqED: boolean, reqTail: boolean }[];
    private selected_mount: number;
    private mount_stats: Stats;

    private pp_list: { name: string, powerfactor: number }[];
    private use_pp: boolean;
    private torque_to_struct: boolean;

    private use_ds: boolean;
    private gp_count: number;
    private gpr_count: number;

    private cowl_list: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[];
    private cowl_sel: number;

    private total_reliability: number;

    constructor(el: EngineStats[],
        ml: { name: string, stats: Stats, strainfactor: number, dragfactor: number, pp_type: string, reqED: boolean, reqTail: boolean }[],
        ppl: { name: string, powerfactor: number }[],
        cl: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[]) {

        super();
        this.engine_list = el;
        this.selected_index = 0;
        this.etype_stats = this.engine_list[0].Clone();

        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;

        this.mount_list = ml;
        this.selected_mount = 0;
        this.mount_stats = this.mount_list[0].stats;

        this.pp_list = ppl;
        this.use_pp = false;
        this.torque_to_struct = false;

        this.cowl_list = cl;
        this.cowl_sel = 0;

        this.gp_count = 0;
        this.gpr_count = 0;

        this.total_reliability = 0;

        if (el.length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }

    public toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.selected_mount,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
        };
    }

    public fromJSON(js: JSON) {
        this.etype_stats.fromJSON(js["selected_stats"]);
        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.selected_mount = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.selected_index = -1;
        for (let i = 0; i < this.engine_list.length; i++) {
            if (this.etype_stats.Equal(this.engine_list[i])) {
                this.selected_index = i;
                break;
            }
        }
    }

    public GetMaxAltitude() {
        return this.etype_stats.altitude;
    }

    public SetSelectedIndex(num: number) {
        this.selected_index = num;
        this.etype_stats = this.engine_list[this.selected_index].Clone();
        if (num >= this.engine_list.length)
            throw "Index is out of range of engine_list.";
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.CalculateStats();
    }

    public GetSelectedIndex(): number {
        return this.selected_index;
    }

    public SetCustomStats(stats: EngineStats) {
        this.selected_index = -1;
        this.etype_stats = stats;
        this.PulseJetCheck();
        this.cooling_count = Math.min(this.cooling_count, this.etype_stats.stats.cooling);
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }

    public GetCurrentStats(): EngineStats {
        let stats = new EngineStats();
        stats = stats.Add(this.etype_stats);
        return stats;
    }

    public NeedCooling(): boolean {
        return this.cooling_count > 0;
    }

    public WarnCoolingReliability(): boolean {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }

    public SetCooling(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.cooling_count = num;
        this.CalculateStats();
    }

    public GetCooling(): number {
        return this.cooling_count;
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

    public GetListOfEngines(): EngineStats[] {
        return this.engine_list;
    }

    public RequiresExtendedDriveshafts(): boolean {
        return this.mount_list[this.selected_mount].reqED;
    }

    public RequiresTailMod(): boolean {
        if (this.use_ds)
            return false;
        return this.mount_list[this.selected_mount].reqTail;
    }

    public SetMountIndex(num: number) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.selected_mount = num;
        this.mount_stats = this.mount_list[num].stats;
        if (this.mount_list[this.selected_mount].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }

    public GetMountIndex(): number {
        if (this.GetIsPulsejet())
            return -1;
        return this.selected_mount;
    }

    public SetUsePushPull(use: boolean) {
        this.use_pp = use;
        this.CalculateStats();
    }

    public GetUsePushPull(): boolean {
        return this.use_pp;
    }

    public GetMountList(): { name: string, stats: Stats, strainfactor: number, dragfactor: number, pp_type: string, reqED: boolean, reqTail: boolean }[] {
        return this.mount_list;
    }

    public SetUseExtendedDriveshaft(use: boolean) {
        this.use_ds = use || this.RequiresExtendedDriveshafts();
        this.CalculateStats();
    }

    public GetUseExtendedDriveshaft(): boolean {
        return this.use_ds;
    }

    public SetGearCount(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }

    public GetGearCount(): number {
        return this.gp_count;
    }

    public SetGearReliability(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
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
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.selected_mount].pp_type == "wing";
    }

    public UpdateReliability(num: number) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        if (this.NeedCooling()) {
            this.total_reliability -= (this.etype_stats.stats.cooling - this.cooling_count);
        }
        this.total_reliability += num;
    }

    public GetReliability(): number {
        return this.total_reliability;
    }

    public GetOverspeed(): number {
        return this.etype_stats.overspeed + Math.floor(this.gp_count * this.etype_stats.overspeed / 2);
    }

    public GetIsPulsejet(): boolean {
        return this.etype_stats.pulsejet;
    }

    private PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.etype_stats.stats.cooling = 0;
            this.etype_stats.overspeed = 100;
            this.etype_stats.altitude = 100;
            this.etype_stats.torque = 0;
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            if (this.mount_list[this.selected_mount].pp_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].pp_type != "fuselage")
                        break;
                }
            }
        }
        else {
            this.etype_stats.rumble = 0;
        }
    }

    public GetHavePropeller() {
        return !this.GetIsPulsejet(); //TODO: Charge and Generators
    }

    public GetIsTractorNacelle() {
        if (!this.GetIsPulsejet()
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].pp_type == "wing")
            return true;
        return false;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
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
            if (this.GetIsPulsejet()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
            }
            else if (this.NeedCooling()) { //Means air cooled
                lst.push(c.liquid);
            }
            else if (this.etype_stats.oiltank) { //Means rotary
                lst.push(c.rotary);
            }
            else { //Means liquid
                lst.push(c.air);
            }
        }
        return lst;
    }

    private VerifyCowl(num: number) {
        var can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        else if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }

    public SetCowl(num: number) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }

    public PartStats(): Stats {
        let stats = new Stats;
        if (this.selected_index > 0)
            stats = stats.Add(this.etype_stats.stats);
        else
            stats = stats.Add(this.etype_stats.stats);

        if (this.etype_stats.oiltank)
            stats.mass += 1;

        if (this.mount_list[this.selected_mount].pp_type == "fuselage")
            stats.latstab -= this.etype_stats.torque;
        else if (this.mount_list[this.selected_mount].pp_type == "wing") {
            if (this.torque_to_struct)
                stats.structure -= this.etype_stats.torque;
            else
                stats.maxstrain -= this.etype_stats.torque;
        }

        stats.structure -= this.etype_stats.rumble;
        stats.flightstress += this.etype_stats.rumble;

        //Push-pull
        if (this.use_pp) {
            var pp_type = this.mount_list[this.selected_mount].pp_type;
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.power = Math.floor(this.pp_list[pp_type].powerfactor * stats.power);
        }

        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(stats.mass * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(stats.drag * this.cowl_list[this.cowl_sel].ed);
        if (this.cowl_sel != 0 && this.mount_list[this.selected_mount].reqTail)
            stats.cost += 2;

        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!this.etype_stats.pulsejet) {
            stats = stats.Add(this.mount_stats);
            stats.maxstrain -= Math.floor(this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }

        //Upgrades
        if (this.use_ds) {
            stats.mass += Math.floor(stats.power / 10);
            stats.cost += 2 * Math.floor(stats.power / 10);
        }
        stats.cost += this.gp_count + this.gpr_count;


        //Reliability is a part local issue.
        stats.reliability = 0;

        return stats;
    }
}