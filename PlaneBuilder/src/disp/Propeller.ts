import { Propeller } from "../impl/Propeller";
import { lu } from "../impl/Localization";
import { Display } from "./Display";

export class Propeller_HTML extends Display {
    private prop: Propeller;
    private select_prop: HTMLSelectElement;
    private select_upgrade: HTMLSelectElement;

    constructor(prop: Propeller) {
        super();
        this.prop = prop;

        (document.getElementById("lbl_propeller") as HTMLLabelElement).textContent = lu("Propeller Section Title");


        (document.getElementById("lbl_propeller_pitch") as HTMLLabelElement).textContent = lu("Propeller Propeller Pitch");
        this.select_prop = document.getElementById("propeller_pitch") as HTMLSelectElement;
        for (let elem of prop.GetPropList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.select_prop.add(opt);
        }
        this.select_prop.onchange = () => { this.prop.SetPropIndex(this.select_prop.selectedIndex); };

        (document.getElementById("lbl_propeller_upgrade") as HTMLLabelElement).textContent = lu("Propeller Propeller Upgrades:");
        this.select_upgrade = document.getElementById("propeller_upgrade") as HTMLSelectElement;
        for (let elem of prop.GetUpgradeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.select_upgrade.add(opt);
        }
        this.select_upgrade.onchange = () => { this.prop.SetUpgradeIndex(this.select_upgrade.selectedIndex); };
    }

    public UpdateDisplay() {
        this.select_upgrade.selectedIndex = this.prop.GetUpgradeIndex();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();

        if (this.prop.GetNumPropellers() == 0) {
            this.select_upgrade.disabled = true;
            this.select_prop.disabled = true;
            this.select_prop.selectedIndex = -1;
        } else {
            this.select_prop.disabled = false;
            this.select_upgrade.disabled = false;
        }
    }
}