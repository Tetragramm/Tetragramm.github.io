import { localization } from "../wasm/localization";
import { AircraftBridge } from "../wasm/aircraft_bridge";
import { DerivedStatsUI } from "../wasm/components/derived_stats_ui";
import { BlinkBad, BlinkNeutral } from "../disp/Tools";
import { JSON2CSV } from "../JSON2CSV/json2csv";
import { StringFmt } from "../string";

// Type for the WASM module
type WasmModule = any;

let wasmModule: WasmModule | null = null;
let acft_builder: AircraftBridge;
let stats_builder: DerivedStatsUI;
let acft_hangar: AircraftBridge;
let stats_hangar: DerivedStatsUI;

let name_builder: HTMLInputElement;
let select_hangar: HTMLSelectElement;
let select_acft: HTMLSelectElement;
let chosen_hangar: string;

const init = async () => {
    const sp = new URLSearchParams(location.search);
    const lang = sp.get("lang");

    // Initialize WASM module first
    try {
        console.log('[Hangar] Loading WASM module...');
        wasmModule = await loadWasmModule();

        if (!wasmModule) {
            throw new Error('WASM module not available');
        }

        // Initialize WASM
        const initWasm = wasmModule.default || wasmModule.init;
        await initWasm();
        console.log('[Hangar] WASM binary loaded');

        // Initialize localization with WASM backend
        localization.initializeWasm(wasmModule.Localization);
        console.log('[Hangar] Localization initialized');

        // Set language from URL or localStorage
        if (lang) {
            localization.setLocale(lang);
        } else if (window.localStorage.language) {
            localization.setLocale(window.localStorage.language);
        }

        await InitHTML();
        await InitStats();
        await LoadFromHangar(0);

        console.log('[Hangar] Initialization complete');
    } catch (error) {
        console.error('[Hangar] Failed to initialize:', error);
        alert('Failed to initialize hangar. Please refresh the page.');
    }
};

window.addEventListener("DOMContentLoaded", init);

/**
 * Load the WASM module
 */
async function loadWasmModule(): Promise<WasmModule | null> {
    try {
        const wasmModule = await import('../pkg/flyingcircuswasm');
        return {
            default: wasmModule.init_panic_hook,
            init: wasmModule.init_panic_hook,
            AircraftWasm: wasmModule.AircraftWasm,
            Localization: wasmModule.Localization
        };
    } catch (e) {
        console.error('[Hangar] WASM module not found:', e);
        return null;
    }
}

