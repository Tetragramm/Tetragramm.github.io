/// <reference path="../disp/Tools.ts" />
/// <reference path="./EngineBuilder.ts" />
/// <reference path="./PulsejetBuilder.ts" />
/// <reference path="../lz/lz-string.ts" />
/// <reference path="../string/index.ts" />
/// <reference path="../JSON2CSV/json2csv.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var ep = sp.get("engine");
    var lang = sp.get("lang");

    var jsons = ['/PlaneBuilder/strings.json', '/PlaneBuilder/engines.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(
            resp => {
                var string_JSON = resp[0];
                var engine_JSON = resp[1];
                //Strings bit
                local = new Localization(string_JSON);
                if (lang) {
                    local.SetLanguages(lang);
                } else if (window.localStorage.language) {
                    local.SetLanguages(window.localStorage.language);
                }

                //Engine Bit
                var nameliststr = window.localStorage.getItem("engines_names");
                var namelist: string[] = [];
                if (nameliststr) {
                    namelist = JSON.parse(nameliststr) as string[];
                    for (let n of namelist) {
                        n = n.trim();
                        n = n.replace(/\s+/g, ' ');
                        if (n != "") {
                            engine_list.set(n, new EngineList(n));
                        }
                    }
                }

                for (let el of engine_JSON["lists"]) {
                    if (!engine_list.has(el["name"]))
                        engine_list.set(el["name"], new EngineList(el["name"]));
                    if (el["name"] != "Custom") {
                        engine_list.get(el["name"]).fromJSON(el, true);
                        engine_list.get(el["name"]).SetConstant();
                    } else {
                        engine_list.get(el["name"]).fromJSON(el, false);
                    }
                }


                ebuild = new EngineBuilder_HTML();
                ebuild.UpdateList();
            }
        );

    if (ep != null) {
        try {
            var str = LZString.decompressFromEncodedURIComponent(ep);
            var arr = _stringToArrayBuffer(str);
            var des = new Deserialize(arr);
            var num = engine_list.get("Custom").deserializeEngine(des);
            ebuild.SelectEngine(num);
        } catch { console.log("Compressed Engine Parameter Failed."); }
    }
    enable_anim = true;
}
window.onload = init;

var ebuild: EngineBuilder_HTML;
var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;
var enable_anim = false;

class EngineBuilder_HTML {
    private pulsejetbuilder: PulsejetBuilder;
    private enginebuilder: EngineBuilder;
    private turbobuilder: TurboBuilder;

    //Engine Inputs
    private e_name: HTMLInputElement;
    private e_sera: HTMLSelectElement;
    private e_cool: HTMLSelectElement;
    private e_disp: HTMLInputElement;
    private e_ncyl: HTMLInputElement;
    private e_nrow: HTMLInputElement;
    private e_cmpr: HTMLInputElement;
    private e_rpmb: HTMLInputElement;
    private e_mfdg: HTMLInputElement;
    private e_qfdg: HTMLInputElement;
    private e_ctyp: HTMLSelectElement;
    private e_ccnt: HTMLInputElement;
    private e_mIA: HTMLInputElement;
    private e_upgs: HTMLInputElement[];
    //Engine Outputs
    private ed_name: HTMLLabelElement;
    private ed_powr: HTMLLabelElement;
    private ed_mass: HTMLLabelElement;
    private ed_drag: HTMLLabelElement;
    private ed_rely: HTMLLabelElement;
    private ed_cool: HTMLLabelElement;
    private ed_ospd: HTMLLabelElement;
    private ed_fuel: HTMLLabelElement;
    private ed_malt: HTMLLabelElement;
    private ed_torq: HTMLLabelElement;
    private ed_cost: HTMLLabelElement;
    private ed_oilt: HTMLLabelElement;
    private ed_grpm: HTMLLabelElement;

    //Pulsejet Inputs
    private p_powr: HTMLInputElement;
    private p_type: HTMLSelectElement;
    private p_sera: HTMLSelectElement;
    private p_bqul: HTMLInputElement;
    private p_strt: HTMLInputElement;
    //Pulsejet Outputs
    private pd_name: HTMLLabelElement;
    private pd_powr: HTMLLabelElement;
    private pd_mass: HTMLLabelElement;
    private pd_drag: HTMLLabelElement;
    private pd_rely: HTMLLabelElement;
    private pd_fuel: HTMLLabelElement;
    private pd_rumb: HTMLLabelElement;
    private pd_cost: HTMLLabelElement;
    private pd_malt: HTMLLabelElement;
    private pd_dcst: HTMLLabelElement;

    //TurboX Inputs
    private t_name: HTMLInputElement;
    private t_era: HTMLSelectElement;
    private t_type: HTMLSelectElement;
    private t_effi: HTMLInputElement;
    private t_diam: HTMLInputElement;
    private t_comp: HTMLInputElement;
    private t_bypr: HTMLInputElement;
    private t_aftb: HTMLInputElement;
    //TurboX Outputs
    private td_desc: HTMLTableCellElement;
    private td_name: HTMLLabelElement;
    private td_powr: HTMLLabelElement;
    private td_mass: HTMLLabelElement;
    private td_drag: HTMLLabelElement;
    private td_rely: HTMLLabelElement;
    private td_fuel: HTMLLabelElement;
    private td_cost: HTMLLabelElement;
    private td_malt: HTMLLabelElement;

    //Manual Inputs
    private m_name: HTMLInputElement;
    private m_pwr: HTMLInputElement;
    private m_mass: HTMLInputElement;
    private m_drag: HTMLInputElement;
    private m_rely: HTMLInputElement;
    private m_cool: HTMLInputElement;
    private m_over: HTMLInputElement;
    private m_fuel: HTMLInputElement;
    private m_alti: HTMLInputElement;
    private m_torq: HTMLInputElement;
    private m_rumb: HTMLInputElement;
    private m_cost: HTMLInputElement;
    private m_oil: HTMLInputElement;
    private m_pulsejet: HTMLInputElement;
    private m_turbo: HTMLInputElement;

    //List Modification
    private list_idx: string;
    private m_list_select: HTMLSelectElement;
    private m_select: HTMLSelectElement;
    private m_delete: HTMLButtonElement;
    private m_add_eb: HTMLButtonElement;
    private m_add_pj: HTMLButtonElement;
    private m_add_tb: HTMLButtonElement;
    private m_save_csv: HTMLButtonElement;
    private m_save: HTMLButtonElement;
    private m_load: HTMLInputElement;
    private m_list_create: HTMLButtonElement;
    private m_list_delete: HTMLButtonElement;
    private m_list_input: HTMLInputElement;

    constructor() {
        this.enginebuilder = new EngineBuilder();
        this.pulsejetbuilder = new PulsejetBuilder();
        this.turbobuilder = new TurboBuilder();

        var etbl = document.getElementById("table_engine") as HTMLTableElement;
        var erow = etbl.insertRow();
        this.InitEngineInputs(erow.insertCell());
        this.InitEngineUpgrades(erow.insertCell());
        this.InitEngineOutputs(erow.insertCell());
        this.UpdateEngine();

        var ptbl = document.getElementById("table_pulsejet") as HTMLTableElement;
        var prow = ptbl.insertRow();
        this.InitPulsejetInputs(prow.insertCell());
        this.InitPulsejetOutputs(prow.insertCell());
        this.UpdatePulsejet();

        var ptbl = document.getElementById("table_turbox") as HTMLTableElement;
        var prow = ptbl.insertRow();
        this.InitTurboXInputs(prow.insertCell());
        this.td_desc = prow.insertCell();
        this.InitTurboXOutputs(prow.insertCell());
        this.UpdateTurboX();

        var mtbl = document.getElementById("table_manual") as HTMLTableElement;
        var mrow = mtbl.insertRow();
        this.InitManual(mrow.insertCell());
        this.InitListManagement(mrow.insertCell());
    }

