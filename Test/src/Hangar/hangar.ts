import { localization } from '../wasm/localization';
import { AircraftBridge } from "../wasm/aircraft_bridge";
import { DerivedStatsUI } from "../wasm/components/derived_stats_ui";
import { BlinkBad, BlinkNeutral, createMobileOptionItem } from "../wasm/dom_utils"
import { JSON2CSV } from "../JSON2CSV/json2csv";

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

    console.log('[Hangar] init?...');
    // Try to initialize WASM first
    try {
        console.log('[Hangar] Loading WASM module...');
        wasmModule = await loadWasmModule();
        console.log("[PlaneBuilder] WASM initialized successfully");

        // Initialize localization with WASM backend
        localization.initializeWasm(wasmModule.Localization);
        console.log('[WasmApp] Localization initialized');

        await InitHTML();
        await InitStats();
        await LoadFromHangar(0);
        console.log('[Hangar] Initialization complete');
    } catch (e) {
        console.error('[Hangar] Failed to initialize:', e);
    }
};

window.addEventListener("DOMContentLoaded", init);

async function InitHTML() {
    chosen_hangar = "Default";
    select_hangar = document.createElement("SELECT") as HTMLSelectElement;
    select_hangar.onchange = async () => {
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
        await LoadFromHangar(select_acft.selectedIndex);
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
        acft_builder = new AircraftBridge();
        await acft_builder.initialize(
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm
        );
        acft_builder.fromJSON(json);
        acft_builder.loadEngineListsFromLocalStorage();
        acft_builder.calculateStats();

        // Update builder display
        stats_builder.render(true);

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
    remove_btn.onclick = async () => {
        RemoveFromHangar(acft_hangar.getName());
        BlinkNeutral(remove_btn.parentElement);
        await LoadFromHangar(select_acft.selectedIndex);
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
                await LoadFromHangar(select_acft.selectedIndex);

            } catch { BlinkBad(hangar_load.parentElement); }
        };
        reader.readAsText(file);
        hangar_load.value = "";
    };

    const list_create = document.getElementById("lbl_create_list") as HTMLLabelElement;
    const list_input = document.getElementById("btn_create_list") as HTMLInputElement;
    list_create.onclick = async () => {
        let n = list_input.value;
        n = n.trim();
        n = n.replace(/\s+/g, ' ');
        if (n != "") {
            select_hangar.selectedIndex = AddHangar(n);
            chosen_hangar = n;
            RefreshAcftSelect(LoadAcftList());
            BlinkNeutral(list_create.parentElement);
            await LoadFromHangar(select_acft.selectedIndex);
        }
        list_input.value = "";
    };

    const list_delete = document.getElementById("btn_delete_list") as HTMLButtonElement;
    list_delete.onclick = async () => {
        RemoveHangar(chosen_hangar);
        BlinkNeutral(list_delete.parentElement);
        await LoadFromHangar(select_acft.selectedIndex);
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
                    wasmModule.AircraftWasm,
                    false
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
                entries.splice(4, 0, ["escape", loadedBridge.getEscapeList().join("/")]);
                entries.splice(5, 0, ["crash", loadedBridge.getCrashList().join("/")]); // TODO: getCrashList if it exists
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
            wasmModule.AircraftWasm,
            false
        );
        acft_hangar = restoredBridge;
        acft_hangar.loadEngineListsFromLocalStorage();
        // Disable auto-save for hangar aircraft

        const json2csv = new JSON2CSV();
        download(json2csv.convert(DerivedStats, { separator: ',', flatten: true, output_csvjson_variant: false }), chosen_hangar + ".csv", "csv");
    }
}

/**
 * Load the WASM module
 * Returns null if WASM is not available (not yet built)
 */
async function loadWasmModule(): Promise<WasmModule | null> {
    try {
        // Try to import the WASM module
        // wasm-pack with --target bundler exports:
        // - default: initialization function
        // - named exports: classes and functions
        const wasmModule = await import('../../pkg/flyingcircuswasm');

        // For bundler target, the default export is the init function
        // We need to wrap it to match our expected interface
        return {
            default: wasmModule.init_panic_hook,
            init: wasmModule.init_panic_hook, // The initialization function
            AircraftWasm: wasmModule.AircraftWasm,
            Localization: wasmModule.Localization
        };
    } catch (e) {
        console.warn('[WasmApp] WASM module not found (not yet built):', e);
        return null;
    }
}

