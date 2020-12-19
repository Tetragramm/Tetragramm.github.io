/// <reference path="./Display.ts" />
/// <reference path="./Cockpit.ts" />
/// <reference path="../impl/Cockpits.ts" />

class Cockpits_HTML extends Display {
    private tbl: HTMLTableElement;
    private counter: HTMLInputElement;
    private positions: Cockpit_HTML[];
    private cockpits: Cockpits;

    constructor(cockpits: Cockpits) {
        super();
        this.cockpits = cockpits;

        (document.getElementById("lbl_cockpits") as HTMLLabelElement).textContent = lu("Cockpit Section Title");
        (document.getElementById("lbl_num_cockpits") as HTMLLabelElement).textContent = lu("Cockpit Num Cockpits");

        this.tbl = document.getElementById("table_cockpit") as HTMLTableElement;
        var row = this.tbl.insertRow();
        CreateTH(row, lu("Cockpit Option"));
        CreateTH(row, lu("Cockpit Upgrade"));
        CreateTH(row, lu("Cockpit Safety Options"));
        CreateTH(row, lu("Cockpit Gunsights"));
        CreateTH(row, lu("Cockpit Cockpit Stats"));
        this.counter = document.getElementById("num_cockpits") as HTMLInputElement;
        this.positions = [];
        this.counter.onchange = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
    }

    private CounterChange() {
        while (this.positions.length > this.counter.valueAsNumber) {
            this.RemoveCockpit();
        }
        while (this.positions.length < this.counter.valueAsNumber) {
            this.AddCockpit(this.positions.length);
        }
    }

    private AddCockpit(num: number) {
        var row = this.tbl.insertRow();
        var cp = new Cockpit_HTML(row, this.cockpits.GetCockpit(num));
        this.positions.push(cp);
    }

    private RemoveCockpit() {
        this.positions.pop();
        this.tbl.deleteRow(this.tbl.rows.length - 1);
    }

    public UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let i = 0; i < this.positions.length; i++) {
            let pos = this.positions[i];
            pos.UpdateCockpit(this.cockpits.GetCockpit(i))
            pos.UpdateDisplay();
        }
    }
}