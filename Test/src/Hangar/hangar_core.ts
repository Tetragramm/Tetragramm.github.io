/**
 * Shared hangar logic for both the airplane and helicopter pages.
 *
 * The two pages run identical UI and identical aircraft-handling code; they
 * differ only in the localStorage prefix ("test." vs "helicopter."). The entry
 * scripts (./hangar.ts and ../../../Helicopter/src/Hangar/helicopter_hangar.ts)
 * import runHangar() from here and pass the appropriate prefix.
 */

import { localization } from '../wasm/localization';
import { AircraftBridge } from "../wasm/aircraft_bridge";
import { DEFAULT_AIRPLANE_LZ, HANGAR_SEED_LZ } from "../wasm/default_aircraft";
import { DerivedStatsUI } from "../wasm/components/derived_stats_ui";
import { BlinkBad, BlinkNeutral, createMobileOptionItem } from "../wasm/dom_utils"
import { JSON2CSV } from "../JSON2CSV/json2csv";

type WasmModule = typeof import('../../pkg/flyingcircuswasm');

/** localStorage key prefix, set by runHangar(). All keys are `${prefix}.something`. */
let prefix: string = "test";

let wasmModule: WasmModule | null = null;
let acft_builder: AircraftBridge;
let stats_builder: DerivedStatsUI;
let acft_hangar: AircraftBridge;
let stats_hangar: DerivedStatsUI;

let name_builder: HTMLInputElement;
let select_hangar: HTMLSelectElement;
let select_acft: HTMLSelectElement;
let chosen_hangar: string;

/**
 * Bootstrap the hangar page. Call once from an entry script with the
 * page-specific localStorage prefix (e.g. "test" or "helicopter").
 */
export async function runHangar(storagePrefix: string): Promise<void> {
    prefix = storagePrefix;

    console.log('[Hangar] init?...');
    try {
        console.log('[Hangar] Loading WASM module...');
        wasmModule = await loadWasmModule();
        if (!wasmModule) {
            console.error('[Hangar] WASM module not available');
            return;
        }
        wasmModule.init_panic_hook();
        console.log("[Hangar] WASM initialized successfully");

        localization.initializeWasm(wasmModule.Localization);
        console.log('[Hangar] Localization initialized');

        await InitHTML();
        await InitStats();
        await LoadFromHangar(0);
        console.log('[Hangar] Initialization complete');
    } catch (e) {
        console.error('[Hangar] Failed to initialize:', e);
    }
}

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
        acft_builder.initialize(wasmModule!.AircraftWasm);
        acft_builder.fromJSON(json);
        acft_builder.loadEngineListsFromLocalStorage();
        acft_builder.calculateStats();

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
    json_btn.onchange = async () => {
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
    hangar_load.onchange = async () => {
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
                window.localStorage.setItem(`${prefix}.hangar.` + name, reader.result as string);
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
                const loadedBridge = AircraftBridge.deserializeFromLZString(
                    acft,
                    wasmModule!.AircraftWasm,
                    false
                );
                loadedBridge.loadEngineListsFromLocalStorage();
                loadedBridge.calculateStats();

                const stats = loadedBridge.getStats();
                const dstats = loadedBridge.getDerivedStats();

                const entries = Object.entries<any>(dstats);
                entries.splice(0, 0, ["name", loadedBridge.getName()]);
                entries.splice(1, 0, ["cost", stats.cost]);
                entries.splice(2, 0, ["upkeep", stats.upkeep]);
                entries.splice(3, 0, ["bomb_mass", stats.bomb_mass]);
                entries.splice(4, 0, ["escape", loadedBridge.getEscapeList().join("/")]);
                entries.splice(5, 0, ["crash", loadedBridge.getCrashList().join("/")]);
                entries.splice(6, 0, ["stress", formatStressList(loadedBridge.getStressList())]);

                const dstatsn = Object.fromEntries(entries);
                DerivedStats.push(dstatsn);
            } catch (e) {
                console.error("Failed to load aircraft for CSV:", e);
            }
        }

        // Restore original hangar aircraft
        acft_hangar = AircraftBridge.fromJSON(curr_acft, wasmModule!.AircraftWasm, false);
        acft_hangar.loadEngineListsFromLocalStorage();

        const json2csv = new JSON2CSV();
        download(json2csv.convert(DerivedStats, { separator: ',', flatten: true, output_csvjson_variant: false }), chosen_hangar + ".csv", "csv");
    }
}

async function loadWasmModule(): Promise<WasmModule | null> {
    try {
        return await import('../../pkg/flyingcircuswasm');
    } catch (e) {
        console.warn('[Hangar] WASM module not found (not yet built):', e);
        return null;
    }
}

