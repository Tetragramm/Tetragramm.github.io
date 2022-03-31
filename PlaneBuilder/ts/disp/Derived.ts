import { Aircraft, DerivedStats } from "../impl/Aircraft.js";
import { Stats, WARNING_COLOR, era2numHl } from "../impl/Stats.js";
import { WING_DECK } from "../impl/Wings.js";
import { WeaponString } from "./Weapons.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, FlexLabels } from "./Tools.js";
import { StringFmt } from "../string/index.js";

export class Derived_HTML {
    private tbl: HTMLTableElement;
    private name_inp: HTMLInputElement;
    private cost_cell: HTMLTableCellElement;
    private upkeep_cell: HTMLTableCellElement;
    private version_cell: HTMLTableCellElement;
    private full_row: HTMLTableRowElement;
    private bomb_row1: HTMLTableRowElement;
    private bomb_row2: HTMLTableRowElement;
    private ts_empty: HTMLTableCellElement;
    private ss_empty: HTMLTableCellElement;
    private hand_empty: HTMLTableCellElement;
    private boost_empty: HTMLTableCellElement;
    private roc_empty: HTMLTableCellElement;
    private ts_half: HTMLTableCellElement;
    private ss_half: HTMLTableCellElement;
    private hand_half: HTMLTableCellElement;
    private boost_half: HTMLTableCellElement;
    private roc_half: HTMLTableCellElement;
    private ts_full: HTMLTableCellElement;
    private ss_full: HTMLTableCellElement;
    private hand_full: HTMLTableCellElement;
    private boost_full: HTMLTableCellElement;
    private roc_full: HTMLTableCellElement;
    private ts_halfwB: HTMLTableCellElement;
    private ss_halfwB: HTMLTableCellElement;
    private hand_halfwB: HTMLTableCellElement;
    private boost_halfwB: HTMLTableCellElement;
    private roc_halfwB: HTMLTableCellElement;
    private ts_fullwB: HTMLTableCellElement;
    private ss_fullwB: HTMLTableCellElement;
    private hand_fullwB: HTMLTableCellElement;
    private boost_fullwB: HTMLTableCellElement;
    private roc_fullwB: HTMLTableCellElement;
    private vital_components: HTMLTableCellElement;
    private dropoff_cell: HTMLTableCellElement;
    private stability_cell: HTMLTableCellElement;
    private reliability_cell: HTMLTableCellElement;
    private flightstress_cell: HTMLTableCellElement;
    private overspeed_cell: HTMLTableCellElement;
    private eloss_cell: HTMLTableCellElement;
    private toughness_cell: HTMLTableCellElement;
    private visibility_cell: HTMLTableCellElement;
    private electric_cell: HTMLTableCellElement;
    private turnbleed_label: HTMLTableCellElement;
    private turnbleed_cell: HTMLTableCellElement;
    private mxstrain_cell: HTMLTableCellElement;
    private attack_cell: HTMLTableCellElement;
    private maxfuel_cell: HTMLTableCellElement;
    private landing_cell: HTMLTableCellElement;
    private escape_cell: HTMLTableCellElement;
    private communications_cell: HTMLTableCellElement;
    private crew_cell: HTMLTableCellElement;
    private maxalt_cell: HTMLTableCellElement;
    private crashsafety_cell: HTMLTableCellElement;
    private flammable_cell: HTMLTableCellElement;
    private weapon_head: HTMLTableHeaderCellElement;
    private weapon_cell: HTMLTableCellElement;
    private warning_head: HTMLTableHeaderCellElement;
    private warning_cell: HTMLTableCellElement;
    private desc_cell: HTMLTableCellElement;

    private show_bombs: boolean;

