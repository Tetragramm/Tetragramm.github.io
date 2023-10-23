import { StringFmt } from "../string";

import { Vehicle } from "../impl/Vehicle";

export class MachineryDisp {
    private vehicle: Vehicle;
    private locomotion: HTMLSelectElement;
    private pp_size: HTMLSelectElement;
    private update_type: boolean = true;
    private pp_type: HTMLSelectElement;
    private enlarged_engine: HTMLInputElement;
    private extra_fuel: HTMLInputElement;
    private front_armour: HTMLInputElement;
    private side_armour: HTMLInputElement;
    private rear_armour: HTMLInputElement;
    private prop_span: HTMLSpanElement;
    private propeller: HTMLInputElement;
    private amph_span: HTMLSpanElement;
    private amphibious: HTMLInputElement;
    private turret_span: HTMLSpanElement;
    private turret: HTMLInputElement;
    private s_cargo: HTMLInputElement;
    private m_cargo: HTMLInputElement;
    private l_cargo: HTMLInputElement;
    private h_cargo: HTMLInputElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;

        this.locomotion = document.getElementById("sel_loco") as HTMLSelectElement;
        for (let pp of this.vehicle.GetPropulsionList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = pp;
            opt.text = pp;
            this.locomotion.append(opt);
        }
        this.locomotion.onchange = () => { this.vehicle.SetPropulsion(this.locomotion.selectedIndex); };

        this.prop_span = document.getElementById("prop_span") as HTMLSpanElement;
        this.propeller = document.getElementById("inp_prop") as HTMLInputElement;
        this.propeller.onchange = () => { this.vehicle.SetPropeller(this.propeller.checked); };

        this.amph_span = document.getElementById("amph_span") as HTMLSpanElement;
        this.amphibious = document.getElementById("inp_amph") as HTMLInputElement;
        this.amphibious.onchange = () => { this.vehicle.SetAmphibious(this.amphibious.checked); };

        this.turret_span = document.getElementById("turret_span") as HTMLSpanElement;
        this.turret = document.getElementById("inp_turret") as HTMLInputElement;
        this.turret.onchange = () => { this.vehicle.SetTurretHull(this.turret.checked); };

        this.pp_type = document.getElementById("sel_pptype") as HTMLSelectElement;
        this.pp_type.onchange = () => { this.update_type = true; this.vehicle.SetPowerplant(this.pp_type.selectedIndex); };
        for (let pp of this.vehicle.GetPowerplantList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = pp.name;
            opt.text = pp.name;
            this.pp_type.append(opt);
        }

        this.pp_size = document.getElementById("sel_ppsize") as HTMLSelectElement;
        this.pp_size.onchange = () => { this.vehicle.SetPowerplantSize(this.pp_size.selectedIndex); };
        this.SetSizeSel();

        this.enlarged_engine = document.getElementById("inp_enlarge") as HTMLInputElement;
        this.enlarged_engine.min = "0";
        this.enlarged_engine.step = "1";
        this.enlarged_engine.onchange = () => { this.vehicle.SetEnlargeEngine(this.enlarged_engine.valueAsNumber); };

        this.extra_fuel = document.getElementById("inp_fuel") as HTMLInputElement;
        this.extra_fuel.min = "0";
        this.extra_fuel.step = "1";
        this.extra_fuel.onchange = () => { this.vehicle.SetExtraFuel(this.extra_fuel.valueAsNumber); };

        this.front_armour = document.getElementById("inp_farm") as HTMLInputElement;
        this.front_armour.min = "0";
        this.front_armour.step = "1";
        this.front_armour.onchange = () => { this.vehicle.SetArmourFront(this.front_armour.valueAsNumber); };

        this.side_armour = document.getElementById("inp_sarm") as HTMLInputElement;
        this.side_armour.min = "0";
        this.side_armour.step = "1";
        this.side_armour.onchange = () => { this.vehicle.SetArmourSide(this.side_armour.valueAsNumber); };

