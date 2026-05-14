import { scrollToFragment } from "./scroll/scroll";
import { WasmApplication } from "./wasm_init";

const init = async () => {
    try {
        const wasmApp = new WasmApplication();
        await wasmApp.initialize();
        console.log("[PlaneBuilder] WASM initialized successfully");
    } catch (e) {
        console.error("[PlaneBuilder] WASM not available, Panic!", e);
    }
}
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("load", () => {
    scrollToFragment();
    setTimeout(() => { window.onscroll = debounce(SetScroll, 250); }, 1000);
});

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}

var hash = "";
function SetScroll(ev) {
    const IDs = ["Era",
        "Cockpit",
        "Passengers",
        "Engines",
        "Frames",
        "Wings",
        "Rotors",
        "Stabilizers",
        "ControlSurfaces",
        "Reinforcements",
        "Weapons", "Load",
        "Landing_Gear",
        "Accessories",
        "Propeller",
        "Optimization",
        "Stats",
        "Flight"];
    var newhash = "";
    var off = window.pageYOffset;
    for (let id of IDs) {
        if (document.getElementById(id).offsetTop != 0) {
            if (off > document.getElementById(id).offsetTop) {
                newhash = id;
            } else {
                break;
            }
        }
    }
    if (hash != newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}