import { Custom } from "../impl/Custom";
import { Stats, WARNING_COLOR } from "../impl/Stats";
import { Vehicle } from "../impl/Vehicle";
import { Weapon } from "../impl/Weapon";
import { CreateCheckbox, CreateFlexSection, CreateInput, CreateText, FlexInput, FlexSection, FlexSpace, FlexText } from "./Tools";

type PartLine = {
    span: FlexSection; cost: HTMLInputElement; upkeep: HTMLInputElement;
    speed: HTMLInputElement; torque: HTMLInputElement; handling: HTMLInputElement;
    integrity: HTMLInputElement; safety: HTMLInputElement; reliability: HTMLInputElement;
    fuel: HTMLInputElement; stress: HTMLInputElement; volume: HTMLInputElement;
    name: HTMLInputElement; warning: HTMLInputElement;
};

type WeaponLine = {
    span: HTMLSpanElement; name: HTMLInputElement;
    cost: HTMLInputElement; loader: HTMLInputElement;
    heavy: HTMLInputElement; artillery: HTMLInputElement;
};

export class CustomDisp {
    private vehicle: Vehicle;
    private custom: Custom;
    private div: HTMLDivElement;
    private count_weap: HTMLInputElement;
    private count_part: HTMLInputElement;
    private weap_lines: WeaponLine[] = [];
    private part_lines: PartLine[] = [];
    private br: HTMLBRElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.custom = veh.GetCustom();
        this.div = document.getElementById("div_alter") as HTMLDivElement;
        let count_span = CreateFlexSection(this.div);
        let fsL = CreateFlexSection(count_span.div1);
        let fsR = CreateFlexSection(count_span.div2);
        this.count_weap = document.createElement("INPUT") as HTMLInputElement;
        this.count_part = document.createElement("INPUT") as HTMLInputElement;
        this.br = document.createElement("BR") as HTMLBRElement;
        this.div.append(this.br);

