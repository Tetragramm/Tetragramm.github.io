/// <reference path="./Display.ts" />
/// <reference path="../impl/Fuel.ts" />
/// <reference path="../impl/Munitions.ts" />
/// <reference path="../impl/CargoAndPassengers.ts" />

class Load_HTML extends Display {
    private fuel: Fuel;
    private boom: Munitions;
    private cargo: CargoAndPassengers

    //Fuel
    private fuel_list: HTMLInputElement[];
    private seal: HTMLInputElement;
    private extinguish: HTMLInputElement;
    //Munitions
    private bombs: HTMLInputElement;
    private rockets: HTMLInputElement;
    private bay_count: HTMLInputElement;
    private bay1: HTMLInputElement;
    private bay2: HTMLInputElement;
    //Cargo and Passengers
    private carg: HTMLSelectElement;

    //Display Stat Elements
    private d_drag: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_wmas: HTMLTableCellElement;
    private d_rsec: HTMLTableCellElement;
    private d_fuel: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;

    constructor(fuel: Fuel, boom: Munitions, cargo: CargoAndPassengers) {
        super();

        this.fuel = fuel;
        this.boom = boom;
        this.cargo = cargo;
        this.fuel_list = [];

        var tbl = document.getElementById("tbl_load") as HTMLTableElement;
        var row = tbl.insertRow();
        this.InitFuel(row.insertCell());
        this.InitMunitions(row.insertCell());
        this.InitCargoAndPassengers(row.insertCell());
        this.InitStats(row.insertCell());
    }

    private InitFuel(cell: HTMLTableCellElement) {
        var lst = this.fuel.GetTankList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let inp = document.createElement("INPUT") as HTMLInputElement;
            FlexInput(lst[i].name, inp, fs);
            inp.onchange = () => { this.fuel.SetTankCount(i, inp.valueAsNumber); };
            this.fuel_list.push(inp);
        }

        this.seal = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Self-Sealing Gas Tank", this.seal, fs);
        this.seal.onchange = () => { this.fuel.SetSelfSealing(this.seal.checked); };

        this.extinguish = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Remote Fire Extinguisher", this.extinguish, fs);
        this.extinguish.onchange = () => { this.fuel.SetExtinguisher(this.extinguish.checked); };
    }

    private InitMunitions(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        this.bombs = document.createElement("INPUT") as HTMLInputElement;
        FlexInput("Bombs ", this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.rockets = document.createElement("INPUT") as HTMLInputElement;
        FlexInput("Rockets", this.rockets, fs);
        this.rockets.onchange = () => { this.boom.SetRocketCount(this.rockets.valueAsNumber); };

        this.bay_count = document.createElement("INPUT") as HTMLInputElement;
        FlexInput("Internal Bay Count", this.bay_count, fs);
        this.bay_count.onchange = () => { this.boom.SetBayCount(this.bay_count.valueAsNumber); };

        this.bay1 = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Widen Internal Bay 1", this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };

        this.bay2 = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Widen Internal Bay 2", this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }

    private InitCargoAndPassengers(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        this.carg = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect("Cargo", this.carg, fs);
        var lst = this.cargo.GetSpaceList();
        for (let l of lst) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = l.name;
            this.carg.add(opt);
        }
        this.carg.onchange = () => { this.cargo.SetSpace(this.carg.selectedIndex); };
    }

    private InitStats(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Wet Mass");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_wmas = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Fuel");
        CreateTH(h2_row, "Cost");
        var c2_row = tbl_stat.insertRow();
        this.d_rsec = c2_row.insertCell();
        this.d_fuel = c2_row.insertCell();
        this.d_cost = c2_row.insertCell();
    }

    public UpdateDisplay() {
        var fl = this.fuel.GetTankCount();
        var fe = this.fuel.GetTankEnabled();
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
        } else {
            this.bay1.disabled = true;
            this.bay2.disabled = true;
        }

        this.carg.selectedIndex = this.cargo.GetSpace();

        var stats = this.fuel.PartStats();
        stats = stats.Add(this.boom.PartStats());
        stats = stats.Add(this.cargo.PartStats());

        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString());
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString());
        BlinkIfChanged(this.d_fuel, stats.fuel.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
    }
}