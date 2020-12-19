/// <reference path="./Display.ts" />
/// <reference path="../impl/Era.ts" />

class Era_HTML extends Display {
    private model: Era;
    private select: HTMLSelectElement;
    private bleed: HTMLTableCellElement;
    private cost: HTMLTableCellElement;
    private pstab: HTMLTableCellElement;
    constructor(m: Era) {
        super();
        this.model = m;

        var tbl = document.getElementById("table_era") as HTMLTableElement;
        var row = tbl.insertRow();
        CreateTH(row, lu("Era Option"));
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Pitch Stability"));

        row = tbl.insertRow();

        var selcell = row.insertCell();
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
            var opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.select.add(opt);
        }
    }

    public UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        var stats = this.model.PartStats();
        BlinkIfChanged(this.bleed, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.cost, stats.cost.toString(), false);
        BlinkIfChanged(this.pstab, stats.pitchstab.toString(), false);
    }
}