async function InitStats() {
    const acft_data = window.localStorage.getItem(`${prefix}.aircraft`);

    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder = new AircraftBridge();
            acft_builder.setAutoSaveToLocalStorage(false);
            acft_builder.initialize(wasmModule!.AircraftWasm);
            acft_builder.fromJSON(acft_data);
        } catch (e) {
            console.error("Saved Data Failed:", e);
            acft_builder = AircraftBridge.deserializeFromLZString(DEFAULT_AIRPLANE_LZ, wasmModule!.AircraftWasm, false);
        }
    } else {
        acft_builder = AircraftBridge.deserializeFromLZString(DEFAULT_AIRPLANE_LZ, wasmModule!.AircraftWasm, false);
    }
    acft_builder.calculateStats();

    stats_builder = new DerivedStatsUI(
        () => acft_builder,
        'table_builder',
        () => { /* No update callback needed for hangar */ }
    );
    stats_builder.setShowBombs(true);
    stats_builder.render(true);

    // Create hangar aircraft (will be loaded in LoadFromHangar)
    acft_hangar = AircraftBridge.deserializeFromLZString(DEFAULT_AIRPLANE_LZ, wasmModule!.AircraftWasm, false);

    stats_hangar = new DerivedStatsUI(
        () => acft_hangar,
        'table_hangar',
        () => { /* No update callback needed for hangar */ }
    );
    stats_hangar.setShowBombs(true);
}

function LoadHangarList(): string[] {
    const key = `${prefix}.hangar_names`;
    if (!window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, JSON.stringify(["Default"]));
    }
    let hangar_list: string[] = JSON.parse(window.localStorage.getItem(key));
    if (hangar_list.length == 0) {
        window.localStorage.setItem(key, JSON.stringify(["Default"]));
        hangar_list = JSON.parse(window.localStorage.getItem(key));
    }
    return hangar_list;
}

function LoadAcftList(): { names: string[], acft: string[] } {
    const key = `${prefix}.hangar.` + chosen_hangar;
    let acft_list: { names: string[], acft: string[] };
    if (window.localStorage.getItem(key)) {
        acft_list = JSON.parse(window.localStorage.getItem(key));
    } else {
        acft_list = {
            names: ["Basic Biplane"],
            acft: [HANGAR_SEED_LZ]
        };
        window.localStorage.setItem(key, JSON.stringify(acft_list));
    }
    return acft_list;
}

