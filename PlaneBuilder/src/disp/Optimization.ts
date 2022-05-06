import { Optimization } from "../impl/Optimization";
import { lu } from "../impl/Localization";
import { insertRow, CreateTH, BlinkIfChanged, toggleCollapse } from "./Tools";
import { Display } from "./Display";

export class Optimization_HTML extends Display {
    private opt: Optimization;
    private free_inp: HTMLInputElement;
    private cost_cbx: HTMLInputElement[];
    private bleed_cbx: HTMLInputElement[];
    private escape_cbx: HTMLInputElement[];
    private mass_cbx: HTMLInputElement[];
    private toughness_cbx: HTMLInputElement[];
    private maxstrain_cbx: HTMLInputElement[];
    private reliability_cbx: HTMLInputElement[];
    private drag_cbx: HTMLInputElement[];

    //Display Stat Elements
    private d_cost: HTMLTableCellElement;
    private d_lift: HTMLTableCellElement;
    private d_escp: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_tugh: HTMLTableCellElement;
    private d_mstr: HTMLTableCellElement;
    private d_reli: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;

    constructor(opt: Optimization) {
        super();
        this.opt = opt;

        (document.getElementById("lbl_optimization") as HTMLLabelElement).textContent = lu("Optimization Section Title");

        (document.getElementById("lbl_num_opt") as HTMLLabelElement).textContent = lu("Optimization Num Free Optimizations");
        this.free_inp = document.getElementById("num_opt") as HTMLInputElement;
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };

        const tbl = document.getElementById("tbl_optimization") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        const row0 = insertRow(fragment);
        CreateTH(row0, lu("Optimization Negative"));
        CreateTH(row0, lu("Optimization Effect"));
        CreateTH(row0, lu("Optimization Positive"));
        CreateTH(row0, lu("Optimization Optimization Stats"));
        // <th>Negative < /th>
        // < th > Effect < /th>
        // < th > Positive < /th>
        // < th > Optimization Stats < /th>

        const row1 = insertRow(fragment);
        this.cost_cbx = this.InitRow(row1, lu("Optimization Cost"), (num: number) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(insertRow(fragment), lu("Optimization Lift Bleed"), (num: number) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(insertRow(fragment), lu("Optimization Leg Room"), (num: number) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(insertRow(fragment), lu("Optimization Mass"), (num: number) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(insertRow(fragment), lu("Optimization Toughness"), (num: number) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(insertRow(fragment), lu("Optimization Max Strain"), (num: number) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(insertRow(fragment), lu("Optimization Reliability"), (num: number) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(insertRow(fragment), lu("Optimization Drag"), (num: number) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
        tbl.appendChild(fragment);
    }

    private InitRow(row: HTMLTableRowElement, txt: string, call: (num: number) => void) {
        const cbxs = [];
        for (let i = 0; i < 6; i++) {
            cbxs.push(document.createElement("INPUT") as HTMLInputElement);
            cbxs[i].setAttribute("type", "checkbox");
            if (i < 3)
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 3);
                    else
                        call(i - 2);
                };
            else
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 2);
                    else
                        call(i - 3);
                };
        }
        const ncell = row.insertCell();
        const ecell = row.insertCell();
        const pcell = row.insertCell();
        ncell.appendChild(cbxs[0]);
        ncell.appendChild(cbxs[1]);
        ncell.appendChild(cbxs[2]);
        ecell.textContent = txt;
        pcell.appendChild(cbxs[3]);
        pcell.appendChild(cbxs[4]);
        pcell.appendChild(cbxs[5]);
        return cbxs;
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.rowSpan = 0;
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        const h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Cost"));
        CreateTH(h1_row, lu("Stat Lift Bleed"));
        CreateTH(h1_row, lu("Stat Escape"));
        const c1_row = tbl_stat.insertRow();
        this.d_cost = c1_row.insertCell();
        this.d_lift = c1_row.insertCell();
        this.d_escp = c1_row.insertCell();
        const h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Visibility"));
        CreateTH(h2_row, lu("Stat Mass"));
        CreateTH(h2_row, lu("Stat Toughness"));
        const c2_row = tbl_stat.insertRow();
        this.d_visi = c2_row.insertCell();
        this.d_mass = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        const h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Max Strain"));
        CreateTH(h3_row, lu("Stat Reliability"));
        CreateTH(h3_row, lu("Stat Drag"));
        const c3_row = tbl_stat.insertRow();
        this.d_mstr = c3_row.insertCell();
        this.d_reli = c3_row.insertCell();
        this.d_drag = c3_row.insertCell();
    }

    public SetCollapse() {
        toggleCollapse("optimization_collapse", !this.opt.IsDefault());
    }

    private UpdateChecked(num: number, lst: HTMLInputElement[]) {
        for (let i = 0; i < lst.length; i++)
            lst[i].checked = false;
        if (num < 0) {
            lst[2].checked = true;
            if (num < -1) {
                lst[1].checked = true;
                if (num < -2)
                    lst[0].checked = true;
            }
        } else if (num > 0) {
            lst[3].checked = true;
            if (num > 1) {
                lst[4].checked = true;
                if (num > 2)
                    lst[5].checked = true;
            }
        }
    }

    private UpdateEnabled(num: number, lst: HTMLInputElement[]) {
        var free = 0;
        for (let i = 3; i < lst.length; i++) {
            if (!lst[i].checked)
                free++;
            lst[i].disabled = free > num;
        }
    }

    public UpdateDisplay() {
        this.free_inp.valueAsNumber = this.opt.GetFreeDots();
        //Update Checked
        this.UpdateChecked(this.opt.GetCost(), this.cost_cbx);
        this.UpdateChecked(this.opt.GetBleed(), this.bleed_cbx);
        this.UpdateChecked(this.opt.GetEscape(), this.escape_cbx);
        this.UpdateChecked(this.opt.GetMass(), this.mass_cbx);
        this.UpdateChecked(this.opt.GetToughness(), this.toughness_cbx);
        this.UpdateChecked(this.opt.GetMaxStrain(), this.maxstrain_cbx);
        this.UpdateChecked(this.opt.GetReliabiilty(), this.reliability_cbx);
        this.UpdateChecked(this.opt.GetDrag(), this.drag_cbx);
        //Update Enabled
        const can_dot = this.opt.GetUnassignedCount();
        this.UpdateEnabled(can_dot, this.cost_cbx);
        this.UpdateEnabled(can_dot, this.bleed_cbx);
        this.UpdateEnabled(can_dot, this.escape_cbx);
        this.UpdateEnabled(can_dot, this.mass_cbx);
        this.UpdateEnabled(can_dot, this.toughness_cbx);
        this.UpdateEnabled(can_dot, this.maxstrain_cbx);
        this.UpdateEnabled(can_dot, this.reliability_cbx);
        this.UpdateEnabled(can_dot, this.drag_cbx);
        //Update Stats
        const stats = this.opt.PartStats();
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_escp, stats.escape.toString(), true);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_mstr, this.opt.final_ms.toString(), true);
        BlinkIfChanged(this.d_reli, stats.reliability.toString(), true);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
    }
}