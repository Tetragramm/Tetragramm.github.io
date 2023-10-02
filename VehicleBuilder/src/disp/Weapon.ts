import { CreateTH, CreateCheckbox, CreateInput } from "./Tools";

import { Vehicle } from "../impl/Vehicle";
import { WeaponList, WeaponMount } from "../impl/Weapon";


export class WeaponDisp {
    private vehicle: Vehicle;
    private tbl: HTMLTableElement;
    private wrows: {
        row: HTMLTableRowElement, crew: HTMLLabelElement, main: HTMLSelectElement, rocket_span: HTMLSpanElement, rocket_count: HTMLInputElement,
        f: HTMLInputElement, r: HTMLInputElement, b: HTMLInputElement, l: HTMLInputElement, u: HTMLInputElement,
        sec_cell: HTMLTableCellElement, secondary: HTMLSelectElement[], pspan: HTMLSpanElement, shield: HTMLInputElement
    }[];
    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.tbl = document.getElementById("table_weapons") as HTMLTableElement;
        var header = this.tbl.insertRow();
        CreateTH(header, "Crew Position");
        CreateTH(header, "Main Weapon");
        CreateTH(header, "Firing Arcs");
        CreateTH(header, "Co-Ax Weapons");
        CreateTH(header, "Accessories");
        this.wrows = [];
    }

    public UpdateDisplay() {
        let clist = this.vehicle.GetCrewList();
        let wcount = this.vehicle.GetNumWeapons();
        let widx = 0;
        while (this.wrows.length > wcount) {
            let wrow = this.wrows.pop();
            this.tbl.deleteRow(this.tbl.rows.length - 1);
        }
        for (let cidx = 0; cidx < clist.length; cidx++) {
            let citm = clist[cidx];
            let mount_idx = 0;
            for (let witm of citm.weapon_mounts) {
                mount_idx += 1;
                if (widx >= this.wrows.length) {
                    this.CreateRow(this.wrows.length);
                }
                let wrow = this.wrows[widx];
                wrow.crew.textContent = citm.name_txt + " Mount " + mount_idx.toString();
                wrow.main.selectedIndex = witm.main_idx;
                wrow.rocket_span.hidden = WeaponList[witm.main_idx].name != "Rocket Artillery Rail";
                wrow.rocket_count.valueAsNumber = witm.rocket_count;
                wrow.f.checked = witm.directions[0];
                wrow.r.checked = witm.directions[1];
                wrow.b.checked = witm.directions[2];
                wrow.l.checked = witm.directions[3];
                wrow.u.checked = witm.directions[4];
                while (wrow.secondary.length > witm.secondary_idx.length + 1) {
                    wrow.sec_cell.removeChild(this.wrows[widx].secondary.pop());
                    wrow.sec_cell.removeChild(wrow.sec_cell.children[wrow.sec_cell.children.length - 1]);
                }
                for (let idx2 = 0; idx2 < witm.secondary_idx.length; idx2++) {
                    if (idx2 == wrow.secondary.length) {
                        let newsec = this.CreateSecondary();
                        newsec.onchange = wrow.f.onchange;
                        wrow.sec_cell.append(newsec);
                        wrow.sec_cell.append(document.createElement("BR"));
                        wrow.secondary.push(newsec);
                    }
                    wrow.secondary[idx2].selectedIndex = witm.secondary_idx[idx2];
                }
                if (wrow.secondary.length == witm.secondary_idx.length) {
                    let newsec = this.CreateSecondary();
                    newsec.onchange = wrow.f.onchange;
                    wrow.sec_cell.append(newsec);
                    wrow.sec_cell.append(document.createElement("BR"));
                    wrow.secondary.push(newsec);
                }
                wrow.secondary[witm.secondary_idx.length].selectedIndex = 0;
                wrow.shield.checked = witm.shield;
                if (witm.main_idx == 0) {
                    wrow.secondary[0].disabled = true;
                    wrow.f.disabled = true;
                    wrow.l.disabled = true;
                    wrow.r.disabled = true;
                    wrow.b.disabled = true;
                    wrow.u.disabled = true;
                    wrow.shield.disabled = true;
                } else {
                    wrow.secondary[0].disabled = false;
                    wrow.f.disabled = false;
                    wrow.l.disabled = false;
                    wrow.r.disabled = false;
                    wrow.b.disabled = false;
                    wrow.u.disabled = false;
                    wrow.shield.disabled = false;
                }
                widx += 1;
            }
        }
    }

    private CreateSecondary() {
        let sel = document.createElement("SELECT") as HTMLSelectElement;
        for (let w of WeaponList) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = w.name;
            opt.text = w.name;
            if (w.name == "Rocket Artillery Rail") {
                opt.disabled = true;
            }
            sel.append(opt);
        }
        sel.selectedIndex = 0;
        return sel;
    }

    private CreateRow(idx: number) {
        let wrow = {
            row: this.tbl.insertRow(),
            crew: document.createElement("LABEL") as HTMLLabelElement,
            main: document.createElement("SELECT") as HTMLSelectElement,
            rocket_span: document.createElement("SPAN") as HTMLSpanElement,
            rocket_count: document.createElement("INPUT") as HTMLInputElement,
            f: document.createElement("INPUT") as HTMLInputElement,
            r: document.createElement("INPUT") as HTMLInputElement,
            b: document.createElement("INPUT") as HTMLInputElement,
            l: document.createElement("INPUT") as HTMLInputElement,
            u: document.createElement("INPUT") as HTMLInputElement,
            sec_cell: undefined,
            secondary: [],
            pspan: document.createElement("SPAN") as HTMLSpanElement,
            shield: document.createElement("INPUT") as HTMLInputElement,
        };
        let oc = () => {
            this.vehicle.SetWeapon(idx, new WeaponMount(wrow.main.selectedIndex,
                [wrow.f.checked, wrow.r.checked, wrow.b.checked, wrow.l.checked, wrow.u.checked],
                wrow.secondary.map((value) => { return value.selectedIndex; }), wrow.shield.checked, wrow.rocket_count.valueAsNumber))
        };
        let cell0 = wrow.row.insertCell();
        cell0.append(wrow.crew);
        let cell1 = wrow.row.insertCell();
        cell1.append(wrow.main);
        cell1.append(document.createElement("BR"));
        cell1.append(wrow.rocket_span);
        for (let w of WeaponList) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = w.name;
            opt.text = w.name;
            wrow.main.append(opt);
        }
        let cell2 = wrow.row.insertCell();
        CreateCheckbox("Forward", wrow.f, cell2, true);
        CreateCheckbox("Left", wrow.l, cell2, false);
        CreateCheckbox("Right", wrow.r, cell2, true);
        CreateCheckbox("Backward", wrow.b, cell2, true);
        CreateCheckbox("Upward", wrow.u, cell2, false);
        CreateInput("Rocket Count: ", wrow.rocket_count, wrow.rocket_span);
        wrow.rocket_count.min = "1";
        wrow.rocket_count.step = "1";
        wrow.main.onchange = oc;
        wrow.rocket_count.onchange = oc;
        wrow.f.onchange = oc;
        wrow.r.onchange = oc;
        wrow.b.onchange = oc;
        wrow.l.onchange = oc;
        wrow.u.onchange = oc;
        wrow.sec_cell = wrow.row.insertCell();
        let cell4 = wrow.row.insertCell();
        cell4.append(wrow.pspan);
        CreateCheckbox("Gun Shield", wrow.shield, wrow.pspan, false);
        wrow.shield.onchange = oc;
        this.wrows.push(wrow);

    }
}