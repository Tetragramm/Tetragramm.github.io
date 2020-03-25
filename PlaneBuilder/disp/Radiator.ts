/// <reference path="./Display.ts" />
/// <reference path="../impl/Radiator.ts" />

class Radiator_HTML extends Display {
    private radiator: Radiator;
    private type_select: HTMLSelectElement;
    private mount_select: HTMLSelectElement;
    private coolant_select: HTMLSelectElement;
    private c_mass: HTMLTableCellElement;
    private c_drag: HTMLTableCellElement;
    private c_cost: HTMLTableCellElement;
    private c_rely: HTMLTableCellElement;
    private c_lstb: HTMLTableCellElement;

    constructor(row: HTMLTableRowElement, rad: Radiator) {
        super();
        this.radiator = rad;

        var type_cell = row.insertCell();
        //Radiator Type
        this.type_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetTypeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);

        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);

        var cool_cell = row.insertCell();
        //Special Coolant
        this.coolant_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex) };
        cool_cell.appendChild(this.coolant_select);

        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE") as HTMLTableElement;
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Reliability");
        CreateTH(h1_row, "Lateral Stab");
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }

    public UpdateRadiator(rad: Radiator) {
        this.radiator = rad;
    }

    public UpdateDisplay() {
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString());
        BlinkIfChanged(this.c_cost, stats.cost.toString());
        BlinkIfChanged(this.c_drag, stats.drag.toString());
        BlinkIfChanged(this.c_rely, stats.reliability.toString());
        BlinkIfChanged(this.c_lstb, stats.latstab.toString());
    }
}