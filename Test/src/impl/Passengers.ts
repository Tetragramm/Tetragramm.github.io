import { Part, Passengers_PS } from "./Part";
import { Stats, WARNING_COLOR } from "./Stats";
import { Serialize, Deserialize } from "./Serialize";
import { lu } from "./Localization";

export class Passengers extends Part {
    private seats: number;
    private beds: number;
    private connected: boolean;

    constructor(js: Passengers_PS) {
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

    public fromJSON(js: JSON, json_version: number) {
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

    public IsDefault() {
        return this.seats == 0
            && this.beds == 0
            && !this.connected;
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
        const stats = new Stats();
        stats.reqsections = 2 * Math.ceil(-1.0e-6 + (this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            stats.mass = 1;
        }
        stats.bomb_mass += this.seats + this.beds;
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);

        if (this.seats + this.beds > 0) {
            stats.warnings.push({
                source: lu("Passengers Section Title"),
                warning: lu("Passengers Count", this.seats, this.beds),
                color: WARNING_COLOR.WHITE,
            });
        }

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}
