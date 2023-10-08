import { StatsDisp } from "./Stats";
import { MachineryDisp } from "./Machinery";
import { CrewDisp } from "./Crew";
import { WeaponDisp } from "./Weapon";
import { AccessoriesDisp } from "./Accessories";

import { Vehicle } from "../impl/Vehicle";
import { Stats } from "../impl/Stats";

export class VehDisp {
    private stats: StatsDisp;
    private armour: MachineryDisp;
    private crew: CrewDisp;
    private weps: WeaponDisp;
    private accessories: AccessoriesDisp;

    constructor(veh: Vehicle) {
        veh.SetDisplayCallback((stats: Stats) => { this.UpdateDisplay(stats); });
        this.stats = new StatsDisp(veh);
        this.armour = new MachineryDisp(veh);
        this.crew = new CrewDisp(veh);
        this.weps = new WeaponDisp(veh);
        this.accessories = new AccessoriesDisp(veh);
    }

    public UpdateDisplay(final_stats: Stats) {
        this.stats.UpdateDisplay(final_stats);
        this.armour.UpdateDisplay();
        this.crew.UpdateDisplay();
        this.weps.UpdateDisplay();
        this.accessories.UpdateDisplay();
    }
}