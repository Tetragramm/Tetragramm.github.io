/// <reference path="../impl/Aircraft.ts" />
/// <reference path="../disp/Tools.ts" />
/// <reference path="../disp/Derived.ts" />
/// <reference path="../lz/lz-string.ts" />
/// <reference path="../string/index.ts" />
/// <reference path="../scroll/scroll.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");

    var jsons = ['/Helicopter/strings.json', '/Helicopter/parts.json', '/Helicopter/engines.json', '/Helicopter/weapons.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(
            resp => {
                var string_JSON = resp[0];
                parts_JSON = resp[1];
                engine_JSON = resp[2];
                weapon_JSON = resp[3];
                //Strings bit
                local = new Localization(string_JSON);
                if (lang) {
                    local.SetLanguages(lang);
                } else if (window.localStorage.language) {
                    local.SetLanguages(window.localStorage.language);
                }

                //Engine bit
                var nameliststr = window.localStorage.getItem("engines_names");
                var namelist = [];
                if (nameliststr) {
                    namelist = JSON.parse(nameliststr);
                    for (let n of namelist) {
                        engine_list.set(n, new EngineList(n));
                    }
                }


                for (let el of engine_JSON["lists"]) {
                    if (!engine_list.has(el["name"]))
                        engine_list.set(el["name"], new EngineList(el["name"]));
                    if (el["name"] != "Custom") {
                        engine_list.get(el["name"]).fromJSON(el, true);
                        engine_list.get(el["name"]).SetConstant();
                    } else {
                        engine_list.get(el["name"]).fromJSON(el, false);
                    }
                }

                InitHTML();
                InitStats();
                LoadFromHangar(0);
            }
        );
};
window.addEventListener("DOMContentLoaded", init);

var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;
var acft_builder: Aircraft;
var stats_builder: Derived_HTML;
var acft_hangar: Aircraft;
var stats_hangar: Derived_HTML;

var name_builder: HTMLInputElement;
var select_hangar: HTMLSelectElement;
var select_acft: HTMLSelectElement;
var chosen_hangar: string;

var list_create: HTMLButtonElement;
var list_delete: HTMLButtonElement;
var list_input: HTMLInputElement;

var parts_JSON: JSON;
var engine_JSON: JSON;
var weapon_JSON: JSON;
var enable_anim = false;

function InitHTML() {
    chosen_hangar = "Default";
    select_hangar = document.createElement("SELECT") as HTMLSelectElement;
    select_hangar.onchange = () => {
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
    };
    RefreshHangarSelect(LoadHangarList());

    select_acft = document.createElement("SELECT") as HTMLSelectElement;
    select_acft.onchange = () => { LoadFromHangar(select_acft.selectedIndex); };
    RefreshAcftSelect(LoadAcftList());

    name_builder = document.createElement("INPUT") as HTMLInputElement;

    var load_btn = document.getElementById("btn_load") as HTMLButtonElement;
    load_btn.onclick = () => {
        acft_builder.fromJSON(JSON.parse(JSON.stringify(acft_hangar.toJSON())));
        acft_builder.CalculateStats();
        stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());
        window.localStorage.aircraft = JSON.stringify(acft_builder.toJSON());
        RefreshDisplay();
        BlinkNeutral(load_btn.parentElement);
    };

    var save_btn = document.getElementById("btn_save") as HTMLButtonElement;
    save_btn.onclick = () => {
        acft_builder.name = name_builder.value;
        AddToHangar(acft_builder);
        BlinkNeutral(save_btn.parentElement);
    };

    var json_btn = document.getElementById("btn_json") as HTMLInputElement;
    json_btn.multiple = false;
    json_btn.accept = "application/JSON";
    json_btn.onchange = (evt) => {
        LoadJSON(json_btn);
        BlinkNeutral(json_btn.parentElement);
    };

    var remove_btn = document.getElementById("btn_remove") as HTMLButtonElement;
    remove_btn.onclick = () => {
        RemoveFromHangar(acft_hangar.name);
        BlinkNeutral(remove_btn.parentElement);
    };

    var hangar_save = document.getElementById("btn_save_h") as HTMLButtonElement;
    hangar_save.onclick = () => {
        download(JSON.stringify(LoadAcftList()), chosen_hangar + ".json", "json");
        BlinkNeutral(hangar_save.parentElement);
    };

    var hangar_load = document.getElementById("btn_json_h") as HTMLInputElement;
    hangar_load.setAttribute("type", "file");
    hangar_load.multiple = false;
    hangar_load.accept = "application/JSON";
    hangar_load.onchange = (evt) => {
        if (hangar_load.files.length == 0)
            return;
        BlinkNeutral(hangar_load.parentElement);
        var file = hangar_load.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            try {
                var name = file.name.substr(0, file.name.length - 5);
                name = name.trim();
                name = name.replace(/\s+/g, ' ');
                var acft_list: { names: string[], acft: string[] };
                acft_list = JSON.parse(reader.result as string);
                if (acft_list.names.length != acft_list.acft.length) {
                    throw "Bad";
                }
                AddHangar(name);
                window.localStorage.setItem("hangar." + name, reader.result as string);
                chosen_hangar = name;
                RefreshHangarSelect(LoadHangarList());
                RefreshAcftSelect(LoadAcftList());
            } catch { BlinkBad(hangar_load.parentElement); }
        };
        reader.readAsText(file);
        hangar_load.value = "";
    };

    var list_create = document.getElementById("lbl_create_list") as HTMLLabelElement;
    var list_input = document.getElementById("btn_create_list") as HTMLInputElement;
    list_create.onclick = () => {
        var n = list_input.value;
        n = n.trim();
        n = n.replace(/\s+/g, ' ');
        if (n != "") {
            select_hangar.selectedIndex = AddHangar(n);
            chosen_hangar = n;
            RefreshAcftSelect(LoadAcftList());
            BlinkNeutral(list_create.parentElement);
        }
        list_input.value = "";
    };

    var list_delete = document.getElementById("btn_delete_list") as HTMLButtonElement;
    list_delete.onclick = () => {
        RemoveHangar(chosen_hangar);
        BlinkNeutral(list_delete.parentElement);
    }
}