async function InitHTML() {
    chosen_hangar = "Default";
    select_hangar = document.createElement("SELECT") as HTMLSelectElement;
    select_hangar.onchange = () => {
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
    };
    RefreshHangarSelect(LoadHangarList());

    select_acft = document.createElement("SELECT") as HTMLSelectElement;
    select_acft.onchange = async () => { await LoadFromHangar(select_acft.selectedIndex); };
    RefreshAcftSelect(LoadAcftList());

    name_builder = document.createElement("INPUT") as HTMLInputElement;

    const load_btn = document.getElementById("btn_load") as HTMLButtonElement;
    load_btn.onclick = async () => {
        // Copy hangar aircraft to builder
        const json = acft_hangar.toJSON();
        const newBridge = await AircraftBridge.fromJSON(
            json,
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
        acft_builder = newBridge;
        acft_builder.loadEngineListsFromLocalStorage();
        acft_builder.calculateStats();

        // Update builder display
        stats_builder.render(true);

        // Save to localStorage
        window.localStorage.setItem("test.aircraft", acft_builder.toJSON());

        RefreshDisplay();
        BlinkNeutral(load_btn.parentElement);
    };

    const save_btn = document.getElementById("btn_save") as HTMLButtonElement;
    save_btn.onclick = () => {
        acft_builder.setName(name_builder.value);
        AddToHangar(acft_builder);
        BlinkNeutral(save_btn.parentElement);
    };

    const json_btn = document.getElementById("btn_json") as HTMLInputElement;
    json_btn.multiple = false;
    json_btn.accept = "application/JSON";
    json_btn.onchange = async (evt) => {
        await LoadJSON(json_btn);
        BlinkNeutral(json_btn.parentElement);
    };

    const remove_btn = document.getElementById("btn_remove") as HTMLButtonElement;
    remove_btn.onclick = () => {
        RemoveFromHangar(acft_hangar.getName());
        BlinkNeutral(remove_btn.parentElement);
    };

    const hangar_save = document.getElementById("btn_save_h") as HTMLButtonElement;
    hangar_save.onclick = () => {
        download(JSON.stringify(LoadAcftList()), chosen_hangar + ".json", "json");
        BlinkNeutral(hangar_save.parentElement);
    };

    const hangar_load = document.getElementById("btn_json_h") as HTMLInputElement;
    hangar_load.setAttribute("type", "file");
    hangar_load.multiple = false;
    hangar_load.accept = "application/JSON";
    hangar_load.onchange = async (evt) => {
        if (hangar_load.files.length == 0)
            return;
        BlinkNeutral(hangar_load.parentElement);
        const file = hangar_load.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                let name = file.name.substr(0, file.name.length - 5);
                name = name.trim();
                name = name.replace(/\s+/g, ' ');
                const acft_list: { names: string[], acft: string[] } = JSON.parse(reader.result as string);
                if (acft_list.names.length != acft_list.acft.length) {
                    throw "Bad";
                }
                AddHangar(name);
                window.localStorage.setItem("test.hangar." + name, reader.result as string);
                chosen_hangar = name;
                RefreshHangarSelect(LoadHangarList());
                RefreshAcftSelect(LoadAcftList());
            } catch { BlinkBad(hangar_load.parentElement); }
        };
        reader.readAsText(file);
        hangar_load.value = "";
    };

    const list_create = document.getElementById("lbl_create_list") as HTMLLabelElement;
    const list_input = document.getElementById("btn_create_list") as HTMLInputElement;
    list_create.onclick = () => {
        let n = list_input.value;
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

    const list_delete = document.getElementById("btn_delete_list") as HTMLButtonElement;
    list_delete.onclick = () => {
        RemoveHangar(chosen_hangar);
        BlinkNeutral(list_delete.parentElement);
    }

    const to_csv = document.getElementById("btn_to_csv") as HTMLButtonElement;
    to_csv.onclick = async () => {
        const acft_list = LoadAcftList();
        const DerivedStats = [];
        const curr_acft = acft_hangar.toJSON();

        for (let acft of acft_list.acft) {
            try {
                const loadedBridge = await AircraftBridge.deserializeFromLZString(
                    acft,
                    async () => { /* Already initialized */ },
                    wasmModule.AircraftWasm
                );
                loadedBridge.loadEngineListsFromLocalStorage();
                loadedBridge.calculateStats();

                const stats = loadedBridge.getStats();
                const dstats = loadedBridge.getDerivedStats();

                // Build CSV row with derived stats
                const entries = Object.entries<any>(dstats);
                entries.splice(0, 0, ["name", loadedBridge.getName()]);
                entries.splice(1, 0, ["cost", stats.cost]);
                entries.splice(2, 0, ["upkeep", stats.upkeep]);
                entries.splice(3, 0, ["bomb_mass", stats.bomb_mass]);
                entries.splice(4, 0, ["escape", StringFmt.Join("/", loadedBridge.getEscapeList())]);
                entries.splice(5, 0, ["crash", StringFmt.Join("/", loadedBridge.getEscapeList())]); // TODO: getCrashList if it exists
                entries.splice(6, 0, ["stress", formatStressList(loadedBridge.getStressList())]);

                const dstatsn = Object.fromEntries(entries);
                DerivedStats.push(dstatsn);
            } catch (e) {
                console.error("Failed to load aircraft for CSV:", e);
            }
        }

        // Restore original hangar aircraft
        const restoredBridge = await AircraftBridge.fromJSON(
            curr_acft,
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
        acft_hangar = restoredBridge;
        acft_hangar.loadEngineListsFromLocalStorage();

        const json2csv = new JSON2CSV();
        download(json2csv.convert(DerivedStats, { separator: ',', flatten: true, output_csvjson_variant: false }), chosen_hangar + ".csv", "csv");
    }
}

async function InitStats() {
    const acft_data = window.localStorage.getItem("test.aircraft");

    // Create builder aircraft
    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder = await AircraftBridge.fromJSON(
                acft_data,
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm
            );
            acft_builder.loadEngineListsFromLocalStorage();
        } catch (e) {
            console.error("Saved Data Failed:", e);
            // Load default aircraft
            acft_builder = await AircraftBridge.deserializeFromLZString(
                "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm
            );
        }
    } else {
        // Load default aircraft
        acft_builder = await AircraftBridge.deserializeFromLZString(
            "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
    }
    acft_builder.loadEngineListsFromLocalStorage();
    acft_builder.calculateStats();

    // Create builder stats UI
    stats_builder = new DerivedStatsUI(
        () => acft_builder,
        'table_builder',
        () => { /* No update callback needed for hangar */ }
    );
    stats_builder.setShowBombs(true);
    stats_builder.render(true);

    // Create hangar aircraft (will be loaded in LoadFromHangar)
    acft_hangar = await AircraftBridge.deserializeFromLZString(
        "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
        async () => { /* Already initialized */ },
        wasmModule.AircraftWasm
    );
    acft_hangar.loadEngineListsFromLocalStorage();

    // Create hangar stats UI
    stats_hangar = new DerivedStatsUI(
        () => acft_hangar,
        'table_hangar',
        () => { /* No update callback needed for hangar */ }
    );
    stats_hangar.setShowBombs(true);
}

