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

        this.enabled = document.getElementById("is_used") as HTMLInputElement;
        this.enabled.onchange = () => { this.used.SetEnabled(this.enabled.checked); };

        this.tbl = document.getElementById("tbl_used") as HTMLTableElement;
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
        row.insertCell().innerText = "Burnt Out";
        row.insertCell().innerText = "Engines are at -1 Reliability";
        var cell = row.insertCell();
        CreateInput("", this.burnt_out, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Ragged";
        row.insertCell().innerText = "Reduce your Max Speed by 10%";
        cell = row.insertCell();
        CreateInput("", this.ragged, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Hefty";
        row.insertCell().innerText = "Increase your Stall Speeds by 20%";
        cell = row.insertCell();
        CreateInput("", this.hefty, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Sticky Guns";
        row.insertCell().innerText = "Increase the chance of guns jamming by 1";
        cell = row.insertCell();
        CreateInput("", this.sticky_guns, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Weak";
        row.insertCell().innerText = "Cut the plane's Toughness in half";
        cell = row.insertCell();
        CreateInput("", this.weak, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Fragile";
        row.insertCell().innerText = "Reduce your Max Strain by 20%";
        cell = row.insertCell();
        CreateInput("", this.fragile, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Leaky";
        row.insertCell().innerText = "Reduce your Fuel by 20%";
        cell = row.insertCell();
        CreateInput("", this.leaky, cell, false);

        row = tbl.insertRow();
        row.insertCell().innerText = "Sluggish";
        row.insertCell().innerText = "Reduce your Handling by 5%";
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