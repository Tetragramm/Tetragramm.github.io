/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Accessories extends Part {
    private armour_coverage: number[];
    //Electrical
    private electric_list: {
        name: string, stats: Stats,
        cp10p: number
    }[];
    private electrical_count: number[];
    private radio_list: { name: string, stats: Stats }[];
    private radio_sel: number;
    //Information
    private info_list: { name: string, stats: Stats }[];
    private info_sel: boolean[];
    //Visibility
    private visi_list: { name: string, stats: Stats }[];
    private visi_sel: boolean[];
    //Climate
    private clim_list: { name: string, stats: Stats, req_radiator: boolean }[];
    private clim_sel: boolean[];
    //Control
    private auto_list: { name: string, stats: Stats }[];
    private auto_sel: number;
    private cont_list: { name: string, stats: Stats }[];
    private cont_sel: number;

    private acft_power: number;
    private acft_rad: boolean;

    constructor(js: JSON) {
        super();

        this.armour_coverage = [...Array(8).fill(0)];
        this.acft_power = 0;

        this.electric_list = [];
        for (let elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10p: elem["cp10p"]
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];

        this.radio_list = [];
        this.radio_sel = 0;
        for (let elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.info_list = [];
        for (let elem of js["information"]) {
            this.info_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.info_sel = [...Array(this.info_list.length).fill(false)];

        this.visi_list = [];
        for (let elem of js["visibility"]) {
            this.visi_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.visi_sel = [...Array(this.visi_list.length).fill(false)];

        this.clim_list = [];
        for (let elem of js["climate"]) {
            this.clim_list.push({ name: elem["name"], stats: new Stats(elem), req_radiator: elem["req_radiator"] });
        }
        this.clim_sel = [...Array(this.clim_list.length).fill(false)];

        this.auto_list = [];
        this.auto_sel = 0;
        for (let elem of js["autopilots"]) {
            this.auto_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.cont_list = [];
        this.cont_sel = 0;
        for (let elem of js["control"]) {
            this.cont_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
    }

    public toJSON() {
        return {
            v: 2,
            armour_coverage: this.armour_coverage,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            info_sel: this.info_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }

    public fromJSON(js: JSON) {
        if (js["v"] == 2) {
            this.armour_coverage = js["armour_coverage"];
        }
        this.electrical_count = js["electrical_count"];
        this.radio_sel = js["radio_sel"];
        this.info_sel = js["info_sel"];
        this.visi_sel = js["visi_sel"];
        this.clim_sel = js["clim_sel"];
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }

    public GetCommunicationName() {
        return this.radio_list[this.radio_sel].name;
    }

    public GetArmourCoverage() {
        return this.armour_coverage;
    }

    public SetArmourCoverage(idx: number, num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.armour_coverage[idx] = num;
        this.CalculateStats();
    }

    public GetElectricalList() {
        return this.electric_list;
    }

    public GetElectricalCount() {
        return this.electrical_count;
    }

    public SetElectricalCount(idx: number, count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        count = Math.min(count, 5);
        this.electrical_count[idx] = count;
        this.CalculateStats();
    }

    public GetRadioList() {
        return this.radio_list;
    }

    public GetRadioSel() {
        return this.radio_sel;
    }

    public SetRadioSel(num: number) {
        this.radio_sel = num;
        this.CalculateStats();
    }

    public GetInfoList() {
        return this.info_list;
    }

    public GetInfoSel() {
        return this.info_sel;
    }

    public SetInfoSel(idx: number, use: boolean) {
        this.info_sel[idx] = use;
        this.CalculateStats();
    }

    public GetVisibilityList() {
        return this.visi_list;
    }

    public GetVisibilitySel() {
        return this.visi_sel;
    }

    public SetVisibilitySel(idx: number, use: boolean) {
        this.visi_sel[idx] = use;
        this.CalculateStats();
    }

    public GetClimateList() {
        return this.clim_list;
    }

    public GetClimateSel() {
        return this.clim_sel;
    }

    public GetClimateEnable() {
        var can = [];
        for (let c of this.clim_list) {
            if (!this.acft_rad && c.req_radiator)
                can.push(false);
            else
                can.push(true);
        }
        return can;
    }

    public SetClimateSel(idx: number, use: boolean) {
        this.clim_sel[idx] = use;
        this.CalculateStats();
    }

    public GetAutopilotList() {
        return this.auto_list;
    }

    public GetAutopilotSel() {
        return this.auto_sel;
    }

    public SetAutopilotSel(num: number) {
        this.auto_sel = num;
        this.CalculateStats();
    }

    public GetControlList() {
        return this.cont_list;
    }

    public GetControlSel() {
        return this.cont_sel;
    }

    public SetControlSel(num: number) {
        this.cont_sel = num;
        this.CalculateStats();
    }

    public SetAcftPower(pwr: number) {
        this.acft_power = pwr;
    }

    public SetAcftRadiator(have: boolean) {
        this.acft_rad = have;
    }

    public IsElectrics() {
        for (let e of this.electrical_count) {
            if (e > 0)
                return true;
        }
        if (this.auto_list[this.auto_sel].stats.charge != 0)
            return true;
        return false;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        //Armour
        for (let i = 0; i < this.armour_coverage.length; i++) {
            let AP = i + 1;
            stats.mass += this.armour_coverage[i] * AP;
            stats.cost += Math.floor(this.armour_coverage[i] * AP / 3);
            stats.toughness += this.armour_coverage[i] * AP;
        }

        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            let ts = this.electric_list[i].stats.Clone();
            ts = ts.Multiply(this.electrical_count[i]);
            stats = stats.Add(ts);
            stats.charge += Math.floor(this.electrical_count[i] * this.electric_list[i].cp10p * this.acft_power / 10);
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);


        //Information
        for (let i = 0; i < this.info_list.length; i++) {
            if (this.info_sel[i])
                stats = stats.Add(this.info_list[i].stats);
        }


        //Visibility
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i])
                stats = stats.Add(this.visi_list[i].stats);
        }


        //Climate
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && (!this.clim_list[i].req_radiator || this.acft_rad))
                stats = stats.Add(this.clim_list[i].stats);
        }


        //Control
        stats = stats.Add(this.auto_list[this.auto_sel].stats);
        stats = stats.Add(this.cont_list[this.cont_sel].stats);


        return stats;
    }
}