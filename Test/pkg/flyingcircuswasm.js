let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedInt16ArrayMemory0 = null;

function getInt16ArrayMemory0() {
    if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
        cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer);
    }
    return cachedInt16ArrayMemory0;
}

function getArrayI16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * Get propeller upgrade names
 * @returns {any}
 */
export function getPropellerUpgrades() {
    const ret = wasm.getPropellerUpgrades();
    return ret;
}

/**
 * Get electric motor winding names
 * @returns {any}
 */
export function getElectricWindings() {
    const ret = wasm.getElectricWindings();
    return ret;
}

/**
 * Get turbine type names
 * @returns {any}
 */
export function getTurbineTypes() {
    const ret = wasm.getTurbineTypes();
    return ret;
}

/**
 * Get propeller cooling type names
 * @returns {any}
 */
export function getPropellerCoolingTypes() {
    const ret = wasm.getPropellerCoolingTypes();
    return ret;
}

/**
 * Get propeller engine era names
 * @returns {any}
 */
export function getTurbineEras() {
    const ret = wasm.getTurbineEras();
    return ret;
}

export function init_panic_hook() {
    wasm.init_panic_hook();
}

/**
 * Get pulsejet valve type names
 * @returns {any}
 */
export function getPulsejetValveTypes() {
    const ret = wasm.getPulsejetValveTypes();
    return ret;
}

/**
 * @returns {any}
 */
export function getPropellerEras() {
    const ret = wasm.getPropellerEras();
    return ret;
}

/**
 * Calculate engine stats from EngineInputs
 * This is a standalone function that can be used by the engine builder UI
 * without needing to add the engine to the aircraft.
 * Accepts EngineInputs as JSON and returns EngineStats as JSON.
 * @param {any} engine_data
 * @returns {any}
 */
export function calculateEngineStats(engine_data) {
    const ret = wasm.calculateEngineStats(engine_data);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Get propeller compressor type names
 * @returns {any}
 */
export function getPropellerCompressorTypes() {
    const ret = wasm.getPropellerCompressorTypes();
    return ret;
}

const AircraftWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_aircraftwasm_free(ptr >>> 0, 1));
/**
 * Main Aircraft wrapper for WASM
 */
