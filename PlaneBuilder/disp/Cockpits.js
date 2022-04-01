import { Cockpit_HTML } from "./Cockpit.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateTH } from "./Tools.js";
import { Display } from "./Display.js";
export class Cockpits_HTML extends Display {
    constructor(cockpits) {
        super();
        this.cockpits = cockpits;
        document.getElementById("lbl_cockpits").textContent = lu("Cockpit Section Title");
        document.getElementById("lbl_num_cockpits").textContent = lu("Cockpit Num Cockpits");
        this.tbl = document.getElementById("table_cockpit");
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        CreateTH(row, lu("Cockpit Option"));
        CreateTH(row, lu("Cockpit Upgrade"));
        CreateTH(row, lu("Cockpit Safety Options"));
        CreateTH(row, lu("Cockpit Gunsights"));
        CreateTH(row, lu("Cockpit Cockpit Stats"));
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.counter.onchange = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
        this.tbl.appendChild(fragment);
    }
    CounterChange() {
        while (this.positions.length > this.counter.valueAsNumber) {
            this.RemoveCockpit();
        }
        while (this.positions.length < this.counter.valueAsNumber) {
            this.AddCockpit(this.positions.length);
        }
    }
    AddCockpit(num) {
        const row = this.tbl.insertRow();
        const cp = new Cockpit_HTML(row, this.cockpits.GetCockpit(num));
        this.positions.push(cp);
    }
    RemoveCockpit() {
        this.positions.pop();
        this.tbl.deleteRow(this.tbl.rows.length - 1);
    }
    UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let i = 0; i < this.positions.length; i++) {
            let pos = this.positions[i];
            pos.UpdateCockpit(this.cockpits.GetCockpit(i));
            pos.UpdateDisplay();
        }
    }
}