    private InitEngineInputs(cell: HTMLTableCellElement) {
        this.e_name = document.createElement("INPUT") as HTMLInputElement;
        this.e_sera = document.createElement("SELECT") as HTMLSelectElement;
        this.e_cool = document.createElement("SELECT") as HTMLSelectElement;
        this.e_disp = document.createElement("INPUT") as HTMLInputElement;
        this.e_cmpr = document.createElement("INPUT") as HTMLInputElement;
        this.e_ncyl = document.createElement("INPUT") as HTMLInputElement;
        this.e_nrow = document.createElement("INPUT") as HTMLInputElement;
        this.e_rpmb = document.createElement("INPUT") as HTMLInputElement;
        this.e_mfdg = document.createElement("INPUT") as HTMLInputElement;
        this.e_qfdg = document.createElement("INPUT") as HTMLInputElement;
        for (let e of this.enginebuilder.EraTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.e_sera.add(opt);
        }
        for (let c of this.enginebuilder.CoolingTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = c.name;
            this.e_cool.add(opt);
        }

        var fs = CreateFlexSection(cell);
        FlexText("Name", this.e_name, fs);
        FlexSelect("Era", this.e_sera, fs);
        FlexSelect("Engine Type", this.e_cool, fs);
        FlexInput("Engine Displacement (L)", this.e_disp, fs);
        FlexInput("Compression Ratio (N:1)", this.e_cmpr, fs);
        FlexInput("Cylinders per Row", this.e_ncyl, fs);
        FlexInput("Number of Rows", this.e_nrow, fs);
        FlexInput("RPM Boost", this.e_rpmb, fs);
        FlexInput("Material Fudge Factor", this.e_mfdg, fs);
        FlexInput("Quality Fudge Factor", this.e_qfdg, fs);

        this.e_disp.min = "0.01";
        this.e_disp.step = "0.01";
        this.e_cmpr.min = "0.01";
        this.e_cmpr.step = "0.01";
        this.e_ncyl.min = "1";
        this.e_nrow.min = "1";
        this.e_rpmb.min = "0.01";
        this.e_rpmb.step = "0.01";
        this.e_rpmb.max = "2000";
        this.e_mfdg.min = "0.1";
        this.e_mfdg.step = "0.1";
        this.e_mfdg.max = "1.9";
        this.e_qfdg.step = "0.1";
        this.e_qfdg.min = "0.1";
        this.e_qfdg.max = "1.9";

        this.e_name.onchange = () => { this.enginebuilder.name = this.e_name.value; this.UpdateEngine(); };
        this.e_sera.onchange = () => { this.enginebuilder.era_sel = this.e_sera.selectedIndex; this.UpdateEngine(); };
        this.e_cool.onchange = () => { this.enginebuilder.cool_sel = this.e_cool.selectedIndex; this.UpdateEngine(); };
        this.e_disp.onchange = () => { this.enginebuilder.engine_displacement = this.e_disp.valueAsNumber; this.UpdateEngine(); };
        this.e_cmpr.onchange = () => { this.enginebuilder.compression_ratio = this.e_cmpr.valueAsNumber; this.UpdateEngine(); };
        this.e_ncyl.onchange = () => { this.enginebuilder.num_cyl_per_row = this.e_ncyl.valueAsNumber; this.UpdateEngine(); };
        this.e_nrow.onchange = () => { this.enginebuilder.num_rows = this.e_nrow.valueAsNumber; this.UpdateEngine(); };
        this.e_rpmb.onchange = () => { this.enginebuilder.rpm_boost = this.e_rpmb.valueAsNumber; this.UpdateEngine(); };
        this.e_mfdg.onchange = () => { this.enginebuilder.material_fudge = this.e_mfdg.valueAsNumber; this.UpdateEngine(); };
        this.e_qfdg.onchange = () => { this.enginebuilder.quality_fudge = this.e_qfdg.valueAsNumber; this.UpdateEngine(); };
    }

    private InitEngineUpgrades(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);

        this.e_ctyp = document.createElement("SELECT") as HTMLSelectElement;
        for (let e of this.enginebuilder.CompressorTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.e_ctyp.add(opt);
        }
        this.e_ccnt = document.createElement("INPUT") as HTMLInputElement;
        this.e_mIA = document.createElement("INPUT") as HTMLInputElement;

        this.e_ctyp.onchange = () => { this.enginebuilder.compressor_type = this.e_ctyp.selectedIndex; this.UpdateEngine(); };
        this.e_ccnt.onchange = () => { this.enginebuilder.compressor_count = this.e_ccnt.valueAsNumber; this.UpdateEngine(); };
        this.e_mIA.onchange = () => { this.enginebuilder.min_IAF = this.e_mIA.valueAsNumber; this.UpdateEngine(); };

        FlexSelect("Compressor Type", this.e_ctyp, fs);
        FlexInput("Compressor Count", this.e_ccnt, fs);
        FlexInput("Minimum Ideal Altitude", this.e_mIA, fs);
        this.e_ccnt.min = "0";
        this.e_ccnt.step = "1";
        this.e_mIA.min = "0";
        this.e_mIA.step = "10";

