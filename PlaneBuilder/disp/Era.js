import { lu } from "../impl/Localization.js";
import { insertRow, CreateTH, BlinkIfChanged } from "./Tools.js";
import { Display } from "./Display.js";
export class Era_HTML extends Display {
    constructor(m) {
        super();
        this.model = m;
        document.getElementById("lbl_era").textContent = lu("Era Section Title");
        var tbl = document.getElementById("table_era");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Era Option"));
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Pitch Stability"));
        row = insertRow(fragment);
        var selcell = row.insertCell();
        //Get used elements
        this.select = document.createElement("SELECT");
        selcell.append(this.select);
        this.bleed = row.insertCell();
        this.cost = row.insertCell();
        this.pstab = row.insertCell();
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = lu(elem.name);
            this.select.add(opt);
        }
        tbl.appendChild(fragment);
    }
    UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        var stats = this.model.PartStats();
        BlinkIfChanged(this.bleed, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.cost, stats.cost.toString(), false);
        BlinkIfChanged(this.pstab, stats.pitchstab.toString(), false);
    }
}
