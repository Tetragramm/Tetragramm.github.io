// export { CargoAndPassengers };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class CargoAndPassengers extends Part {
    private mass: number;
    private pass: number;
    private seats: number;

    constructor() {
        super();
        this.mass = 0;
        this.pass = 0;
    }

    public toJSON() {
        return {
            mass: this.mass,
            pass: this.pass,
        }
    }

    public fromJSON(js: JSON) {
        this.mass = js["mass"];
        this.pass = js["pass"];
    }

    public GetMass() {
        return this.mass;
    }

    public SetMass(count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.mass = count;
        this.CalculateStats();
    }

    public GetPassengers() {
        return this.pass;
    }

    public SetPassengers(count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.pass = count;
        this.CalculateStats();
    }

    public SetSeats(count: number) {
        this.seats = count;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        stats.wetmass += Math.max(this.pass, this.seats);
        //Can be placed in cargo space, if uncomfortably. Takes 3 mass.
        if (this.pass > this.seats) {
            stats.wetmass += 3 * (this.pass - this.seats);
        } else {
            //Cargo can be placed in half seats.
            var emptyseat = this.seats - this.pass;
            if (this.mass - emptyseat > 0)
                stats.wetmass += this.mass - emptyseat;
        }

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);

        return stats;
    }
}