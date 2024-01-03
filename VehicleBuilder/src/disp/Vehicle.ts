import { StatsDisp } from "./Stats";
import { MachineryDisp } from "./Machinery";
import { CrewDisp } from "./Crew";
import { WeaponDisp } from "./Weapon";
import { AccessoriesDisp } from "./Accessories";
import { CustomDisp } from "./Custom";
import { Cards } from "./Cards";

import { _arrayBufferToString, _stringToArrayBuffer, download } from "./Tools";
import { LZString } from "../lz/lz-string";

import { Vehicle } from "../impl/Vehicle";
import { Stats } from "../impl/Stats";
import { Serialize } from "../impl/Serialize";

export class VehDisp {
    private vehicle: Vehicle;
    private stats: StatsDisp;
    private armour: MachineryDisp;
    private crew: CrewDisp;
    private weps: WeaponDisp;
    private accessories: AccessoriesDisp;
    private custom: CustomDisp;
    private cards: Cards;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        veh.SetDisplayCallback((stats: Stats) => { this.UpdateDisplay(stats); });
        this.stats = new StatsDisp(veh);
        this.armour = new MachineryDisp(veh);
        this.crew = new CrewDisp(veh);
        this.weps = new WeaponDisp(veh);
        this.accessories = new AccessoriesDisp(veh);
        this.custom = new CustomDisp(veh);

        const link_button = document.getElementById("acft_save_link") as HTMLButtonElement;
        link_button.onclick = () => { this.SaveLink(); };

        this.cards = new Cards();
        const dash_button = document.getElementById("acft_save_dash") as HTMLButtonElement;
        dash_button.onclick = () => { this.cards.SaveDash(this.vehicle); };

        const reset_button = document.getElementById("acft_reset") as HTMLButtonElement;
        reset_button.onclick = () => { this.vehicle.Reset(); this.vehicle.CalculateStats(); };

        const cat_button = document.getElementById("acft_save_cat");
        // cat_button.onclick = () => { this.CatalogStats(); }
    }

    public UpdateDisplay(final_stats: Stats) {

        let origoffset = document.getElementById("lbl_mech").getBoundingClientRect().top;

        this.stats.UpdateDisplay(final_stats);
        this.armour.UpdateDisplay();
        this.crew.UpdateDisplay();
        this.weps.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.custom.UpdateDisplay();

        let newoffset = document.getElementById("lbl_mech").getBoundingClientRect().top;
        window.scrollBy(0, newoffset - origoffset);
    }

    private MakeLink() {
        const ser = new Serialize();
        this.vehicle.Serialize(ser);
        const arr = ser.FinalArray();
        const str2 = _arrayBufferToString(arr);
        const txt2 = LZString.compressToEncodedURIComponent(str2);
        const link = (location.protocol + "//" + location.host + location.pathname + "?tank=" + txt2);
        return link;
    }

    private SaveLink() {
        navigator.clipboard.writeText(this.MakeLink());
    }

    private MakeCatalog() {
        let str = `\\FCVehicleOnePage[Name = {0}, Price = {1},
    Nickname = {2}, Upkeep = {3},
    Speed = {4}, Torque = {5}, Handling = {6},
    Armour = {6}, Integrity = {7}, Safety = {8},
    Reliability = {9}, Fuel Uses = {10}, Stress = {11},
    Size = {12}, Cargo = {13},
    Crew = {
        {14}
    },
    Image = Default.png
]{
#Flavor Text Goes Here
}`;
    }
}