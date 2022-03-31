import { LandingGear } from "../impl/LandingGear.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";

export class LandingGear_HTML extends Display {
    private gear: LandingGear;
    private sel: HTMLSelectElement;
    private retract: HTMLInputElement;
    private extras: HTMLInputElement[];

    //Display Stat Elements
    private d_drag: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;

    constructor(gear: LandingGear) {
        super();
        this.gear = gear;

        (document.getElementById("lbl_landing_gear") as HTMLLabelElement).textContent = lu("Landing Gear Section Title");
        const tbl = document.getElementById("tbl_gear") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        CreateTH(row, lu("Landing Gear Landing Gear"));
        CreateTH(row, lu("Landing Gear Extras"));
        CreateTH(row, lu("Landing Gear Gear Stats"));

        row = insertRow(fragment);
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
        tbl.appendChild(fragment);
    }

    private InitGear(cell: HTMLTableCellElement) {
        const lst = this.gear.GetGearList();
        const fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(lst[i].name);
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };

        this.retract = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox(lu("Landing Gear Retractable"), this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }

    private InitExtras(cell: HTMLTableCellElement) {
        this.extras = [];
        const lst = this.gear.GetExtraList();
        const fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(lu(lst[i].name), cbx, fs);
            cbx.onchange = () => { this.gear.SetExtraSelected(i, cbx.checked); };
            this.extras.push(cbx);
        }
    }

    private InitStats(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE") as HTMLTableElement;
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
        CreateTH(h2_row, lu("Stat Crash Safety"));
        CreateTH(h2_row, "");
        const c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }

    public UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        const gcan = this.gear.CanGear();
        for (let i = 0; i < gcan.length; i++)
            this.sel.options[i].disabled = !gcan[i];

        this.retract.checked = this.gear.GetRetract();
        this.retract.disabled = !this.gear.CanRetract();

        const lst = this.gear.GetExtraSelected();
        for (let i = 0; i < lst.length; i++) {
            this.extras[i].checked = lst[i];
        }

        const stats = this.gear.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
}