async function LoadFromHangar(idx: number) {
    const acft_list = LoadAcftList();
    try {
        acft_hangar = AircraftBridge.deserializeFromLZString(acft_list.acft[idx], wasmModule!.AircraftWasm, false);
        acft_hangar.calculateStats();
    } catch (e) {
        console.error("Failed to load aircraft from hangar:", e);
        acft_hangar = AircraftBridge.deserializeFromLZString(HANGAR_SEED_LZ, wasmModule!.AircraftWasm, false);
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
        window.localStorage.removeItem(`${prefix}.hangar.` + name);
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
    window.localStorage.setItem(`${prefix}.hangar.` + chosen_hangar, JSON.stringify(acft_list));
    RefreshAcftSelect(acft_list);
}

function SaveHangarList(hangar_list: string[]) {
    window.localStorage.setItem(`${prefix}.hangar_names`, JSON.stringify(hangar_list));
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
            loadedBridge.initialize(wasmModule!.AircraftWasm);
            loadedBridge.setAutoSaveToLocalStorage(false);
            loadedBridge.fromJSON(str);
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

    const mobileComp = document.getElementById("Compare_Mobile");
    if (mobileComp) {
        MergeMobile(mobileComp);
    }
}

function MergeTables(tbl1: HTMLTableElement, tbl2: HTMLTableElement, tbl3: HTMLTableElement) {
    while (tbl3.lastChild) {
        tbl3.removeChild(tbl3.lastChild);
    }

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

    const mobileGroup = document.createElement('div');
    mobileGroup.className = 'mobile-option-group';

    // === Name/Selection Section ===
    const nameSection = createMobileOptionItem('', mobileGroup);
    nameSection.content.style.display = 'grid';
    nameSection.content.style.gridTemplateColumns = '1fr 1fr';
    nameSection.content.style.gap = '1em';

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

    addMobileCompCell(costGrid, '', true);
    addMobileCompCell(costGrid, localization.translate('Aircraft From Builder') || 'Builder', true);
    addMobileCompCell(costGrid, localization.translate('Aircraft From Hangar') || 'Hangar', true);

    addMobileCompCell(costGrid, localization.translate('Stat Cost'), true);
    addMobileCompCell(costGrid, builderStats.cost.toString() + 'þ');
    addMobileCompCell(costGrid, hangarStats.cost.toString() + 'þ');

    addMobileCompCell(costGrid, localization.translate('Stat Upkeep'), true);
    addMobileCompCell(costGrid, builderStats.upkeep.toString() + 'þ');
    addMobileCompCell(costGrid, hangarStats.upkeep.toString() + 'þ');

    costSection.content.appendChild(costGrid);

    // === Mass Variations Section ===
    const massSection = createMobileOptionItem(localization.translate('Derived Mass Variations'), mobileGroup);
    const massGrid = document.createElement('div');
    massGrid.className = 'mobile-stats-grid';
    massGrid.style.gridTemplateColumns = 'auto repeat(5, 1fr)';

    addMobileCompCell(massGrid, '', true);
    addMobileCompLabel(massGrid, localization.translate('Derived Boost'));
    addMobileCompLabel(massGrid, localization.translate('Derived Handling'));
    addMobileCompLabel(massGrid, localization.translate('Derived Rate of Climb'));
    addMobileCompLabel(massGrid, localization.translate('Derived Stall Speed'));
    addMobileCompLabel(massGrid, localization.translate('Derived Top Speed'));

    addMobileCompLabel(massGrid, localization.translate('Derived Full Fuel'));
    addMobileCompValueCell(massGrid, builderDerived.boost_full, hangarDerived.boost_full);
    addMobileCompValueCell(massGrid, builderDerived.handling_full, hangarDerived.handling_full);
    addMobileCompValueCell(massGrid, builderDerived.rate_of_climb_full, hangarDerived.rate_of_climb_full);
    addMobileCompValueCell(massGrid, builderDerived.stall_speed_full, hangarDerived.stall_speed_full);
    addMobileCompValueCell(massGrid, Math.floor(1.0e-6 + builderDerived.max_speed_full), Math.floor(1.0e-6 + hangarDerived.max_speed_full));

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

    addMobileCompLabel(massGrid, localization.translate('Derived Empty Fuel'));
    addMobileCompValueCell(massGrid, 0, 0);
    addMobileCompValueCell(massGrid, builderDerived.handling_empty, hangarDerived.handling_empty);
    addMobileCompValueCell(massGrid, 0, 0);
    addMobileCompValueCell(massGrid, builderDerived.stall_speed_empty, hangarDerived.stall_speed_empty);
    addMobileCompValueCell(massGrid, 0, 0);

    massSection.content.appendChild(massGrid);

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

    const weaponsSection = createMobileOptionItem(localization.translate('Derived Weapon Systems'), mobileGroup);
    weaponsSection.content.appendChild(createCenteredDividerGrid(
        formatWeaponsHTML(acft_builder),
        formatWeaponsHTML(acft_hangar)
    ));

    const electricsSection = createMobileOptionItem(localization.translate('Derived Electrics'), mobileGroup);
    electricsSection.content.appendChild(createCenteredDividerGrid(
        formatElectricsHTML(acft_builder),
        formatElectricsHTML(acft_hangar)
    ));

    const warningsSection = createMobileOptionItem(localization.translate('Derived Special Rules'), mobileGroup);
    warningsSection.content.appendChild(createCenteredDividerGrid(
        formatWarningsHTML(builderStats.warnings),
        formatWarningsHTML(hangarStats.warnings)
    ));

    container.appendChild(mobileGroup);
}

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

function addMobileCompLabel(grid: HTMLElement, text: string) {
    const item = document.createElement('div');
    item.className = 'mobile-stat-item';
    const label = document.createElement('div');
    label.className = 'mobile-stat-label';
    label.textContent = text;
    item.appendChild(label);
    grid.appendChild(item);
}

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

function createCenteredDividerGrid(leftHTML: string, rightHTML: string): HTMLElement {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 0px 1fr';
    container.style.width = '100%';

    const leftDiv = document.createElement('div');
    leftDiv.style.paddingRight = '0.5em';
    leftDiv.innerHTML = leftHTML;
    container.appendChild(leftDiv);

    const divider = document.createElement('div');
    divider.style.borderLeft = '1px dashed var(--inp_bdr_color)';
    container.appendChild(divider);

    const rightDiv = document.createElement('div');
    rightDiv.style.paddingLeft = '0.5em';
    rightDiv.innerHTML = rightHTML;
    container.appendChild(rightDiv);

    return container;
}

function formatWeaponsHTML(acft: AircraftBridge): string {
    let html = '';
    const bombs = acft.getBombCount();
    const rockets = acft.getRocketCount();
    let internal = acft.getInternalBombCount();

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

    const weaponSetsCount = acft.getWeaponSetsCount();
    for (let i = 0; i < weaponSetsCount; i++) {
        const ws = acft.getWeaponSystemDisplayInfo(i);
        html += `<div style="padding:0.25em 0;">${ws}</div>`;
    }

    return html || '<em>None</em>';
}

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

function formatWarningsHTML(warnings: any[]): string {
    if (!warnings || warnings.length === 0) {
        return '<em>None</em>';
    }

    const levelToNum = (level: string): number => {
        if (level === 'Red') return 2;
        if (level === 'Yellow') return 1;
        return 0;
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
