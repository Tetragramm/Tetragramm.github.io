import { StatsDisp } from "./Stats";
import { MachineryDisp } from "./Machinery";
import { CrewDisp } from "./Crew";
import { WeaponDisp } from "./Weapon";
import { AccessoriesDisp } from "./Accessories";
import { CustomDisp } from "./Custom";
import { Cards } from "./Cards";

import { CreateLabel, _arrayBufferToString, _stringToArrayBuffer, download } from "./Tools";
import { LZString } from "../lz/lz-string";

import { Vehicle } from "../impl/Vehicle";
import { Stats, Volume } from "../impl/Stats";
import { Serialize, Deserialize } from "../impl/Serialize";
import { StringFmt } from "../string";
import { Crew } from "../impl/Crew";

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
        cat_button.onclick = () => { this.CatalogStats(); }
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

    private CatalogStats() {
        let str = `\\FCVehicleOnePage[Name = {0}, Price = {1},
    Nickname = {2}, Upkeep = {3},
    Speed = {4}, Torque = {5}, Handling = {6},
    Armour = {7}, Integrity = {8}, Safety = {9},
    Reliability = {10}, Fuel Uses = {11}, Stress = {12},
    Size = {13}, Cargo = {14},
    Crew = {
{15}
    },
    Image = Default.png
]{
#Flavor Text Goes Here
}`;
        let final_stats = this.vehicle.CalculateStats();
        let torque_str;
        if (final_stats.walker_torque) {
            torque_str = StringFmt.Format("+{0}/{1}", final_stats.walker_torque, final_stats.torque);
        } else {
            torque_str = final_stats.torque.toString();
        }

        let cargo = this.vehicle.GetCargo();
        let cstring = [];
        if (cargo[0] > 0) {
            cstring.push(StringFmt.Format("{0} Tiny Cargo", cargo[0]));
        }
        if (cargo[1] > 0) {
            cstring.push(StringFmt.Format("{0} Small Cargo", cargo[1]));
        }
        if (cargo[2] > 0) {
            cstring.push(StringFmt.Format("{0} Medium Cargo", cargo[2]));
        }
        if (cargo[3] > 0) {
            cstring.push(StringFmt.Format("{0} Large Cargo", cargo[3]));
        }
        if (cargo[4] > 0) {
            cstring.push(StringFmt.Format("{0} Huge Cargo", cargo[4]));
        }
        if (cstring.length == 0) {
            cstring.push("No Cargo Space");
        }

        let crew_string = "";
        var tempcrewlist = this.vehicle.GetCrewList();
        var crewlist = [];
        for (let c of tempcrewlist) {
            let s = new Serialize();
            c.Serialize(s);
            let arr = s.FinalArray();
            let nc = new Crew("", false, false, false, false, false, false, false, [], []);
            let d = new Deserialize(arr);
            nc.Deserialize(d);
            nc.base_escape = c.base_escape;
            nc.base_vis = c.base_vis;
            crewlist.push(nc);
        }

        while (crewlist.length > 0) {
            let vis = crewlist[0].GetVisibility();
            let esc = crewlist[0].GetEscape();
            let next_crew = crewlist.splice(0, 1);
            console.log(StringFmt.Format("This Crew is {0} {1} {2} {3} {4}", next_crew[0].name_txt, next_crew[0].enclosed, next_crew[0].sealed, next_crew[0].cupola, next_crew[0].loaders));

            for (let i = 0; i < crewlist.length; i++) {
                let loaders_equal = crewlist[i].loaders.length == next_crew[0].loaders.length &&
                    (next_crew[0].loaders.length == 0
                        || crewlist[i].loaders.every((element, index) => {
                            element.enclosed == next_crew[0].loaders[index].enclosed
                                && element.sealed == next_crew[0].loaders[index].sealed
                                && element.cupola == next_crew[0].loaders[index].cupola
                        }));
                console.log(StringFmt.Format("Matching Crew is {0} {1} {2} {3} {4} {5} {6}", i, crewlist[i].name_txt, crewlist[i].enclosed, crewlist[i].sealed, crewlist[i].cupola, crewlist[i].loaders, loaders_equal));
                if (crewlist[i].name_txt == next_crew[0].name_txt
                    && crewlist[i].enclosed == next_crew[0].enclosed
                    && crewlist[i].sealed == next_crew[0].sealed
                    && crewlist[i].cupola == next_crew[0].cupola
                    && loaders_equal) {
                    next_crew.splice(next_crew.length, 0, ...crewlist.splice(i, 1));
                    i--;
                }
            }


            let crew_line = "";

            let enclosure = "Exposed";
            if (next_crew[0].enclosed) {
                enclosure = "Closed";
                if (next_crew[0].sealed) {
                    enclosure = "Sealed"
                }
            }

            let notes = [];
            if (next_crew[0].hatch) {
                notes.push("Hatch");
            }
            notes.push(next_crew[0].WeaponString());
            if (next_crew.length == 1) {
                crew_line = StringFmt.Format("        {0} & {1} & {2} & {3} & {4} \\\\\n",
                    next_crew[0].name_txt,
                    enclosure,
                    (vis ?? "-").toString(),
                    (esc ?? "-").toString(),
                    StringFmt.Join(",", notes)
                );
            } else {
                //Make Weapon String
                crew_line = StringFmt.Format("        {5}x {0} & {1} & {2} & {3} & {4} \\\\\n",
                    next_crew[0].name_txt,
                    enclosure,
                    (vis ?? "-").toString(),
                    (esc ?? "-").toString(),
                    StringFmt.Join(",", notes),
                    next_crew.length
                );
            }
            //Driver & Closed & 0 & 1 & Hatch \\
            while (next_crew[0].loaders.length > 0) {
                let vis = next_crew[0].GetVisibility(0);
                let esc = next_crew[0].GetEscape(0);
                let next_loader = next_crew[0].loaders.splice(0, 1);
                for (let i = 0; i < next_crew[0].loaders.length; i++) {
                    if (next_crew[0].loaders[i].enclosed == next_loader[0].enclosed
                        && next_crew[0].loaders[i].sealed == next_loader[0].sealed
                        && next_crew[0].loaders[i].cupola == next_loader[0].cupola) {
                        next_loader.splice(next_loader.length, 0, ...(next_crew[0].loaders.splice(i, 1)));
                        i--;
                    }
                }

                let loader_line = "";

                let enclosure = "Exposed";
                if (next_crew[0].enclosed) {
                    enclosure = "Closed";
                    if (next_crew[0].sealed) {
                        enclosure = "Sealed"
                    }
                }

                let lhatch = "";
                if (next_loader[0].hatch) {
                    lhatch = "Hatch";
                }
                if (next_loader.length == 1) {
                    loader_line = StringFmt.Format("        \\quad{}{0} & {1} & {2} & {3} & {4} \\\\\n",
                        "Loader",
                        enclosure,
                        (vis ?? "-").toString(),
                        (esc ?? "-").toString(),
                        lhatch
                    );
                } else {
                    //Make Weapon String
                    loader_line = StringFmt.Format("        \\quad{}{5}x {0} & {1} & {2} & {3} & {4} \\\\\n",
                        "Loader",
                        enclosure,
                        (vis ?? "-").toString(),
                        (esc ?? "-").toString(),
                        lhatch,
                        next_loader.length
                    );
                }
                crew_line = crew_line + loader_line;
            }
            crew_string = crew_string + crew_line;
        }

        str = StringFmt.Format(str, this.vehicle.name,
            final_stats.cost,
            this.vehicle.nickname,
            final_stats.upkeep,
            final_stats.speed,
            torque_str,
            final_stats.handling,
            StringFmt.Format("{0}/{1}/{2}", this.vehicle.GetArmourFront(), this.vehicle.GetArmourSide(), this.vehicle.GetArmourRear()),
            final_stats.integrity,
            final_stats.safety,
            final_stats.reliability,
            final_stats.fuel,
            final_stats.stress,
            Volume[Math.min(final_stats.volume, Volume.length - 1)].size.toString() + StringFmt.Format(" ({0} Volume)", final_stats.volume),
            StringFmt.Join(", ", cstring),
            crew_string
        );

        download(str, this.vehicle.name + "_" + this.vehicle.version + ".txt", "txt");
    }
}