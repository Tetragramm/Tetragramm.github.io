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
    abstract GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] };
    protected FormatEquipment(equipment: { source: string, charge: string }[], name: string, charge: number): { source: string, charge: string }[] {
        if (Math.abs(charge) > 0.5) {
            equipment.push({
                source: lu(name),
                charge: charge.toString(),
            });
        } else if (charge > 0 && charge < 1.0e-6) {
            equipment.push({
                source: lu(name),
                charge: "-",
            });
        }
        return equipment;
    }
    abstract SetCalculateStats(callback: () => void);
    protected CalculateStats: () => void;
}

function MergeElectrics(
    a: { storage: number, equipment: { source: string, charge: string }[] },
    b: { storage: number, equipment: { source: string, charge: string }[] }): { storage: number, equipment: { source: string, charge: string }[] } {

    for (let bi = 0; bi < b.equipment.length; bi++) {
        let merge = false;
        for (let ai = 0; ai < a.equipment.length; ai++) {
            if (a.equipment[ai].source == b.equipment[bi].source && !isNaN(parseInt(a.equipment[ai].charge))) {
                a.equipment[ai].charge = (parseInt(a.equipment[ai].charge) + parseInt(b.equipment[bi].charge)).toString();
                merge = true;
                break;
            }
        }
        if (!merge) {
            a.equipment.push(b.equipment[bi]);
        }
    }

    return { storage: a.storage + b.storage, equipment: a.equipment };
}