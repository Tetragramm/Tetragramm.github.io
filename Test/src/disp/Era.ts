import { Era } from "../impl/Era";
import { insertRow, CreateTH, BlinkIfChanged } from "./Tools";
import { Display } from "./Display";
import { lu } from "../impl/Localization";

export class Era_HTML extends Display {
    private model: Era;
    private select: HTMLSelectElement;
    private bleed: HTMLTableCellElement;
    private cost: HTMLTableCellElement;
    private pstab: HTMLTableCellElement;
    constructor(m: Era) {
        super();
        this.model = m;

        (document.getElementById("lbl_era") as HTMLLabelElement).textContent = lu("Era Section Title");

        const tbl = document.getElementById("table_era") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Era Option"));
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Pitch Stability"));

        row = insertRow(fragment);

        const selcell = row.insertCell();
        //Get used elements
        this.select = document.createElement("SELECT") as HTMLSelectElement;
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
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.select.add(opt);
        }
        tbl.appendChild(fragment);
    }

    public UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        const stats = this.model.PartStats();
        BlinkIfChanged(this.bleed, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.cost, stats.cost.toString(), false);
        BlinkIfChanged(this.pstab, stats.pitchstab.toString(), false);
    }
}
