import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput, FlexLabel, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";
export class Reinforcement_HTML extends Display {
    constructor(rf) {
        super();
        this.rf = rf;
        this.ext_wood_inp = [];
        this.ext_steel_inp = [];
        this.cant_inp = [];
        document.getElementById("lbl_reinforcements").textContent = lu("Reinforcement Section Title");
        const tbl = document.getElementById("tbl_reinforcements");
        const fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Reinforcement External Reinforcements"));
        CreateTH(row, lu("Reinforcement Internal Reinforcements"));
        CreateTH(row, lu("Reinforcement Reinforcement Stats"));
        row = insertRow(fragment);
        this.InitExternal(row.insertCell());
        this.InitInternal(row.insertCell());
        this.InitStatDisplay(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitExternal(cell) {
        const fs = CreateFlexSection(cell);
        const fsr = CreateFlexSection(fs.div2);
        const fs_wood = CreateFlexSection(fsr.div1);
        const fs_steel = CreateFlexSection(fsr.div2);
        const lst = this.rf.GetExternalList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let w_inp = document.createElement("INPUT");
            let s_inp = document.createElement("INPUT");
            FlexLabel(lu(elem.name), fs.div1);
            FlexInput(lu("Reinforcement Wood"), w_inp, fs_wood);
            FlexInput(lu("Reinforcement Steel"), s_inp, fs_steel);
            w_inp.min = "0";
            s_inp.min = "0";
            w_inp.onchange = () => { this.rf.SetExternalWoodCount(i, w_inp.valueAsNumber); };
            s_inp.onchange = () => { this.rf.SetExternalSteelCount(i, s_inp.valueAsNumber); };
            this.ext_wood_inp.push(w_inp);
            this.ext_steel_inp.push(s_inp);
        }
        this.cabane = document.createElement("SELECT");
        FlexSelect(lu("Reinforcement Cabane"), this.cabane, fs);
        for (let o of this.rf.GetCabaneList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(o.name);
            this.cabane.add(opt);
        }
        this.cabane.onchange = () => { this.rf.SetCabane(this.cabane.selectedIndex); };
        this.cabane.selectedIndex = 0;
        this.wires = document.createElement("INPUT");
        FlexCheckbox(lu("Reinforcement Wires"), this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
    }
    InitInternal(cell) {
        const fs = CreateFlexSection(cell);
        const lst = this.rf.GetCantileverList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let inp = document.createElement("INPUT");
            FlexInput(lu(elem.name), inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.rf.SetCantileverCount(i, inp.valueAsNumber); };
            this.cant_inp.push(inp);
        }
        this.wing_blades = document.createElement("INPUT");
        FlexCheckbox(lu("Reinforcement Wing Blades"), this.wing_blades, fs);
        this.wing_blades.onchange = () => { this.rf.SetWingBlade(this.wing_blades.checked); };
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        const h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        const c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        const h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Raw Strain"));
        CreateTH(h2_row, lu("Reinforcement Aircraft Max Strain"));
        const c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_maxs = c2_row.insertCell();
        this.d_amax = c2_row.insertCell();
        this.d_amax.className = "part_local";
    }
    UpdateDisplay() {
        this.cabane.selectedIndex = this.rf.GetCabane();
        this.wires.checked = this.rf.GetWires();
        const w_count = this.rf.GetExternalWoodCount();
        const w_can = this.rf.CanExternalWood();
        for (let i = 0; i < w_count.length; i++) {
            this.ext_wood_inp[i].valueAsNumber = w_count[i];
            this.ext_wood_inp[i].disabled = !w_can[i];
        }
        const s_count = this.rf.GetExternalSteelCount();
        const s_can = this.rf.CanExternalWood();
        for (let i = 0; i < s_count.length; i++) {
            this.ext_steel_inp[i].valueAsNumber = s_count[i];
            this.ext_steel_inp[i].disabled = !s_can[i];
        }
        const c_count = this.rf.GetCantileverCount();
        for (let i = 0; i < c_count.length; i++) {
            this.cant_inp[i].valueAsNumber = c_count[i];
        }
        this.wing_blades.disabled = !this.rf.CanWingBlade();
        this.wing_blades.checked = this.rf.GetWingBlade();
        const stats = this.rf.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
    }
    UpdateMaxStrain(strain) {
        BlinkIfChanged(this.d_amax, strain.toString(), true);
    }
}