function InitStats() {
    let acft_data = window.localStorage.aircraft;
    acft_builder = new Aircraft(parts_JSON, weapon_JSON, false);
    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder.fromJSON(JSON.parse(acft_data));
            acft_builder.CalculateStats();
        } catch { console.log("Saved Data Failed."); acft_builder.Reset(); }
    }
    stats_builder = new Derived_HTML(document.getElementById("table_builder") as HTMLTableElement);
    stats_builder.SetShowBombs(true);
    stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());

    acft_hangar = new Aircraft(parts_JSON, weapon_JSON, false);
    stats_hangar = new Derived_HTML(document.getElementById("table_hangar") as HTMLTableElement);
    stats_hangar.SetShowBombs(true);
}

function LoadHangarList() {
    var hangar_list: string[];
    if (!window.localStorage.getItem("hangar_names")) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
    }
    hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    if (hangar_list.length == 0) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
        hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    }
    return hangar_list;
}

function LoadAcftList() {
    var acft_list: { names: string[], acft: string[] };
    if (window.localStorage.getItem("hangar." + chosen_hangar)) {
        acft_list = JSON.parse(window.localStorage.getItem("hangar." + chosen_hangar));
    } else {
        acft_list = {
            names: ["Basic Biplane"],
            acft: ["AAEAjGB0DMwLACECGBnAlgYwAQLQBwBskA7AU2AEBLgaAwGhmgUEZpFY+oHQAlACwD2xJFgCyAgC4CATgCMkAVywAtCFgAcABj55gAJGABcYACAaVVuwAQDdpw4B-h8BsAoex8+9BwsZJnySqpgGtq6NGYUAIKQAGaxAAIACQwAkJQA-AABNNm5OfZ2jE6eZhxlAMCeHmXVtdS1NjYeTRxVbKwW1J7tNOld1WmDnCweVBbsA8OsvS7TtnUMs0XzY8AVVLRT1BRde6sHDEA"]
        };
        window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    }
    return acft_list;
}

function LoadFromHangar(idx: number) {
    var acft_list = LoadAcftList();
    try {
        var str = LZString.decompressFromEncodedURIComponent(acft_list.acft[idx]);
        var arr = _stringToArrayBuffer(str);
        var des = new Deserialize(arr);
        acft_hangar.deserialize(des);
        acft_hangar.CalculateStats();
    } catch (e) { console.log("Compressed Query Parameter Failed."); console.log(e); acft_hangar.Reset(); }

    stats_hangar.UpdateDisplay(acft_hangar, acft_hangar.GetStats(), acft_hangar.GetDerivedStats());
    select_acft.selectedIndex = idx;
    RefreshDisplay();
}

function AddHangar(hangar: string) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == hangar);
    if (idx == -1) {
        hangar_list.push(hangar);
        idx = hangar_list.length - 1;
        SaveHangarList(hangar_list);
    }
    return idx;
}

