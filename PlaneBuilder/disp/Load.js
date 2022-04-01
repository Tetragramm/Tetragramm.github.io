import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput } from "./Tools.js";
import { Display } from "./Display.js";
export class Load_HTML extends Display {
    constructor(fuel, boom, cargo) {
        super();
        this.fuel = fuel;
        this.boom = boom;
        this.cargo = cargo;
        this.fuel_list = [];
        document.getElementById("lbl_load").textContent = lu("Load Section Title");
        const tbl = document.getElementById("tbl_load");
        const fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Load Fuel"));
        CreateTH(row, lu("Load Munitions"));
        CreateTH(row, lu("Load Cargo and Passengers"));
        CreateTH(row, lu("Load Load Stats"));
        row = insertRow(fragment);
        this.InitFuel(row.insertCell());
        this.InitMunitions(row.insertCell());
        this.InitCargoAndPassengers(row.insertCell());
        this.InitStats(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitFuel(cell) {
        const lst = this.fuel.GetTankList();
        const fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(lst[i].name), inp, fs);
            inp.onchange = () => { this.fuel.SetTankCount(i, inp.valueAsNumber); };
            this.fuel_list.push(inp);
        }
        this.seal = document.createElement("INPUT");
        FlexCheckbox(lu("Load Self-Sealing Gas Tank"), this.seal, fs);
        this.seal.onchange = () => { this.fuel.SetSelfSealing(this.seal.checked); };
        this.extinguish = document.createElement("INPUT");
        FlexCheckbox(lu("Load Remote Fire Extinguisher"), this.extinguish, fs);
        this.extinguish.onchange = () => { this.fuel.SetExtinguisher(this.extinguish.checked); };
    }
    InitMunitions(cell) {
        const fs = CreateFlexSection(cell);
        this.bombs = document.createElement("INPUT");
        FlexInput(lu("Load Bombs"), this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.rockets = document.createElement("INPUT");
        FlexInput(lu("Load Rockets"), this.rockets, fs);
        this.rockets.onchange = () => { this.boom.SetRocketCount(this.rockets.valueAsNumber); };
        this.bay_count = document.createElement("INPUT");
        FlexInput(lu("Load Internal Bay Count"), this.bay_count, fs);
        this.bay_count.onchange = () => { this.boom.SetBayCount(this.bay_count.valueAsNumber); };
        this.bay1 = document.createElement("INPUT");
        FlexCheckbox(lu("Load Widen Internal Bay 1"), this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
        this.bay2 = document.createElement("INPUT");
        FlexCheckbox(lu("Load Widen Internal Bay 2"), this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }
    InitCargoAndPassengers(cell) {
        // const fs = CreateFlexSection(cell);
        this.carg = document.createElement("SELECT");
        // FlexSelect(lu("Load Cargo"), this.carg, fs);
        cell.appendChild(this.carg);
        const lst = this.cargo.GetSpaceList();
        for (let l of lst) {
            let opt = document.createElement("OPTION");
            opt.text = lu(l.name);
            this.carg.add(opt);
        }
        this.carg.onchange = () => { this.cargo.SetSpace(this.carg.selectedIndex); };
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        const h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Wet Mass"));
        const c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_wmas = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Stat Fuel"));
        CreateTH(h2_row, lu("Stat Cost"));
        var c2_row = tbl_stat.insertRow();
        this.d_rsec = c2_row.insertCell();
        this.d_fuel = c2_row.insertCell();
        this.d_cost = c2_row.insertCell();
        h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "");
        CreateTH(h2_row, lu("Derived Fuel Uses"));
        CreateTH(h2_row, "");
        c2_row = tbl_stat.insertRow();
        c2_row.insertCell();
        this.d_fuse = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateFuelUses(uses) {
        var value = Math.floor(1.0e-6 + uses * 10) / 10;
        if (!isFinite(value)) {
            value = 0;
        }
        BlinkIfChanged(this.d_fuse, (value).toString(), false);
    }
    UpdateDisplay() {
        const fl = this.fuel.GetTankCount();
        const fe = this.fuel.GetTankEnabled();
        for (let i = 0; i < fl.length; i++) {
            this.fuel_list[i].valueAsNumber = fl[i];
            this.fuel_list[i].disabled = !fe[i];
        }
        this.seal.checked = this.fuel.GetSelfSealing();
        this.seal.disabled = !this.fuel.GetSealingEnabled();
        this.extinguish.checked = this.fuel.GetExtinguisher();
        this.bombs.valueAsNumber = this.boom.GetBombCount();
        this.rockets.valueAsNumber = this.boom.GetRocketCount();
        this.bay_count.valueAsNumber = this.boom.GetBayCount();
        this.bay1.checked = this.boom.GetBay1();
        this.bay2.checked = this.boom.GetBay2();
        if (this.boom.GetBayCount() > 0) {
            this.bay1.disabled = false;
            if (this.bay1.checked)
                this.bay2.disabled = false;
            else
                this.bay2.disabled = true;
        }
        else {
            this.bay1.disabled = true;
            this.bay2.disabled = true;
        }
        this.carg.selectedIndex = this.cargo.GetSpace();
        var stats = this.fuel.PartStats();
        stats = stats.Add(this.boom.PartStats());
        stats = stats.Add(this.cargo.PartStats());
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString(), false);
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString(), false);
        BlinkIfChanged(this.d_fuel, stats.fuel.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
    }
}
