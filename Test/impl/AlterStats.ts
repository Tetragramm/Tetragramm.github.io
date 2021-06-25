/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class AlterStats extends Part {
    public stats: Stats;

    constructor() {
        super();
        this.stats = new Stats();
    }

    public PartStats(): Stats {
        var stats = new Stats();
        if (!this.stats.liftbleed)
            this.stats.liftbleed = 0;
        if (!this.stats.drag)
            this.stats.drag = 0;
        if (!this.stats.mass)
            this.stats.mass = 0;
        if (!this.stats.wetmass)
            this.stats.wetmass = 0;
        if (!this.stats.bomb_mass)
            this.stats.bomb_mass = 0;
        if (!this.stats.cost)
            this.stats.cost = 0;
        if (!this.stats.upkeep)
            this.stats.upkeep = 0;
        if (!this.stats.control)
            this.stats.control = 0;
        if (!this.stats.pitchstab)
            this.stats.pitchstab = 0;
        if (!this.stats.latstab)
            this.stats.latstab = 0;
        if (!this.stats.wingarea)
            this.stats.wingarea = 0;
        if (!this.stats.maxstrain)
            this.stats.maxstrain = 0;
        if (!this.stats.structure)
            this.stats.structure = 0;
        if (!this.stats.toughness)
            this.stats.toughness = 0;
        if (!this.stats.power)
            this.stats.power = 0;
        if (!this.stats.fuelconsumption)
            this.stats.fuelconsumption = 0;
        if (!this.stats.fuel)
            this.stats.fuel = 0;
        if (!this.stats.pitchspeed)
            this.stats.pitchspeed = 0;
        if (!this.stats.pitchboost)
            this.stats.pitchboost = 0;
        if (!this.stats.charge)
            this.stats.charge = 0;
        if (!this.stats.crashsafety)
            this.stats.crashsafety = 0;
        stats = stats.Add(this.stats);
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}