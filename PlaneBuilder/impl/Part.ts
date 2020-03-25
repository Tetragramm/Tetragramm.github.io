// export { Part };

// import { Stats } from "./Stats";
/// <reference path="./Stats.ts" />

abstract class Part {
    abstract PartStats(): Stats;
    abstract SetCalculateStats(callback: () => void);
    protected CalculateStats: () => void;

}