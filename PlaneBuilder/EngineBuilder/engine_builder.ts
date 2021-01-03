/// <reference path="../disp/Tools.ts" />
/// <reference path="./EngineBuilder.ts" />
/// <reference path="./PulsejetBuilder.ts" />
/// <reference path="../lz/lz-string.ts" />
/// <reference path="../string/index.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var ep = sp.get("engine");

    ebuild = new EngineBuilder_HTML();

    loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
        var engine_json = JSON.parse(engine_resp);

        var nameliststr = window.localStorage.getItem("engines_names");
        var namelist = [];
        if (nameliststr) {
            namelist = JSON.parse(nameliststr);
            for (let n of namelist) {
                engine_list.set(n, new EngineList(n));
            }
        }

        for (let el of engine_json["lists"]) {
            if (!engine_list.has(el["name"]))
                engine_list.set(el["name"], new EngineList(el["name"]));
            engine_list.get(el["name"]).fromJSON(el, false); //TODO: Overwrite defaults
        }

        ebuild.UpdateList();
    });

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
    private e_mIAF: HTMLInputElement;
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
    private m_save: HTMLButtonElement;
    private m_load: HTMLInputElement;
    private m_list_create: HTMLButtonElement;
    private m_list_delete: HTMLButtonElement;
    private m_list_input: HTMLInputElement;

    constructor() {
        this.enginebuilder = new EngineBuilder();
        this.pulsejetbuilder = new PulsejetBuilder();

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
        this.e_mIAF = document.createElement("INPUT") as HTMLInputElement;

        this.e_ctyp.onchange = () => { this.enginebuilder.compressor_type = this.e_ctyp.selectedIndex; this.UpdateEngine(); };
        this.e_ccnt.onchange = () => { this.enginebuilder.compressor_count = this.e_ccnt.valueAsNumber; this.UpdateEngine(); };
        this.e_mIAF.onchange = () => { this.enginebuilder.min_IAF = this.e_mIAF.valueAsNumber; this.UpdateEngine(); };

        FlexSelect("Compressor Type", this.e_ctyp, fs);
        FlexInput("Compressor Count", this.e_ccnt, fs);
        FlexInput("Minimum IAF", this.e_mIAF, fs);
        this.e_ccnt.min = "0";
        this.e_ccnt.step = "1";
        this.e_mIAF.min = "0";
        this.e_mIAF.step = "10";

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
        this.e_mIAF.valueAsNumber = this.enginebuilder.min_IAF;

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
        this.m_save = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_load = document.createElement("INPUT") as HTMLInputElement;
        this.m_list_create = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_list_input = document.createElement("INPUT") as HTMLInputElement;
        this.m_list_delete = document.createElement("BUTTON") as HTMLButtonElement;

        this.m_list_select.onchange = () => { this.list_idx = this.m_list_select.options[this.m_list_select.selectedIndex].text; this.UpdateList(); };
        this.m_select.onchange = () => { this.SetValues(engine_list.get(this.list_idx).get(this.m_select.selectedIndex)); this.m_select.selectedIndex = -1; };
        this.m_delete.onclick = () => { engine_list.get(this.list_idx).remove_name(this.UpdateManual().name); this.UpdateList(); }
        this.m_add_eb.onclick = () => {
            var inputs = this.enginebuilder.EngineInputs();
            if (inputs.name != "Default") {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
            }
        }
        this.m_add_pj.onclick = () => {
            var inputs = this.pulsejetbuilder.EngineInputs();
            if (inputs.name != "Default") {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
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
                    var newelist = new EngineList("");
                    newelist.fromJSON(str);
                    engine_list.set(newelist.name, newelist);
                    this.UpdateList();
                } catch { }
            };
            reader.readAsText(file);
            this.m_load.value = "";
        };
        this.m_list_create.onclick = () => {
            if (this.m_list_input.value != "") {
                engine_list.set(this.m_list_input.value, new EngineList(this.m_list_input.value));
                this.UpdateList();
            }
        };
        this.m_list_delete.onclick = () => {
            if (this.list_idx != "" && this.list_idx != "Custom") {
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
            }
        };

        CreateSelect("Lists", this.m_list_select, cell);
        CreateSelect("Engines", this.m_select, cell);
        cell.appendChild(document.createElement("BR"));
        CreateButton("Save Engine List", this.m_save, cell);
        CreateButton("Load Engine List", this.m_load, cell);
        CreateButton("Add From Engine Builder", this.m_add_eb, cell);
        CreateButton("Add From Pulsejet Builder", this.m_add_pj, cell);
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

        this.UpdateList();
    }

    public UpdateList() {
        var l_idx = this.m_list_select.selectedIndex;
        while (this.m_list_select.options.length > 0) {
            this.m_list_select.options.remove(0);
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
            this.m_select.options.remove(0);
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
                this.enginebuilder.min_IAF = e_input.min_IAF;
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
