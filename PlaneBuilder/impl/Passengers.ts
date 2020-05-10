/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Passengers extends Part {
    private seats: number;
    private beds: number;
    private connected: boolean;

    constructor(js: JSON) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }

    public toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }

    public fromJSON(js: JSON, json_version: string) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.seats);
        s.PushNum(this.beds);
        s.PushBool(this.connected);
    }

    public deserialize(d: Deserialize) {
        this.seats = d.GetNum();
        this.beds = d.GetNum();
        this.connected = d.GetBool();
    }

    public GetSeats() {
        return this.seats;
    }

    public SetSeats(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.seats = num;
        this.CalculateStats();
    }

    public GetBeds() {
        return this.beds;
    }

    public SetBeds(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.beds = num;
        this.CalculateStats();
    }

    public PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }

    public GetConnected() {
        return this.connected;
    }

    public SetConnected(sel: boolean) {
        this.connected = sel;
        this.CalculateStats();
    }

    public PartStats(): Stats {
        var s = new Stats();
        s.reqsections = 2 * Math.ceil((this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            s.mass = 1;
        }
        return s;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}