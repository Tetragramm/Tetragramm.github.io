import { Passengers } from "../impl/Passengers";
import { lu } from "../impl/Localization";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, toggleCollapse } from "./Tools";
import { Display } from "./Display";

export class Passengers_HTML extends Display {
    private pass: Passengers;
    private connect: HTMLInputElement;
    private mass: HTMLTableCellElement;
    private reqseq: HTMLTableCellElement;
    private nseats: HTMLInputElement;
    private nbeds: HTMLInputElement;

    constructor(pass: Passengers) {
        super();
        this.pass = pass;

        (document.getElementById("lbl_passengers") as HTMLLabelElement).textContent = lu("Passengers Section Title");

        const tbl = document.getElementById("table_passengers") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Passengers Number of Seats"));
        CreateTH(row, lu("Passengers Number of Beds"));
        CreateTH(row, lu("Passengers Upgrade"));
        CreateTH(row, lu("Stat Mass"));
        CreateTH(row, lu("Stat Required Sections"));

        // < tr >
        // <td><input type="number" id = "num_seats" min = "0" value = "0" /> </td>
        // < td > <input type="number" id = "num_beds" min = "0" value = "0" /> </td>
        // < td id = "passenger_upg" > </td>
        // < td id = "passenger_mass" > </td>
        // < td id = "passenger_req_seq" > </td>
        // < /tr>

        row = insertRow(fragment);
        this.nseats = document.createElement("INPUT") as HTMLInputElement;
        this.nseats.type = "number";
        this.nseats.min = "0";
        row.insertCell().append(this.nseats);
        this.nbeds = document.createElement("INPUT") as HTMLInputElement;
        this.nbeds.type = "number";
        this.nbeds.min = "0";
        row.insertCell().append(this.nbeds);

        const upg_cell = row.insertCell();
        this.connect = document.createElement("INPUT") as HTMLInputElement;
        const fs = CreateFlexSection(upg_cell);
        FlexCheckbox(lu("Passengers Connectivity"), this.connect, fs);

        this.mass = row.insertCell();
        this.reqseq = row.insertCell();

        this.connect.disabled = true;
        this.nseats.onchange = () => {
            this.pass.SetSeats(this.nseats.valueAsNumber);
        }
        this.nbeds.onchange = () => {
            this.pass.SetBeds(this.nbeds.valueAsNumber);
        }
        this.connect.onchange = () => {
            this.pass.SetConnected(this.connect.checked);
        }
        tbl.appendChild(fragment);
    }

    public SetCollapse() {
        toggleCollapse("passenger_collapse", !this.pass.IsDefault());
    }

    public UpdateDisplay() {
        const stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString(), false);
        BlinkIfChanged(this.reqseq, stats.reqsections.toString(), false);
    }
}