        this.e_upgs = [];
        //NOTE: Asperator Boot depricated, so start from 1.
        for (let i = 1; i < this.enginebuilder.Upgrades.length; i++) {
            let u = this.enginebuilder.Upgrades[i];
            let inp = document.createElement("INPUT") as HTMLInputElement;
            inp.onchange = () => { this.enginebuilder.upg_sel[i] = this.e_upgs[i - 1].checked; this.UpdateEngine(); };
            FlexCheckbox(u.name, inp, fs);
            this.e_upgs.push(inp);
        }
    }

    private InitEngineOutputs(cell: HTMLTableCellElement) {
        this.ed_name = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_powr = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_cool = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_ospd = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_malt = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_torq = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_oilt = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_grpm = document.createElement("LABEL") as HTMLLabelElement;
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.ed_name, fs);
        FlexDisplay("Power", this.ed_powr, fs);
        FlexDisplay("Mass", this.ed_mass, fs);
        FlexDisplay("Drag", this.ed_drag, fs);
        FlexDisplay("Reliability", this.ed_rely, fs);
        FlexDisplay("Required Cooling", this.ed_cool, fs);
        FlexDisplay("Overspeed", this.ed_ospd, fs);
        FlexDisplay("Fuel Consumption", this.ed_fuel, fs);
        FlexDisplay("Altitude", this.ed_malt, fs);
        FlexDisplay("Torque", this.ed_torq, fs);
        FlexDisplay("Cost", this.ed_cost, fs);
        FlexDisplay("Oil Tank", this.ed_oilt, fs);
        FlexDisplay("Geared RPM", this.ed_grpm, fs);
    }

    private UpdateEngine() {
        //Update and enfoce values before updating displayed values.
        var estats = this.enginebuilder.EngineStats();

        this.e_name.value = this.enginebuilder.name;
        this.e_sera.selectedIndex = this.enginebuilder.era_sel;
        this.e_cool.selectedIndex = this.enginebuilder.cool_sel;
        this.e_disp.valueAsNumber = this.enginebuilder.engine_displacement;
        this.e_ncyl.valueAsNumber = this.enginebuilder.num_cyl_per_row;
        this.e_nrow.valueAsNumber = this.enginebuilder.num_rows;
        this.e_cmpr.valueAsNumber = this.enginebuilder.compression_ratio;
        this.e_rpmb.valueAsNumber = this.enginebuilder.rpm_boost;
        this.e_mfdg.valueAsNumber = this.enginebuilder.material_fudge;
        this.e_qfdg.valueAsNumber = this.enginebuilder.quality_fudge;
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].checked = this.enginebuilder.upg_sel[i + 1];
        }
        this.e_ctyp.selectedIndex = this.enginebuilder.compressor_type;
        this.e_ccnt.valueAsNumber = this.enginebuilder.compressor_count;
        this.e_mIA.valueAsNumber = this.enginebuilder.min_IAF;

        var can_upg = this.enginebuilder.CanUpgrade();
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].disabled = !can_upg[i + 1];//NOTE: Asperator Boot depricated, so start from 1.
        }

        BlinkIfChanged(this.ed_name, estats.name);
        BlinkIfChanged(this.ed_powr, estats.stats.power.toString(), true);
        BlinkIfChanged(this.ed_mass, estats.stats.mass.toString(), false);
        BlinkIfChanged(this.ed_drag, estats.stats.drag.toString(), false);
        BlinkIfChanged(this.ed_rely, estats.stats.reliability.toString(), true);
        BlinkIfChanged(this.ed_cool, estats.stats.cooling.toString(), false);
        BlinkIfChanged(this.ed_ospd, estats.overspeed.toString(), true);
        BlinkIfChanged(this.ed_fuel, estats.stats.fuelconsumption.toString(), false);
        var b = this.enginebuilder.min_IAF;
        var t = this.enginebuilder.min_IAF + estats.altitude;
        BlinkIfChanged(this.ed_malt, b.toString() + "-" + t.toString());
        BlinkIfChanged(this.ed_torq, estats.torque.toString(), false);
        BlinkIfChanged(this.ed_cost, estats.stats.cost.toString(), false);
        if (estats.oiltank)
            BlinkIfChanged(this.ed_oilt, "Yes");
        else
            BlinkIfChanged(this.ed_oilt, "No");
        BlinkIfChanged(this.ed_grpm, (Math.round(100 * this.enginebuilder.GearedRPM()) / 100).toString());
    }

    private InitPulsejetInputs(cell: HTMLTableCellElement) {
        this.p_powr = document.createElement("INPUT") as HTMLInputElement;
        this.p_type = document.createElement("SELECT") as HTMLSelectElement;
        this.p_sera = document.createElement("SELECT") as HTMLSelectElement;
        this.p_bqul = document.createElement("INPUT") as HTMLInputElement;
        this.p_strt = document.createElement("INPUT") as HTMLInputElement;
        for (let v of this.pulsejetbuilder.ValveTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = v.name;
            this.p_type.add(opt);
        }
        for (let e of this.pulsejetbuilder.EraTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.p_sera.add(opt);
        }

        var fs = CreateFlexSection(cell);
        FlexInput("Desired Power", this.p_powr, fs);
        FlexSelect("Engine Type", this.p_type, fs);
        FlexSelect("Era", this.p_sera, fs);
        FlexInput("Quality", this.p_bqul, fs);
        FlexCheckbox("Starter", this.p_strt, fs);

        this.p_bqul.step = "0.1";
        this.p_bqul.min = "0";

        this.p_powr.onchange = () => { this.pulsejetbuilder.desired_power = this.p_powr.valueAsNumber; this.UpdatePulsejet(); };
        this.p_type.onchange = () => { this.pulsejetbuilder.valve_sel = this.p_type.selectedIndex; this.UpdatePulsejet(); };
        this.p_sera.onchange = () => { this.pulsejetbuilder.era_sel = this.p_sera.selectedIndex; this.UpdatePulsejet(); };
        this.p_bqul.onchange = () => { this.pulsejetbuilder.build_quality = this.p_bqul.valueAsNumber; this.pulsejetbuilder.overall_quality = this.p_bqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_strt.onchange = () => { this.pulsejetbuilder.starter = this.p_strt.checked; this.UpdatePulsejet(); };
    }

    private InitPulsejetOutputs(cell: HTMLTableCellElement) {
        this.pd_name = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_powr = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_rumb = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_malt = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_dcst = document.createElement("LABEL") as HTMLLabelElement;
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.pd_name, fs);
        FlexDisplay("Power", this.pd_powr, fs);
        FlexDisplay("Mass", this.pd_mass, fs);
        FlexDisplay("Drag", this.pd_drag, fs);
        FlexDisplay("Reliability", this.pd_rely, fs);
        FlexDisplay("Fuel Consumption", this.pd_fuel, fs);
        FlexDisplay("Rumble", this.pd_rumb, fs);
        FlexDisplay("Cost", this.pd_cost, fs);
        FlexDisplay("Altitude", this.pd_malt, fs);
        FlexDisplay("Design Cost", this.pd_dcst, fs);
    }

    private UpdatePulsejet() {
        this.p_powr.valueAsNumber = this.pulsejetbuilder.desired_power;
        this.p_type.selectedIndex = this.pulsejetbuilder.valve_sel;
        this.p_sera.selectedIndex = this.pulsejetbuilder.era_sel;
        this.p_bqul.valueAsNumber = this.pulsejetbuilder.build_quality;
        this.p_strt.checked = this.pulsejetbuilder.starter;

        var estats = this.pulsejetbuilder.EngineStats();
        BlinkIfChanged(this.pd_name, estats.name);
        BlinkIfChanged(this.pd_powr, estats.stats.power.toString());
        BlinkIfChanged(this.pd_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.pd_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.pd_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.pd_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.pd_rumb, estats.rumble.toString());
        BlinkIfChanged(this.pd_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.pd_malt, estats.altitude.toString());
        BlinkIfChanged(this.pd_dcst, this.pulsejetbuilder.DesignCost().toString());
    }

    private InitTurboXInputs(cell: HTMLTableCellElement) {
        this.t_name = document.createElement("INPUT") as HTMLInputElement;
        this.t_era = document.createElement("SELECT") as HTMLSelectElement;
        this.t_type = document.createElement("SELECT") as HTMLSelectElement;
        this.t_effi = document.createElement("INPUT") as HTMLInputElement;
        this.t_diam = document.createElement("INPUT") as HTMLInputElement;
        this.t_comp = document.createElement("INPUT") as HTMLInputElement;
        this.t_bypr = document.createElement("INPUT") as HTMLInputElement;
        this.t_aftb = document.createElement("INPUT") as HTMLInputElement;

        var fs = CreateFlexSection(cell);
        FlexText("Name", this.t_name, fs);
        FlexSelect("Era", this.t_era, fs);
        FlexSelect("Type", this.t_type, fs);
        FlexInput("Engine Diameter (m)", this.t_diam, fs);
        FlexInput("Overall Pressure Ratio", this.t_comp, fs);
        FlexInput("Bypass Ratio", this.t_bypr, fs);
        FlexInput("Mass Flow Adjustment", this.t_effi, fs);
        FlexCheckbox("Afterburner", this.t_aftb, fs);

        this.t_effi.step = "0.05";
        this.t_effi.min = "-0.5";
        this.t_effi.max = "0.5";
        this.t_diam.step = "0.01";
        this.t_comp.step = "0.01";
        this.t_bypr.step = "0.1";

        for (let e of this.turbobuilder.EraTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.t_era.add(opt);
        }

        for (let t of this.turbobuilder.TypeTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = t.name;
            this.t_type.add(opt);
        }

        this.t_name.onchange = () => { this.turbobuilder.name = this.t_name.value; this.UpdateTurboX(); };
        this.t_era.onchange = () => { this.turbobuilder.era_sel = this.t_era.selectedIndex; this.UpdateTurboX(); };
        this.t_type.onchange = () => { this.turbobuilder.type_sel = this.t_type.selectedIndex; this.UpdateTurboX(); };
        this.t_effi.onchange = () => { this.turbobuilder.flow_adjustment = this.t_effi.valueAsNumber; this.UpdateTurboX(); };
        this.t_diam.onchange = () => { this.turbobuilder.diameter = this.t_diam.valueAsNumber; this.UpdateTurboX(); };
        this.t_comp.onchange = () => { this.turbobuilder.compression_ratio = this.t_comp.valueAsNumber; this.UpdateTurboX(); };
        this.t_bypr.onchange = () => { this.turbobuilder.bypass_ratio = this.t_bypr.valueAsNumber; this.UpdateTurboX(); };
        this.t_aftb.onchange = () => { this.turbobuilder.afterburner = this.t_aftb.checked; this.UpdateTurboX(); };
    }

    private InitTurboXOutputs(cell: HTMLTableCellElement) {
        this.td_name = document.createElement("LABEL") as HTMLLabelElement;
        this.td_powr = document.createElement("LABEL") as HTMLLabelElement;
        this.td_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.td_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.td_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.td_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.td_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.td_malt = document.createElement("LABEL") as HTMLLabelElement;
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.td_name, fs);
        FlexDisplay("Power", this.td_powr, fs);
        FlexDisplay("Mass", this.td_mass, fs);
        FlexDisplay("Drag", this.td_drag, fs);
        FlexDisplay("Reliability", this.td_rely, fs);
        FlexDisplay("Fuel Consumption", this.td_fuel, fs);
        FlexDisplay("Cost", this.td_cost, fs);
        FlexDisplay("Altitude", this.td_malt, fs);
        this.td_desc.classList.add("disp_cell");
    }

    private UpdateTurboX() {
        this.t_name.value = this.turbobuilder.name;
        this.t_era.selectedIndex = this.turbobuilder.era_sel;
        this.t_type.selectedIndex = this.turbobuilder.type_sel;
        this.t_effi.valueAsNumber = this.turbobuilder.flow_adjustment;
        this.t_diam.valueAsNumber = this.turbobuilder.diameter;
        this.t_comp.valueAsNumber = this.turbobuilder.compression_ratio;
        this.t_bypr.valueAsNumber = this.turbobuilder.bypass_ratio;
        this.t_aftb.checked = this.turbobuilder.afterburner;

        if (this.turbobuilder.type_sel == 0 || this.turbobuilder.type_sel == 3) {
            this.t_bypr.disabled = true;
        } else {
            this.t_bypr.disabled = false;
        }

        var estats = this.turbobuilder.EngineStats();
        BlinkIfChanged(this.td_name, estats.name);
        BlinkIfChanged(this.td_powr, estats.stats.power.toString());
        BlinkIfChanged(this.td_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.td_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.td_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.td_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.td_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.td_malt, estats.altitude.toString());

        switch (this.turbobuilder.type_sel) {
            case 0:
                this.td_desc.innerHTML = StringFmt.Format(
                    `Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake) and OPR. Then
                    adjust the mass flow rate until the Thrust is just below the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.<br/>
                    `,
                    Math.trunc(this.turbobuilder.kN * 100) / 100,
                    Math.trunc(this.turbobuilder.tsfc * 100) / 100
                );
                break;
            case 1:
                this.td_desc.innerHTML = StringFmt.Format(
                    `Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `,
                    Math.trunc(this.turbobuilder.kN * 100) / 100,
                    Math.trunc(this.turbobuilder.tsfc * 100) / 100
                );
                break;
            case 2:
                this.td_desc.innerHTML = StringFmt.Format(
                    `Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total diameter of the largest fan, Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `,
                    Math.trunc(this.turbobuilder.kN * 100) / 100,
                    Math.trunc(this.turbobuilder.tsfc * 100) / 100
                );
                break;
            case 3:
                this.td_desc.innerHTML = StringFmt.Format(
                    `For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Power is just below
                    the rated takeoff power (in effective shp if available, shp if not). Note
                    that Power = 10*hp<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `
                );
                break;
        }
    }

    private InitManual(cell: HTMLTableCellElement) {
        this.m_name = document.createElement("INPUT") as HTMLInputElement;
        this.m_pwr = document.createElement("INPUT") as HTMLInputElement;
        this.m_mass = document.createElement("INPUT") as HTMLInputElement;
        this.m_drag = document.createElement("INPUT") as HTMLInputElement;
        this.m_rely = document.createElement("INPUT") as HTMLInputElement;
        this.m_cool = document.createElement("INPUT") as HTMLInputElement;
        this.m_over = document.createElement("INPUT") as HTMLInputElement;
        this.m_fuel = document.createElement("INPUT") as HTMLInputElement;
        this.m_alti = document.createElement("INPUT") as HTMLInputElement;
        this.m_torq = document.createElement("INPUT") as HTMLInputElement;
        this.m_rumb = document.createElement("INPUT") as HTMLInputElement;
        this.m_cost = document.createElement("INPUT") as HTMLInputElement;
        this.m_oil = document.createElement("INPUT") as HTMLInputElement;
        this.m_pulsejet = document.createElement("INPUT") as HTMLInputElement;
        this.m_turbo = document.createElement("INPUT") as HTMLInputElement;
        this.m_name.disabled = true;
        this.m_pwr.disabled = true;
        this.m_mass.disabled = true;
        this.m_drag.disabled = true;
        this.m_rely.disabled = true;
        this.m_cool.disabled = true;
        this.m_over.disabled = true;
        this.m_fuel.disabled = true;
        this.m_alti.disabled = true;
        this.m_torq.disabled = true;
        this.m_rumb.disabled = true;
        this.m_cost.disabled = true;
        this.m_oil.disabled = true;
        this.m_pulsejet.disabled = true;
        this.m_turbo.disabled = true;

        var fs = CreateFlexSection(cell);
        //Set up the individual stat input boxes
        FlexText("Name", this.m_name, fs);
        FlexInput("Power", this.m_pwr, fs);
        FlexInput("Mass", this.m_mass, fs);
        FlexInput("Drag", this.m_drag, fs);
        FlexInput("Reliability", this.m_rely, fs);
        FlexInput("Cooling", this.m_cool, fs);
        FlexInput("Overspeed", this.m_over, fs);
        FlexInput("Fuel Consumption", this.m_fuel, fs);
        FlexInput("Altitude", this.m_alti, fs);
        FlexInput("Torque", this.m_torq, fs);
        FlexInput("Rumble", this.m_rumb, fs);
        FlexInput("Cost", this.m_cost, fs);
        FlexCheckbox("Oil Tank", this.m_oil, fs);
        FlexCheckbox("Pulsejet", this.m_pulsejet, fs);
        FlexCheckbox("Turbocharger", this.m_turbo, fs);

        var trigger = () => { this.UpdateManual(); };
        this.m_name.onchange = trigger;
        this.m_pwr.onchange = trigger;
        this.m_mass.onchange = trigger;
        this.m_drag.onchange = trigger;
        this.m_rely.onchange = trigger;
        this.m_cool.onchange = trigger;
        this.m_over.onchange = trigger;
        this.m_fuel.onchange = trigger;
        this.m_alti.onchange = trigger;
        this.m_torq.onchange = trigger;
        this.m_rumb.onchange = trigger;
        this.m_cost.onchange = trigger;
        this.m_oil.onchange = trigger;
        this.m_pulsejet.onchange = trigger;
        this.m_turbo.onchange = trigger;
    }

    private InitListManagement(cell: HTMLTableCellElement) {
        this.list_idx = "Custom";
        this.m_list_select = document.createElement("SELECT") as HTMLSelectElement;
        this.m_select = document.createElement("SELECT") as HTMLSelectElement;
        this.m_delete = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_add_eb = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_add_pj = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_add_tb = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_save_csv = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_save = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_load = document.createElement("INPUT") as HTMLInputElement;
        this.m_list_create = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_list_input = document.createElement("INPUT") as HTMLInputElement;
        this.m_list_delete = document.createElement("BUTTON") as HTMLButtonElement;

        this.m_list_select.onchange = () => { this.list_idx = this.m_list_select.options[this.m_list_select.selectedIndex].text; this.UpdateList(); };
        this.m_select.onchange = () => { this.SetValues(engine_list.get(this.list_idx).get(this.m_select.selectedIndex)); this.m_select.selectedIndex = -1; };
        this.m_delete.onclick = () => {
            if (!engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).remove_name(this.UpdateManual().name);
                this.list_idx = "Custom";
                this.UpdateList();
                BlinkGood(this.m_delete.parentElement);
            } else {
                BlinkBad(this.m_delete.parentElement);
            }
        }
        this.m_add_eb.onclick = () => {
            var inputs = this.enginebuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_eb.parentElement);
            } else {
                BlinkBad(this.m_add_eb.parentElement);
            }
        }
        this.m_add_pj.onclick = () => {
            var inputs = this.pulsejetbuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_pj.parentElement);
            } else {
                BlinkBad(this.m_add_pj.parentElement);
            }
        }
        this.m_add_tb.onclick = () => {
            var inputs = this.turbobuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_tb.parentElement);
            } else {
                BlinkBad(this.m_add_tb.parentElement);
            }
        }
        this.m_save.onclick = () => { download(JSON.stringify(engine_list.get(this.list_idx).toJSON()), this.list_idx + ".json", "json"); }
        this.m_load.setAttribute("type", "file");
        this.m_load.multiple = false;
        this.m_load.accept = "application/JSON";
        this.m_load.onchange = (evt) => {
            if (this.m_load.files.length == 0)
                return;
            var file = this.m_load.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var str = JSON.parse(reader.result as string);
                    var newelist = new EngineList(str["name"]);
                    newelist.fromJSON(str);
                    if (engine_list.has(newelist.name) && engine_list.get(newelist.name).constant) {
                        BlinkBad(this.m_load.parentElement);
                    } else {
                        engine_list.set(newelist.name, newelist);
                        this.UpdateList();
                        BlinkGood(this.m_load.parentElement);
                    }
                } catch { }
            };
            reader.readAsText(file);
            this.m_load.value = "";
        };
        this.m_list_create.onclick = () => {
            var nlist = this.m_list_input.value;
            nlist = nlist.trim();
            nlist = nlist.replace(/\s+/g, ' ');
            if (nlist != "") {
                if (engine_list.has(nlist) && engine_list.get(nlist).constant) {
                    BlinkBad(this.m_list_create.parentElement);
                } else {
                    engine_list.set(nlist, new EngineList(nlist));
                    this.UpdateList();
                    BlinkGood(this.m_list_create.parentElement);
                }
            } else {
                BlinkBad(this.m_list_create.parentElement);
            }
        };
        this.m_list_delete.onclick = () => {
            if (this.list_idx != "" && this.list_idx != "Custom") {
                if (engine_list.get(this.list_idx).constant) {
                    BlinkBad(this.m_list_delete.parentElement);
                } else {
                    engine_list.delete(this.list_idx);
                    window.localStorage.removeItem("engines." + this.list_idx);
                    let namelist = JSON.parse(window.localStorage.getItem("engines_names"));
                    var idx = -1;
                    for (let i = 0; i < namelist.length; i++) {
                        if (namelist[i] == this.list_idx)
                            idx = i;
                    }
                    if (idx != -1)
                        namelist.splice(idx, 1);
                    window.localStorage.setItem("engines_names", JSON.stringify(namelist));
                    this.list_idx = "Custom";
                    this.UpdateList();
                    BlinkGood(this.m_list_delete.parentElement);
                }
            }
        };

        this.m_save_csv.onclick = () => {
            let output = [];
            let list = engine_list.get(this.list_idx);
            for (let i = 0; i < list.length; i++) {
                let estats = list.get_stats(i);
                output.push({
                    name: estats.name,
                    power: estats.stats.power,
                    mass: estats.stats.mass,
                    drag: estats.stats.drag,
                    cooling: estats.stats.cooling,
                    reliability: estats.stats.reliability,
                    fuelconsumption: estats.stats.fuelconsumption,
                    overspeed: estats.overspeed,
                    cost: estats.stats.cost,
                });
            }
            var json2csv = new JSON2CSV();
            download(json2csv.convert(output, { separator: ',', flatten: true, output_csvjson_variant: false }), this.list_idx + ".csv", "csv");
        }

        CreateSelect("Lists", this.m_list_select, cell);
        CreateSelect("Engines", this.m_select, cell);
        cell.appendChild(document.createElement("BR"));
        CreateButton("Save Engine List", this.m_save, cell);
        CreateButton("Load Engine List", this.m_load, cell);
        CreateButton("Add From Engine Builder", this.m_add_eb, cell);
        CreateButton("Add From Pulsejet Builder", this.m_add_pj, cell);
        CreateButton("Add From Turbine Builder", this.m_add_tb, cell);
        CreateButton("Delete Engine", this.m_delete, cell);

        var span = document.createElement("SPAN") as HTMLSpanElement;
        var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
        this.m_list_create.hidden = true;
        this.m_list_create.id = GenerateID();
        txtSpan.htmlFor = this.m_list_create.id;
        txtSpan.innerHTML = "<b>&nbsp;" + "Create List" + "&nbsp;&nbsp;</b>";
        txtSpan.classList.add("lbl_action");
        txtSpan.classList.add("btn_th");
        span.appendChild(txtSpan);
        span.appendChild(this.m_list_create);
        span.appendChild(this.m_list_input);
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
        cell.appendChild(document.createElement("BR"));
        CreateButton("Delete List", this.m_list_delete, cell);
        CreateButton("Save Engine List as CSV", this.m_save_csv, cell);

        this.UpdateList();
    }

    public UpdateList() {
        var l_idx = this.m_list_select.selectedIndex;
        while (this.m_list_select.options.length > 0) {
            this.m_list_select.options.remove(this.m_list_select.options.length - 1);
        }
        for (let key of engine_list.keys()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = key;
            this.m_list_select.add(opt);
            if (key == this.list_idx)
                l_idx = this.m_list_select.options.length - 1;
        }
        this.m_list_select.selectedIndex = l_idx;

        var idx = this.m_select.selectedIndex;
        while (this.m_select.options.length > 0) {
            this.m_select.options.remove(this.m_select.options.length - 1);
        }
        for (let i = 0; i < engine_list.get(this.list_idx).length; i++) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = engine_list.get(this.list_idx).get(i).name;
            this.m_select.add(opt);
        }
        if (idx >= engine_list.get(this.list_idx).length) {
            idx = engine_list.get(this.list_idx).length - 1;
        }
        this.m_select.selectedIndex = idx;
    }

    private UpdateManual() {
        var e_stats = new EngineStats();
        e_stats.name = this.m_name.value;
        e_stats.stats.power = this.m_pwr.valueAsNumber;
        e_stats.stats.mass = this.m_mass.valueAsNumber;
        e_stats.stats.drag = this.m_drag.valueAsNumber;
        e_stats.stats.reliability = this.m_rely.valueAsNumber;
        e_stats.stats.cooling = this.m_cool.valueAsNumber;
        e_stats.overspeed = this.m_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.m_fuel.valueAsNumber;
        e_stats.altitude = this.m_alti.valueAsNumber;
        e_stats.torque = this.m_torq.valueAsNumber;
        e_stats.rumble = this.m_rumb.valueAsNumber;
        e_stats.stats.cost = this.m_cost.valueAsNumber;
        e_stats.oiltank = this.m_oil.checked;
        e_stats.pulsejet = this.m_pulsejet.checked;
        if (this.m_turbo.checked)
            e_stats.stats.reqsections = 1;
        e_stats.Verify();
        return e_stats;
    }

    private SetValues(e_input: EngineInputs) {
        var e_stats = e_input.PartStats();
        switch (e_input.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.enginebuilder.name = e_input.name;
                this.enginebuilder.era_sel = e_input.era_sel;
                this.enginebuilder.cool_sel = e_input.type;
                this.enginebuilder.engine_displacement = e_input.displacement;
                this.enginebuilder.compression_ratio = e_input.compression;
                this.enginebuilder.num_cyl_per_row = e_input.cyl_per_row;
                this.enginebuilder.num_rows = e_input.rows;
                this.enginebuilder.rpm_boost = e_input.RPM_boost;
                this.enginebuilder.material_fudge = e_input.material_fudge;
                this.enginebuilder.quality_fudge = e_input.quality_fudge;
                for (let i = 0; i < this.enginebuilder.upg_sel.length; i++) {
                    this.enginebuilder.upg_sel[i] = e_input.upgrades[i];
                }
                this.enginebuilder.compressor_type = e_input.compressor_type;
                this.enginebuilder.compressor_count = e_input.compressor_count;
                this.enginebuilder.min_IAF = e_input.min_IdealAlt;
                this.UpdateEngine();
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.pulsejetbuilder.era_sel = e_input.era_sel;
                this.pulsejetbuilder.valve_sel = e_input.type;
                this.pulsejetbuilder.desired_power = e_input.power;
                this.pulsejetbuilder.build_quality = e_input.quality_cost;
                this.pulsejetbuilder.overall_quality = e_input.quality_rely;
                this.pulsejetbuilder.starter = e_input.starter;
                this.UpdatePulsejet();
                break;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.turbobuilder.name = e_input.name;
                this.turbobuilder.era_sel = e_input.era_sel;
                this.turbobuilder.type_sel = e_input.type;
                this.turbobuilder.diameter = e_input.diameter;
                this.turbobuilder.compression_ratio = e_input.compression_ratio;
                this.turbobuilder.bypass_ratio = e_input.bypass_ratio;
                this.turbobuilder.flow_adjustment = e_input.flow_adjustment;
                this.turbobuilder.afterburner = e_input.upgrades[0];
                this.UpdateTurboX();
                break;
            }
            default:
                throw "engine_builder.SetValues New Engine Type";
        }
        this.m_name.value = e_stats.name;
        this.m_pwr.valueAsNumber = e_stats.stats.power;
        this.m_mass.valueAsNumber = e_stats.stats.mass;
        this.m_drag.valueAsNumber = e_stats.stats.drag;
        this.m_rely.valueAsNumber = e_stats.stats.reliability;
        this.m_cool.valueAsNumber = e_stats.stats.cooling;
        this.m_over.valueAsNumber = e_stats.overspeed;
        this.m_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.m_alti.valueAsNumber = e_stats.altitude;
        this.m_torq.valueAsNumber = e_stats.torque;
        this.m_rumb.valueAsNumber = e_stats.rumble;
        this.m_cost.valueAsNumber = e_stats.stats.cost;
        this.m_oil.checked = e_stats.oiltank;
        this.m_pulsejet.checked = e_stats.pulsejet;
        this.m_turbo.checked = e_stats.stats.reqsections > 0;
    }

    public SelectEngine(num: number) {
        this.SetValues(engine_list.get(this.list_idx).get(num));
    }
}


