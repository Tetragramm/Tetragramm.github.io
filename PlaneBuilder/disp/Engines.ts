/// <reference path="./Display.ts" />
/// <reference path="./Engine.ts" />
/// <reference path="./Radiator.ts" />
/// <reference path="../impl/Engines.ts" />

class Engines_HTML extends Display {
    private eng: Engines;
    private engines: Engine_HTML[];
    private radiators: Radiator_HTML[];
    private tbl: HTMLTableElement;
    private tblR: HTMLTableElement;
    private num_engines: HTMLInputElement;
    private num_radiators: HTMLInputElement;
    private is_asymmetric: HTMLInputElement;

    constructor(eng: Engines) {
        super();
        this.eng = eng;
        this.engines = [];
        this.radiators = [];
        this.tbl = document.getElementById("table_engine") as HTMLTableElement;
        var row = this.tbl.insertRow();
        CreateTH(row, lu("Engines Engine Type"));
        CreateTH(row, lu("Engines Options"));
        CreateTH(row, lu("Engines Options 2"));
        CreateTH(row, lu("Engines Engine Stats"));

        this.tblR = document.getElementById("table_radiator") as HTMLTableElement;
        row = this.tblR.insertRow();
        CreateTH(row, lu("Radiators Radiator Type"));
        CreateTH(row, lu("Radiators Mounting"));
        CreateTH(row, lu("Radiators Coolant"));
        CreateTH(row, lu("Radiators Radiator Stats"));

        this.num_engines = document.getElementById("num_engines") as HTMLInputElement;
        this.num_engines.onchange = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfItems();

        this.num_radiators = document.getElementById("num_radiators") as HTMLInputElement;
        this.num_radiators.onchange = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();

        this.is_asymmetric = document.getElementById("asymmetric") as HTMLInputElement;
        this.is_asymmetric.onchange = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }

    public UpdateDisplay() {
        var num = this.eng.GetNumberOfItems();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, this.tbl.insertRow());
            this.engines.push(en);
        }

        for (let i = 0; i < num; i++) {
            this.engines[i].UpdateEngine(this.eng.GetEngine(i));
        }

        var rad = this.eng.GetNumberOfRadiators();
        this.num_radiators.valueAsNumber = rad;
        if (rad == 0) {
            this.tblR.style.display = "none";
            this.num_radiators.disabled = true;
        }
        else {
            this.tblR.style.display = "";
            this.num_radiators.disabled = false;
        }

        while (this.radiators.length > rad) {
            this.radiators.pop();
            this.tblR.deleteRow(this.radiators.length + 1);
        }
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(this.tblR.insertRow(), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }

        for (let i = 0; i < rad; i++) {
            this.radiators[i].UpdateRadiator(this.eng.GetRadiator(i));
        }

        this.is_asymmetric.checked = this.eng.GetAsymmetry();

        for (let elem of this.engines) {
            elem.UpdateDisplay();
        }
        for (let elem of this.radiators) {
            elem.UpdateDisplay();
        }
    }
}