function LoadHangarList(): string[] {
    if (!window.localStorage.getItem("test.hangar_names")) {
        window.localStorage.setItem("test.hangar_names", JSON.stringify(["Default"]));
    }
    let hangar_list: string[] = JSON.parse(window.localStorage.getItem("test.hangar_names"));
    if (hangar_list.length == 0) {
        window.localStorage.setItem("test.hangar_names", JSON.stringify(["Default"]));
        hangar_list = JSON.parse(window.localStorage.getItem("test.hangar_names"));
    }
    return hangar_list;
}

function LoadAcftList(): { names: string[], acft: string[] } {
    let acft_list: { names: string[], acft: string[] };
    if (window.localStorage.getItem("test.hangar." + chosen_hangar)) {
        acft_list = JSON.parse(window.localStorage.getItem("test.hangar." + chosen_hangar));
    } else {
        acft_list = {
            names: ["Basic Biplane"],
            acft: ["AAEAjGB0DMwLACECGBnAlgYwAQLQBwBskA7AU2AEBLgaAwGhmgUEZpFY+oHQAlACwD2xJFgCyAgC4CATgCMkAVywAtCFgAcABj55gAJGABcYACAaVVuwAQDdpw4B-h8BsAoex8+9BwsZJnySqpgGtq6NGYUAIKQAGaxAAIACQwAkJQA-AABNNm5OfZ2jE6eZhxlAMCeHmXVtdS1NjYeTRxVbKwW1J7tNOld1WmDnCweVBbsA8OsvS7TtnUMs0XzY8AVVLRT1BRde6sHDEA"]
        };
        window.localStorage.setItem("test.hangar." + chosen_hangar, JSON.stringify(acft_list));
    }
    return acft_list;
}

