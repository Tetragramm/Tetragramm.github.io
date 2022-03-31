import { Engines } from "../impl/Engines.js";
import { Engine_HTML } from "./Engine.js";
import { Radiator_HTML } from "./Radiator.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateTH } from "./Tools.js";
import { Display } from "./Display.js";

export class Engines_HTML extends Display {
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

        (document.getElementById("lbl_engines") as HTMLLabelElement).textContent = lu("Engines Section Title");

        this.tbl = document.getElementById("table_engine") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        CreateTH(row, lu("Engines Engine Type"));
        CreateTH(row, lu("Engines Options"));
        CreateTH(row, lu("Engines Options 2"));
        CreateTH(row, lu("Engines Engine Stats"));
        this.tbl.appendChild(fragment);

        fragment = document.createDocumentFragment();
        this.tblR = document.getElementById("table_radiator") as HTMLTableElement;
        row = insertRow(fragment);
        CreateTH(row, lu("Radiators Radiator Type"));
        CreateTH(row, lu("Radiators Mounting"));
        CreateTH(row, lu("Radiators Coolant"));
        CreateTH(row, lu("Radiators Radiator Stats"));
        this.tblR.appendChild(fragment);

        (document.getElementById("lbl_num_engines") as HTMLLabelElement).textContent = lu("Engines Num Engines");
        this.num_engines = document.getElementById("num_engines") as HTMLInputElement;
        this.num_engines.onchange = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfItems();

        (document.getElementById("lbl_num_radiators") as HTMLLabelElement).textContent = lu("Engines Num Radiators");
        this.num_radiators = document.getElementById("num_radiators") as HTMLInputElement;
        this.num_radiators.onchange = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();

        (document.getElementById("lbl_asymmetric") as HTMLLabelElement).textContent = lu("Engines Asymmetric Plane");
        this.is_asymmetric = document.getElementById("asymmetric") as HTMLInputElement;
        this.is_asymmetric.onchange = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }

    public UpdateDisplay() {
        const num = this.eng.GetNumberOfItems();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        const fragment = document.createDocumentFragment();
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, insertRow(fragment));
            this.engines.push(en);
        }
        this.tbl.appendChild(fragment);

        for (let i = 0; i < num; i++) {
            this.engines[i].UpdateEngine(this.eng.GetEngine(i));
        }

        const rad = this.eng.GetNumberOfRadiators();
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
        fragment = document.createDocumentFragment();
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(insertRow(fragment), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }
        this.tblR.appendChild(fragment);

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