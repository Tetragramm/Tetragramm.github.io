import { CreateLabel } from "./Tools";

import { CrewType, Loader, Crew } from "../impl/Crew";
import { Vehicle } from "../impl/Vehicle";

export class CrewDisp {
    private vehicle: Vehicle;
    private crewdiv: HTMLDivElement;
    private datalist: HTMLDataListElement;
    private crewline: {
        span: HTMLSpanElement,
        rem: HTMLButtonElement, add: HTMLButtonElement,
        name_span: HTMLSpanElement, name: HTMLInputElement,
        enc_span: HTMLSpanElement, enclosed: HTMLInputElement, coup_span: HTMLSpanElement,
        cupola: HTMLInputElement, seal_span: HTMLSpanElement, seal: HTMLInputElement,
        load_span: HTMLSpanElement, has_loader: HTMLInputElement, loop_front: HTMLInputElement,
        loop_left: HTMLInputElement, loop_right: HTMLInputElement, loop_back: HTMLInputElement,
        num_mounts: HTMLInputElement, br: HTMLBRElement,
        loader: {
            span: HTMLSpanElement, enc_span: HTMLSpanElement,
            enclosed: HTMLInputElement, coup_span: HTMLSpanElement,
            cupola: HTMLInputElement, seal_span: HTMLSpanElement,
            seal: HTMLInputElement, loop_front: HTMLInputElement,
            loop_left: HTMLInputElement, loop_right: HTMLInputElement, loop_back: HTMLInputElement,
            br: HTMLBRElement
        }[]
    }[] = [];
    private lastline: HTMLSelectElement;