var tf_to_test = [
    {
        name: "F3-IHI-30", thrust: 16.37, OPR: 11, BPR: 0.9, diameter: 0.63, real_mass: 8.31, era: 3.00,
    }, {
        name: "F100-IHI-100", thrust: 65.26, OPR: 23, BPR: 0.71, diameter: 1.18, real_mass: 57.68, era: 4.00,
    }, {
        name: "F100-PW-220", thrust: 65.26, OPR: 25, BPR: 0.71, diameter: 1.18, real_mass: 58.06, era: 4.00,
    }, {
        name: "F100-PW-229", thrust: 79.18, OPR: 32.4, BPR: 0.36, diameter: 1.18, real_mass: 67.22, era: 4.00,
    }, {
        name: "F101-GE-102", thrust: 77.35, OPR: 26.8, BPR: 1.91, diameter: 1.40, real_mass: 80.92, era: 3.00,
    }, {
        name: "F110-GE-100", thrust: 73.84, OPR: 29, BPR: 0.87, diameter: 1.18, real_mass: 71.12, era: 3.00,
    }, {
        name: "F110-GE-129", thrust: 75.62, OPR: 30.7, BPR: 0.76, diameter: 1.18, real_mass: 72.21, era: 3.00,
    }, {
        name: "F110-IHI-129", thrust: 75.62, OPR: 30.7, BPR: 0.76, diameter: 1.18, real_mass: 71.49, era: 4.00,
    }, {
        name: "F110-GE-400", thrust: 74.73, OPR: 29.9, BPR: 0.87, diameter: 1.18, real_mass: 79.83, era: 4.00,
    }, {
        name: "F117-PW-100", thrust: 185.49, OPR: 31.8, BPR: 5.8, diameter: 0.00, real_mass: 128.82, era: 4.00,
    }, {
        name: "F124-GA-100", thrust: 28.02, OPR: 19.4, BPR: 0.4, diameter: 0.91, real_mass: 19.96, era: 3.00,
    }, {
        name: "F125-GA-100", thrust: 26.80, OPR: 18.5, BPR: 0.3, diameter: 0.59, real_mass: 24.68, era: 3.00,
    }, {
        name: "F402-RR-408", thrust: 105.87, OPR: 16.3, BPR: 1.2, diameter: 1.22, real_mass: 77.29, era: 4.00,
    }, {
        name: "F404-GE-400", thrust: 47.15, OPR: 25, BPR: 0.34, diameter: 0.88, real_mass: 39.83, era: 4.00,
    }, {
        name: "F404-GE-402", thrust: 53.16, OPR: 26, BPR: 0.27, diameter: 0.88, real_mass: 41.40, era: 4.00,
    }, {
        name: "JT15D-5D", thrust: 13.54, OPR: 13.1, BPR: 2, diameter: 0.69, real_mass: 11.38, era: 2.00,
    }, {
        name: "Larzac 04-C6", thrust: 13.34, OPR: 10.7, BPR: 1.13, diameter: 0.65, real_mass: 11.61, era: 2.00,
    }, {
        name: "Larzac 04-C20", thrust: 14.12, OPR: 11.1, BPR: 1.04, diameter: 0.65, real_mass: 11.61, era: 2.00,
    }, {
        name: "Larzac 04-R20", thrust: 14.12, OPR: 11.1, BPR: 1.04, diameter: 0.65, real_mass: 12.08, era: 2.00,
    }, {
        name: "M53-P2", thrust: 64.30, OPR: 8.2, BPR: 0.32, diameter: 1.05, real_mass: 60.00, era: 2.00,
    }, {
        name: "M88-2", thrust: 50.04, OPR: 24, BPR: 0.5, diameter: 0.00, real_mass: 35.74, era: 3.00,
    }, {
        name: "NK-8-2", thrust: 93.16, OPR: 21.5, BPR: 1, diameter: 1.44, real_mass: 83.99, era: 1.00,
    }, {
        name: "NK-8-2U", thrust: 102.98, OPR: 23.2, BPR: 1.05, diameter: 1.44, real_mass: 83.99, era: 1.00,
    }, {
        name: "NK-321", thrust: 137.20, OPR: 28.4, BPR: 1.4, diameter: 1.46, real_mass: 137.67, era: 3.00,
    }, {
        name: "Pegasus 11 Mk.102", thrust: 91.19, OPR: 14.6, BPR: 1.3, diameter: 1.22, real_mass: 65.68, era: 3.00,
    }, {
        name: "Pegasus 11 Mk.103", thrust: 91.19, OPR: 14.6, BPR: 1.5, diameter: 1.22, real_mass: 65.68, era: 3.00,
    }, {
        name: "Pegasus 11 Mk.104", thrust: 91.19, OPR: 14.6, BPR: 1.2, diameter: 1.22, real_mass: 65.68, era: 3.00,
    }, {
        name: "Pegasus 11-21 Mk.106", thrust: 95.64, OPR: 15.3, BPR: 1.2, diameter: 1.22, real_mass: 71.85, era: 3.00,
    }, {
        name: "PW1120", thrust: 60.19, OPR: 26.8, BPR: 0.2, diameter: 1.02, real_mass: 51.69, era: 3.00,
    }, {
        name: "RB.153-61", thrust: 30.47, OPR: 18, BPR: 0.7, diameter: 0.75, real_mass: 25.95, era: 1.00,
    }, {
        name: "RB.199-34R-04 Mk.103", thrust: 40.48, OPR: 23.5, BPR: 1.25, diameter: 0.00, real_mass: 38.23, era: 3.00,
    }, {
        name: "RB.199-34R-04 Mk.105", thrust: 42.95, OPR: 23.4, BPR: 0.97, diameter: 0.75, real_mass: 39.19, era: 3.00,
    }, {
        name: "RB.211-524B", thrust: 222.41, OPR: 28.4, BPR: 4.5, diameter: 0.00, real_mass: 178.06, era: 2.00,
    }, {
        name: "RD-33", thrust: 49.38, OPR: 21, BPR: 0.48, diameter: 1.00, real_mass: 42.20, era: 2.00,
    }, {
        name: "RM12", thrust: 54.00, OPR: 26, BPR: 0.31, diameter: 0.00, real_mass: 42.00, era: 3.00,
    }, {
        name: "Spey RB.168-1A RSp.2 Mk.101", thrust: 49.06, OPR: 16.5, BPR: 0.7, diameter: 0.83, real_mass: 44.83, era: 1.00,
    }, {
        name: "Spey RB.168-20 RSp.5-1 Mk.250", thrust: 53.36, OPR: 19.2, BPR: 0.7, diameter: 0.83, real_mass: 49.71, era: 1.00,
    }, {
        name: "Spey RB.168-25R RSp.2 Mk.202", thrust: 54.49, OPR: 19.5, BPR: 0.7, diameter: 1.12, real_mass: 74.26, era: 1.00,
    }, {
        name: "Spey RB.168-?? Mk.807", thrust: 49.06, OPR: 16.8, BPR: 0.96, diameter: 0.83, real_mass: 43.85, era: 1.00,
    }, {
        name: "Tay RB.183-3 Mk.611-8", thrust: 61.61, OPR: 15.8, BPR: 3.04, diameter: 0.00, real_mass: 56.88, era: 3.00,
    }, {
        name: "TF33-PW-3", thrust: 75.62, OPR: 13, BPR: 1.55, diameter: 1.35, real_mass: 70.76, era: 1.00,
    }, {
        name: "TF33-PW-7", thrust: 93.41, OPR: 16, BPR: 1.21, diameter: 1.35, real_mass: 83.55, era: 1.00,
    }, {
        name: "TF34-GE-100", thrust: 40.32, OPR: 20, BPR: 6.24, diameter: 1.24, real_mass: 26.13, era: 1.00,
    }, {
        name: "TF34-GE-100A", thrust: 40.32, OPR: 20, BPR: 6.24, diameter: 1.24, real_mass: 26.13, era: 1.00,
    }, {
        name: "TF34-GE-400A", thrust: 41.26, OPR: 21, BPR: 6.24, diameter: 1.32, real_mass: 26.82, era: 1.00,
    }, {
        name: "TF34-GE-400B", thrust: 41.26, OPR: 21, BPR: 6.24, diameter: 1.32, real_mass: 26.82, era: 1.00,
    }, {
        name: "TF37-GE-1", thrust: 18.68, OPR: 6.9, BPR: 1.9, diameter: 0.84, real_mass: 12.25, era: 1.00,
    }, {
        name: "TF39-GE-1", thrust: 181.51, OPR: 26, BPR: 8, diameter: 2.60, real_mass: 127.48, era: 1.00,
    }, {
        name: "TF41-A-1", thrust: 63.39, OPR: 20, BPR: 0.77, diameter: 0.95, real_mass: 59.00, era: 2.00,
    }, {
        name: "TF41-A-2", thrust: 66.72, OPR: 21.4, BPR: 0.74, diameter: 0.95, real_mass: 59.00, era: 2.00,
    }, {
        name: "TFE731-2-2B", thrust: 15.57, OPR: 13, BPR: 2.66, diameter: 1.00, real_mass: 13.48, era: 2.00,
    }, {
        name: "TFE731-3-1H", thrust: 16.46, OPR: 14.6, BPR: 2.8, diameter: 1.00, real_mass: 13.68, era: 2.00,
    }, {
        name: "TFE731-5-1J", thrust: 19.15, OPR: 14.4, BPR: 3.65, diameter: 1.03, real_mass: 15.46, era: 2.00,
    }, {
        name: "TFE1042-70", thrust: 26.80, OPR: 18.5, BPR: 0.3, diameter: 0.59, real_mass: 24.68, era: 3.00,
    }, {
        name: "WS6", thrust: 71.13, OPR: 14.4, BPR: 1, diameter: 1.37, real_mass: 84.00, era: 3.00,
    },];