    constructor(tbl: HTMLTableElement) {
        const fragment = document.createDocumentFragment();
        const row0 = insertRow(fragment);
        const name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 2;
        this.name_inp = document.createElement("INPUT") as HTMLInputElement;
        this.name_inp.defaultValue = lu("Derived Aircraft Name");
        name_cell.appendChild(this.name_inp);

        CreateTH(row0, lu("Stat Cost"));
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        CreateTH(row0, lu("Stat Upkeep"));
        // Aircraft Upkeep
        this.upkeep_cell = row0.insertCell();
        // Rules Version
        CreateTH(row0, lu("Derived Era Report"));
        this.version_cell = row0.insertCell();

        const row1 = insertRow(fragment);
        CreateTH(row1, lu("Derived Mass Variations"));
        CreateTH(row1, lu("Derived Boost"));
        CreateTH(row1, lu("Derived Handling"));
        CreateTH(row1, lu("Derived Rate of Climb"));
        CreateTH(row1, lu("Derived Stall Speed"));
        CreateTH(row1, lu("Derived Top Speed"));
        CreateTH(row1, lu("Derived Vital Components")).colSpan = 2;


        this.bomb_row2 = insertRow(fragment);
        CreateTH(this.bomb_row2, lu("Derived Full Fuel with Bombs"));
        this.boost_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.roc_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.vital_components = this.bomb_row2.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;

        this.bomb_row1 = insertRow(fragment);
        CreateTH(this.bomb_row1, lu("Derived Half Fuel with Bombs"));
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.roc_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.ts_halfwB = this.bomb_row1.insertCell();

        this.full_row = insertRow(fragment);
        CreateTH(this.full_row, lu("Derived Full Fuel"));
        this.boost_full = this.full_row.insertCell();
        this.hand_full = this.full_row.insertCell();
        this.roc_full = this.full_row.insertCell();
        this.ss_full = this.full_row.insertCell();
        this.ts_full = this.full_row.insertCell();

        const half = insertRow(fragment);
        CreateTH(half, lu("Derived Half Fuel"));
        this.boost_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.roc_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.ts_half = half.insertCell();

        const empty = insertRow(fragment);
        CreateTH(empty, lu("Derived Empty Fuel"));
        this.boost_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.roc_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.ts_empty = empty.insertCell();

        const row7 = insertRow(fragment);
        CreateTH(row7, lu("Derived Propulsion")).colSpan = 2;
        CreateTH(row7, lu("Derived Aerodynamics")).colSpan = 2;
        CreateTH(row7, lu("Derived Survivability")).colSpan = 2;
        CreateTH(row7, lu("Derived Crew Members")).colSpan = 2;

        const row8 = insertRow(fragment);
        CreateTH(row8, lu("Derived Dropoff"));
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Stability"));
        this.stability_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crash Safety"));
        this.crashsafety_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crew/Passengers"));
        this.crew_cell = row8.insertCell();

        const row9 = insertRow(fragment);
        CreateTH(row9, lu("Derived Overspeed"));
        this.overspeed_cell = row9.insertCell();
        CreateTH(row9, lu("Derived Energy Loss"));
        this.eloss_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Toughness"));
        this.toughness_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Visibility"));
        this.visibility_cell = row9.insertCell();

        const row10 = insertRow(fragment);
        CreateTH(row10, lu("Derived Fuel Uses"));
        this.maxfuel_cell = row10.insertCell();
        this.turnbleed_label = CreateTH(row10, lu("Derived Turn Bleed"));
        this.turnbleed_cell = row10.insertCell();
        CreateTH(row10, lu("Stat Max Strain"));
        this.mxstrain_cell = row10.insertCell();
        CreateTH(row10, lu("Derived Attack Modifier"));
        this.attack_cell = row10.insertCell();

        const row11 = insertRow(fragment);
        CreateTH(row11, lu("Stat Reliability"));
        this.reliability_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Landing Gear"));
        this.landing_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Communications"));
        this.communications_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Escape"));
        this.escape_cell = row11.insertCell();

        const row12 = insertRow(fragment);
        CreateTH(row12, lu("Derived Ideal Engine Altitude"));
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, lu("Derived Is Flammable Question"));
        this.flammable_cell = row12.insertCell();
        this.desc_cell = row12.insertCell();
        this.desc_cell.colSpan = 2;
        CreateTH(row12, lu("Stat Flight Stress"));
        this.flightstress_cell = row12.insertCell();

