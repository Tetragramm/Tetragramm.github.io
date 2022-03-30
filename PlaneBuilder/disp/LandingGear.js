import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";
export class LandingGear_HTML extends Display {
    constructor(gear) {
        super();
        this.gear = gear;
        document.getElementById("lbl_landing_gear").textContent = lu("Landing Gear Section Title");
        var tbl = document.getElementById("tbl_gear");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Landing Gear Landing Gear"));
        CreateTH(row, lu("Landing Gear Extras"));
        CreateTH(row, lu("Landing Gear Gear Stats"));
        row = insertRow(fragment);
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitGear(cell) {
        var lst = this.gear.GetGearList();
        var fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT");
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(lst[i].name);
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };
        this.retract = document.createElement("INPUT");
        FlexCheckbox(lu("Landing Gear Retractable"), this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }
    InitExtras(cell) {
        this.extras = [];
        var lst = this.gear.GetExtraList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lu(lst[i].name), cbx, fs);
            cbx.onchange = () => { this.gear.SetExtraSelected(i, cbx.checked); };
            this.extras.push(cbx);
        }
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Crash Safety"));
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        var gcan = this.gear.CanGear();
        for (let i = 0; i < gcan.length; i++)
            this.sel.options[i].disabled = !gcan[i];
        this.retract.checked = this.gear.GetRetract();
        this.retract.disabled = !this.gear.CanRetract();
        var lst = this.gear.GetExtraSelected();
        for (let i = 0; i < lst.length; i++) {
            this.extras[i].checked = lst[i];
        }
        var stats = this.gear.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
}