var tp_to_test = [
    {
        name: "250-B17C", power: 42, OPR: 7.2, diameter: 0.5715, real_mass: 3.53802072, era: 2
    }, {
        name: "250-MTU-C20B", power: 42, OPR: 7.2, diameter: 0.58928, real_mass: 2.866703968, era: 2
    }, {
        name: "250-C20J", power: 42, OPR: 7.2, diameter: 0.58928, real_mass: 2.921135056, era: 2
    }, {
        name: "250-C20R/1", power: 45, OPR: 7.9, diameter: 0.58928, real_mass: 3.138859408, era: 2
    }, {
        name: "250-C28C", power: 50, OPR: 8.4, diameter: 0.63754, real_mass: 4.17305008, era: 2
    }, {
        name: "250-C30L", power: 65, OPR: 8.6, diameter: 0.6477, real_mass: 4.681073568, era: 2
    }, {
        name: "250-C30R", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 2
    }, {
        name: "250-C30R/1", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 2
    }, {
        name: "250-C30R/2", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 2
    }, {
        name: "250-C30R/3", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 3
    }, {
        name: "250-C30R/3M", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 3
    }, {
        name: "250-C30S", power: 65, OPR: 8.4, diameter: 0.6477, real_mass: 4.681073568, era: 3
    }, {
        name: "Arriel 1A", power: 64.1, OPR: 9, diameter: 0.56896, real_mass: 4.80807944, era: 3
    }, {
        name: "Arriel 1A1", power: 64.1, OPR: 9, diameter: 0.56896, real_mass: 4.80807944, era: 3
    }, {
        name: "Arriel 1A2", power: 64.1, OPR: 9, diameter: 0.56896, real_mass: 4.80807944, era: 3
    }, {
        name: "Arriel 1B", power: 64.1, OPR: 9, diameter: 0.56896, real_mass: 4.80807944, era: 3
    }, {
        name: "CT7-6A1", power: 214.5, OPR: 19, diameter: 0.635, real_mass: 8.944842128, era: 3
    }, {
        name: "CTS800-2", power: 136, OPR: 14.1, diameter: 0.6985, real_mass: 6.949035568, era: 4
    }, {
        name: "CTS800-4N", power: 136, OPR: 14.1, diameter: 0.6985, real_mass: 6.949035568, era: 4
    }, {
        name: "D-136", power: 1140, OPR: 18.7, diameter: 1.40208, real_mass: 42.00265624, era: 3
    }, {
        name: "Gazelle NGa.2 Mk.101", power: 146.5, OPR: 6.3, diameter: 1.0795, real_mass: 16.83734989, era: 1
    }, {
        name: "Gazelle NGa.13 Mk.161", power: 145, OPR: 5.9, diameter: 1.0795, real_mass: 17.05507424, era: 1
    }, {
        name: "Gazelle NGa.13/2 Mk.162", power: 154, OPR: 6.1, diameter: 1.0795, real_mass: 17.05507424, era: 1
    }, {
        name: "Gazelle NGa.22 Mk.165", power: 160, OPR: 5.9, diameter: 1.0795, real_mass: 16.03902726, era: 1
    }, {
        name: "Gazelle NGa.22 Mk.165C", power: 160, OPR: 5.9, diameter: 1.0795, real_mass: 16.03902726, era: 1
    }, {
        name: "Gem 2 Mk.1001", power: 82.5, OPR: 12, diameter: 0.5969, real_mass: 7.130472528, era: 2
    }, {
        name: "Gem 42-1 Mk.204", power: 100, OPR: 13, diameter: 0.5969, real_mass: 7.330053184, era: 2
    }, {
        name: "Gem 42-1 Mk.205", power: 100, OPR: 13, diameter: 0.5969, real_mass: 7.330053184, era: 2
    }, {
        name: "Gem 42 Mk.1017", power: 100, OPR: 13, diameter: 0.5969, real_mass: 7.330053184, era: 2
    }, {
        name: "Gnome H.1400", power: 140, OPR: 8.4, diameter: 0.57658, real_mass: 5.914844896, era: 1
    }, {
        name: "Gnome H.1400-1", power: 166, OPR: 8.5, diameter: 0.57658, real_mass: 5.914844896, era: 1
    }, {
        name: "GTD-350", power: 39.4, OPR: 6.1, diameter: 0.62992, real_mass: 5.570114672, era: 1
    }, {
        name: "LTP 101-600A-1A", power: 61.5, OPR: 8.5, diameter: 0.59182, real_mass: 5.8967012, era: 1
    }, {
        name: "LTS 101-750B-2", power: 74.2, OPR: 8.8, diameter: 0.62738, real_mass: 4.862510528, era: 1
    }, {
        name: "MTR 390", power: 155.6, OPR: 14, diameter: 0.68326, real_mass: 6.767598608, era: 4
    }, {
        name: "NK-12M", power: 1479.5, OPR: 13, diameter: 1.15062, real_mass: 94.00248898, era: 1
    }, {
        name: "PT6A-27", power: 62, OPR: 6.7, diameter: 0.4826, real_mass: 5.951132288, era: 1
    }, {
        name: "PT6A-65B", power: 110, OPR: 10, diameter: 0.4826, real_mass: 8.727117776, era: 1
    }, {
        name: "RTM 322-01/8", power: 220, OPR: 14, diameter: 0.65786, real_mass: 9.779452144, era: 4
    }, {
        name: "RTM 322-02/8", power: 220, OPR: 14, diameter: 0.65786, real_mass: 9.779452144, era: 4
    }, {
        name: "RTM 322-01/9", power: 243, OPR: 16, diameter: 0.65786, real_mass: 9.053704304, era: 4
    }, {
        name: "XT31-GE-1", power: 170, OPR: 6.1, diameter: 0.9144, real_mass: 34.56374088, era: 0
    }, {
        name: "XT31-GE-2", power: 170, OPR: 6.1, diameter: 0.9144, real_mass: 34.56374088, era: 0
    }, {
        name: "XT31-GE-3", power: 170, OPR: 6.1, diameter: 0.9144, real_mass: 34.56374088, era: 0
    }, {
        name: "XT33-FF-1", power: 590, OPR: 4.7, diameter: 1.30556, real_mass: 87.18045928, era: 0
    }, {
        name: "XT35-W-1", power: 550, OPR: 4.3, diameter: 1.4986, real_mass: 80.7394472, era: 0
    }, {
        name: "XT37-NA-1", power: 750, OPR: 6, diameter: 1.12268, real_mass: 91.6256648, era: 0
    }, {
        name: "XT37-NA-3", power: 1000, OPR: 6, diameter: 1.1684, real_mass: 108.862176, era: 0
    }, {
        name: "XT39-A-1", power: 900, OPR: 6.2, diameter: 0.9906, real_mass: 67.1316752, era: 0
    }, {
        name: "T53-L-13B", power: 140, OPR: 7.4, diameter: 0.5842, real_mass: 9.88831432, era: 0
    }, {
        name: "T53-K-13B2", power: 140, OPR: 7.4, diameter: 0.5842, real_mass: 9.79759584, era: 0
    }, {
        name: "T53-L-17A", power: 150, OPR: 7.4, diameter: 0.5842, real_mass: 9.88831432, era: 0
    }, {
        name: "T53-L-701A", power: 140, OPR: 7.4, diameter: 0.5842, real_mass: 12.57358133, era: 0
    }, {
        name: "T53-L-703", power: 180, OPR: 8, diameter: 0.5842, real_mass: 9.88831432, era: 0
    }, {
        name: "T53-K-703", power: 180, OPR: 8, diameter: 0.5842, real_mass: 9.88831432, era: 0
    }, {
        name: "T55-L-712", power: 375, OPR: 8.2, diameter: 0.72898, real_mass: 13.78920896, era: 1
    }, {
        name: "T55-L-712E", power: 375, OPR: 8.2, diameter: 0.72898, real_mass: 13.78920896, era: 1
    }, {
        name: "T55-L-712F", power: 375, OPR: 8.2, diameter: 0.72898, real_mass: 13.78920896, era: 1
    }, {
        name: "T55-K-712", power: 375, OPR: 7.4, diameter: 0.72898, real_mass: 9.79759584, era: 1
    }, {
        name: "T55-L-714", power: 486.7, OPR: 9.3, diameter: 0.72898, real_mass: 14.5149568, era: 1
    }, {
        name: "T55-L-714A", power: 486.7, OPR: 9.3, diameter: 0.72898, real_mass: 15.09555507, era: 1
    }, {
        name: "T56-A-14", power: 459.1, OPR: 9.6, diameter: 1.2446, real_mass: 34.20086696, era: 1
    }, {
        name: "T56-IHI-14", power: 459.1, OPR: 9.5, diameter: 1.2446, real_mass: 34.20086696, era: 1
    }, {
        name: "T56-A-15", power: 459.1, OPR: 9.6, diameter: 1.13284, real_mass: 33.52955021, era: 1
    }, {
        name: "T56-A-16", power: 459.1, OPR: 9.3, diameter: 1.13284, real_mass: 33.40254434, era: 1
    }, {
        name: "T56-A-18", power: 500, OPR: 9.7, diameter: 1.13284, real_mass: 33.40254434, era: 1
    }, {
        name: "T56-A-423", power: 459.1, OPR: 9.3, diameter: 1.13284, real_mass: 33.40254434, era: 1
    }, {
        name: "T56-A-425", power: 459.1, OPR: 9.7, diameter: 1.13284, real_mass: 34.4548787, era: 1
    }, {
        name: "T56-A-427", power: 525, OPR: 12, diameter: 1.22682, real_mass: 35.19877024, era: 1
    }, {
        name: "T58-GE-5", power: 150, OPR: 8.4, diameter: 0.53086, real_mass: 6.07813816, era: 1
    }, {
        name: "T58-GE-6", power: 125, OPR: 8.2, diameter: 0.53086, real_mass: 5.53382728, era: 1
    }, {
        name: "T58-GE-8B", power: 125, OPR: 8.2, diameter: 0.53086, real_mass: 5.53382728, era: 1
    }, {
        name: "YT58-GE-8D", power: 125, OPR: 8.2, diameter: 0.53086, real_mass: 5.53382728, era: 1
    }, {
        name: "T58-GE-8F", power: 135, OPR: 8.2, diameter: 0.51308, real_mass: 5.53382728, era: 1
    }, {
        name: "T58-GE-10", power: 140, OPR: 8.4, diameter: 0.51308, real_mass: 6.3502936, era: 1
    }, {
        name: "T58-GE-16", power: 187, OPR: 8.4, diameter: 0.61468, real_mass: 7.98322624, era: 1
    }, {
        name: "T63-A-720", power: 41.8, OPR: 7.3, diameter: 0.58928, real_mass: 2.866703968, era: 1
    }, {
        name: "T64-MTU-7", power: 392.5, OPR: 13, diameter: 0.51054, real_mass: 12.91831155, era: 1
    }, {
        name: "T64-GE-7A", power: 393.6, OPR: 14.1, diameter: 0.51054, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-IHI-10J", power: 273.6, OPR: 12.5, diameter: 0.53594, real_mass: 22.49818304, era: 1
    }, {
        name: "T64-GE-16A", power: 348.5, OPR: 13, diameter: 0.61468, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-GE-100", power: 433, OPR: 14.9, diameter: 0.61468, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-GE-413", power: 392.5, OPR: 14.1, diameter: 0.61468, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-GE-413A", power: 392.5, OPR: 14.1, diameter: 0.61468, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-GE-415", power: 438, OPR: 14.8, diameter: 0.61468, real_mass: 13.06346112, era: 1
    }, {
        name: "T64-GE-419", power: 475, OPR: 14.9, diameter: 0.61468, real_mass: 13.69849048, era: 1
    }, {
        name: "T64-GE-P4D-1", power: 340, OPR: 13.2, diameter: 0.51054, real_mass: 21.55471085, era: 1
    }, {
        name: "T76-G-10", power: 104, OPR: 8.6, diameter: 0.6858, real_mass: 6.187000336, era: 2
    }, {
        name: "T406-AD-400", power: 615, OPR: 16.7, diameter: 0.86868, real_mass: 17.61752882, era: 4
    }, {
        name: "T700-GE-401", power: 172, OPR: 17, diameter: 0.635, real_mass: 8.001369936, era: 2
    }, {
        name: "T700-GE-401C", power: 180, OPR: 18, diameter: 0.635, real_mass: 8.309812768, era: 2
    }, {
        name: "T700-IHI-401C", power: 180, OPR: 18, diameter: 0.635, real_mass: 8.309812768, era: 2
    }, {
        name: "T700-GE-700", power: 162.2, OPR: 17, diameter: 0.635, real_mass: 7.928795152, era: 2
    }, {
        name: "T700-GE-701", power: 172, OPR: 17, diameter: 0.635, real_mass: 7.946938848, era: 2
    }, {
        name: "T700-GE-701A", power: 172, OPR: 17, diameter: 0.635, real_mass: 7.946938848, era: 2
    }, {
        name: "T700-GE-701C", power: 189, OPR: 18, diameter: 0.635, real_mass: 8.273525376, era: 2
    }, {
        name: "T700-GE-701D", power: 194.4, OPR: 18, diameter: 0.635, real_mass: 8.273525376, era: 2
    }, {
        name: "T700-GE-T6A", power: 200, OPR: 18, diameter: 0.635, real_mass: 8.79969256, era: 2
    }, {
        name: "T700-GE-T6A-1", power: 214.5, OPR: 19, diameter: 0.635, real_mass: 8.944842128, era: 2
    }, {
        name: "T700-GE-T6E", power: 227, OPR: 19, diameter: 0.635, real_mass: 9.634302576, era: 2
    }, {
        name: "T700-GE-T6E-1", power: 227, OPR: 19, diameter: 0.635, real_mass: 9.743164752, era: 2
    }, {
        name: "T703-AD-700", power: 65, OPR: 8.6, diameter: 0.63754, real_mass: 4.0823316, era: 2
    }, {
        name: "T800-LHT-800", power: 140, OPR: 14.1, diameter: 0.66294, real_mass: 5.71526424, era: 4
    }, {
        name: "TPE331-2-201A", power: 71.5, OPR: 8.3, diameter: 0.6604, real_mass: 6.096281856, era: 1
    }, {
        name: "TPE331-2-201C", power: 71.5, OPR: 8.3, diameter: 0.6604, real_mass: 6.096281856, era: 1
    }, {
        name: "TPE331-3A-301W", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-3UW-304G", power: 90.4, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-251C", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-251K", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-252C", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-252D", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-252K", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-254K", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-5-255K", power: 84, OPR: 10.3, diameter: 0.6604, real_mass: 6.44101208, era: 1
    }, {
        name: "TPE331-10", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-10-501K", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-10R", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-10T", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-10T-516K", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-10UF", power: 98.4, OPR: 10.8, diameter: 0.6604, real_mass: 6.89460448, era: 1
    }, {
        name: "TPE331-11-601W", power: 100, OPR: 10.8, diameter: 0.6604, real_mass: 7.2574784, era: 1
    }, {
        name: "TPE331-11U-601G", power: 100, OPR: 10.8, diameter: 0.6604, real_mass: 7.2574784, era: 1
    }, {
        name: "TPE331-11U-611G", power: 100, OPR: 10.8, diameter: 0.6604, real_mass: 7.2574784, era: 1
    }, {
        name: "TPE331-12UA-701G", power: 115.1, OPR: 10.8, diameter: 0.6604, real_mass: 7.2574784, era: 1
    }, {
        name: "TPE331-12UAR-701G", power: 115.1, OPR: 10.8, diameter: 0.6604, real_mass: 7.2574784, era: 1
    }, {
        name: "TV2-117A", power: 167, OPR: 6.6, diameter: 0.74422, real_mass: 13.51705352, era: 1
    }, {
        name: "TWD-10W", power: 88.8, OPR: 7.4, diameter: 0.76454, real_mass: 5.62454576, era: 3
    }, {
        name: "Tyne RTy.12 Mk.101", power: 546, OPR: 13.5, diameter: 1.09728, real_mass: 40.26086142, era: 1
    }, {
        name: "Tyne RTy.12 Mk.515/10", power: 573, OPR: 13.5, diameter: 1.09728, real_mass: 40.26086142, era: 1
    }, {
        name: "Tyne RTy.20 Mk.21", power: 585.6, OPR: 14, diameter: 1.09728, real_mass: 39.97056229, era: 1
    }, {
        name: "Tyne RTy.20 Mk.22", power: 610, OPR: 14, diameter: 1.09728, real_mass: 39.97056229, era: 1
    }, { name: "Tyne RTy.20 Mk.801", power: 548, OPR: 14, diameter: 1.09728, real_mass: 39.68026315, era: 1 },
]

