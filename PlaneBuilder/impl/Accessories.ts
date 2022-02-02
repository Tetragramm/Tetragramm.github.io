/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Accessories extends Part {
    private armour_coverage: number[];
    //Electrical
    private electric_list: {
        name: string, stats: Stats,
        cp10s: number, storage: number,
    }[];
    private electrical_count: number[];
    private radio_list: { name: string, stats: Stats }[];
    private radio_sel: number;
    //Recon
    private recon_list: { name: string, stats: Stats }[];
    private recon_sel: number[];
    //Visibility
    private visi_list: { name: string, stats: Stats }[];
    private visi_sel: boolean[];
    private can_visi: boolean[];
    //Climate
    private clim_list: { name: string, stats: Stats, req_radiator: boolean }[];
    private clim_sel: boolean[];
    //Control
    private auto_list: { name: string, stats: Stats }[];
    private auto_sel: number;
    private cont_list: { name: string, max_mass_stress: number, max_total_stress: number, stats: Stats }[];
    private cont_sel: number;

    private acft_power: number;
    private acft_rad: boolean;
    private skin_armour: number;
    private vital_parts: number;

    constructor(js: JSON) {
        super();

        this.armour_coverage = [...Array(8).fill(0)];
        this.acft_power = 0;
        this.acft_rad = false;
        this.skin_armour = 0;

        this.electric_list = [];
        for (let elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10s: elem["cp10s"], storage: elem["storage"],
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];

        this.radio_list = [];
        this.radio_sel = 0;
        for (let elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.recon_list = [];
        for (let elem of js["recon"]) {
            this.recon_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.recon_sel = Array(this.recon_list.length).fill(0);

        this.visi_list = [];
        for (let elem of js["visibility"]) {
            this.visi_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.visi_sel = [...Array(this.visi_list.length).fill(false)];
        this.can_visi = [...Array(this.visi_list.length).fill(true)];

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
            this.cont_list.push({ name: elem["name"], max_mass_stress: elem["max_mass_stress"], max_total_stress: elem["max_total_stress"], stats: new Stats(elem) });
        }
    }

    public toJSON() {
        return {
            v: 2,
            armour_coverage: this.armour_coverage,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            recon_sel: this.recon_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        if (js["v"] == 2) {
            this.armour_coverage = js["armour_coverage"];
        }
        if (json_version < 11.85) {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        } else {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length);
        }
        this.radio_sel = js["radio_sel"];
        if (json_version < 12.05) {
            let old_info = BoolArr(js["info_sel"], 2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        } else {
            this.recon_sel = NumArr(js["recon_sel"], this.recon_sel.length);
        }
        this.visi_sel = BoolArr(js["visi_sel"], this.visi_sel.length);
        this.clim_sel = BoolArr(js["clim_sel"], this.clim_sel.length);
        if (json_version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }

    public serialize(s: Serialize) {
        s.PushNumArr(this.armour_coverage);
        s.PushNumArr(this.electrical_count);
        s.PushNum(this.radio_sel);
        s.PushNumArr(this.recon_sel)
        s.PushBoolArr(this.visi_sel);
        s.PushBoolArr(this.clim_sel);
        s.PushNum(this.auto_sel);
        s.PushNum(this.cont_sel);
    }

    public deserialize(d: Deserialize) {
        this.armour_coverage = d.GetNumArr(this.armour_coverage.length);
        if (d.version < 11.85) {
            this.electrical_count = d.GetNumArr(this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        } else {
            this.electrical_count = d.GetNumArr(this.electrical_count.length);
        }
        this.radio_sel = d.GetNum();
        if (d.version < 12.05) {
            let old_info = d.GetBoolArr(2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        } else {
            this.recon_sel = d.GetNumArr(this.recon_sel.length);
        }
        this.visi_sel = d.GetBoolArr(this.visi_sel.length);
        this.clim_sel = d.GetBoolArr(this.clim_sel.length);
        if (d.version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = d.GetNum();
        this.cont_sel = d.GetNum();
    }

    public GetCommunicationName() {
        return lu(this.radio_list[this.radio_sel].name);
    }

    public GetArmourCoverage() {
        return this.armour_coverage;
    }

    public GetEffectiveCoverage() {
        var arr = [];
        var vital_adj = Math.max(0, Math.floor((this.vital_parts - 8) / 2));
        for (let i = 0; i < this.armour_coverage.length; i++) {
            arr.push(Math.max(0, this.armour_coverage[i]));
        }
        var sum = 0;
        for (let r = this.armour_coverage.length - 1; r >= 0; r--) {
            sum += arr[r];
            arr[r] = sum - vital_adj;
        }
        return arr;
    }

    public SetArmourCoverage(idx: number, num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.armour_coverage[idx] = num;
        this.NormalizeCoverage();
        this.CalculateStats();
    }

    private NormalizeCoverage() {
        var coverage = -8 + Math.min(0, -Math.floor(1.0e-6 + (this.vital_parts - 8) / 2));
        for (let i = this.armour_coverage.length - 1; i >= 0; i--) {
            if (i == 1) {
                coverage += this.skin_armour;
            }
            this.armour_coverage[i] = Math.max(0, Math.min(Math.abs(coverage), this.armour_coverage[i]));
            coverage += this.armour_coverage[i];
        }
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
        count = Math.floor(1.0e-6 + count);
        count = Math.min(count, 50);
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

    public GetReconList() {
        return this.recon_list;
    }

    public GetReconSel() {
        return this.recon_sel;
    }

    public SetReconSel(idx: number, num: number) {
        num = Math.trunc(num);
        if (num != num || num < 0)
            num = 0;
        this.recon_sel[idx] = num;
        this.CalculateStats();
    }

    public GetVisibilityList() {
        return this.visi_list;
    }

    public GetCanVisibility() {
        return this.can_visi;
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
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && this.clim_list[i].stats.charge != 0)
                return true;
        }
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i] && this.visi_list[i].stats.charge != 0)
                return true;
        }
        if (this.radio_list[this.radio_sel].stats.charge != 0)
            return true;
        if (this.auto_list[this.auto_sel].stats.charge != 0)
            return true;
        return false;
    }

    public SetSkinArmor(num: number) {
        if (num < this.skin_armour)
            this.armour_coverage[1] += num - this.skin_armour;
        this.skin_armour = num;
        this.armour_coverage[1] = Math.max(this.armour_coverage[1], this.skin_armour);
    }

    public SetVitalParts(num: number) {
        this.vital_parts = num;
        this.NormalizeCoverage();
    }

    public GetMaxMassStress() {
        return this.cont_list[this.cont_sel].max_mass_stress;
    }

    public GetMaxTotalStress() {
        return this.cont_list[this.cont_sel].max_total_stress;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetStorage() {
        return 5 * this.electrical_count[2]
            + 5 * this.electrical_count[3];
    }

    public GetWindmill() {
        var production = 0;
        for (let i = 0; i < this.electrical_count.length; i++) {
            production += this.electric_list[i].cp10s * this.electrical_count[i];
        }
        return production;
    }

    public SetCanCutouts(wing: boolean, frame: boolean) {
        this.can_visi[0] = wing;
        this.can_visi[1] = frame;
        if (!wing) {
            this.visi_sel[0] = false;
        }
        if (!frame) {
            this.visi_sel[1] = false;
        }
    }

    public PartStats() {
        var stats = new Stats();

        this.armour_coverage[1] = Math.max(this.armour_coverage[1], this.skin_armour);
        var armour_str = "";
        //Armour
        var eff_armour = this.GetEffectiveCoverage();
        for (let i = 0; i < this.armour_coverage.length; i++) {
            let AP = i + 1;
            var count = this.armour_coverage[i];
            if (AP == 2) {
                count -= this.skin_armour;
            }

            stats.mass += count * Math.pow(2, AP - 1);
            stats.cost += Math.floor(1.0e-6 + count * AP / 3);
            stats.toughness += this.armour_coverage[i] * AP;
            if (eff_armour[i] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                armour_str += AP.toString() + "/" + (11 - eff_armour[i]).toString() + "+";
            }
        }
        if (armour_str != "") {
            stats.warnings.push({
                source: lu("Armour"), warning: armour_str,
                color: WARNING_COLOR.WHITE,
            });
        }

        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            if (this.electrical_count[i] > 0) {
                let ts = this.electric_list[i].stats.Clone();
                ts = ts.Multiply(this.electrical_count[i]);
                stats = stats.Add(ts);
            }
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);


        //Information
        for (let i = 0; i < this.recon_list.length; i++) {
            if (this.recon_sel[i] > 0) {
                let ts = this.recon_list[i].stats.Clone();
                ts = ts.Multiply(this.recon_sel[i]);
                stats = stats.Add(ts);
            }
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

        stats.Round();
        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        var battery_storage = 0;
        var equipment: { source: string, charge: string }[] = [];
        for (let i = 0; i < this.electric_list.length; i++) {
            let item = this.electric_list[i];
            let count = this.electrical_count[i];
            if (count > 0) {
                battery_storage += item.storage * count;
                if (item.cp10s > 0) {
                    equipment.push({
                        source: lu(item.name),
                        charge: StringFmt.Format("{0}" + lu("Derived Per 10 Speed"), Math.floor(1.0e-6 + count * item.cp10s)),
                    });
                } else if (item.stats.charge != 0) {
                    equipment.push({
                        source: lu(item.name),
                        charge: (count * item.stats.charge).toString(),
                    });
                }
            }
        }

        let radio = this.radio_list[this.radio_sel];
        equipment = this.FormatEquipment(equipment, radio.name, radio.stats.charge);

        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i]) {
                let item = this.clim_list[i];
                equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
            }
        }

        for (let i = 0; i < this.recon_list.length; i++) {
            let item = this.recon_list[i];
            let count = this.recon_sel[i];
            if (count > 0) {
                equipment = this.FormatEquipment(equipment, item.name, count * item.stats.charge);
            }
        }

        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i]) {
                let item = this.visi_list[i];
                equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
            }
        }

        let autopilot = this.auto_list[this.auto_sel];
        equipment = this.FormatEquipment(equipment, autopilot.name, autopilot.stats.charge);

        let controls = this.cont_list[this.cont_sel];
        equipment = this.FormatEquipment(equipment, controls.name, controls.stats.charge);



        return { storage: battery_storage, equipment: equipment };
    }
}