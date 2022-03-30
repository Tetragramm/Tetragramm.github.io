import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";
export class ControlSurfaces_HTML extends Display {
    constructor(cs) {
        super();
        this.cs = cs;
        document.getElementById("lbl_control_surfaces").textContent = lu("Control Surfaces Section Title");
        var tbl = document.getElementById("tbl_control_surfaces");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Control Surfaces Control Surfaces"));
        CreateTH(row, lu("Control Surfaces Drag Inducers"));
        CreateTH(row, lu("Control Surfaces Stats"));
        row = insertRow(fragment);
        var cs_cell = row.insertCell();
        this.aileron_select = document.createElement("SELECT");
        for (let a of cs.GetAileronList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.aileron_select.add(opt);
        }
        this.aileron_select.onchange = () => { this.cs.SetAileron(this.aileron_select.selectedIndex); };
        this.rudder_select = document.createElement("SELECT");
        for (let a of cs.GetRudderList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.rudder_select.add(opt);
        }
        this.rudder_select.onchange = () => { this.cs.SetRudder(this.rudder_select.selectedIndex); };
        this.elevator_select = document.createElement("SELECT");
        for (let a of cs.GetElevatorList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.elevator_select.add(opt);
        }
        this.elevator_select.onchange = () => { this.cs.SetElevator(this.elevator_select.selectedIndex); };
        this.flaps_select = document.createElement("SELECT");
        for (let a of cs.GetFlapsList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.flaps_select.add(opt);
        }
        this.flaps_select.onchange = () => { this.cs.SetFlaps(this.flaps_select.selectedIndex); };
        this.slats_select = document.createElement("SELECT");
        for (let a of cs.GetSlatsList()) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            this.slats_select.add(opt);
        }
        this.slats_select.onchange = () => { this.cs.SetSlats(this.slats_select.selectedIndex); };
        var fs = CreateFlexSection(cs_cell);
        FlexSelect(lu("Control Surfaces Ailerons"), this.aileron_select, fs);
        FlexSelect(lu("Control Surfaces Rudders"), this.rudder_select, fs);
        FlexSelect(lu("Control Surfaces Elevators"), this.elevator_select, fs);
        FlexSelect(lu("Control Surfaces Flaps"), this.flaps_select, fs);
        FlexSelect(lu("Control Surfaces Slats"), this.slats_select, fs);
        var drag_cell = row.insertCell();
        var fs2 = CreateFlexSection(drag_cell);
        this.drag_chbx = [];
        var dlist = cs.GetDragList();
        for (let i = 0; i < dlist.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lu(dlist[i].name), cbx, fs2);
            cbx.onchange = () => { this.cs.SetDrag(i, cbx.checked); };
            this.drag_chbx.push(cbx);
        }
        this.InitStatDisplay(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitStatDisplay(stat_cell) {
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
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Lift Bleed"));
        CreateTH(h3_row, lu("Stat Crash Safety"));
        CreateTH(h3_row, " ");
        var c3_row = tbl_stat.insertRow();
        this.d_lift = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_none = c3_row.insertCell();
    }
    UpdateDisplay() {
        var can_aileron = this.cs.CanAileron();
        for (let i = 0; i < can_aileron.length; i++) {
            this.aileron_select.options[i].disabled = !can_aileron[i];
        }
        this.aileron_select.selectedIndex = this.cs.GetAileron();
        this.rudder_select.selectedIndex = this.cs.GetRudder();
        this.rudder_select.disabled = !this.cs.CanRudder();
        this.elevator_select.selectedIndex = this.cs.GetElevator();
        this.elevator_select.disabled = !this.cs.CanElevator();
        this.flaps_select.selectedIndex = this.cs.GetFlaps();
        this.slats_select.selectedIndex = this.cs.GetSlats();
        var drag = this.cs.GetDrag();
        for (let i = 0; i < this.drag_chbx.length; i++) {
            this.drag_chbx[i].checked = drag[i];
        }
        var stats = this.cs.PartStats();
        var cost = stats.cost + this.cs.GetFlapCost();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, cost.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }
}
