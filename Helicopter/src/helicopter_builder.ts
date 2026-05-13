import { scrollToFragment } from "../../Test/src/scroll/scroll";

// Helicopter WASM Integration
import { wasmApp } from "./wasm_init_helicopter";

const init = async () => {
    try {
        await wasmApp.initialize();
        console.log("[HelicopterBuilder] WASM initialized successfully");
    } catch (e) {
        console.error("[HelicopterBuilder] WASM not available, Panic!", e);
    }
};
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
    };
}

var hash = "";
function SetScroll(_ev) {
    const IDs = ["Era",
        "Cockpit",
        "Passengers",
        "Engines",
        "Frames",
        "Rotors",
        "Stabilizers",
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
        const el = document.getElementById(id);
        if (el && el.offsetTop !== 0) {
            if (off > el.offsetTop) {
                newhash = id;
            } else {
                break;
            }
        }
    }
    if (hash !== newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}