export class AircraftWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AircraftWasm.prototype);
        obj.__wbg_ptr = ptr;
        AircraftWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AircraftWasmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aircraftwasm_free(ptr, 0);
    }
    /**
     * Get the name of the currently selected era
     * @returns {string}
     */
    getEraText() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getEraText(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get electrical systems data
     * @returns {any}
     */
    getElectrics() {
        const ret = wasm.aircraftwasm_getElectrics(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for the selected era
     * @returns {any}
     */
    getEraStats() {
        const ret = wasm.aircraftwasm_getEraStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get landing gear type name
     * @returns {string}
     */
    getGearName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getGearName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get wing deck at index
     * @param {number} index
     * @returns {number | undefined}
     */
    getWingDeck(index) {
        const ret = wasm.aircraftwasm_getWingDeck(this.__wbg_ptr, index);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Delete a section at the given index
     * @param {number} index
     */
    deleteSection(index) {
        wasm.aircraftwasm_deleteSection(this.__wbg_ptr, index);
    }
    /**
     * Get bomb count
     * @returns {number}
     */
    getBombCount() {
        const ret = wasm.aircraftwasm_getBombCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for fuel
     * @returns {any}
     */
    getFuelStats() {
        const ret = wasm.aircraftwasm_getFuelStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for used part
     * @returns {any}
     */
    getUsedStats() {
        const ret = wasm.aircraftwasm_getUsedStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get number of wings
     * @returns {number}
     */
    getWingCount() {
        const ret = wasm.aircraftwasm_getWingCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    reset() {
        wasm.aircraftwasm_reset(this.__wbg_ptr);
    }
    /**
     * Add or update a custom part
     * @param {string} name
     * @param {any} stats_js
     */
    addCustomPart(name, stats_js) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.aircraftwasm_addCustomPart(this.__wbg_ptr, ptr0, len0, stats_js);
    }
    /**
     * Calculate all aircraft statistics
     */
    calculateStats() {
        wasm.aircraftwasm_calculateStats(this.__wbg_ptr);
    }
    /**
     * Get attack modifier values from all cockpit positions
     * @returns {Int16Array}
     */
    getAttackList() {
        const ret = wasm.aircraftwasm_getAttackList(this.__wbg_ptr);
        var v1 = getArrayI16FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 2, 2);
        return v1;
    }
    /**
     * Get stats for cargo
     * @returns {any}
     */
    getCargoStats() {
        const ret = wasm.aircraftwasm_getCargoStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get escape values from all cockpit positions
     * @returns {Int16Array}
     */
    getEscapeList() {
        const ret = wasm.aircraftwasm_getEscapeList(this.__wbg_ptr);
        var v1 = getArrayI16FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 2, 2);
        return v1;
    }
    /**
     * Get stats for rotor
     * @returns {any}
     */
    getRotorStats() {
        const ret = wasm.aircraftwasm_getRotorStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get flight stress values from all cockpit positions
     * @returns {any}
     */
    getStressList() {
        const ret = wasm.aircraftwasm_getStressList(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for wings
     * @returns {any}
     */
    getWingsStats() {
        const ret = wasm.aircraftwasm_getWingsStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get list of all custom parts
     * @returns {any}
     */
    getCustomParts() {
        const ret = wasm.aircraftwasm_getCustomParts(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a specific engine
     * @param {number} index
     * @returns {any}
     */
    getEngineStats(index) {
        const ret = wasm.aircraftwasm_getEngineStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get Era UI bindings (includes localized strings)
     * @returns {any}
     */
    getEraBindings() {
        const ret = wasm.aircraftwasm_getEraBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for frames
     * @returns {any}
     */
    getFramesStats() {
        const ret = wasm.aircraftwasm_getFramesStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if aircraft has flammable components
     * @returns {boolean}
     */
    getIsFlammable() {
        const ret = wasm.aircraftwasm_getIsFlammable(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get maximum operational altitude
     * @returns {number}
     */
    getMaxAltitude() {
        const ret = wasm.aircraftwasm_getMaxAltitude(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get minimum operational altitude
     * @returns {number}
     */
    getMinAltitude() {
        const ret = wasm.aircraftwasm_getMinAltitude(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get rocket count
     * @returns {number}
     */
    getRocketCount() {
        const ret = wasm.aircraftwasm_getRocketCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a specific weapon
     * @param {number} system_index
     * @param {number} weapon_index
     * @returns {any}
     */
    getWeaponStats(system_index, weapon_index) {
        const ret = wasm.aircraftwasm_getWeaponStats(this.__wbg_ptr, system_index, weapon_index);
        return ret;
    }
    /**
     * Check if wings are closed
     * @returns {boolean}
     */
    getWingsClosed() {
        const ret = wasm.aircraftwasm_getWingsClosed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if wings are in tandem configuration
     * @returns {boolean}
     */
    getWingsTandem() {
        const ret = wasm.aircraftwasm_getWingsTandem(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Update Era from UI bindings
     * @param {any} js_options
     */
    setEraBindings(js_options) {
        wasm.aircraftwasm_setEraBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Clear all engines from a non-constant list
     * @param {string} list_name
     */
    clearEngineList(list_name) {
        const ptr0 = passStringToWasm0(list_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.aircraftwasm_clearEngineList(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Duplicate a section at the given index
     * @param {number} index
     */
    duplicateSection(index) {
        wasm.aircraftwasm_duplicateSection(this.__wbg_ptr, index);
    }
    /**
     * Get current aircraft type
     * @returns {number}
     */
    getAircraftType() {
        const ret = wasm.aircraftwasm_getAircraftType(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a specific cockpit
     * @param {number} index
     * @returns {any}
     */
    getCockpitStats(index) {
        const ret = wasm.aircraftwasm_getCockpitStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get derived stats (performance characteristics)
     * @returns {any}
     */
    getDerivedStats() {
        const ret = wasm.aircraftwasm_getDerivedStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a all engines
     * @returns {any}
     */
    getEnginesStats() {
        const ret = wasm.aircraftwasm_getEnginesStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Fuel UI bindings
     * @returns {any}
     */
    getFuelBindings() {
        const ret = wasm.aircraftwasm_getFuelBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get maximum bomb size
     * @returns {number}
     */
    getMaxBombSize() {
        const ret = wasm.aircraftwasm_getMaxBombSize(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Used Part UI bindings
     * @returns {any}
     */
    getUsedBindings() {
        const ret = wasm.aircraftwasm_getUsedBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for weapons
     * @returns {any}
     */
    getWeaponsStats() {
        const ret = wasm.aircraftwasm_getWeaponsStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Remove a weapon set at the given index
     * @param {number} idx
     */
    removeWeaponSet(idx) {
        wasm.aircraftwasm_removeWeaponSet(this.__wbg_ptr, idx);
    }
    /**
     * Serialize to JSON string (for saved data)
     * @returns {string}
     */
    toJSON() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.aircraftwasm_toJSON(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Set aircraft type (0=Airplane, 1=Helicopter, 2=Autogyro, 3=OrnithopterBasic, 4=OrnithopterFlutter, 5=OrnithopterBuzzer)
     * @param {number} acft_type
     */
    setAircraftType(acft_type) {
        wasm.aircraftwasm_setAircraftType(this.__wbg_ptr, acft_type);
    }
    /**
     * Update Fuel from UI bindings
     * @param {any} js_options
     */
    setFuelBindings(js_options) {
        wasm.aircraftwasm_setFuelBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Used Part from UI bindings
     * @param {any} js_options
     */
    setUsedBindings(js_options) {
        wasm.aircraftwasm_setUsedBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Add an engine to a specific list
     * Creates the list if it doesn't exist
     * @param {string} list_name
     * @param {any} engine_data
     */
    addEngineToList(list_name, engine_data) {
        const ptr0 = passStringToWasm0(list_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.aircraftwasm_addEngineToList(this.__wbg_ptr, ptr0, len0, engine_data);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Get Cargo UI bindings
     * @returns {any}
     */
    getCargoBindings() {
        const ret = wasm.aircraftwasm_getCargoBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get number of cockpit positions
     * @returns {number}
     */
    getCockpitsCount() {
        const ret = wasm.aircraftwasm_getCockpitsCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a specific radiator
     * @param {number} index
     * @returns {any}
     */
    getRadiatorStats(index) {
        const ret = wasm.aircraftwasm_getRadiatorStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get Rotor UI bindings
     * @returns {any}
     */
    getRotorBindings() {
        const ret = wasm.aircraftwasm_getRotorBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Wings UI bindings
     * @returns {any}
     */
    getWingsBindings() {
        const ret = wasm.aircraftwasm_getWingsBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Remove a custom part by name
     * @param {string} name
     */
    removeCustomPart(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.aircraftwasm_removeCustomPart(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Update Cargo from UI bindings
     * @param {any} js_options
     */
    setCargoBindings(js_options) {
        wasm.aircraftwasm_setCargoBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Rotor from UI bindings
     * @param {any} js_options
     */
    setRotorBindings(js_options) {
        wasm.aircraftwasm_setRotorBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Wings from UI bindings
     * @param {any} js_options
     */
    setWingsBindings(js_options) {
        wasm.aircraftwasm_setWingsBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get Engine UI bindings for a specific engine
     * @param {number} index
     * @returns {any}
     */
    getEngineBindings(index) {
        const ret = wasm.aircraftwasm_getEngineBindings(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get all engines in a specific list with full data
     * @param {string} list_name
     * @returns {any}
     */
    getEnginesInList(list_name) {
        const ptr0 = passStringToWasm0(list_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.aircraftwasm_getEnginesInList(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get Frames UI bindings
     * @returns {any}
     */
    getFramesBindings() {
        const ret = wasm.aircraftwasm_getFramesBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for munitions
     * @returns {any}
     */
    getMunitionsStats() {
        const ret = wasm.aircraftwasm_getMunitionsStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for the selected propeller
     * @returns {any}
     */
    getPropellerStats() {
        const ret = wasm.aircraftwasm_getPropellerStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if used modifiers are at default (no damage/wear)
     * @returns {boolean}
     */
    getUsedIsDefault() {
        const ret = wasm.aircraftwasm_getUsedIsDefault(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get visibility values from all cockpit positions
     * @returns {Int16Array}
     */
    getVisibilityList() {
        const ret = wasm.aircraftwasm_getVisibilityList(this.__wbg_ptr);
        var v1 = getArrayI16FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 2, 2);
        return v1;
    }
    /**
     * Get Weapon UI bindings for a specific weapon in a weapon system
     * @param {number} system_index
     * @param {number} weapon_index
     * @returns {any}
     */
    getWeaponBindings(system_index, weapon_index) {
        const ret = wasm.aircraftwasm_getWeaponBindings(this.__wbg_ptr, system_index, weapon_index);
        return ret;
    }
    /**
     * Set quantity for a custom part by index
     * @param {number} idx
     * @param {number} qty
     */
    setCustomPartQty(idx, qty) {
        wasm.aircraftwasm_setCustomPartQty(this.__wbg_ptr, idx, qty);
    }
    /**
     * Update Engine from UI bindings
     * @param {number} index
     * @param {any} js_options
     */
    setEngineBindings(index, js_options) {
        wasm.aircraftwasm_setEngineBindings(this.__wbg_ptr, index, js_options);
    }
    /**
     * Update Frames from UI bindings
     * @param {any} js_options
     */
    setFramesBindings(js_options) {
        wasm.aircraftwasm_setFramesBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Weapon from UI bindings
     * @param {number} system_index
     * @param {number} weapon_index
     * @param {any} js_options
     */
    setWeaponBindings(system_index, weapon_index, js_options) {
        wasm.aircraftwasm_setWeaponBindings(this.__wbg_ptr, system_index, weapon_index, js_options);
    }
    /**
     * Duplicate a weapon set at the given index
     * @param {number} idx
     */
    duplicateWeaponSet(idx) {
        wasm.aircraftwasm_duplicateWeaponSet(this.__wbg_ptr, idx);
    }
    /**
     * Get Engines UI bindings (container with asymmetric flag and counts)
     * @returns {any}
     */
    getEnginesBindings() {
        const ret = wasm.aircraftwasm_getEnginesBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Frames Flammability
     * @returns {any}
     */
    getFramesFlammable() {
        const ret = wasm.aircraftwasm_getFramesFlammable(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get total passenger capacity (seats + beds)
     * @returns {number}
     */
    getPassengersCount() {
        const ret = wasm.aircraftwasm_getPassengersCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for passengers
     * @returns {any}
     */
    getPassengersStats() {
        const ret = wasm.aircraftwasm_getPassengersStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get reliability strings from all engines
     * @returns {string[]}
     */
    getReliabilityList() {
        const ret = wasm.aircraftwasm_getReliabilityList(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get Weapons UI bindings (container with weapon system count and brace count)
     * @returns {any}
     */
    getWeaponsBindings() {
        const ret = wasm.aircraftwasm_getWeaponsBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Update Engines from UI bindings
     * @param {any} js_options
     */
    setEnginesBindings(js_options) {
        wasm.aircraftwasm_setEnginesBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Weapons from UI bindings
     * @param {any} js_options
     */
    setWeaponsBindings(js_options) {
        wasm.aircraftwasm_setWeaponsBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get list of vital component names
     * @returns {string[]}
     */
    vitalComponentList() {
        const ret = wasm.aircraftwasm_vitalComponentList(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Deserialize from JSON string (for saved data)
     * @param {string} js_str
     */
    fromJSON(js_str) {
        const ptr0 = passStringToWasm0(js_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.aircraftwasm_fromJSON(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Get stats for accessories
     * @returns {any}
     */
    getAccessoriesStats() {
        const ret = wasm.aircraftwasm_getAccessoriesStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Cockpits UI bindings (includes localized strings)
     * @returns {any}
     */
    getCockpitsBindings() {
        const ret = wasm.aircraftwasm_getCockpitsBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get full EngineStats for a specific engine (includes rarity, overspeed, altitude, etc.)
     * @param {number} index
     * @returns {any}
     */
    getEngineFullStats(index) {
        const ret = wasm.aircraftwasm_getEngineFullStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get all available engine list names
     * @returns {any}
     */
    getEngineNamesOfLists() {
        const ret = wasm.aircraftwasm_getEngineNamesOfLists(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the number of engines
     * @returns {any}
     */
    getNumberOfEngines() {
        const ret = wasm.aircraftwasm_getNumberOfEngines(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Radiator UI bindings for a specific radiator
     * @param {number} index
     * @returns {any}
     */
    getRadiatorBindings(index) {
        const ret = wasm.aircraftwasm_getRadiatorBindings(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get stats for stabilizers
     * @returns {any}
     */
    getStabilizersStats() {
        const ret = wasm.aircraftwasm_getStabilizersStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get number of weapon sets
     * @returns {number}
     */
    getWeaponSetsCount() {
        const ret = wasm.aircraftwasm_getWeaponSetsCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get sesquiplane info: (is_sesquiplane, biggest_deck, super_small)
     * @returns {any}
     */
    getWingsSesquiplane() {
        const ret = wasm.aircraftwasm_getWingsSesquiplane(this.__wbg_ptr);
        return ret;
    }
    /**
     * Update Cockpits from UI bindings
     * @param {any} js_options
     */
    setCockpitsBindings(js_options) {
        wasm.aircraftwasm_setCockpitsBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Set the number of engines
     * @param {number} num
     */
    setNumberOfEngines(num) {
        wasm.aircraftwasm_setNumberOfEngines(this.__wbg_ptr, num);
    }
    /**
     * Update Radiator from UI bindings
     * @param {number} index
     * @param {any} js_options
     */
    setRadiatorBindings(index, js_options) {
        wasm.aircraftwasm_setRadiatorBindings(this.__wbg_ptr, index, js_options);
    }
    /**
     * Get communication system name
     * @returns {string}
     */
    getCommunicationName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getCommunicationName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get custom parts stats
     * @returns {any}
     */
    getCustomPartsStats() {
        const ret = wasm.aircraftwasm_getCustomPartsStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if frames are flying wing
     * @returns {boolean}
     */
    getFramesFlyingWing() {
        const ret = wasm.aircraftwasm_getFramesFlyingWing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get stats for landing gear
     * @returns {any}
     */
    getLandingGearStats() {
        const ret = wasm.aircraftwasm_getLandingGearStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Munitions UI bindings
     * @returns {any}
     */
    getMunitionsBindings() {
        const ret = wasm.aircraftwasm_getMunitionsBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for optimization
     * @returns {any}
     */
    getOptimizationStats() {
        const ret = wasm.aircraftwasm_getOptimizationStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Propeller UI bindings (includes localized strings)
     * @returns {any}
     */
    getPropellerBindings() {
        const ret = wasm.aircraftwasm_getPropellerBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Radiator flammability
     * @param {number} index
     * @returns {any}
     */
    getRadiatorFlammable(index) {
        const ret = wasm.aircraftwasm_getRadiatorFlammable(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Serialize to LZ-compressed string (for URLs)
     * @returns {string}
     */
    serializeToLZString() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.aircraftwasm_serializeToLZString(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Update Munitions from UI bindings
     * @param {any} js_options
     */
    setMunitionsBindings(js_options) {
        wasm.aircraftwasm_setMunitionsBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Propeller from UI bindings
     * @param {any} js_options
     */
    setPropellerBindings(js_options) {
        wasm.aircraftwasm_setPropellerBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get aircraft type names for UI dropdown
     * @returns {any}
     */
    static getAircraftTypeNames() {
        const ret = wasm.aircraftwasm_getAircraftTypeNames();
        return ret;
    }
    /**
     * Get internal bomb storage count
     * @returns {number}
     */
    getInternalBombCount() {
        const ret = wasm.aircraftwasm_getInternalBombCount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the number of radiators
     * @returns {any}
     */
    getNumberOfRadiators() {
        const ret = wasm.aircraftwasm_getNumberOfRadiators(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Passengers UI bindings
     * @returns {any}
     */
    getPassengersBindings() {
        const ret = wasm.aircraftwasm_getPassengersBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get stats for a specific weapon system
     * @param {number} index
     * @returns {any}
     */
    getWeaponSystemStats(index) {
        const ret = wasm.aircraftwasm_getWeaponSystemStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Check if custom parts are in default state (all quantities zero)
     * @returns {boolean}
     */
    isCustomPartsDefault() {
        const ret = wasm.aircraftwasm_isCustomPartsDefault(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Set the number of radiators
     * @param {number} num
     */
    setNumberOfRadiators(num) {
        wasm.aircraftwasm_setNumberOfRadiators(this.__wbg_ptr, num);
    }
    /**
     * Update Passengers from UI bindings
     * @param {any} js_options
     */
    setPassengersBindings(js_options) {
        wasm.aircraftwasm_setPassengersBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get Accessories UI bindings
     * @returns {any}
     */
    getAccessoriesBindings() {
        const ret = wasm.aircraftwasm_getAccessoriesBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get derived stats for a specific engine (calculated values like reliability)
     * @param {number} index
     * @returns {any}
     */
    getEngineDerivedStats(index) {
        const ret = wasm.aircraftwasm_getEngineDerivedStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get all engine names in a specific list
     * @param {string} list_name
     * @returns {any}
     */
    getEngineNamesInList(list_name) {
        const ptr0 = passStringToWasm0(list_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.aircraftwasm_getEngineNamesInList(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get the selected engine list name for a specific engine
     * @param {number} index
     * @returns {string}
     */
    getEngineSelectedList(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getEngineSelectedList(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the selected engine name for a specific engine
     * @param {number} index
     * @returns {string}
     */
    getEngineSelectedName(index) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getEngineSelectedName(this.__wbg_ptr, index);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get stats for reinforcements
     * @returns {any}
     */
    getReinforcementsStats() {
        const ret = wasm.aircraftwasm_getReinforcementsStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Stabilizers UI bindings
     * @returns {any}
     */
    getStabilizersBindings() {
        const ret = wasm.aircraftwasm_getStabilizersBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Update Accessories from UI bindings
     * @param {any} js_options
     */
    setAccessoriesBindings(js_options) {
        wasm.aircraftwasm_setAccessoriesBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Set the selected engine list for a specific engine
     * @param {number} index
     * @param {string} list_name
     */
    setEngineSelectedList(index, list_name) {
        const ptr0 = passStringToWasm0(list_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.aircraftwasm_setEngineSelectedList(this.__wbg_ptr, index, ptr0, len0);
    }
    /**
     * Update Stabilizers from UI bindings
     * @param {any} js_options
     */
    setStabilizersBindings(js_options) {
        wasm.aircraftwasm_setStabilizersBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get derived stats for a specific cockpit (flight stress, escape, visibility)
     * @param {number} index
     * @returns {any}
     */
    getCockpitDerivedStats(index) {
        const ret = wasm.aircraftwasm_getCockpitDerivedStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get LandingGear UI bindings
     * @returns {any}
     */
    getLandingGearBindings() {
        const ret = wasm.aircraftwasm_getLandingGearBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Optimization UI bindings
     * @returns {any}
     */
    getOptimizationBindings() {
        const ret = wasm.aircraftwasm_getOptimizationBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set the selected engine by index within its current list
     * @param {number} index
     * @param {number} engine_index
     */
    setEngineSelectedIndex(index, engine_index) {
        wasm.aircraftwasm_setEngineSelectedIndex(this.__wbg_ptr, index, engine_index);
    }
    /**
     * Update LandingGear from UI bindings
     * @param {any} js_options
     */
    setLandingGearBindings(js_options) {
        wasm.aircraftwasm_setLandingGearBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Update Optimization from UI bindings
     * @param {any} js_options
     */
    setOptimizationBindings(js_options) {
        wasm.aircraftwasm_setOptimizationBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Deserialize from LZ-compressed string (for URLs)
     * @param {string} lz_str
     * @returns {AircraftWasm}
     */
    static deserializeFromLZString(lz_str) {
        const ptr0 = passStringToWasm0(lz_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.aircraftwasm_deserializeFromLZString(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AircraftWasm.__wrap(ret[0]);
    }
    /**
     * Get stats for control surfaces
     * @returns {any}
     */
    getControlSurfacesStats() {
        const ret = wasm.aircraftwasm_getControlSurfacesStats(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if frames can be flying wing (lifting body)
     * @returns {boolean}
     */
    getFramesCanFlyingWing() {
        const ret = wasm.aircraftwasm_getFramesCanFlyingWing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get number of available optimizations
     * @returns {any}
     */
    getOptimizationAvailable() {
        const ret = wasm.aircraftwasm_getOptimizationAvailable(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get WeaponSystem UI bindings for a specific weapon system
     * @param {number} index
     * @returns {any}
     */
    getWeaponSystemBindings(index) {
        const ret = wasm.aircraftwasm_getWeaponSystemBindings(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Update WeaponSystem from UI bindings
     * @param {number} index
     * @param {any} js_options
     */
    setWeaponSystemBindings(index, js_options) {
        wasm.aircraftwasm_setWeaponSystemBindings(this.__wbg_ptr, index, js_options);
    }
    /**
     * Get Reinforcements UI bindings
     * @returns {any}
     */
    getReinforcementsBindings() {
        const ret = wasm.aircraftwasm_getReinforcementsBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Update Reinforcements from UI bindings
     * @param {any} js_options
     */
    setReinforcementsBindings(js_options) {
        wasm.aircraftwasm_setReinforcementsBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get ControlSurfaces UI bindings
     * @returns {any}
     */
    getControlSurfacesBindings() {
        const ret = wasm.aircraftwasm_getControlSurfacesBindings(this.__wbg_ptr);
        return ret;
    }
    /**
     * Update ControlSurfaces from UI bindings
     * @param {any} js_options
     */
    setControlSurfacesBindings(js_options) {
        wasm.aircraftwasm_setControlSurfacesBindings(this.__wbg_ptr, js_options);
    }
    /**
     * Get flap cost based on dry MP (for display purposes)
     * @param {number} dry_mp
     * @returns {number}
     */
    getControlSurfacesFlapCost(dry_mp) {
        const ret = wasm.aircraftwasm_getControlSurfacesFlapCost(this.__wbg_ptr, dry_mp);
        return ret;
    }
    /**
     * Get WeaponSystem display information for derived stats UI
     * @param {number} index
     * @returns {any}
     */
    getWeaponSystemDisplayInfo(index) {
        const ret = wasm.aircraftwasm_getWeaponSystemDisplayInfo(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Get WeaponSystem derived stats for display
     * @param {number} index
     * @returns {any}
     */
    getWeaponSystemDerivedStats(index) {
        const ret = wasm.aircraftwasm_getWeaponSystemDerivedStats(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * Create a new aircraft
     */
    constructor() {
        const ret = wasm.aircraftwasm_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AircraftWasmFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get aircraft name
     * @returns {string}
     */
    getName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.aircraftwasm_getName(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Set aircraft name
     * @param {string} name
     */
    setName(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.aircraftwasm_setName(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Get base stats
     * @returns {any}
     */
    getStats() {
        const ret = wasm.aircraftwasm_getStats(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) AircraftWasm.prototype[Symbol.dispose] = AircraftWasm.prototype.free;

const LocalizationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_localization_free(ptr >>> 0, 1));
/**
 * Localization API for managing translations
 *
 * This is a pass-through wrapper for the localization functions in flyingcircusrust
 */
export class Localization {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LocalizationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_localization_free(ptr, 0);
    }
    /**
     * Get current locale
     * @returns {string}
     */
    static getLocale() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.localization_getLocale();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Set the current locale
     * @param {string} locale
     */
    static setLocale(locale) {
        const ptr0 = passStringToWasm0(locale, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.localization_setLocale(ptr0, len0);
    }
    /**
     * Translate a key with one parameter substitution
     * The translation string should contain %{A} which will be replaced with the value
     * @param {string} key
     * @param {string} value
     * @returns {string}
     */
    static translateWithParam(key, value) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.localization_translateWithParam(ptr0, len0, ptr1, len1);
            deferred3_0 = ret[0];
            deferred3_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Get list of available languages
     * @returns {string[]}
     */
    static getAvailableLanguages() {
        const ret = wasm.localization_getAvailableLanguages();
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Translate a single key
     * @param {string} key
     * @returns {string}
     */
    static translate(key) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.localization_translate(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
}
if (Symbol.dispose) Localization.prototype[Symbol.dispose] = Localization.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_Error_e83987f665cf5504 = function(arg0, arg1) {
        const ret = Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_Number_bb48ca12f395cd08 = function(arg0) {
        const ret = Number(arg0);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg___wbindgen_boolean_get_6d5a1ee65bab5f68 = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? v : undefined;
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg___wbindgen_debug_string_df47ffb5e35e6763 = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_in_bb933bd9e1b3bc0f = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_bigint_cb320707dcd35f0b = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_function_ee8a6c5833c90377 = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_object_c818261d21f283a4 = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_string_fbb76cb2940daafd = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_undefined_2d472862bd29a478 = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_jsval_eq_6b13ab83478b1c50 = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_jsval_loose_eq_b664b38a2f582147 = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_number_get_a20bf9b85341449d = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg___wbindgen_string_get_e4f06c90489ad01b = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_call_e762c39fa8ea36bf = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_2042aa2670fb1db1 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_entries_e171b586f8f6bdbf = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_get_7bed016f185add81 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_get_efcb449f58ec27c2 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_with_ref_key_1dc361bd10053bfe = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_70beb1189ca63b38 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Map_8579b5e2ab5437c7 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_20c8e73002f7af98 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_96e0af9891d0945d = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_d216eda7911dde36 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_e5822695327a3c39 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_69bca3cb64fc8748 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_cdd215e10d9dd507 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_new_1acc0b6eea89d040 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_5a79be3ab53b8aa5 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_68651c719dcda04e = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_e17d9f43105b08be = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_next_020810e0ae8ebcb0 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_2c826fe5dfec6b6a = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_prototypesetcall_2a6620b6922694b2 = function(arg0, arg1, arg2) {
        Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_907fb406c34a251d = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_set_c213c871859d6500 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_692627309814bb8c = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function(arg0) {
        // Cast intrinsic for `U64 -> Externref`.
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_cast_9ae0607507abb057 = function(arg0) {
        // Cast intrinsic for `I64 -> Externref`.
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedInt16ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('flyingcircuswasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
