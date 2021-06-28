/// <reference path="./Stats.ts" />


enum AIRCRAFT_TYPE {
    AIRPLANE,
    HELICOPTER,
    AUTOGYRO,
    ORNITHOPTER_BASIC,
    ORNITHOPTER_FLUTTER,
    ORNITHOPTER_BUZZER,
}
function IsAnyOrnithopter(type: AIRCRAFT_TYPE){
    return type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC
    || type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER
    || type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER;
}
abstract class Part {
    abstract PartStats(): Stats;
    abstract SetCalculateStats(callback: () => void);
    protected CalculateStats: () => void;

}