/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Optimization extends Part {
    private free_dots: number;
    private cost: number;
    private bleed: number;
    private escape: number;
    private mass: number;
    private toughness: number;
    private maxstrain: number;
    private reliability: number;
    private drag: number;
    private acft_stats: Stats;

    constructor() {
        super();

        this.free_dots = 0;
        this.cost = 0;
        this.bleed = 0;
        this.escape = 0;
        this.mass = 0;
        this.toughness = 0;
        this.maxstrain = 0;
        this.reliability = 0;
        this.drag = 0;
        this.acft_stats = new Stats;
    }

    public toJSON() {
        return {
            free_dots: this.free_dots,
            cost: this.cost,
            bleed: this.bleed,
            escape: this.escape,
            mass: this.mass,
            toughness: this.toughness,
            maxstrain: this.maxstrain,
            reliability: this.reliability,
            drag: this.drag,
        }
    }

    public fromJSON(js: JSON) {
        this.free_dots = js["free_dots"];
        this.cost = js["cost"];
        this.bleed = js["bleed"];
        this.escape = js["escape"];
        this.mass = js["mass"];
        this.toughness = js["toughness"];
        this.maxstrain = js["maxstrain"];
        this.reliability = js["reliability"];
        this.drag = js["drag"];
    }

    public GetUnassignedCount() {
        return this.free_dots - this.cost - this.bleed
            - this.escape - this.mass - this.toughness - this.maxstrain
            - this.reliability - this.drag;
    }

    public ReduceDots() {
        var diff = -this.GetUnassignedCount();
        if (diff > 0) {
            let d = Math.min(diff, this.drag);
            d = Math.max(d, 0);
            this.drag -= d;
            diff -= d;
            d = Math.min(diff, this.reliability);
            d = Math.max(d, 0);
            this.reliability -= d;
            diff -= d;
            d = Math.min(diff, this.maxstrain);
            d = Math.max(d, 0);
            this.maxstrain -= d;
            diff -= d;
            d = Math.min(diff, this.toughness);
            d = Math.max(d, 0);
            this.toughness -= d;
            diff -= d;
            d = Math.min(diff, this.mass);
            d = Math.max(d, 0);
            this.mass -= d;
            diff -= d;
            d = Math.min(diff, this.escape);
            d = Math.max(d, 0);
            this.escape -= d;
            diff -= d;
            d = Math.min(diff, this.bleed);
            d = Math.max(d, 0);
            this.bleed -= d;
            diff -= d;
            d = Math.min(diff, this.cost);
            d = Math.max(d, 0);
            this.cost -= d;
            diff -= d;
        }
    }

    public GetFreeDots() {
        return this.free_dots;
    }

    public SetFreeDots(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, 0);
        this.free_dots = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetCost() {
        return this.cost;
    }

    public SetCost(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.cost = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetBleed() {
        return this.bleed;
    }

    public SetBleed(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.bleed = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetEscape() {
        return this.escape;
    }

    public SetEscape(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.escape = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetMass() {
        return this.mass;
    }

    public SetMass(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.mass = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetToughness() {
        return this.toughness;
    }

    public SetToughness(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.toughness = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetMaxStrain() {
        return this.maxstrain;
    }

    public SetMaxStrain(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.maxstrain = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetReliabiilty() {
        return this.reliability;
    }

    public SetReliability(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.reliability = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public GetDrag() {
        return this.drag;
    }

    public SetDrag(num: number) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.drag = num;
        this.ReduceDots();
        this.CalculateStats();
    }

    public SetAcftStats(stats: Stats) {
        this.acft_stats = stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        stats.cost = Math.floor(-(this.cost * 1.5 * this.acft_stats.cost / 10));
        stats.liftbleed = Math.floor(- this.bleed * 2);
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = Math.floor(-(this.mass * this.acft_stats.mass / 20));
        stats.toughness = Math.floor(this.toughness * this.acft_stats.toughness / 5);
        stats.maxstrain = Math.floor(this.maxstrain * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = Math.floor(-(this.drag * this.acft_stats.drag / 20));

        return stats;
    }
}