function test_turbofans(engines: { name: string, thrust: number, OPR: number, BPR: number, diameter: number, real_mass: number, era: number }[]) {
    var tb = new TurboBuilder();
    var mass = [];
    console.log("Model, Thrust, OPR, BPR, Diameter, Real Mass, Era, Builder Mass");
    for (let e of engines) {
        tb.afterburner = false;
        tb.bypass_ratio = e.BPR;
        tb.compression_ratio = e.OPR;
        tb.diameter = e.diameter;
        tb.era_sel = e.era;
        tb.name = e.name;
        tb.type_sel = 1;

        let min_td_mfa = -0.5;
        let min_td = 1e6;
        let min_td_mass = 0;
        for (let mfa = -0.5; mfa <= 0.5; mfa += 0.01) {
            tb.flow_adjustment = mfa;
            let stats = tb.EngineStats();
            if (Math.abs(tb.kN - e.thrust) < min_td) {
                min_td = Math.abs(tb.kN - e.thrust);
                min_td_mfa = mfa;
                min_td_mass = stats.stats.mass;
            }
        }
        if (e.diameter > 0)
            console.log(StringFmt.Join(", ", [e.name, e.thrust, e.OPR, e.BPR, e.diameter, e.real_mass, e.era, min_td_mass]));
    }
}

function test_turboprops(engines: { name: string, power: number, OPR: number, BPR: number, diameter: number, real_mass: number, era: number }[]) {
    var tb = new TurboBuilder();
    var mass = [];
    console.log("Model, Power, OPR, Diameter, Real Mass, Era, MFA, Builder Mass");
    for (let e of engines) {
        tb.afterburner = false;
        tb.bypass_ratio = 0;
        tb.compression_ratio = e.OPR;
        tb.diameter = e.diameter;
        tb.era_sel = e.era;
        tb.name = e.name;
        tb.type_sel = 3;

        let min_td_mfa = -0.5;
        let min_td = 1e6;
        let min_td_mass = 0;
        for (let mfa = -0.5; mfa <= 0.5; mfa += 0.01) {
            tb.flow_adjustment = mfa;
            let stats = tb.EngineStats();
            if (Math.abs(stats.stats.power - e.power) < min_td) {
                min_td = Math.abs(stats.stats.power - e.power);
                min_td_mfa = mfa;
                min_td_mass = stats.stats.mass;
            }
        }
        console.log(StringFmt.Join(", ", [e.name, e.power, e.OPR, e.diameter, e.real_mass, e.era, min_td_mfa, min_td_mass]));
    }
}