import { StringFmt } from "../string";
import { Vehicle } from "../impl/Vehicle";
import { WARNING_COLOR, Volume, Stats } from "../impl/Stats";


export class StatsDisp {
    private vehicle: Vehicle;
    private name_lbl: HTMLLabelElement;
    private nick_lbl: HTMLLabelElement;
    private spd: HTMLTableCellElement;
    private trq: HTMLTableCellElement;
    private hnd: HTMLTableCellElement;
    private amr: HTMLTableCellElement;
    private int: HTMLTableCellElement;
    private sft: HTMLTableCellElement;
    private rel: HTMLTableCellElement;
    private ful: HTMLTableCellElement;
    private str: HTMLTableCellElement;
    private sze: HTMLTableCellElement;
    private crg: HTMLTableCellElement;
    private crw: HTMLTableElement;
    private special: HTMLTableCellElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.name_lbl = document.getElementById("lbl_name") as HTMLLabelElement;
        this.nick_lbl = document.getElementById("lbl_nickname") as HTMLLabelElement;
        this.CreateStatTable();
        this.CreateCrewTable();
    }

    private CreateStatTable() {
        var tbl = document.getElementById("tbl_derived") as HTMLTableElement;
        var h1 = tbl.insertRow();
        this.AddHeader(h1, "Speed").classList.add("thirdwidth");
        this.AddHeader(h1, "Torque").classList.add("thirdwidth");
        this.AddHeader(h1, "Handling").classList.add("thirdwidth");
        var r1 = tbl.insertRow();
        this.spd = this.AddData(r1);
        this.trq = this.AddData(r1);
        this.hnd = this.AddData(r1);
        var h2 = tbl.insertRow();
        this.AddHeader(h2, "Armour");
        this.AddHeader(h2, "Integrity");
        this.AddHeader(h2, "Safety");
        var r2 = tbl.insertRow();
        this.amr = this.AddData(r2);
        this.int = this.AddData(r2);
        this.sft = this.AddData(r2);
        var h3 = tbl.insertRow();
        this.AddHeader(h3, "Reliability");
        this.AddHeader(h3, "Fuel Uses");
        this.AddHeader(h3, "Stress");
        var r3 = tbl.insertRow();
        this.rel = this.AddData(r3);
        this.ful = this.AddData(r3);
        this.str = this.AddData(r3);
        var r4 = tbl.insertRow();
        this.sze = r4.insertCell();
        this.sze.colSpan = 3;
        this.crg = r4.insertCell();
        this.crg.colSpan = 3;
        var r5 = tbl.insertRow();
        this.special = r5.insertCell();
        this.special.colSpan = 6;
    }

    private CreateCrewTable() {
        this.crw = document.getElementById("tbl_crew") as HTMLTableElement;
        var first_row = this.crw.insertRow();
        var fcol = this.AddData(first_row);
        fcol.colSpan = 4;
        fcol.classList.add("tl");
        this.AddHeader(first_row, "Type").colSpan = 1;
        this.AddHeader(first_row, "Vis.").colSpan = 1;
        this.AddHeader(first_row, "Escape").colSpan = 1;
        this.AddHeader(first_row, "Notes").colSpan = 1;
    }

    private AddHeader(row: HTMLTableRowElement, txt: string) {
        var h = document.createElement("TH") as HTMLTableHeaderCellElement;
        row.appendChild(h);
        h.colSpan = 2;
        h.textContent = txt;
        return h;
    }

    private AddData(row: HTMLTableRowElement) {
        var h = row.insertCell();
        h.colSpan = 2;
        return h;
    }

    private CrewLine(name: string, type: string, vis: number, escape: number, notes: string, indent: boolean = false) {
        var r = this.crw.insertRow();
        if (indent) {
            var indent_cell = r.insertCell();
            indent_cell.classList.add("borderless");
        }
        var name_cell = r.insertCell();
        name_cell.textContent = name;
        if (indent) {
            name_cell.colSpan = 3;
        } else {
            name_cell.colSpan = 4;
        }
        r.insertCell().textContent = type;
        r.insertCell().textContent = (vis ?? "-").toString();
        r.insertCell().textContent = (escape ?? "-").toString();
        r.insertCell().textContent = notes;
    }

    public UpdateDisplay(final_stats: Stats) {
        let origoffset = document.getElementById("lbl_mech").offsetTop;

        this.name_lbl.innerHTML = StringFmt.Format("<p><span style=\"float:left;\">{0}</span> <span style=\"float:right\">{1}þ</span></p>", this.vehicle.name, final_stats.cost);
        this.nick_lbl.innerHTML = StringFmt.Format("<p><span style=\"float:left;\">{0}</span> <span style=\"float:right\">Upkeep {1}þ</span></p>", this.vehicle.nickname, final_stats.upkeep);
        this.spd.textContent = final_stats.speed.toString();
        if (final_stats.walker_torque) {
            this.trq.textContent = StringFmt.Format("+{0}/{1}", final_stats.walker_torque, final_stats.torque);
        } else {
            this.trq.textContent = final_stats.torque.toString();
        }
        this.hnd.textContent = final_stats.handling.toString();
        this.amr.textContent = StringFmt.Format("{0}/{1}/{2}", this.vehicle.GetArmourFront(), this.vehicle.GetArmourSide(), this.vehicle.GetArmourRear());
        this.int.textContent = final_stats.integrity.toString();
        this.sft.textContent = final_stats.safety.toString();
        this.rel.textContent = final_stats.reliability.toString();
        this.ful.textContent = final_stats.fuel.toString();
        this.str.textContent = final_stats.stress.toString();
        this.sze.textContent = Volume[Math.min(final_stats.volume, Volume.length - 1)].size.toString() + StringFmt.Format(" ({0} Volume)", final_stats.volume);
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
        this.crg.textContent = StringFmt.Join(", ", cstring);

        final_stats.warnings.sort((a, b) => { return a.color - b.color });
        var warnhtml = "";
        for (let w of final_stats.warnings) {
            switch (w.color) {
                case WARNING_COLOR.RED:
                    warnhtml += "<div style=\"color:#FF0000;\">";
                    break;
                case WARNING_COLOR.YELLOW:
                    warnhtml += "<div style=\"color:#FFFF00;\">";
                    break;
                case WARNING_COLOR.WHITE:
                default:
                    warnhtml += "<div style=\"color:var(--inp_txt_color);;\">";
                    break;
            }
            warnhtml += w.source + ":  " + w.warning + "</div>";
        }
        this.special.innerHTML = warnhtml;

        while (this.crw.rows.length > 1) {
            this.crw.deleteRow(1);
        }
        var crewlist = this.vehicle.GetCrewList();
        for (let c of crewlist) {
            let enclosure = "Exposed";
            if (c.enclosed) {
                enclosure = "Closed";
                if (c.sealed) {
                    enclosure = "Sealed"
                }
            }
            let notes = [];
            if (c.enclosed && c.coupla) {
                notes.push("Hatch");
            }
            notes.push(c.WeaponString());
            //TODO: Vis & Escape
            this.CrewLine(c.name_txt, enclosure, c.GetVisibility(), c.GetEscape(), StringFmt.Join(", ", notes));
            for (let l = 0; l < c.loaders.length; l++) {
                let enclosure = "Exposed";
                if (c.loaders[l].enclosed) {
                    enclosure = "Closed";
                    if (c.loaders[l].sealed) {
                        enclosure = "Sealed"
                    }
                }
                let notes = [];
                if (c.loaders[l].enclosed && c.loaders[l].coupla) {
                    notes.push("Hatch");
                }
                //TODO: Vis & Escape
                this.CrewLine("Loader", enclosure, c.GetVisibility(l), c.GetEscape(l), StringFmt.Join(", ", notes), true);
            }

            let newoffset = document.getElementById("lbl_mech").offsetTop;
            document.body.scrollBy(0, newoffset - origoffset);
        }

        // this.CrewLine("Driver", "Closed", -1, -1, "Hatch", false);
        // this.CrewLine("Commander", "Closed", -1, -1, "Hatch", false);
        // this.CrewLine("Gunner", "Closed", -2, -3, "*F. Cannon (Fore)", false);
        // this.CrewLine("Loader", "Closed", -2, -3, "", true);
        // this.CrewLine("x6 MG Crew", "Closed", -3, -3, "x1 WMG each\n(x2 Left, x2 Right, x2 Rear)", false);
        // this.CrewLine("Mechanic", "Sealed", undefined, -2, "Engine Access", false);
    }
}