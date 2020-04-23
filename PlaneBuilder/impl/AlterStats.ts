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
        stats = stats.Add(this.stats);
        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}