        this.rear_armour = document.getElementById("inp_rarm") as HTMLInputElement;
        this.rear_armour.min = "0";
        this.rear_armour.step = "1";
        this.rear_armour.onchange = () => { this.vehicle.SetArmourRear(this.rear_armour.valueAsNumber); };

        this.s_cargo = document.getElementById("inp_scargo") as HTMLInputElement;
        this.m_cargo = document.getElementById("inp_mcargo") as HTMLInputElement;
        this.l_cargo = document.getElementById("inp_lcargo") as HTMLInputElement;
        this.h_cargo = document.getElementById("inp_hcargo") as HTMLInputElement;
        this.s_cargo.min = "0";
        this.m_cargo.min = "0";
        this.l_cargo.min = "0";
        this.h_cargo.min = "0";
        this.s_cargo.step = "1";
        this.m_cargo.step = "1";
        this.l_cargo.step = "1";
        this.h_cargo.step = "1";
        this.s_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.m_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.l_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
        this.h_cargo.onchange = () => { this.vehicle.SetCargo(this.s_cargo.valueAsNumber, this.m_cargo.valueAsNumber, this.l_cargo.valueAsNumber, this.h_cargo.valueAsNumber); };
    }

    private SetSizeSel() {
        this.update_type = false;
        while (this.pp_size.options.length) {
            this.pp_size.options.remove(0);
        }
        for (let pps of this.vehicle.GetPowerplantSizeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = StringFmt.Format("{0}HP {1}", pps.HP, pps.name);
            opt.text = StringFmt.Format("{0}HP {1}", pps.HP, pps.name);
            this.pp_size.append(opt);
        }
    }

    public UpdateLocomotion() {
        let volume = this.vehicle.GetVolume();
        for (let opt of this.locomotion.options) {
            switch (opt.text) {
                case "Monowheel":
                case "Two-Wheeled":
                    if (volume > 1) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Three-Wheeled":
                case "Four-Wheeled":
                case "Six-Wheeled":
                case "Half-Track":
                case "Continuous Track":
                case "Crawler":
                case "Half-Walker":
                case "Walker":
                    if (volume > 8) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Skids":
                case "Skis":
                    if (volume > 6) {
                        opt.disabled = true;
                        continue;
                    }
                    break;
                case "Boat Hull":
                case "Cable Car":
                case "Sky-Line":
                case "Dorandisch Earthline":
                    break;
                default:
                    console.error("Unknonw Locomotion in MachineryDisp");
            }
            opt.disabled = false;
        }
    }

    public UpdateDisplay() {
        this.locomotion.selectedIndex = this.vehicle.GetPropulsionIdx();

        this.amph_span.hidden = !this.vehicle.CanAmphibious();
        this.prop_span.hidden = !this.vehicle.CanPropeller();
        this.turret_span.hidden = !this.vehicle.CanTurretHull();

        this.pp_type.selectedIndex = this.vehicle.GetPowerplantIdx();
        if (this.update_type) {
            this.SetSizeSel();
        }
        this.pp_size.selectedIndex = this.vehicle.GetPowerplantSizeIdx();

        this.enlarged_engine.valueAsNumber = this.vehicle.GetEnlargedEngine();
        this.extra_fuel.disabled = !this.vehicle.CanExtraFuel();
        this.extra_fuel.valueAsNumber = this.vehicle.GetExtraFuel();
        this.front_armour.valueAsNumber = this.vehicle.GetArmourFront();
        this.side_armour.valueAsNumber = this.vehicle.GetArmourSide();
        this.rear_armour.valueAsNumber = this.vehicle.GetArmourRear();

        let cargo = this.vehicle.GetCargo();
        this.s_cargo.valueAsNumber = cargo[1];
        this.m_cargo.valueAsNumber = cargo[2];
        this.l_cargo.valueAsNumber = cargo[3];
        this.h_cargo.valueAsNumber = cargo[4];
        this.UpdateLocomotion();
    }
}