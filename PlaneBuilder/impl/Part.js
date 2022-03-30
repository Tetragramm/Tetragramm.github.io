import { lu } from "./Localization.js";
export var AIRCRAFT_TYPE;
(function (AIRCRAFT_TYPE) {
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AIRPLANE"] = 0] = "AIRPLANE";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["HELICOPTER"] = 1] = "HELICOPTER";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AUTOGYRO"] = 2] = "AUTOGYRO";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_BASIC"] = 3] = "ORNITHOPTER_BASIC";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_FLUTTER"] = 4] = "ORNITHOPTER_FLUTTER";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_BUZZER"] = 5] = "ORNITHOPTER_BUZZER";
})(AIRCRAFT_TYPE || (AIRCRAFT_TYPE = {}));
export function IsAnyOrnithopter(type) {
    return type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC
        || type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER
        || type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER;
}
export class Part {
    FormatEquipment(equipment, name, charge) {
        if (Math.abs(charge) > 0.5) {
            equipment.push({
                source: lu(name),
                charge: charge.toString(),
            });
        }
        else if (charge > 0 && charge < 1.0e-6) {
            equipment.push({
                source: lu(name),
                charge: "-",
            });
        }
        return equipment;
    }
}
export function MergeElectrics(a, b) {
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
