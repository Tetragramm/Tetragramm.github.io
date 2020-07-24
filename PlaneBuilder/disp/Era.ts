/// <reference path="./Display.ts" />
/// <reference path="../impl/Era.ts" />

class Era_HTML extends Display {
    private model: Era;
    private select: HTMLSelectElement;
    private bleed: HTMLTableCellElement;
    constructor(m: Era) {
        super();
        this.model = m;

        //Get used elements
        this.select = document.getElementById("select_era") as HTMLSelectElement;
        this.bleed = document.getElementById("liftbleed_era") as HTMLTableCellElement;
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.select.add(opt);
        }
    }

    public UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        BlinkIfChanged(this.bleed, this.model.GetLiftBleed().toString(), false);
    }
}