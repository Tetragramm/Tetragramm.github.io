import { Accessories } from "../impl/Accessories";
import { Vehicle } from "../impl/Vehicle";
import { CreateFlexSection, FlexCheckbox, FlexSpace } from "./Tools";

export class AccessoriesDisp {
    private vehicle: Vehicle;
    private accessories: Accessories;
    private extra_armour: HTMLInputElement;
    private wooden_armour: HTMLInputElement;
    private cruise_control: HTMLInputElement;
    private intercom: HTMLInputElement;
    private wireless: HTMLInputElement;
    private temp_control: HTMLInputElement;
    private gas_filters: HTMLInputElement;
    private dozer_blades: HTMLInputElement;
    private wire_cutters: HTMLInputElement;
    private clockwerk_missile: HTMLInputElement;
    private smokescreen: HTMLInputElement;
    private camouflage: HTMLInputElement;
    private steering_trailer: HTMLInputElement;
    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.accessories = veh.GetAccessories();
        let div = document.getElementById("div_accessories") as HTMLDivElement;
        let fs = CreateFlexSection(div);
        let left = CreateFlexSection(fs.div1);
        let right = CreateFlexSection(fs.div2);
        this.extra_armour = document.createElement("INPUT") as HTMLInputElement;
        this.extra_armour.onchange = () => { this.accessories.extra_armour = this.extra_armour.checked; this.vehicle.CalculateStats(); };
        this.wooden_armour = document.createElement("INPUT") as HTMLInputElement;
        this.wooden_armour.onchange = () => { this.accessories.wooden_armour = this.wooden_armour.checked; this.vehicle.CalculateStats(); };
        this.cruise_control = document.createElement("INPUT") as HTMLInputElement;
        this.cruise_control.onchange = () => { this.accessories.cruise_control = this.cruise_control.checked; this.vehicle.CalculateStats(); };
        this.intercom = document.createElement("INPUT") as HTMLInputElement;
        this.intercom.onchange = () => { this.accessories.intercom = this.intercom.checked; this.vehicle.CalculateStats(); };
        this.wireless = document.createElement("INPUT") as HTMLInputElement;
        this.wireless.onchange = () => { this.accessories.wireless = this.wireless.checked; this.vehicle.CalculateStats(); };
        this.temp_control = document.createElement("INPUT") as HTMLInputElement;
        this.temp_control.onchange = () => { this.accessories.temp_control = this.temp_control.checked; this.vehicle.CalculateStats(); };
        this.gas_filters = document.createElement("INPUT") as HTMLInputElement;
        this.gas_filters.onchange = () => { this.accessories.gas_filters = this.gas_filters.checked; this.vehicle.CalculateStats(); };
        this.dozer_blades = document.createElement("INPUT") as HTMLInputElement;
        this.dozer_blades.onchange = () => { this.accessories.dozer_blades = this.dozer_blades.checked; this.vehicle.CalculateStats(); };
        this.wire_cutters = document.createElement("INPUT") as HTMLInputElement;
        this.wire_cutters.onchange = () => { this.accessories.wire_cutters = this.wire_cutters.checked; this.vehicle.CalculateStats(); };
        this.clockwerk_missile = document.createElement("INPUT") as HTMLInputElement;
        this.clockwerk_missile.onchange = () => { this.accessories.clockwerk_missile = this.clockwerk_missile.checked; this.vehicle.CalculateStats(); };
        this.smokescreen = document.createElement("INPUT") as HTMLInputElement;
        this.smokescreen.onchange = () => { this.accessories.smokescreen = this.smokescreen.checked; this.vehicle.CalculateStats(); };
        this.camouflage = document.createElement("INPUT") as HTMLInputElement;
        this.camouflage.onchange = () => { this.accessories.camouflage = this.camouflage.checked; this.vehicle.CalculateStats(); };
        this.steering_trailer = document.createElement("INPUT") as HTMLInputElement;
        this.steering_trailer.onchange = () => { this.accessories.steering_trailer = this.steering_trailer.checked; this.vehicle.CalculateStats(); };
        FlexCheckbox("Extra Armour", this.extra_armour, left);
        FlexCheckbox("Wooden Spaced Armour", this.wooden_armour, right);
        FlexCheckbox("Cruise Control", this.cruise_control, left);
        FlexCheckbox("Temperature Control", this.temp_control, right);
        FlexCheckbox("Intercom", this.intercom, left);
        FlexCheckbox("Wireless", this.wireless, right);
        FlexCheckbox("Gas Filters", this.gas_filters, left);
        FlexCheckbox("Dozer Blades", this.dozer_blades, right);
        FlexCheckbox("Wire Cutters", this.wire_cutters, left);
        FlexCheckbox("Steering Trailer", this.steering_trailer, right);
        FlexCheckbox("Smokescreen", this.smokescreen, left);
        FlexCheckbox("Camouflage", this.camouflage, right);
        FlexCheckbox("Clockwerk Missile Rail", this.clockwerk_missile, left);
        FlexSpace(right);
    }

    public UpdateDisplay() {
        this.extra_armour.checked = this.accessories.extra_armour;
        this.wooden_armour.checked = this.accessories.wooden_armour;
        this.cruise_control.checked = this.accessories.cruise_control;
        this.intercom.checked = this.accessories.intercom;
        this.wireless.checked = this.accessories.wireless;
        this.temp_control.checked = this.accessories.temp_control;
        this.gas_filters.checked = this.accessories.gas_filters;
        this.dozer_blades.checked = this.accessories.dozer_blades;
        this.wire_cutters.checked = this.accessories.wire_cutters;
        this.clockwerk_missile.checked = this.accessories.clockwerk_missile;
        this.smokescreen.checked = this.accessories.smokescreen;
        this.camouflage.checked = this.accessories.camouflage;
        this.steering_trailer.checked = this.accessories.steering_trailer;
        if (this.accessories.is_enclosed) {
            this.gas_filters.disabled = false;
            this.temp_control.disabled = false;
        } else {
            this.gas_filters.disabled = true;
            this.temp_control.disabled = true;
        }
    }
}