function AddToHangar(acft: Aircraft) {
    var s = new Serialize();
    acft.serialize(s);
    var arr = s.FinalArray();
    var str2 = _arrayBufferToString(arr);
    var data = LZString.compressToEncodedURIComponent(str2);
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == acft.name);
    if (idx == -1) {
        acft_list.names.push(acft.name);
        acft_list.acft.push(data);
        idx = acft_list.names.length - 1;
    } else {
        acft_list.acft[idx] = data;
    }
    SaveAcftList(acft_list);

    return idx;
}

function RemoveHangar(name: string) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == name);
    if (idx != -1) {
        hangar_list.splice(idx, 1);
        window.localStorage.removeItem("hangar." + name);
    }
    SaveHangarList(hangar_list);
    chosen_hangar = "Default";
    RefreshHangarSelect(LoadHangarList());
    RefreshAcftSelect(LoadAcftList());
    LoadFromHangar(0);
}

function RemoveFromHangar(name: string) {
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == name);
    if (idx != -1) {
        acft_list.names.splice(idx, 1);
        acft_list.acft.splice(idx, 1);
    }
    SaveAcftList(acft_list);
    LoadFromHangar(Math.min(acft_list.names.length - 1, idx));
}

function SaveAcftList(acft_list: { names: string[], acft: string[] }) {
    window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    RefreshAcftSelect(acft_list);
}

function SaveHangarList(hangar_list: string[]) {
    window.localStorage.setItem("hangar_names", JSON.stringify(hangar_list));
    RefreshHangarSelect(hangar_list);
}

function RefreshAcftSelect(acft_list: { names: string[], acft: string[] }) {
    while (select_acft.options.length > 0) {
        select_acft.options.remove(0);
    }
    for (let i = 0; i < acft_list.names.length; i++) {
        let opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.text = acft_list.names[i];
        select_acft.add(opt);
    }
}

function RefreshHangarSelect(hangar_list: string[]) {
    while (select_hangar.options.length > 0) {
        select_hangar.options.remove(0);
    }
    var idx = 0;
    for (let i = 0; i < hangar_list.length; i++) {
        let opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.text = hangar_list[i];
        select_hangar.add(opt);
        if (hangar_list[i] == chosen_hangar)
            idx = i;
    }
    select_hangar.selectedIndex = idx;
}

function LoadJSON(input: HTMLInputElement) {
    if (input.files.length == 0)
        return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
        try {
            var str = JSON.parse(reader.result as string);
            var acft = new Aircraft(parts_JSON, weapon_JSON, false);
            if (acft.fromJSON(str)) {
                var idx = AddToHangar(acft);
                LoadFromHangar(idx);
            }

        } catch (e) {
            console.error(e, e.stack);
        }
    };
    reader.readAsText(file);
    input.value = "";
}

function RefreshDisplay() {
    var tbl1 = document.getElementById("table_builder") as HTMLTableElement;
    var tbl2 = document.getElementById("table_hangar") as HTMLTableElement;
    var tbl3 = document.getElementById("table_comp") as HTMLTableElement;
    MergeTables(tbl1, tbl2, tbl3);
}

function MergeTables(tbl1: HTMLTableElement, tbl2: HTMLTableElement, tbl3: HTMLTableElement) {
    while (tbl3.children.length) {
        tbl3.children[0].remove();
    }
    console.log(acft_builder.GetStats());
    for (let r = 0; r < tbl1.children.length; r++) {
        var row1 = tbl1.children[r];
        var row2 = tbl2.children[r];
        var row3 = tbl3.insertRow();
        for (let c = 0; c < Math.max(row1.children.length, row2.children.length); c++) {

            if (r == 0 && c == 0) {
                var cell = row3.insertCell();
                cell.colSpan = 2;
                cell.appendChild(name_builder);
                name_builder.value = acft_builder.name;
                var hr = document.createElement("HR");
                hr.className = "dashed";
                cell.appendChild(hr);
                cell.appendChild(select_hangar);
                cell.appendChild(document.createElement("BR"));
                cell.appendChild(select_acft);
                continue;
            }

            var cell1 = row1.children[c];
            var cell2 = row2.children[c];
            if (cell1.nodeName == "TH") {
                row3.appendChild(cell1.cloneNode(true));
            } else {
                var clone = cell1.cloneNode(true) as HTMLTableCellElement;
                clone.innerHTML += "<hr class=\"dashed\">" + cell2.innerHTML;
                row3.appendChild(clone);
            }
        }
    }
}