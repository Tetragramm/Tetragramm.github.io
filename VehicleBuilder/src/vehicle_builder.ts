import { LZString } from "./lz/lz-string";
import { _stringToArrayBuffer, _arrayBufferToString, SetAnimationEnabled, CreateTH, CreateCheckbox, CreateInput, CreateLabel } from "./disp/Tools";
import { Deserialize } from "./impl/Serialize";
import { Vehicle } from "./impl/Vehicle";
import { VehDisp } from "./disp/Vehicle";
import { scrollToFragment } from "./scroll/scroll";


const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var test = sp.get("test");

    //Weapons bit2
    vehicle_model = new Vehicle();
    vehicle_display = new VehDisp(vehicle_model);
    vehicle_model.CalculateStats();

    SetAnimationEnabled(true);

    window.addEventListener("load", () => {
        scrollToFragment();
        setTimeout(() => { window.onscroll = debounce(SetScroll, 250); }, 1000);
    });

    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            var active = this.classList.toggle("active");
            var content = this.nextElementSibling;
            content = content.nextElementSibling;
            if (!active) {
                content.style.maxHeight = "0px";
            } else {
                content.style.maxHeight = "inherit";
            }
        });
    }
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
    const IDs = ["Fight", "Machinery", "Crew", "Weapons", "Accessories", "Stats"];
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

var vehicle_model: Vehicle;
var vehicle_display: VehDisp;
