/// <reference path="./Display.ts" />

enum FUEL_STATE {
    FULLWBOMBS = 0,
    HALFWBOMBS = 1,
    FULL = 2,
    HALF = 3,
    EMPTY = 4,
}
class Altitude_HTML {
    private tbl: HTMLTableElement;
    private fRow: HTMLTableRowElement;
    private rows: HTMLTableRowElement[];
    constructor() {
        (document.getElementById("lbl_altitude") as HTMLLabelElement).textContent = lu("Altitude Section Title");

        this.tbl = document.getElementById("table_altitude") as HTMLTableElement;

        this.fRow = insertRow(this.tbl);
        CreateTH(this.fRow, lu("Altitude Altitude"));
        CreateTH(this.fRow, lu("Derived Boost"));
        CreateTH(this.fRow, lu("Derived Rate of Climb"));
        CreateTH(this.fRow, lu("Derived Stall Speed"));
        CreateTH(this.fRow, lu("Derived Top Speed"));

        this.rows = [];
    }

    private AddRow(af: number) {
        var row = document.createElement("TR") as HTMLTableRowElement;
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
        var fragment = document.createDocumentFragment();
        fragment.appendChild(this.fRow);
        var fuelstate = 0;

        var Boost = 0;
        var RoC = 0;
        var Stall = 0;
        var Speed = 0;
        switch (fuelstate) {
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
            case FUEL_STATE.EMPTY:
                Boost = 0;
                RoC = 0;
                Stall = derived.StallSpeedEmpty;
                Speed = 0;
                break;
        }

        for (let af = 0; af < 100; af++) {
            var PowerReduction = 0;
            var SpeedIncrease = 0;
            if (af < acft.GetMinIAF()) {
                PowerReduction = acft.GetMinIAF() - af;
            } else {
                SpeedIncrease = Math.min(af - acft.GetMinIAF(), acft.GetMaxIAF() - acft.GetMinIAF())
                if (af > acft.GetMaxIAF()) {
                    PowerReduction = af - acft.GetMaxIAF();
                }
            }

            if (this.rows.length <= af) {
                this.AddRow(af);
            }
            var row = this.rows[af];

            var adjBoost = 0;
            if (PowerReduction > 0) {
                adjBoost = Math.max(1, Boost - 1);
            } else {
                adjBoost = Boost;
            }
            var adjRoC = Math.max(1, RoC - PowerReduction);
            var adjStall = Math.max(1, Stall + af);
            var adjSpeed = Math.max(1, Speed + SpeedIncrease - PowerReduction);

            row.children[1].textContent = adjBoost.toString();
            row.children[2].textContent = adjRoC.toString();
            row.children[3].textContent = adjStall.toString();
            row.children[4].textContent = adjSpeed.toString();
            fragment.appendChild(row);
            if (adjStall > adjSpeed) {
                while (this.rows.length > af) {
                    var r = this.rows.pop();
                }
                break;
            }

        }

        this.tbl.appendChild(fragment);
    }
}