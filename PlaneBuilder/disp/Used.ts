/// <reference path="./Display.ts" />
/// <reference path="../impl/Used.ts" />

class Used_HTML extends Display {
    private used: Used;
    private enabled: HTMLInputElement;
    private burnt_out: HTMLInputElement;
    private ragged: HTMLInputElement;
    private hefty: HTMLInputElement;
    private sticky_guns: HTMLInputElement;
    private weak: HTMLInputElement;
    private fragile: HTMLInputElement;
    private leaky: HTMLInputElement;
    private sluggish: HTMLInputElement;
    private tbl: HTMLTableElement;

    constructor(used: Used) {
        super();
        this.used = used;

        (document.getElementById("lbl_used") as HTMLLabelElement).textContent = lu("Used Section Title");

        (document.getElementById("lbl_is_used") as HTMLLabelElement).textContent = lu("Used Is Aircraft Used?");
        this.enabled = document.getElementById("is_used") as HTMLInputElement;
        this.enabled.onchange = () => { this.used.SetEnabled(this.enabled.checked); };

        this.tbl = document.getElementById("tbl_used") as HTMLTableElement;
        var row = this.tbl.insertRow();
        CreateTH(row, lu("Used Effect"));
        CreateTH(row, lu("Used Description"));
        CreateTH(row, lu("Used Penalties(+) <br/> Benefits(-)"));
        this.InitTable(this.tbl);
    }

    private InitTable(tbl: HTMLTableElement) {
        this.burnt_out = document.createElement("INPUT") as HTMLInputElement;
        this.ragged = document.createElement("INPUT") as HTMLInputElement;
        this.hefty = document.createElement("INPUT") as HTMLInputElement;
        this.sticky_guns = document.createElement("INPUT") as HTMLInputElement;
        this.weak = document.createElement("INPUT") as HTMLInputElement;
        this.fragile = document.createElement("INPUT") as HTMLInputElement;
        this.leaky = document.createElement("INPUT") as HTMLInputElement;
        this.sluggish = document.createElement("INPUT") as HTMLInputElement;

        var row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Burnt Out");
        row.insertCell().textContent = lu("Used Burnt Out Description");
        var cell = row.insertCell();
        CreateInput("", this.burnt_out, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Ragged");
        row.insertCell().textContent = lu("Used Ragged Description");
        cell = row.insertCell();
        CreateInput("", this.ragged, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Hefty");
        row.insertCell().textContent = lu("Used Hefty Description");
        cell = row.insertCell();
        CreateInput("", this.hefty, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Sticky Guns");
        row.insertCell().textContent = lu("Used Sticky Guns Description");
        cell = row.insertCell();
        CreateInput("", this.sticky_guns, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Weak");
        row.insertCell().textContent = lu("Used Weak Description");
        cell = row.insertCell();
        CreateInput("", this.weak, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Fragile");
        row.insertCell().textContent = lu("Used Fragile Description");
        cell = row.insertCell();
        CreateInput("", this.fragile, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Leaky");
        row.insertCell().textContent = lu("Used Leaky Description");
        cell = row.insertCell();
        CreateInput("", this.leaky, cell, false);

        row = tbl.insertRow();
        row.insertCell().textContent = lu("Used Sluggish");
        row.insertCell().textContent = lu("Used Sluggish Description");
        cell = row.insertCell();
        CreateInput("", this.sluggish, cell, false);

        this.burnt_out.onchange = () => { this.used.burnt_out = this.burnt_out.valueAsNumber; this.used.TriggerCS(); };
        this.ragged.onchange = () => { this.used.ragged = this.ragged.valueAsNumber; this.used.TriggerCS(); };
        this.hefty.onchange = () => { this.used.hefty = this.hefty.valueAsNumber; this.used.TriggerCS(); };
        this.sticky_guns.onchange = () => { this.used.sticky_guns = this.sticky_guns.valueAsNumber; this.used.TriggerCS(); };
        this.weak.onchange = () => { this.used.weak = this.weak.valueAsNumber; this.used.TriggerCS(); };
        this.fragile.onchange = () => { this.used.fragile = this.fragile.valueAsNumber; this.used.TriggerCS(); };
        this.leaky.onchange = () => { this.used.leaky = this.leaky.valueAsNumber; this.used.TriggerCS(); };
        this.sluggish.onchange = () => { this.used.sluggish = this.sluggish.valueAsNumber; this.used.TriggerCS(); };
        this.burnt_out.min = "-5";
        this.burnt_out.max = "5";
        this.ragged.min = "-5";
        this.ragged.max = "5";
        this.hefty.min = "-5";
        this.hefty.max = "5";
        this.sticky_guns.min = "-5";
        this.sticky_guns.max = "5";
        this.weak.min = "-5";
        this.weak.max = "5";
        this.fragile.min = "-5";
        this.fragile.max = "5";
        this.leaky.min = "-5";
        this.leaky.max = "5";
        this.sluggish.min = "-5";
        this.sluggish.max = "5";
    }

    public UpdateDisplay() {
        this.burnt_out.valueAsNumber = this.used.burnt_out;
        this.ragged.valueAsNumber = this.used.ragged;
        this.hefty.valueAsNumber = this.used.hefty;
        this.sticky_guns.valueAsNumber = this.used.sticky_guns;
        this.weak.valueAsNumber = this.used.weak;
        this.fragile.valueAsNumber = this.used.fragile;
        this.leaky.valueAsNumber = this.used.leaky;
        this.sluggish.valueAsNumber = this.used.sluggish;

        this.enabled.checked = this.used.GetEnabled();
        this.tbl.hidden = !this.enabled.checked;
    }
}