async function LoadFromHangar(idx: number) {
    const acft_list = LoadAcftList();
    try {
        const loadedBridge = await AircraftBridge.deserializeFromLZString(
            acft_list.acft[idx],
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
        acft_hangar = loadedBridge;
        acft_hangar.loadEngineListsFromLocalStorage();
        acft_hangar.calculateStats();
    } catch (e) {
        console.error("Failed to load aircraft from hangar:", e);
        // Load default on error
        acft_hangar = await AircraftBridge.deserializeFromLZString(
            "AAEAjGB0DMwLACECGBnAlgYwAQLQBwBskA7AU2AEBLgaAwGhmgUEZpFY+oHQAlACwD2xJFgCyAgC4CATgCMkAVywAtCFgAcABj55gAJGABcYACAaVVuwAQDdpw4B-h8BsAoex8+9BwsZJnySqpgGtq6NGYUAIKQAGaxAAIACQwAkJQA-AABNNm5OfZ2jE6eZhxlAMCeHmXVtdS1NjYeTRxVbKwW1J7tNOld1WmDnCweVBbsA8OsvS7TtnUMs0XzY8AVVLRT1BRde6sHDEA",
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
        acft_hangar.loadEngineListsFromLocalStorage();
    }

    stats_hangar.render(true);
    select_acft.selectedIndex = idx;
    RefreshDisplay();
}

function AddHangar(hangar: string): number {
    const hangar_list = LoadHangarList();
    let idx = hangar_list.findIndex(n => n == hangar);
    if (idx == -1) {
        hangar_list.push(hangar);
        idx = hangar_list.length - 1;
        SaveHangarList(hangar_list);
    }
    return idx;
}

function AddToHangar(acft: AircraftBridge): number {
    const data = acft.serializeToLZString();
    const acft_list = LoadAcftList();
    let idx = acft_list.names.findIndex(n => n == acft.getName());
    if (idx == -1) {
        acft_list.names.push(acft.getName());
        acft_list.acft.push(data);
        idx = acft_list.names.length - 1;
    } else {
        acft_list.acft[idx] = data;
    }
    SaveAcftList(acft_list);
    return idx;
}

function RemoveHangar(name: string) {
    const hangar_list = LoadHangarList();
    const idx = hangar_list.findIndex(n => n == name);
    if (idx != -1) {
        hangar_list.splice(idx, 1);
        window.localStorage.removeItem("test.hangar." + name);
    }
    SaveHangarList(hangar_list);
    chosen_hangar = "Default";
    RefreshHangarSelect(LoadHangarList());
    RefreshAcftSelect(LoadAcftList());
    LoadFromHangar(0);
}

function RemoveFromHangar(name: string) {
    const acft_list = LoadAcftList();
    const idx = acft_list.names.findIndex(n => n == name);
    if (idx != -1) {
        acft_list.names.splice(idx, 1);
        acft_list.acft.splice(idx, 1);
    }
    SaveAcftList(acft_list);
    LoadFromHangar(Math.min(acft_list.names.length - 1, idx));
}

function SaveAcftList(acft_list: { names: string[], acft: string[] }) {
    window.localStorage.setItem("test.hangar." + chosen_hangar, JSON.stringify(acft_list));
    RefreshAcftSelect(acft_list);
}

function SaveHangarList(hangar_list: string[]) {
    window.localStorage.setItem("test.hangar_names", JSON.stringify(hangar_list));
    RefreshHangarSelect(hangar_list);
}

function RefreshAcftSelect(acft_list: { names: string[], acft: string[] }) {
    while (select_acft.lastChild) {
        select_acft.removeChild(select_acft.lastChild);
    }
    for (let i = 0; i < acft_list.names.length; i++) {
        const opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.text = acft_list.names[i];
        select_acft.add(opt);
    }
}

function RefreshHangarSelect(hangar_list: string[]) {
    while (select_hangar.lastChild) {
        select_hangar.removeChild(select_hangar.lastChild);
    }
    let idx = 0;
    for (let i = 0; i < hangar_list.length; i++) {
        const opt = document.createElement("OPTION") as HTMLOptionElement;
        opt.text = hangar_list[i];
        select_hangar.add(opt);
        if (hangar_list[i] == chosen_hangar)
            idx = i;
    }
    select_hangar.selectedIndex = idx;
}

async function LoadJSON(input: HTMLInputElement) {
    if (input.files.length == 0)
        return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
        try {
            const str = reader.result as string;
            const loadedBridge = await AircraftBridge.fromJSON(
                str,
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm
            );
            loadedBridge.loadEngineListsFromLocalStorage();
            const idx = AddToHangar(loadedBridge);
            await LoadFromHangar(idx);
        } catch (e) {
            console.error("Failed to load JSON:", e);
            BlinkBad(input.parentElement);
        }
    };
    reader.readAsText(file);
    input.value = "";
}

function RefreshDisplay() {
    const tbl1 = document.getElementById("table_builder") as HTMLTableElement;
    const tbl2 = document.getElementById("table_hangar") as HTMLTableElement;
    const tbl3 = document.getElementById("table_comp") as HTMLTableElement;
    MergeTables(tbl1, tbl2, tbl3);
}

function MergeTables(tbl1: HTMLTableElement, tbl2: HTMLTableElement, tbl3: HTMLTableElement) {
    while (tbl3.lastChild) {
        tbl3.removeChild(tbl3.lastChild);
    }

    const maxRows = Math.max(tbl1.children.length, tbl2.children.length);

    for (let r = 0; r < maxRows; r++) {
        const row1 = r < tbl1.children.length ? tbl1.children[r] : null;
        const row2 = r < tbl2.children.length ? tbl2.children[r] : null;
        const row3 = tbl3.insertRow();

        const maxCols = Math.max(
            row1 ? row1.children.length : 0,
            row2 ? row2.children.length : 0
        );

        for (let c = 0; c < maxCols; c++) {
            if (r == 0 && c == 0) {
                const cell = row3.insertCell();
                cell.colSpan = 2;
                cell.appendChild(name_builder);
                name_builder.value = acft_builder.getName();
                const hr = document.createElement("HR");
                hr.className = "dashed";
                cell.appendChild(hr);
                cell.appendChild(select_hangar);
                cell.appendChild(document.createElement("BR"));
                cell.appendChild(select_acft);
                continue;
            }

            const cell1 = row1 && c < row1.children.length ? row1.children[c] : null;
            const cell2 = row2 && c < row2.children.length ? row2.children[c] : null;

            if (cell1 && cell1.nodeName == "TH") {
                row3.appendChild(cell1.cloneNode(true));
            } else if (cell1 && cell2) {
                const clone = cell1.cloneNode(true) as HTMLTableCellElement;
                clone.innerHTML += "<hr class=\"dashed\">" + cell2.innerHTML;
                row3.appendChild(clone);
            } else if (cell1) {
                row3.appendChild(cell1.cloneNode(true));
            } else if (cell2) {
                row3.appendChild(cell2.cloneNode(true));
            }
        }
    }
}

// Helper function to format stress list for CSV export
function formatStressList(stressList: Array<[number, number]>): string {
    let str = '';
    for (let i = 0; i < stressList.length - 1; i++) {
        if (stressList[i][0] !== stressList[i][1]) {
            str += stressList[i][0].toString() + '(' + stressList[i][1].toString() + '), ';
        } else {
            str += stressList[i][0].toString() + ', ';
        }
    }
    if (stressList.length > 0) {
        const i = stressList.length - 1;
        if (stressList[i][0] !== stressList[i][1]) {
            str += stressList[i][0].toString() + '(' + stressList[i][1].toString() + ')';
        } else {
            str += stressList[i][0].toString();
        }
    }
    return str;
}

// Helper function to download files
function download(data: string, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
