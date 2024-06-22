import { Aircraft, DerivedStats } from "../impl/Aircraft";
import { lu } from "../impl/Localization";
import { insertRow, CreateTH } from "./Tools";
import { StringFmt } from "../string/index";

enum FUEL_STATE {
    FULLWBOMBS = 0,
    HALFWBOMBS = 1,
    FULL = 2,
    HALF = 3,
    EMPTY = 4,
}
export class Altitude_HTML {
    private tbl: HTMLTableElement;
    private fRow: HTMLTableRowElement;
    private rows: HTMLTableRowElement[];

    private fuel_state: HTMLSelectElement;
    private fires: HTMLInputElement;
    private oxidized: HTMLInputElement;

    constructor(callback: () => void) {
        (document.getElementById("lbl_altitude") as HTMLLabelElement).textContent = lu("Altitude Section Title");

        this.tbl = document.getElementById("table_altitude") as HTMLTableElement;

        this.fuel_state = document.getElementById("select_fuelstate") as HTMLSelectElement;
        let opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.textContent = lu("Derived Full Fuel with Bombs");
        this.fuel_state.appendChild(opt);
        opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.textContent = lu("Derived Half Fuel with Bombs");
        this.fuel_state.appendChild(opt);
        opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.textContent = lu("Derived Full Fuel");
        this.fuel_state.appendChild(opt);
        opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.textContent = lu("Derived Half Fuel");
        this.fuel_state.appendChild(opt);
        this.fuel_state.onchange = () => { callback(); }

        this.fires = document.getElementById("input_fires") as HTMLInputElement;
        this.fires.onchange = () => { callback(); }

        this.oxidized = document.getElementById("input_oxidized") as HTMLInputElement;
        this.oxidized.onchange = () => { callback(); }

        this.fRow = insertRow(this.tbl);
        CreateTH(this.fRow, lu("Altitude Altitude"));
        CreateTH(this.fRow, lu("Derived Boost"));
        CreateTH(this.fRow, lu("Derived Rate of Climb"));
        CreateTH(this.fRow, lu("Derived Stall Speed"));
        CreateTH(this.fRow, lu("Derived Top Speed"));

        this.rows = [];
    }

    private AddRow(af: number) {
        const row = document.createElement("TR") as HTMLTableRowElement;
        let af_cell = row.insertCell();
        af_cell.textContent = StringFmt.Format("{0}-{1}", af * 10, af * 10 + 9);
        row.insertCell();
        row.insertCell();
        row.insertCell();
        row.insertCell();
        this.rows.push(row)
    }

    public UpdateDisplay(acft: Aircraft, derived: DerivedStats) {
        while (this.tbl.lastChild) {
            this.tbl.removeChild(this.tbl.lastChild);
        }
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.fRow);

        var Boost = 0;
        var RoC = 0;
        var Stall = 0;
        var Speed = 0;
        switch (this.fuel_state.selectedIndex) {
            case FUEL_STATE.FULLWBOMBS:
                Boost = derived.BoostFullwBombs;
                RoC = derived.RateOfClimbwBombs;
                Stall = derived.StallSpeedFullwBombs;
                Speed = derived.MaxSpeedwBombs;
                break;
            case FUEL_STATE.HALFWBOMBS:
                Boost = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2);
                RoC = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2);
                Stall = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2);
                Speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2);
                break;
            case FUEL_STATE.FULL:
                Boost = derived.BoostFull;
                RoC = derived.RateOfClimbFull;
                Stall = derived.StallSpeedFull;
                Speed = derived.MaxSpeedFull;
                break;
            case FUEL_STATE.HALF:
                Boost = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2);
                RoC = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2);
                Stall = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2);
                Speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2);
                break;
        }

        for (let af = 0; af < 100; af++) {
            var PowerReduction = 0;
            var SpeedIncrease = 0;
            if (af < acft.GetMinIAF()) {
                PowerReduction = acft.GetMinIAF() - af;
            } else {
                let maxIAF = acft.GetMaxIAF();
                if (this.oxidized.checked)
                    maxIAF += 3;
                SpeedIncrease = Math.min(af - acft.GetMinIAF(), maxIAF - acft.GetMinIAF())
                if (af > maxIAF) {
                    PowerReduction = af - maxIAF;
                }
            }

            if (this.fires.checked)
                PowerReduction = 0;

            if (this.rows.length <= af) {
                this.AddRow(af);
            }
            const row = this.rows[af];

            var adjBoost = 0;
            if (PowerReduction > 0 && Boost != 0) {
                adjBoost = Math.max(1, Boost - 1);
            } else {
                adjBoost = Boost;
            }
            const adjRoC = Math.max(1, RoC - PowerReduction);
            const adjStall = Math.max(1, Stall + af);
            const adjSpeed = Math.max(1, Speed + SpeedIncrease - PowerReduction);

            row.children[1].textContent = adjBoost.toString();
            row.children[2].textContent = adjRoC.toString();
            row.children[3].textContent = adjStall.toString();
            row.children[4].textContent = adjSpeed.toString();
            fragment.appendChild(row);
            if (adjStall > adjSpeed) {
                while (this.rows.length > af) {
                    const r = this.rows.pop();
                }
                break;
            }

        }

        this.tbl.appendChild(fragment);
    }
}