        const head_row = insertRow(fragment);
        const body_row = insertRow(fragment);
        this.weapon_head = CreateTH(head_row, lu("Derived Weapon Systems"));
        this.weapon_head.colSpan = 6;
        this.weapon_cell = body_row.insertCell();
        this.weapon_cell.colSpan = 6;

        this.warning_head = CreateTH(insertRow(fragment), lu("Derived Special Rules"));
        this.warning_head.colSpan = 6;
        this.warning_cell = insertRow(fragment).insertCell();
        this.warning_cell.colSpan = 6;

        const electric_head = CreateTH(head_row, lu("Derived Electrics"));
        electric_head.colSpan = 2;
        this.electric_cell = body_row.insertCell();
        this.electric_cell.colSpan = 2;
        this.electric_cell.rowSpan = 3;

        tbl.appendChild(fragment);
        this.tbl = tbl;
    }

    public UpdateDisplay(acft: Aircraft, stats: Stats, derived: DerivedStats) {
        this.name_inp.value = acft.name;

        while (this.version_cell.children.length > 0) {
            this.version_cell.removeChild(this.version_cell.children[0]);
        }
        this.version_cell.className = "tooltip"

        const era_t_div = document.createElement("DIV") as HTMLDivElement;
        era_t_div.className = "tooltiptext";
        let div_text = document.createElement("P") as HTMLParagraphElement;
        div_text.textContent = lu("Derived Problematic Parts");
        era_t_div.appendChild(div_text);

        const plane_era = era2numHl(acft.GetEra().GetSelectedText());
        const era_break = 0;
        for (let part of stats.era) {
            const part_era = era2numHl(part.era);
            if (part_era > plane_era) {
                era_break += part_era - plane_era;
                let part_text = document.createElement("P") as HTMLParagraphElement;
                part_text.textContent = part.name + ": " + part.era;
                era_t_div.appendChild(part_text);
            }
        }
        if (era_break == 0) {
            let part_text = document.createElement("P") as HTMLParagraphElement;
            part_text.textContent = lu("None");
            era_t_div.appendChild(part_text);
        }


        const era_p_elem = document.createElement("P") as HTMLParagraphElement;
        era_p_elem.textContent = lu(acft.GetEra().GetSelectedText());
        if (era_break == 0)
            era_p_elem.className = "green";
        else if (era_break > 2)
            era_p_elem.className = "red";
        else
            era_p_elem.className = "yellow";
        this.version_cell.appendChild(era_p_elem);
        this.version_cell.appendChild(era_t_div);


        this.cost_cell.textContent = stats.cost.toString() + "þ ";
        if (acft.GetUsed().GetEnabled()) {
            this.cost_cell.textContent += " (" + Math.floor(1.0e-6 + stats.cost / 2).toString() + "þ " + lu("Price Word Used") + ")";
        }
        this.upkeep_cell.textContent = stats.upkeep.toString() + "þ";
        //Empty
        // this.ts_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedEmpty).toString();
        // this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        // this.hand_empty.textContent = derived.HandlingEmpty.toString();
        // this.boost_empty.textContent = derived.BoostEmpty.toString();
        // this.roc_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull - derived.StallSpeedFull + derived.BoostFull).toString();
        this.ts_empty.textContent = (0).toString();
        this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        this.hand_empty.textContent = derived.HandlingEmpty.toString();
        this.boost_empty.textContent = (0).toString();
        this.roc_empty.textContent = (0).toString();
        //Half
        this.ts_half.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.roc_half.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2).toString();
        //Full
        this.ts_full.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull).toString();
        this.ss_full.textContent = derived.StallSpeedFull.toString();
        this.hand_full.textContent = derived.HandlingFull.toString();
        this.boost_full.textContent = derived.BoostFull.toString();
        this.roc_full.textContent = derived.RateOfClimbFull.toString();

        if (stats.bomb_mass > 0 || this.show_bombs) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            this.bomb_row2.appendChild(this.vital_components);
            this.vital_components.rowSpan = 5;
            //Half
            this.ts_halfwB.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.roc_halfwB.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2).toString();
            //Full
            this.ts_fullwB.textContent = Math.floor(1.0e-6 + derived.MaxSpeedwBombs).toString();
            this.ss_fullwB.textContent = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.textContent = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.textContent = derived.BoostFullwBombs.toString();
            this.roc_fullwB.textContent = derived.RateOfClimbwBombs.toString();

            //Turn Bleed
            this.turnbleed_label.textContent = lu("Derived Turn Bleed wB");
            this.turnbleed_cell.textContent = StringFmt.Format("{0} ({1})", derived.TurnBleed, derived.TurnBleedwBombs);
        } else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.full_row.appendChild(this.vital_components);
            this.vital_components.rowSpan = 3;
            //Turn Bleed
            this.turnbleed_label.textContent = lu("Derived Turn Bleed");
            this.turnbleed_cell.textContent = StringFmt.Format("{0}", derived.TurnBleed);
        }

        this.dropoff_cell.textContent = derived.Dropoff.toString();
        this.overspeed_cell.textContent = derived.Overspeed.toString();
        this.maxfuel_cell.textContent = (Math.floor(1.0e-6 + derived.FuelUses * 10) / 10).toString();
        if (acft.GetIsFlammable())
            this.flammable_cell.textContent = lu("Yes");
        else
            this.flammable_cell.textContent = lu("No");

        this.stability_cell.textContent = derived.Stabiilty.toString();
        this.eloss_cell.textContent = derived.EnergyLoss.toString();
        //Turn bleed done in bomb mass section because affected by it.
        this.landing_cell.textContent = acft.GetGearName();
        this.maxalt_cell.textContent = acft.GetMinAltitude().toString() + "-" + acft.GetMaxAltitude().toString();

        this.reliability_cell.textContent = StringFmt.Join(", ", acft.GetReliabilityList());
        this.toughness_cell.textContent = derived.Toughness.toString();
        this.mxstrain_cell.textContent = derived.MaxStrain.toString();
        this.escape_cell.textContent = StringFmt.Join(", ", acft.GetEscapeList());
        this.crashsafety_cell.textContent = stats.crashsafety.toString();

        this.crew_cell.textContent = acft.GetCockpits().GetNumberOfCockpits().toString() + "/" + (acft.GetPassengers().GetSeats() + acft.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.textContent = this.Stress2Str(acft.GetStressList());
        this.visibility_cell.textContent = StringFmt.Join(", ", acft.GetVisibilityList());
        this.attack_cell.textContent = StringFmt.Join(", ", acft.GetAttackList());
        this.communications_cell.textContent = acft.GetCommunicationName();

        while (this.electric_cell.childElementCount > 0) {
            this.electric_cell.removeChild(this.electric_cell.firstChild);
        }
        const electrics = acft.GetElectrics();
        const elec_fs = CreateFlexSection(this.electric_cell);
        if (electrics.storage > 0) {
            FlexLabels(lu("Derived Battery"), electrics.storage.toString(), elec_fs);
        }
        for (let equip of electrics.equipment) {
            FlexLabels(equip.source, equip.charge, elec_fs);
        }

        const vital = "";
        const vlist = acft.VitalComponentList();
        for (let v of vlist) {
            vital += v + "<br/>";
        }
        this.vital_components.innerHTML = vital;

        const wlist = acft.GetWeapons().GetWeaponList();
        const dlist = acft.GetWeapons().GetDirectionList();
        const bombs = acft.GetMunitions().GetBombCount();
        const rockets = acft.GetMunitions().GetRocketCount();
        const internal = acft.GetMunitions().GetInternalBombCount();
        const weaphtml = "";
        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                weaphtml += lu(" Bomb Mass Internally.", int_bomb);
            if (ext_bomb > 0)
                weaphtml += lu(" Bomb Mass Externally.", ext_bomb);
            if (int_bomb > 0) {
                const mib = Math.min(int_bomb, acft.GetMunitions().GetMaxBombSize());
                weaphtml += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            weaphtml += "<br/>";
        }
        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                weaphtml += lu(" Rocket Mass Internally.", int_rock);
            if (ext_rock > 0)
                weaphtml += lu(" Rocket Mass Externally.", ext_rock);
            weaphtml += "<br/>";
        }

        for (let w of acft.GetWeapons().GetWeaponSets()) {
            weaphtml += WeaponString(w, wlist, dlist);
            weaphtml += "<br\>";
        }
        this.weapon_cell.innerHTML = weaphtml;

        stats.warnings.sort((a, b) => { return a.color - b.color });
        const warnhtml = "";
        for (let w of stats.warnings) {
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
        this.warning_cell.innerHTML = warnhtml;

        const description = "";
        const num_wings = acft.GetWings().GetWingList().length;
        if (num_wings == 1) {
            const deck = acft.GetWings().GetWingList()[0].deck;
            if (deck < WING_DECK.MID) {
                description += "High-Wing Monoplane ";
            } else if (deck == WING_DECK.MID) {
                description += "Mid-Wing Monoplane ";
            } else {
                description += "Low-Wing Monoplane ";
            }
        } else {
            const is_sesqui = acft.GetWings().GetIsSesquiplane().is;
            if (is_sesqui) {
                if (num_wings == 2)
                    description += "Sesquiplane ";
                else
                    description += "Sesqui-" + this.prefix(num_wings);
            } else if (acft.GetWings().GetTandem()) {
                if (num_wings == 2 && acft.GetWings().GetClosed())
                    description += "Annular Monoplane ";
                else
                    description += "Tandem " + this.prefix(num_wings);
            } else {
                description += this.prefix(num_wings);
            }
        }

        if (acft.GetFrames().GetFlyingWing()) {
            description += "Flying Wing ";
        } else if (acft.GetFrames().CanFlyingWing()) {
            description += "Lifting Body ";
        } else if (num_wings == 0) {
            description += "Falling Rock ";
        }
        this.desc_cell.textContent = description;
    }

    private prefix(num_wings: number): string {
        switch (num_wings) {
            case 0:
                return "";
            case 1:
                return "Monoplane ";
            case 2:
                return "Biplane ";
            case 3:
                return "Triplane ";
            case 4:
                return "Quadruplane ";
            case 5:
                return "Pentaplane ";
            case 6:
                return "Hexaplane ";
            case 7:
                return "Heptaplane ";
            case 8:
                return "Octoplane ";
            case 9:
                return "Nonaplane ";
            case 10:
                return "Decaplane ";
            case 11:
                return "Undecaplane ";
            case 12:
                return "Duodecaplane ";
            case 13:
                return "Tredecaplane ";
            case 14:
                return "Quattuordecaplane ";
            case 15:
                return "Quindecaplane ";
            case 16:
                return "Sexdecaplane ";
            case 17:
                return "Septendecaplane ";
            case 18:
                return "Octodecaplane ";
            case 19:
                return "Novendecaplane ";
            case 20:
                return "Vigintiplane ";
            default:
                return "Window Blinds ";
        }
    }

    public GetName() {
        return this.name_inp.value;
    }
    public SetName(name: string) {
        this.name_inp.value = name;
    }

    public SetShowBombs(set: boolean) {
        this.show_bombs = set;
    }

    private Stress2Str(arr: any[]) {
        const str = "";
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + "), ";
            } else {
                str += arr[i][0].toString() + ", ";
            }
        }
        if (arr.length > 0) {
            const i = arr.length - 1;
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + ")";
            } else {
                str += arr[i][0].toString();
            }
        }

        return str;
    }
}