async function InitStats() {
    const acft_data = window.localStorage.getItem("test.aircraft");

    // Create builder aircraft
    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder = new AircraftBridge();
            acft_builder.setAutoSaveToLocalStorage(false);
            await acft_builder.initialize(
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm
            );
            acft_builder.fromJSON(acft_data);
        } catch (e) {
            console.error("Saved Data Failed:", e);
            // Load default aircraft
            acft_builder = await AircraftBridge.deserializeFromLZString(
                "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm,
                false
            );
        }
    } else {
        // Load default aircraft
        acft_builder = await AircraftBridge.deserializeFromLZString(
            "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
            async () => { /* Already initialized */ },
            wasmModule.AircraftWasm,
            false
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
        wasmModule.AircraftWasm,
        false
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
            wasmModule.AircraftWasm,
            false
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
            wasmModule.AircraftWasm,
            false
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
            const loadedBridge = new AircraftBridge();
            await loadedBridge.initialize(
                async () => { /* Already initialized */ },
                wasmModule.AircraftWasm);
            loadedBridge.setAutoSaveToLocalStorage(false);
            loadedBridge.fromJSON(str);
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
    const div1 = document.getElementById("table_builder");
    const tbl1 = div1.getElementsByTagName('table').item(0) as HTMLTableElement;
    const div2 = document.getElementById("table_hangar");
    const tbl2 = div2.getElementsByTagName('table').item(0) as HTMLTableElement;
    const tbl3 = document.getElementById("table_comp") as HTMLTableElement;

    MergeTables(tbl1, tbl2, tbl3);

    // Update mobile comparison view
    const mobileComp = document.getElementById("Compare_Mobile");
    if (mobileComp) {
        MergeMobile(mobileComp);
    }
}

function MergeTables(tbl1: HTMLTableElement, tbl2: HTMLTableElement, tbl3: HTMLTableElement) {
    while (tbl3.lastChild) {
        tbl3.removeChild(tbl3.lastChild);
    }

    // Use .rows to access table rows directly (not .children which gets tbody)
    const maxRows = Math.max(tbl1.rows.length, tbl2.rows.length);

    for (let r = 0; r < maxRows; r++) {
        const row1 = r < tbl1.rows.length ? tbl1.rows[r] : null;
        const row2 = r < tbl2.rows.length ? tbl2.rows[r] : null;
        const row3 = tbl3.insertRow();

        const maxCols = Math.max(
            row1 ? row1.cells.length : 0,
            row2 ? row2.cells.length : 0
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

            const cell1 = row1 && c < row1.cells.length ? row1.cells[c] : null;
            const cell2 = row2 && c < row2.cells.length ? row2.cells[c] : null;

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

/**
 * Create a mobile-friendly comparison view for two aircraft
 */
function MergeMobile(container: HTMLElement) {
    container.innerHTML = '';

    const builderStats = acft_builder.getStats();
    const builderDerived = acft_builder.getDerivedStats();
    const hangarStats = acft_hangar.getStats();
    const hangarDerived = acft_hangar.getDerivedStats();

    // Create mobile option group
    const mobileGroup = document.createElement('div');
    mobileGroup.className = 'mobile-option-group';

    // === Name/Selection Section ===
    const nameSection = createMobileOptionItem('', mobileGroup);
    nameSection.content.style.display = 'grid';
    nameSection.content.style.gridTemplateColumns = '1fr 1fr';
    nameSection.content.style.gap = '1em';

    // Builder name column
    const builderNameDiv = document.createElement('div');
    const builderLabel = document.createElement('div');
    builderLabel.style.fontWeight = 'bold';
    builderLabel.style.marginBottom = '0.25em';
    builderLabel.textContent = localization.translate('Aircraft From Builder') || 'Builder';
    builderNameDiv.appendChild(builderLabel);
    const nameInputClone = name_builder.cloneNode(true) as HTMLInputElement;
    nameInputClone.style.width = '100%';
    nameInputClone.value = acft_builder.getName();
    nameInputClone.onchange = () => {
        acft_builder.setName(nameInputClone.value);
        name_builder.value = nameInputClone.value;
    };
    builderNameDiv.appendChild(nameInputClone);
    nameSection.content.appendChild(builderNameDiv);

    // Hangar selection column
    const hangarNameDiv = document.createElement('div');
    const hangarLabel = document.createElement('div');
    hangarLabel.style.fontWeight = 'bold';
    hangarLabel.style.marginBottom = '0.25em';
    hangarLabel.textContent = localization.translate('Aircraft From Hangar') || 'Hangar';
    hangarNameDiv.appendChild(hangarLabel);

    const hangarSelectClone = select_hangar.cloneNode(true) as HTMLSelectElement;
    hangarSelectClone.style.width = '100%';
    hangarSelectClone.selectedIndex = select_hangar.selectedIndex;
    hangarSelectClone.onchange = async () => {
        select_hangar.selectedIndex = hangarSelectClone.selectedIndex;
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
        await LoadFromHangar(select_acft.selectedIndex);
    };
    hangarNameDiv.appendChild(hangarSelectClone);

    const acftSelectClone = select_acft.cloneNode(true) as HTMLSelectElement;
    acftSelectClone.style.width = '100%';
    acftSelectClone.style.marginTop = '0.25em';
    acftSelectClone.selectedIndex = select_acft.selectedIndex;
    acftSelectClone.onchange = async () => {
        select_acft.selectedIndex = acftSelectClone.selectedIndex;
        await LoadFromHangar(select_acft.selectedIndex);
    };
    hangarNameDiv.appendChild(acftSelectClone);
    nameSection.content.appendChild(hangarNameDiv);

    // === Cost/Upkeep Section ===
    const costSection = createMobileOptionItem('', mobileGroup);
    const costGrid = document.createElement('div');
    costGrid.style.display = 'grid';
    costGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
    costGrid.style.gap = '0.5em';

    // Header row
    addMobileCompCell(costGrid, '', true);
    addMobileCompCell(costGrid, localization.translate('Aircraft From Builder') || 'Builder', true);
    addMobileCompCell(costGrid, localization.translate('Aircraft From Hangar') || 'Hangar', true);

    // Cost row
    addMobileCompCell(costGrid, localization.translate('Stat Cost'), true);
    addMobileCompCell(costGrid, builderStats.cost.toString() + 'þ');
    addMobileCompCell(costGrid, hangarStats.cost.toString() + 'þ');

    // Upkeep row
    addMobileCompCell(costGrid, localization.translate('Stat Upkeep'), true);
    addMobileCompCell(costGrid, builderStats.upkeep.toString() + 'þ');
    addMobileCompCell(costGrid, hangarStats.upkeep.toString() + 'þ');

    costSection.content.appendChild(costGrid);

    // === Mass Variations Section ===
    const massSection = createMobileOptionItem(localization.translate('Derived Mass Variations'), mobileGroup);
    const massGrid = document.createElement('div');
    massGrid.className = 'mobile-stats-grid';
    massGrid.style.gridTemplateColumns = 'auto repeat(5, 1fr)';

    // Headers
    addMobileCompCell(massGrid, '', true);
    addMobileCompLabel(massGrid, localization.translate('Derived Boost'));
    addMobileCompLabel(massGrid, localization.translate('Derived Handling'));
    addMobileCompLabel(massGrid, localization.translate('Derived Rate of Climb'));
    addMobileCompLabel(massGrid, localization.translate('Derived Stall Speed'));
    addMobileCompLabel(massGrid, localization.translate('Derived Top Speed'));

    // Full Fuel row with combined cells
    addMobileCompLabel(massGrid, localization.translate('Derived Full Fuel'));
    addMobileCompValueCell(massGrid, builderDerived.boost_full, hangarDerived.boost_full);
    addMobileCompValueCell(massGrid, builderDerived.handling_full, hangarDerived.handling_full);
    addMobileCompValueCell(massGrid, builderDerived.rate_of_climb_full, hangarDerived.rate_of_climb_full);
    addMobileCompValueCell(massGrid, builderDerived.stall_speed_full, hangarDerived.stall_speed_full);
    addMobileCompValueCell(massGrid, Math.floor(1.0e-6 + builderDerived.max_speed_full), Math.floor(1.0e-6 + hangarDerived.max_speed_full));

    // Half Fuel row with combined cells
    addMobileCompLabel(massGrid, localization.translate('Derived Half Fuel'));
    addMobileCompValueCell(massGrid,
        Math.floor((builderDerived.boost_empty + builderDerived.boost_full) / 2),
        Math.floor((hangarDerived.boost_empty + hangarDerived.boost_full) / 2));
    addMobileCompValueCell(massGrid,
        Math.floor((builderDerived.handling_empty + builderDerived.handling_full) / 2),
        Math.floor((hangarDerived.handling_empty + hangarDerived.handling_full) / 2));
    addMobileCompValueCell(massGrid,
        Math.floor((builderDerived.rate_of_climb_empty + builderDerived.rate_of_climb_full) / 2),
        Math.floor((hangarDerived.rate_of_climb_empty + hangarDerived.rate_of_climb_full) / 2));
    addMobileCompValueCell(massGrid,
        Math.floor((builderDerived.stall_speed_empty + builderDerived.stall_speed_full) / 2),
        Math.floor((hangarDerived.stall_speed_empty + hangarDerived.stall_speed_full) / 2));
    addMobileCompValueCell(massGrid,
        Math.floor((builderDerived.max_speed_empty + builderDerived.max_speed_full) / 2),
        Math.floor((hangarDerived.max_speed_empty + hangarDerived.max_speed_full) / 2));

    // Empty Fuel row with combined cells
    addMobileCompLabel(massGrid, localization.translate('Derived Empty Fuel'));
    addMobileCompValueCell(massGrid, 0, 0);
    addMobileCompValueCell(massGrid, builderDerived.handling_empty, hangarDerived.handling_empty);
    addMobileCompValueCell(massGrid, 0, 0);
    addMobileCompValueCell(massGrid, builderDerived.stall_speed_empty, hangarDerived.stall_speed_empty);
    addMobileCompValueCell(massGrid, 0, 0);

    massSection.content.appendChild(massGrid);

    // === Stats Comparison Sections ===
    const statSections = [
        {
            title: localization.translate('Derived Propulsion'),
            stats: [
                { label: 'Derived Dropoff', b: builderDerived.dropoff, h: hangarDerived.dropoff },
                { label: 'Derived Overspeed', b: builderDerived.overspeed, h: hangarDerived.overspeed },
                { label: 'Derived Fuel Uses', b: (Math.floor(builderDerived.fuel_uses * 10) / 10), h: (Math.floor(hangarDerived.fuel_uses * 10) / 10) },
                { label: 'Stat Reliability', b: acft_builder.getReliabilityList().join(', '), h: acft_hangar.getReliabilityList().join(', ') },
                { label: 'Derived Ideal Engine Altitude', b: acft_builder.getMinAltitude() + '-' + acft_builder.getMaxAltitude(), h: acft_hangar.getMinAltitude() + '-' + acft_hangar.getMaxAltitude() },
            ]
        },
        {
            title: localization.translate('Derived Aerodynamics'),
            stats: [
                { label: 'Derived Stability', b: builderDerived.stability, h: hangarDerived.stability },
                { label: 'Derived Energy Loss', b: builderDerived.energy_loss, h: hangarDerived.energy_loss },
                { label: 'Derived Turn Bleed', b: builderDerived.turn_bleed, h: hangarDerived.turn_bleed },
                { label: 'Derived Landing Gear', b: acft_builder.getGearName(), h: acft_hangar.getGearName() },
                { label: 'Derived Is Flammable Question', b: acft_builder.getIsFlammable() ? localization.translate('Yes') : localization.translate('No'), h: acft_hangar.getIsFlammable() ? localization.translate('Yes') : localization.translate('No') },
            ]
        },
        {
            title: localization.translate('Derived Survivability'),
            stats: [
                { label: 'Derived Crash Safety', b: builderStats.crashsafety, h: hangarStats.crashsafety },
                { label: 'Stat Toughness', b: builderDerived.toughness, h: hangarDerived.toughness },
                { label: 'Stat Max Strain', b: builderDerived.max_strain, h: hangarDerived.max_strain },
                { label: 'Derived Communications', b: acft_builder.getCommunicationName(), h: acft_hangar.getCommunicationName() },
            ]
        },
        {
            title: localization.translate('Derived Crew Members'),
            stats: [
                { label: 'Derived Crew/Passengers', b: acft_builder.getCockpitsCount() + '/' + acft_builder.getPassengersCount(), h: acft_hangar.getCockpitsCount() + '/' + acft_hangar.getPassengersCount() },
                { label: 'Stat Visibility', b: acft_builder.getVisibilityList().join(', '), h: acft_hangar.getVisibilityList().join(', ') },
                { label: 'Derived Attack Modifier', b: acft_builder.getAttackList().join(', '), h: acft_hangar.getAttackList().join(', ') },
                { label: 'Derived Escape', b: acft_builder.getEscapeList().join(', '), h: acft_hangar.getEscapeList().join(', ') },
                { label: 'Stat Flight Stress', b: formatStressList(acft_builder.getStressList()), h: formatStressList(acft_hangar.getStressList()) },
            ]
        }
    ];

    for (const section of statSections) {
        const statSection = createMobileOptionItem(section.title, mobileGroup);
        const statGrid = document.createElement('div');
        statGrid.className = 'mobile-stats-grid';
        statGrid.style.display = 'flex';
        statGrid.style.flexWrap = 'wrap';

        for (const stat of section.stats) {
            // Create stat item with label and combined value cell
            const item = document.createElement('div');
            item.className = 'mobile-stat-item';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'mobile-stat-label';
            labelDiv.textContent = localization.translate(stat.label);
            item.appendChild(labelDiv);

            const valueDiv = document.createElement('div');
            valueDiv.className = 'mobile-stat-value';
            valueDiv.style.display = 'flex';
            valueDiv.style.justifyContent = 'center';
            valueDiv.style.gap = '0';

            const builderSpan = document.createElement('span');
            builderSpan.textContent = stat.b?.toString() || '';
            builderSpan.style.paddingRight = '0.5em';
            builderSpan.style.borderRight = '1px dashed var(--inp_bdr_color)';
            builderSpan.style.height = 'auto';
            builderSpan.style.whiteSpace = 'wrap'

            const hangarSpan = document.createElement('span');
            hangarSpan.textContent = stat.h?.toString() || '';
            hangarSpan.style.paddingLeft = '0.5em';
            hangarSpan.style.height = 'auto';
            hangarSpan.style.whiteSpace = 'wrap'

            valueDiv.appendChild(builderSpan);
            valueDiv.appendChild(hangarSpan);
            item.appendChild(valueDiv);

            statGrid.appendChild(item);
        }

        statSection.content.appendChild(statGrid);
    }

    // === Weapons Section ===
    const weaponsSection = createMobileOptionItem(localization.translate('Derived Weapon Systems'), mobileGroup);
    weaponsSection.content.appendChild(createCenteredDividerGrid(
        formatWeaponsHTML(acft_builder),
        formatWeaponsHTML(acft_hangar)
    ));

    // === Electrics Section ===
    const electricsSection = createMobileOptionItem(localization.translate('Derived Electrics'), mobileGroup);
    electricsSection.content.appendChild(createCenteredDividerGrid(
        formatElectricsHTML(acft_builder),
        formatElectricsHTML(acft_hangar)
    ));

    // === Special Rules/Warnings Section ===
    const warningsSection = createMobileOptionItem(localization.translate('Derived Special Rules'), mobileGroup);
    warningsSection.content.appendChild(createCenteredDividerGrid(
        formatWarningsHTML(builderStats.warnings),
        formatWarningsHTML(hangarStats.warnings)
    ));

    container.appendChild(mobileGroup);
}

/**
 * Add a simple cell to the mobile comparison grid
 */
function addMobileCompCell(grid: HTMLElement, text: string, isHeader: boolean = false) {
    const cell = document.createElement('div');
    cell.textContent = text;
    cell.style.padding = '0.25em';
    if (isHeader) {
        cell.style.fontWeight = 'bold';
        cell.style.fontSize = '0.85em';
    }
    grid.appendChild(cell);
}

/**
 * Add a label cell (mobile-stat-label style)
 */
function addMobileCompLabel(grid: HTMLElement, text: string) {
    const item = document.createElement('div');
    item.className = 'mobile-stat-item';
    const label = document.createElement('div');
    label.className = 'mobile-stat-label';
    label.textContent = text;
    item.appendChild(label);
    grid.appendChild(item);
}

/**
 * Add a combined value cell with vertical dashed divider (mobile-stat-value style)
 */
function addMobileCompValueCell(grid: HTMLElement, builderVal: any, hangarVal: any) {
    const item = document.createElement('div');
    item.className = 'mobile-stat-item';

    const valueDiv = document.createElement('div');
    valueDiv.className = 'mobile-stat-value';
    valueDiv.style.display = 'flex';
    valueDiv.style.justifyContent = 'center';
    valueDiv.style.gap = '0';

    const builderSpan = document.createElement('span');
    builderSpan.textContent = builderVal?.toString() || '';
    builderSpan.style.paddingRight = '0.3em';
    builderSpan.style.borderRight = '1px dashed var(--inp_bdr_color)';

    const hangarSpan = document.createElement('span');
    hangarSpan.textContent = hangarVal?.toString() || '';
    hangarSpan.style.paddingLeft = '0.3em';

    valueDiv.appendChild(builderSpan);
    valueDiv.appendChild(hangarSpan);
    item.appendChild(valueDiv);

    grid.appendChild(item);
}

/**
 * Create a two-column grid with a centered vertical dashed divider
 */
function createCenteredDividerGrid(leftHTML: string, rightHTML: string): HTMLElement {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 0px 1fr';
    container.style.width = '100%';

    // Left column
    const leftDiv = document.createElement('div');
    leftDiv.style.paddingRight = '0.5em';
    leftDiv.innerHTML = leftHTML;
    container.appendChild(leftDiv);

    // Centered divider line (middle column with zero width, border creates the line)
    const divider = document.createElement('div');
    divider.style.borderLeft = '1px dashed var(--inp_bdr_color)';
    container.appendChild(divider);

    // Right column
    const rightDiv = document.createElement('div');
    rightDiv.style.paddingLeft = '0.5em';
    rightDiv.innerHTML = rightHTML;
    container.appendChild(rightDiv);

    return container;
}

/**
 * Format weapons HTML for an aircraft
 */
function formatWeaponsHTML(acft: AircraftBridge): string {
    let html = '';
    const bombs = acft.getBombCount();
    const rockets = acft.getRocketCount();
    let internal = acft.getInternalBombCount();

    // Display bombs
    if (bombs > 0) {
        const int_bomb = Math.min(bombs, internal);
        const ext_bomb = Math.max(0, bombs - int_bomb);
        if (int_bomb > 0) {
            html += `<div style="padding:0.25em 0;">${localization.translateWithParam('Bomb Mass Internally.', int_bomb)}</div>`;
        }
        if (ext_bomb > 0) {
            html += `<div style="padding:0.25em 0;">${localization.translateWithParam('Bomb Mass Externally.', ext_bomb)}</div>`;
        }
        if (int_bomb > 0) {
            const mib = Math.min(int_bomb, acft.getMaxBombSize());
            html += `<div style="padding:0.25em 0;">${localization.translateWithParam('Largest Internal Bomb', mib.toString())}</div>`;
        }
        internal -= int_bomb;
    }

    // Display rockets
    if (rockets > 0) {
        const int_rock = Math.min(rockets, internal);
        const ext_rock = Math.max(0, rockets - int_rock);
        if (int_rock > 0) {
            html += `<div style="padding:0.25em 0;">${localization.translateWithParam('Rocket Mass Internally.', int_rock)}</div>`;
        }
        if (ext_rock > 0) {
            html += `<div style="padding:0.25em 0;">${localization.translateWithParam('Rocket Mass Externally.', ext_rock)}</div>`;
        }
    }

    // Display weapon sets
    const weaponSetsCount = acft.getWeaponSetsCount();
    for (let i = 0; i < weaponSetsCount; i++) {
        const ws = acft.getWeaponSystemDisplayInfo(i);
        html += `<div style="padding:0.25em 0;">${ws}</div>`;
    }

    return html || '<em>None</em>';
}

/**
 * Format electrics HTML for an aircraft
 */
function formatElectricsHTML(acft: AircraftBridge): string {
    let html = '';
    const electrics = acft.getElectrics();

    if (electrics.storage > 0) {
        html += `<div style="display:flex;justify-content:space-between;gap:1em;padding:0.25em 0;"><span>${localization.translate('Derived Battery')}</span><span>${electrics.storage}</span></div>`;
    }

    for (const equip of electrics.equipment) {
        html += `<div style="display:flex;justify-content:space-between;gap:1em;padding:0.25em 0;"><span>${equip.source}</span><span>${equip.charge}</span></div>`;
    }

    return html || '<em>None</em>';
}

/**
 * Format warnings HTML with color coding
 */
function formatWarningsHTML(warnings: any[]): string {
    if (!warnings || warnings.length === 0) {
        return '<em>None</em>';
    }

    // Sort warnings by level (White=0, Yellow=1, Red=2)
    const levelToNum = (level: string): number => {
        if (level === 'Red') return 2;
        if (level === 'Yellow') return 1;
        return 0; // White
    };

    const sortedWarnings = [...warnings].sort((a: any, b: any) => {
        return levelToNum(a.level) - levelToNum(b.level);
    });

    let html = '';
    for (const w of sortedWarnings) {
        let color = 'var(--inp_txt_color)';
        if (w.level === 'Red') {
            color = '#FF0000';
        } else if (w.level === 'Yellow') {
            color = '#FFFF00';
        }
        html += `<div style="color:${color};padding:0.25em 0;">${w.name}: ${w.warning}</div>`;
    }

    return html;
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
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
