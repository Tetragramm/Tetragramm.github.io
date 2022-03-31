import { Stabilizers } from "../impl/Stabilizers.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateInput, CreateTH, BlinkIfChanged } from "./Tools.js";
import { Display } from "./Display.js";

export class Stabilizers_HTML extends Display {
    private stab: Stabilizers;
    private h_type: HTMLSelectElement;
    private h_count: HTMLInputElement;
    private v_type: HTMLSelectElement;
    private v_count: HTMLInputElement;

    //Display Stat Elements
    private d_drag: HTMLTableCellElement;
    private d_cont: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_pstb: HTMLTableCellElement;
    private d_lstb: HTMLTableCellElement;
    private d_lift: HTMLTableCellElement;

    constructor(s: Stabilizers) {
        super();
        this.stab = s;

        (document.getElementById("lbl_stab") as HTMLLabelElement).textContent = lu("Stabilizers Section Title");

        const tbl = document.getElementById("stab_table") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        CreateTH(row, lu("Stabilizers Horizontal Stabilizers"));
        CreateTH(row, lu("Stabilizers Vertical Stabilizers"));
        CreateTH(row, lu("Stabilizers Stabilizer Stats"));

        row = insertRow(fragment);
        const hcell = row.insertCell();
        const vcell = row.insertCell();

        this.h_type = document.createElement("SELECT") as HTMLSelectElement;
        this.h_count = document.createElement("INPUT") as HTMLInputElement;
        hcell.appendChild(this.h_type);
        hcell.append(document.createElement("BR"));
        CreateInput(lu("Stabilizers # of Stabilizers"), this.h_count, hcell);

        this.h_count.min = "0";
        this.h_count.max = "20";
        this.h_count.onchange = () => { this.stab.SetHStabCount(this.h_count.valueAsNumber); };
        this.h_type.onchange = () => { this.stab.SetHStabType(this.h_type.selectedIndex); };

        for (let elem of s.GetHStabList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.h_type.add(opt);
        }

        this.v_type = document.createElement("SELECT") as HTMLSelectElement;
        this.v_count = document.createElement("INPUT") as HTMLInputElement;
        vcell.appendChild(this.v_type);
        vcell.appendChild(document.createElement("BR"));
        CreateInput(lu("Stabilizers # of Stabilizers"), this.v_count, vcell);

        this.v_count.min = "0";
        this.v_count.max = "20";
        this.v_count.onchange = () => { this.stab.SetVStabCount(this.v_count.valueAsNumber); };
        this.v_type.onchange = () => { this.stab.SetVStabType(this.v_type.selectedIndex); };

        for (let elem of s.GetVStabList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.v_type.add(opt);
        }

        const stat_cell = row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
        tbl.appendChild(fragment);
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        const h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Control"));
        CreateTH(h1_row, lu("Stat Cost"));
        const c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        const h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        CreateTH(h2_row, lu("Stat Lift Bleed"));
        const c2_row = tbl_stat.insertRow();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
    }

    public UpdateDisplay() {
        this.h_type.selectedIndex = this.stab.GetHStabType();
        this.v_type.selectedIndex = this.stab.GetVStabType();

        const valid = this.stab.GetHValidList();
        for (let i = 0; i < valid.length; i++) {
            this.h_type.options[i].disabled = !valid[i];
        }
        valid = this.stab.GetVValidList();
        for (let i = 0; i < valid.length; i++) {
            this.v_type.options[i].disabled = !valid[i];
        }

        this.h_count.valueAsNumber = this.stab.GetHStabCount();
        this.h_count.step = this.stab.GetHStabIncrement().toString();
        this.v_count.valueAsNumber = this.stab.GetVStabCount();
        this.v_count.step = this.stab.GetVStabIncrement().toString();

        const stats = this.stab.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
    }
}