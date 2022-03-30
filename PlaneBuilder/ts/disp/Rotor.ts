import { AIRCRAFT_TYPE } from "../impl/Part.js";
import { Rotor } from "../impl/Rotor.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexDisplay, FlexInput, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";

export class Rotor_HTML extends Display {
    private rotor: Rotor;

    private div: HTMLDivElement;
    private wing_div: HTMLDivElement;
    private reinforce_div: HTMLDivElement;
    private control_div: HTMLDivElement;

    private auto_header: HTMLTableRowElement;
    private auto_row: HTMLTableRowElement;
    private auto_min: HTMLLabelElement;
    private auto_span: HTMLInputElement;
    private auto_mat: HTMLSelectElement;
    private auto_clutch: HTMLInputElement;

    //Autogyro Stats
    private a_drag: HTMLTableCellElement;
    private a_mass: HTMLTableCellElement;
    private a_cost: HTMLTableCellElement;
    private a_area: HTMLTableCellElement;

    private heli_header: HTMLTableRowElement;
    private heli_row: HTMLTableRowElement;
    private heli_count: HTMLInputElement;
    private heli_min: HTMLLabelElement;
    private heli_span: HTMLInputElement;
    private heli_stagger: HTMLSelectElement;
    private heli_blade_count: HTMLSelectElement;
    private heli_mat: HTMLSelectElement;
    private heli_shafts: HTMLInputElement;

    //Helicopter Stats
    private h_drag: HTMLTableCellElement;
    private h_mass: HTMLTableCellElement;
    private h_cost: HTMLTableCellElement;
    private h_area: HTMLTableCellElement;
    private h_rely: HTMLTableCellElement;
    private h_strn: HTMLTableCellElement;

    constructor(r: Rotor) {
        super();
        this.rotor = r;

        (document.getElementById("lbl_rotor") as HTMLLabelElement).textContent = lu("Rotor Section Title");

        this.div = document.getElementById("Rotors") as HTMLDivElement;
        this.wing_div = document.getElementById("Wings") as HTMLDivElement;
        this.reinforce_div = document.getElementById("Reinforcements") as HTMLDivElement;
        this.control_div = document.getElementById("ControlSurfaces") as HTMLDivElement;
        var tbl = document.getElementById("rotor_table") as HTMLTableElement;
        var fragment = document.createDocumentFragment();
        this.InitAutogyro(fragment);
        this.InitHelicopter(fragment);
        tbl.appendChild(fragment);
    }

    private InitAutogyro(fragment: DocumentFragment) {
        this.auto_header = insertRow(fragment);
        CreateTH(this.auto_header, lu("Rotor Rotor"));
        CreateTH(this.auto_header, lu("Rotor Material"));
        CreateTH(this.auto_header, lu("Rotor Accessories"));
        CreateTH(this.auto_header, lu("Rotor Stats"));

        this.auto_row = insertRow(fragment);
        var rotor_cell = this.auto_row.insertCell();
        var rotor_fs = CreateFlexSection(rotor_cell);
        this.auto_min = document.createElement("LABEL") as HTMLLabelElement;
        FlexDisplay(lu("Rotor Minimum Span"), this.auto_min, rotor_fs);
        this.auto_span = document.createElement("INPUT") as HTMLInputElement;
        FlexInput(lu("Rotor Span"), this.auto_span, rotor_fs);
        this.auto_span.onchange = () => { this.rotor.SetRotorSpan(this.auto_span.valueAsNumber); };

        var mat_cell = this.auto_row.insertCell();
        var mat_fs = CreateFlexSection(mat_cell);
        this.auto_mat = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect(lu("Rotor Material"), this.auto_mat, mat_fs);
        for (let ctype of this.rotor.GetCantileverList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(ctype.name);
            this.auto_mat.add(opt);
        }
        this.auto_mat.onchange = () => { this.rotor.SetCantilever(this.auto_mat.selectedIndex); };

        var acc_cell = this.auto_row.insertCell();
        var acc_fs = CreateFlexSection(acc_cell);
        this.auto_clutch = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox(lu("Rotor Clutched Rotor"), this.auto_clutch, acc_fs);
        this.auto_clutch.onchange = () => { this.rotor.SetAccessory(this.auto_clutch.checked); };

        this.InitAutogyroStats(this.auto_row.insertCell());
    }

    private InitAutogyroStats(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.a_drag = c1_row.insertCell();
        this.a_mass = c1_row.insertCell();
        this.a_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Rotor Area"));
        CreateTH(h2_row, "");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.a_area = c2_row.insertCell();
        c2_row.insertCell();
        c2_row.insertCell();
    }

    private UpdateAutogyroStats() {
        this.auto_span.valueAsNumber = this.rotor.GetRotorSpan();

        this.auto_mat.selectedIndex = this.rotor.GetCantilever();

        this.auto_min.innerText = "" + this.rotor.GetSizingSpan();

        this.auto_clutch.checked = this.rotor.GetAccessory();

        var stats = this.rotor.PartStats();
        BlinkIfChanged(this.a_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.a_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.a_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.a_area, stats.wingarea.toString(), true);
    }

