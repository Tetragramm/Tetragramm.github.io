/// <reference path="./Display.ts" />
/// <reference path="../impl/Passengers.ts" />

class Passengers_HTML extends Display {
    private pass: Passengers;
    private connect: HTMLInputElement;
    private mass: HTMLTableCellElement;
    private reqseq: HTMLTableCellElement;
    private nseats: HTMLInputElement;
    private nbeds: HTMLInputElement;

    constructor(pass: Passengers) {
        super();
        this.pass = pass;

        this.nseats = document.getElementById("num_seats") as HTMLInputElement;
        this.nbeds = document.getElementById("num_beds") as HTMLInputElement;
        this.mass = document.getElementById("passenger_mass") as HTMLTableCellElement;
        this.reqseq = document.getElementById("passenger_req_seq") as HTMLTableCellElement;

        var upg_cell = document.getElementById("passenger_upg") as HTMLTableCellElement;
        this.connect = document.createElement("INPUT") as HTMLInputElement;
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Connectivity", this.connect, fs);


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
    }

    public UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString(), false);
        BlinkIfChanged(this.reqseq, stats.reqsections.toString(), false);
    }
}