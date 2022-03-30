import { Radiator } from "../impl/Radiator.js";
import { lu } from "../impl/Localization.js";
import { CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox } from "./Tools.js";
import { Display } from "./Display.js";

export class Radiator_HTML extends Display {
    private radiator: Radiator;
    private type_select: HTMLSelectElement;
    private mount_select: HTMLSelectElement;
    private coolant_select: HTMLSelectElement;
    private harden_input: HTMLInputElement;
    private c_mass: HTMLTableCellElement;
    private c_drag: HTMLTableCellElement;
    private c_cost: HTMLTableCellElement;
    private c_rely: HTMLTableCellElement;
    private c_lstb: HTMLTableCellElement;
    private c_flam: HTMLTableCellElement;

    constructor(row: HTMLTableRowElement, rad: Radiator) {
        super();
        this.radiator = rad;

        var type_cell = row.insertCell();
        //Radiator Type
        this.type_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetTypeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);

        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);

        var cool_cell = row.insertCell();
        //Special Coolant

        this.coolant_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex) };
        cool_cell.appendChild(this.coolant_select);
        cool_cell.appendChild(document.createElement("BR"));
        this.harden_input = document.createElement("INPUT") as HTMLInputElement;
        var fs = CreateFlexSection(cool_cell);
        FlexCheckbox(lu("Radiators Harden Radiator"), this.harden_input, fs);
        this.harden_input.onchange = () => { this.radiator.SetHarden(this.harden_input.checked); };

        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE") as HTMLTableElement;
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Reliability"));
        CreateTH(h1_row, lu("Stat Lateral Stability"));
        CreateTH(h1_row, lu("Derived Is Flammable Question"));
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        this.c_flam = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }

    public UpdateRadiator(rad: Radiator) {
        this.radiator = rad;
    }

    public UpdateDisplay() {
        var tcan = this.radiator.CanType();
        for (let i = 0; i < tcan.length; i++) {
            this.type_select.options[i].disabled = !tcan[i];
        }
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        var mcan = this.radiator.CanMount();
        for (let i = 0; i < mcan.length; i++) {
            this.mount_select.options[i].disabled = !mcan[i];
        }
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        this.harden_input.checked = this.radiator.GetHarden();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.c_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.c_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.c_rely, stats.reliability.toString(), true);
        BlinkIfChanged(this.c_lstb, stats.latstab.toString(), true);
        if (this.radiator.GetIsFlammable())
            BlinkIfChanged(this.c_flam, lu("Yes"));
        else
            BlinkIfChanged(this.c_flam, lu("No"));
    }
}