    private InitHelicopter(fragment: DocumentFragment) {
        this.heli_header = insertRow(fragment);
        CreateTH(this.heli_header, lu("Rotor Rotor"));
        CreateTH(this.heli_header, lu("Rotor Material"));
        CreateTH(this.heli_header, lu("Rotor Accessories"));
        CreateTH(this.heli_header, lu("Rotor Stats"));

        this.heli_row = insertRow(fragment);
        var rotor_cell = this.heli_row.insertCell();
        var rotor_fs = CreateFlexSection(rotor_cell);
        this.heli_count = document.createElement("INPUT") as HTMLInputElement;
        FlexInput(lu("Rotor Number of Rotors"), this.heli_count, rotor_fs);
        this.heli_count.onchange = () => { this.rotor.SetRotorCount(this.heli_count.valueAsNumber); };
        this.heli_min = document.createElement("LABEL") as HTMLLabelElement;
        FlexDisplay(lu("Rotor Ideal Rotor Span"), this.heli_min, rotor_fs);
        this.heli_span = document.createElement("INPUT") as HTMLInputElement;
        FlexInput(lu("Rotor Span"), this.heli_span, rotor_fs);
        this.heli_span.min = "";
        this.heli_span.onchange = () => { this.rotor.SetRotorSpan(this.heli_span.valueAsNumber); };

        this.heli_stagger = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect(lu("Rotor Stagger"), this.heli_stagger, rotor_fs);
        var staggers = this.rotor.GetStaggerList();
        for (let s of staggers) {
            let opt1 = document.createElement("OPTION") as HTMLOptionElement;
            opt1.text = lu(s.name);
            this.heli_stagger.add(opt1);
        }
        this.heli_stagger.onchange = () => { this.rotor.SetStagger(this.heli_stagger.selectedIndex); };

        this.heli_blade_count = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect(lu("Rotor Blade Count"), this.heli_blade_count, rotor_fs);
        var blade_list = this.rotor.GetBladeList();
        for (let b of blade_list) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = b.name;
            this.heli_blade_count.add(opt);
        }
        this.heli_blade_count.onchange = () => { this.rotor.SetBladeCount(this.heli_blade_count.selectedIndex); };


        var mat_cell = this.heli_row.insertCell();
        var mat_fs = CreateFlexSection(mat_cell);
        this.heli_mat = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect(lu("Rotor Rotor Material"), this.heli_mat, mat_fs);
        for (let ctype of this.rotor.GetCantileverList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(ctype.name);
            this.heli_mat.add(opt);
        }
        this.heli_mat.onchange = () => { this.rotor.SetCantilever(this.heli_mat.selectedIndex); };

        var acc_cell = this.heli_row.insertCell();
        var acc_fs = CreateFlexSection(acc_cell);
        this.heli_shafts = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox(lu("Rotor Motor Cross-link"), this.heli_shafts, acc_fs);
        this.heli_shafts.onchange = () => { this.rotor.SetAccessory(this.heli_shafts.checked); };

        this.InitHelicopterStats(this.heli_row.insertCell());
    }

    private InitHelicopterStats(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.h_drag = c1_row.insertCell();
        this.h_mass = c1_row.insertCell();
        this.h_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Rotor Area"));
        CreateTH(h2_row, lu("Stat Reliability"));
        CreateTH(h2_row, lu("Reinforcement Aircraft Max Strain"));
        var c2_row = tbl_stat.insertRow();
        this.h_area = c2_row.insertCell();
        this.h_rely = c2_row.insertCell();
        this.h_strn = c2_row.insertCell();
    }

    private UpdateHelicopterStats() {
        this.heli_count.valueAsNumber = this.rotor.GetRotorCount();
        if (this.rotor.GetRotorCount() == 1)
            this.heli_count.step = "1";
        else
            this.heli_count.step = "2";

        this.heli_min.innerText = "" + this.rotor.GetSizingSpan();
        this.heli_span.valueAsNumber = this.rotor.GetRotorSpan();
        var can_stagger = this.rotor.CanStagger();
        for (let i = 0; i < can_stagger.length; i++) {
            this.heli_stagger.options[i].disabled = !can_stagger[i];
        }

        this.heli_stagger.selectedIndex = this.rotor.GetStagger();

        this.heli_mat.selectedIndex = this.rotor.GetCantilever();

        this.heli_shafts.checked = this.rotor.GetAccessory();

        this.heli_blade_count.selectedIndex = this.rotor.GetBladeCountIdx();

        var stats = this.rotor.PartStats();
        BlinkIfChanged(this.h_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.h_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.h_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.h_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.h_rely, stats.reliability.toString(), true);
    }

    public UpdateMaxStrain(strain: number) {
        BlinkIfChanged(this.h_strn, strain.toString(), true);
    }

    public UpdateDisplay() {
        switch (this.rotor.GetType()) {
            case AIRCRAFT_TYPE.AIRPLANE:
                this.div.hidden = true;
                this.wing_div.hidden = false;
                this.reinforce_div.hidden = false;
                this.control_div.hidden = false;
                break;
            case AIRCRAFT_TYPE.AUTOGYRO:
                this.div.hidden = false;
                this.wing_div.hidden = false;
                this.reinforce_div.hidden = false;
                this.control_div.hidden = false;
                this.heli_header.hidden = true;
                this.heli_row.hidden = true;
                this.auto_header.hidden = false;
                this.auto_row.hidden = false;
                this.UpdateAutogyroStats();
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
                this.div.hidden = false;
                this.wing_div.hidden = true;
                this.reinforce_div.hidden = true;
                this.control_div.hidden = true;
                this.auto_header.hidden = true;
                this.auto_row.hidden = true;
                this.heli_header.hidden = false;
                this.heli_row.hidden = false;
                this.UpdateHelicopterStats();
                break;
        }
    }
}