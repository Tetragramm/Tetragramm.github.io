import { scrollToFragment } from "../../Test/src/scroll/scroll";

// WASM Integration for Helicopter
import { helicopterWasmApp } from "./wasm_init_helicopter";

const init = async () => {
    // Try to initialize WASM first
    try {
        await helicopterWasmApp.initialize();
        console.log("[HelicopterBuilder] WASM initialized successfully");
    } catch (e) {
        console.error("[HelicopterBuilder] WASM not available, Panic!", e);
    }

    window.addEventListener("load", () => {
        scrollToFragment();
        setTimeout(() => { window.onscroll = debounce(SetScroll, 250); }, 1000);
    });
}
window.addEventListener("DOMContentLoaded", init);

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}

var hash = "";
function SetScroll(ev) {
    const IDs = ["Era", "Cockpit", "Passengers", "Engines", "Frames", "Tail", "Rotors", "Stabilizers", "Reinforcements", "Weapons", "Load", "Landing_Gear", "Accessories", "Propeller", "Optimization", "Stats", "Flight"];
    var newhash = "";
    var off = window.pageYOffset;
    for (let id of IDs) {
        const elem = document.getElementById(id);
        if (elem && elem.offsetTop != 0) {
            if (off > elem.offsetTop) {
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