        FlexInput("Number of Weapons: ", this.count_weap, fsL);
        FlexInput("Number of Parts: ", this.count_part, fsR);
        this.count_part.onchange = () => {
            while (this.custom.GetParts().length > this.count_part.valueAsNumber) {
                this.custom.RemovePart();
            }
            while (this.custom.GetParts().length < this.count_part.valueAsNumber) {
                this.custom.AddPart();
            }
            this.vehicle.CalculateStats();
        };
        this.count_weap.onchange = () => {
            while (this.custom.GetWeapons().length > this.count_weap.valueAsNumber) {
                this.custom.RemoveWeapon();
            }
            while (this.custom.GetWeapons().length < this.count_weap.valueAsNumber) {
                this.custom.AddWeapon();
            }
            this.vehicle.CalculateStats();
        };
    }

    public UpdateDisplay() {
        let parts = this.custom.GetParts();
        while (this.part_lines.length > parts.length) {
            let line = this.part_lines.pop();
            line.span.div0.remove();
        }
        while (this.part_lines.length < parts.length) {
            this.part_lines.push(this.CreatePartLine(this.part_lines.length));
        }
        for (let idx = 0; idx < parts.length; idx++) {
            this.UpdatePartLine(this.part_lines[idx], parts[idx]);
        }

        let weapons = this.custom.GetWeapons();
        while (this.weap_lines.length > weapons.length) {
            let line = this.weap_lines.pop();
            line.span.remove();
        }
        while (this.weap_lines.length < weapons.length) {
            this.weap_lines.push(this.CreateWeaponLine(this.weap_lines.length));
        }
        for (let idx = 0; idx < weapons.length; idx++) {
            this.UpdateWeaponLine(this.weap_lines[idx], weapons[idx]);
        }

        this.count_part.valueAsNumber = this.part_lines.length;
        this.count_weap.valueAsNumber = this.weap_lines.length;
    }

    private CreatePartLine(idx: number): PartLine {
        let line = {
            span: CreateFlexSection(),
            cost: document.createElement("INPUT") as HTMLInputElement,
            upkeep: document.createElement("INPUT") as HTMLInputElement,
            speed: document.createElement("INPUT") as HTMLInputElement,
            torque: document.createElement("INPUT") as HTMLInputElement,
            handling: document.createElement("INPUT") as HTMLInputElement,
            integrity: document.createElement("INPUT") as HTMLInputElement,
            safety: document.createElement("INPUT") as HTMLInputElement,
            reliability: document.createElement("INPUT") as HTMLInputElement,
            fuel: document.createElement("INPUT") as HTMLInputElement,
            stress: document.createElement("INPUT") as HTMLInputElement,
            volume: document.createElement("INPUT") as HTMLInputElement,
            name: document.createElement("INPUT") as HTMLInputElement,
            warning: document.createElement("INPUT") as HTMLInputElement,
        };

        let left = CreateFlexSection(line.span.div1);
        let right = CreateFlexSection(line.span.div2);
        FlexText("Name:", line.name, left);
        FlexText("Special Rules:", line.warning, right);

        let A = CreateFlexSection(left.div1);
        let B = CreateFlexSection(left.div2);
        let C = CreateFlexSection(right.div1);
        let D = CreateFlexSection(right.div2);
        FlexInput("Cost:", line.cost, A);
        FlexInput("Upkeep:", line.upkeep, B);
        FlexInput("Speed:", line.speed, C);
        FlexInput("Torque:", line.torque, D);
        FlexInput("Handling:", line.handling, A);
        FlexInput("Integrity:", line.integrity, B);
        FlexInput("Safety:", line.safety, C);
        FlexInput("Reliability:", line.reliability, D);
        FlexInput("Fuel:", line.fuel, A);
        FlexInput("Stress:", line.stress, B);
        FlexInput("Volume:", line.volume, C);
        FlexSpace(D);
        line.cost.min = "";
        line.upkeep.min = "";
        line.speed.min = "";
        line.torque.min = "";
        line.handling.min = "";
        line.integrity.min = "";
        line.safety.min = "";
        line.reliability.min = "";
        line.fuel.min = "";
        line.stress.min = "";
        line.volume.min = "";
        let oc = () => {
            this.custom.SetPart(idx, line.name.value, new Stats({
                cost: line.cost.valueAsNumber,
                upkeep: line.upkeep.valueAsNumber,
                speed: line.speed.valueAsNumber,
                torque: line.torque.valueAsNumber,
                handling: line.handling.valueAsNumber,
                integrity: line.integrity.valueAsNumber,
                safety: line.safety.valueAsNumber,
                reliability: line.reliability.valueAsNumber,
                fuel: line.fuel.valueAsNumber,
                stress: line.stress.valueAsNumber,
                volume: line.volume.valueAsNumber,
                warnings: [{ source: line.name.value, warning: line.warning.value, color: WARNING_COLOR.YELLOW }],
            }));
            this.vehicle.CalculateStats();
        };
        line.name.onchange = oc;
        line.warning.onchange = oc;
        line.cost.onchange = oc;
        line.upkeep.onchange = oc;
        line.speed.onchange = oc;
        line.torque.onchange = oc;
        line.handling.onchange = oc;
        line.integrity.onchange = oc;
        line.safety.onchange = oc;
        line.reliability.onchange = oc;
        line.fuel.onchange = oc;
        line.stress.onchange = oc;
        line.volume.onchange = oc;

        this.br.insertAdjacentElement("beforebegin", line.span.div0);
        return line;
    }

    private UpdatePartLine(line: PartLine, part: { name: string, stats: Stats }) {
        line.name.value = part.name;
        line.warning.value = part.stats.warnings[0].warning;
        line.cost.valueAsNumber = part.stats.cost;
        line.upkeep.valueAsNumber = part.stats.upkeep;
        line.speed.valueAsNumber = part.stats.speed;
        line.torque.valueAsNumber = part.stats.torque;
        line.handling.valueAsNumber = part.stats.handling;
        line.integrity.valueAsNumber = part.stats.integrity;
        line.safety.valueAsNumber = part.stats.safety;
        line.reliability.valueAsNumber = part.stats.reliability;
        line.fuel.valueAsNumber = part.stats.fuel;
        line.stress.valueAsNumber = part.stats.stress;
        line.volume.valueAsNumber = part.stats.volume;
    }

    private CreateWeaponLine(idx: number): WeaponLine {
        let line = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            name: document.createElement("INPUT") as HTMLInputElement,
            cost: document.createElement("INPUT") as HTMLInputElement,
            loader: document.createElement("INPUT") as HTMLInputElement,
            heavy: document.createElement("INPUT") as HTMLInputElement,
            artillery: document.createElement("INPUT") as HTMLInputElement,
        }
        CreateText("Name:", line.name, line.span, false);
        CreateInput("Cost:", line.cost, line.span, false);
        CreateCheckbox("Loader:", line.loader, line.span, false);
        CreateCheckbox("Artillery:", line.artillery, line.span, false);
        CreateInput("Heavy:", line.heavy, line.span, true);
        let oc = () => {
            this.custom.SetWeapon(idx, line.name.value, line.cost.valueAsNumber, line.loader.checked, line.heavy.valueAsNumber, line.artillery.checked);
            this.vehicle.CalculateStats();
        };
        line.name.onchange = oc;
        line.cost.onchange = oc;
        line.loader.onchange = oc;
        line.artillery.onchange = oc;
        line.heavy.onchange = oc;

        this.div.append(line.span);
        return line;
    }

    private UpdateWeaponLine(line: WeaponLine, weap: Weapon) {
        line.name.value = weap.name;
        line.cost.valueAsNumber = weap.cost;
        line.loader.checked = weap.loader;
        line.artillery.checked = weap.artillery;
        line.heavy.valueAsNumber = weap.heavy;
        //All Artillery is Loader
        line.loader.disabled = weap.artillery;
        line.heavy.disabled = !weap.artillery;
    }

}