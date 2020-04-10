/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />

class Weapons_HTML extends Display {
    private weap: Weapons;
    private input_mass: HTMLInputElement;
    private input_drag: HTMLInputElement;
    private input_cost: HTMLInputElement;

    constructor(weap: Weapons) {
        super();
        this.weap = weap;

        this.input_mass = document.getElementById("weapon_mass") as HTMLInputElement;
        this.input_mass.onchange = () => { this.weap.SetMass(this.input_mass.valueAsNumber); };
        this.input_drag = document.getElementById("weapon_drag") as HTMLInputElement;
        this.input_drag.onchange = () => { this.weap.SetDrag(this.input_drag.valueAsNumber); };
        this.input_cost = document.getElementById("weapon_cost") as HTMLInputElement;
        this.input_cost.onchange = () => { this.weap.SetCost(this.input_cost.valueAsNumber); };
    }

    public UpdateDisplay() {
        this.input_mass.valueAsNumber = this.weap.GetMass();
        this.input_drag.valueAsNumber = this.weap.GetDrag();
        this.input_cost.valueAsNumber = this.weap.GetCost();
    }
}