    constructor(veh: Vehicle) {
        this.vehicle = veh;
        this.crewdiv = document.getElementById("div_crew") as HTMLDivElement;
        this.datalist = document.createElement("DATALIST") as HTMLDataListElement;
        for (let n of CrewType) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = n.name;
            opt.text = n.name;
            this.datalist.append(opt);
        }
        this.datalist.id = "Crew_DataList";
        this.crewdiv.append(this.datalist);
        this.lastline = document.createElement("SELECT") as HTMLSelectElement;
        for (let n of CrewType) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.value = n.name;
            opt.text = n.name;
            this.lastline.append(opt);
        }
        this.lastline.onchange = () => {
            this.vehicle.SetCrew(this.vehicle.GetCrewList().length, new Crew(
                this.lastline.options[this.lastline.selectedIndex].text,
                false, false, false, false, false, false, false, [], []));
        };
    }

    public UpdateDisplay() {
        this.lastline.remove();
        var list = this.vehicle.GetCrewList();
        while (list.length > this.crewline.length) {
            let idx = this.crewline.length;
            this.crewline.push(this.CreateLine(idx));
        }
        while (this.crewline.length > list.length) {
            let line = this.crewline.pop();
            line.span.remove();
            line.br.remove();
            for (let ldr of line.loader) {
                ldr.span.remove();
                ldr.br.remove();
            }
        }

        for (let idx = 0; idx < list.length; idx++) {
            let line = this.crewline[idx];
            let crew = list[idx];

            while (crew.loaders.length > line.loader.length) {
                let loader_idx = line.loader.length;
                let ldr = this.CreateLoader(idx, loader_idx);
                if (line.loader.length == 0) {
                    line.br.insertAdjacentElement("afterend", ldr.span);
                    ldr.span.insertAdjacentElement("afterend", ldr.br);
                } else {
                    line.loader[line.loader.length - 1].br.insertAdjacentElement("afterend", ldr.span);
                    ldr.span.insertAdjacentElement("afterend", ldr.br);
                }
                line.loader.push(ldr);
            }
            while (line.loader.length > crew.loaders.length) {
                let ldr = line.loader.pop();
                ldr.span.remove();
                ldr.br.remove();
            }

            line.name_span.hidden = false;
            line.name.value = crew.name_txt;
            line.enclosed.checked = crew.enclosed;
            if (crew.enclosed && this.vehicle.SumArmour() > 0) {
                line.coup_span.hidden = false;
                line.cupola.checked = crew.cupola;
            } else {
                line.coup_span.hidden = true;
            }
            if (crew.enclosed) {
                line.seal_span.hidden = false;
                line.seal.checked = crew.sealed;
            } else {
                line.seal_span.hidden = true;
            }
            line.loop_front.checked = crew.loop_front;
            line.loop_left.checked = crew.loop_left;
            line.loop_right.checked = crew.loop_right;
            line.loop_back.checked = crew.loop_back;
            line.num_mounts.valueAsNumber = crew.weapon_mounts.length;
            if (crew.GetNumLoaders() == 0) {
                line.has_loader.disabled = true;
            } else {
                line.has_loader.disabled = false;
            }
            if (crew.weapon_mounts.length != 0) {
                line.load_span.hidden = false;
                line.has_loader.valueAsNumber = crew.loaders.length;
                for (let idx = 0; idx < crew.loaders.length; idx++) {
                    line.loader[idx].span.hidden = false;
                    line.loader[idx].br.hidden = false;
                    line.loader[idx].enclosed.checked = crew.loaders[idx].enclosed;
                    if (crew.loaders[idx].enclosed) {
                        line.loader[idx].coup_span.hidden = false;
                        line.loader[idx].seal_span.hidden = false;
                        line.loader[idx].cupola.checked = crew.loaders[idx].cupola;
                        line.loader[idx].seal.checked = crew.loaders[idx].sealed;
                        line.loader[idx].loop_front.checked = crew.loaders[idx].loop_front;
                        line.loader[idx].loop_left.checked = crew.loaders[idx].loop_left;
                        line.loader[idx].loop_right.checked = crew.loaders[idx].loop_right;
                        line.loader[idx].loop_back.checked = crew.loaders[idx].loop_back;
                    } else {
                        line.loader[idx].coup_span.hidden = true;
                        line.loader[idx].seal_span.hidden = true;
                    }
                }
            } else {
                line.load_span.hidden = true;
            }
        }
        this.crewdiv.append(this.lastline);
        this.lastline.selectedIndex = 0;
    }

    private CreateLoader(crew_idx: number, idx: number) {
        let line = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            enc_span: undefined,
            enclosed: document.createElement("INPUT") as HTMLInputElement,
            coup_span: undefined,
            cupola: document.createElement("INPUT") as HTMLInputElement,
            seal_span: undefined,
            seal: document.createElement("INPUT") as HTMLInputElement,
            loop_front: document.createElement("INPUT") as HTMLInputElement,
            loop_left: document.createElement("INPUT") as HTMLInputElement,
            loop_right: document.createElement("INPUT") as HTMLInputElement,
            loop_back: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement,
        };

        line.enc_span = CreateLabel("\u00A0\u00A0Enclosed:", line.enclosed);
        line.coup_span = CreateLabel("\u00A0\u00A0Cupola/Hatch:", line.cupola);
        line.seal_span = CreateLabel("\u00A0Sealed:", line.seal);
        let name = document.createElement("LABEL") as HTMLLabelElement;
        name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Loader&nbsp;";
        let loop_span = CreateLabel("\u00A0\u00A0Loopholes F/L/R/B:", line.loop_front);
        loop_span.append(line.loop_left);
        loop_span.append(line.loop_right);
        loop_span.append(line.loop_back);
        line.span.append(name);
        line.span.append(line.enc_span);
        line.span.append(line.coup_span);
        line.span.append(line.seal_span);
        line.span.append(loop_span);
        line.enclosed.type = "checkbox";
        line.cupola.type = "checkbox";
        line.seal.type = "checkbox";
        line.loop_front.type = "checkbox";
        line.loop_left.type = "checkbox";
        line.loop_right.type = "checkbox";
        line.loop_back.type = "checkbox";
        let oc = () => {
            this.vehicle.SetLoader(crew_idx, idx,
                new Loader(line.enclosed.checked, line.cupola.checked, line.seal.checked,
                    line.loop_front.checked, line.loop_left.checked, line.loop_right.checked, line.loop_back.checked));
        };
        line.enclosed.onchange = oc;
        line.cupola.onchange = oc;
        line.seal.onchange = oc;
        line.loop_front.onchange = oc;
        line.loop_left.onchange = oc;
        line.loop_right.onchange = oc;
        line.loop_back.onchange = oc;
        return line;
    }

    private CreateLine(idx: number) {
        let line = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            name_span: undefined,
            rem: document.createElement("BUTTON") as HTMLButtonElement,
            add: document.createElement("BUTTON") as HTMLButtonElement,
            name: document.createElement("INPUT") as HTMLInputElement,
            enc_span: undefined,
            enclosed: document.createElement("INPUT") as HTMLInputElement,
            coup_span: undefined,
            cupola: document.createElement("INPUT") as HTMLInputElement,
            seal_span: undefined,
            seal: document.createElement("INPUT") as HTMLInputElement,
            loop_front: document.createElement("INPUT") as HTMLInputElement,
            loop_left: document.createElement("INPUT") as HTMLInputElement,
            loop_right: document.createElement("INPUT") as HTMLInputElement,
            loop_back: document.createElement("INPUT") as HTMLInputElement,
            num_mounts: document.createElement("INPUT") as HTMLInputElement,
            load_span: undefined,
            has_loader: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement,
            loader: []
        };
        line.name_span = CreateLabel("\u00A0\u00A0Name:", line.name);
        line.name.setAttribute("list", this.datalist.id);
        line.rem.textContent = "-";
        line.rem.onclick = () => { this.vehicle.DeleteCrew(idx); };
        line.add.textContent = "+";
        line.add.onclick = () => { this.vehicle.DuplicateCrew(idx); };
        if (idx == 0) {
            line.rem.disabled = true;
            line.add.disabled = true;
        }
        line.name_span.insertAdjacentElement("afterbegin", line.add);
        line.name_span.insertAdjacentElement("afterbegin", line.rem);
        line.enc_span = CreateLabel("\u00A0\u00A0Enclosed:", line.enclosed);
        line.coup_span = CreateLabel("\u00A0\u00A0Hatch:", line.cupola);
        line.seal_span = CreateLabel("\u00A0\u00A0Sealed:", line.seal);
        let mount_span = CreateLabel("\u00A0\u00A0#Weapon Mounts:", line.num_mounts);
        line.load_span = CreateLabel("\u00A0\u00A0#Loaders:", line.has_loader);
        let loop_span = CreateLabel("\u00A0\u00A0Loopholes F/L/R/B:", line.loop_front);
        loop_span.append(line.loop_left);
        loop_span.append(line.loop_right);
        loop_span.append(line.loop_back);
        line.span.append(line.name_span);
        line.span.append(line.enc_span);
        line.span.append(line.coup_span);
        line.span.append(line.seal_span);
        line.span.append(loop_span);
        line.span.append(mount_span);
        line.span.append(line.load_span);
        line.name.type = "text";
        line.enclosed.type = "checkbox";
        line.cupola.type = "checkbox";
        line.seal.type = "checkbox";
        line.loop_front.type = "checkbox";
        line.loop_left.type = "checkbox";
        line.loop_right.type = "checkbox";
        line.loop_back.type = "checkbox";
        line.num_mounts.type = "number";
        line.num_mounts.min = "0";
        line.num_mounts.step = "1";
        line.has_loader.type = "number";
        line.has_loader.step = "1";
        line.has_loader.min = "0";
        let oc = () => {
            this.vehicle.SetCrew(idx, new Crew(line.name.value, line.enclosed.checked,
                line.cupola.checked, line.seal.checked,
                line.loop_front.checked, line.loop_left.checked, line.loop_right.checked, line.loop_back.checked, undefined, undefined));
        };
        let setnum = () => { this.vehicle.SetNumLoaders(idx, line.has_loader.valueAsNumber); };
        let setwep = () => { this.vehicle.SetNumWeapons(idx, line.num_mounts.valueAsNumber); };
        line.name.onchange = oc;
        line.enclosed.onchange = oc;
        line.cupola.onchange = oc;
        line.seal.onchange = oc;
        line.loop_front.onchange = oc;
        line.loop_left.onchange = oc;
        line.loop_right.onchange = oc;
        line.loop_back.onchange = oc;
        line.num_mounts.onchange = setwep;
        line.has_loader.onchange = setnum;
        this.crewdiv.append(line.span);
        this.crewdiv.append(line.br);
        return line;
    }
}