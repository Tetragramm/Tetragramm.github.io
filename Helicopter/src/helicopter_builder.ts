import { Helicopter_HTML } from "./Helicopter_HTML";
import { Helicopter } from "./Helicopter";

import { SetEngineLists } from "../../Test/src/impl/EngineList";
import { Deserialize } from "../../Test/src/impl/Serialize";
import { _stringToArrayBuffer } from "../../Test/src/disp/Tools";
import { AIRCRAFT_TYPE } from "../../Test/src/impl/Part";

import * as parts_JSON from "./parts.json";
import { SetAnimationEnabled } from "../../Test/src/disp/Tools";
import { localization } from "../../Test/src/impl/Localization";
import { scrollToFragment } from "../../Test/src/scroll/scroll";
import { LZString } from "../../Test/src/lz/lz-string";

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var lang = sp.get("lang");

    if (lang) {
        localization.SetCurrentLanguage(lang);
    } else if (window.localStorage.language) {
        localization.SetCurrentLanguage(window.localStorage.language);
    }

    //Parts bit
    let acft_data = window.localStorage.getItem("test.helicopter");

    //Engine bit
    var nameliststr = window.localStorage.getItem("test.engines_names");
    SetEngineLists(nameliststr);

    //Weapons bit
    helicopter_model = new Helicopter(parts_JSON, true);
    helicopter_display = new Helicopter_HTML(parts_JSON, helicopter_model);

    var loaded = false;
    if (qp && !loaded) {
        console.log("Used Query Parameter");
        var oldplane = false;
        try {
            var str = LZString.decompressFromEncodedURIComponent(qp);
            var arr = _stringToArrayBuffer(str);
            var des = new Deserialize(arr);
            if (des.version < 12.25 && des.CheckLastNum() == AIRCRAFT_TYPE.AIRPLANE) {
                oldplane = true;
            }
            helicopter_model.deserialize(des);
            loaded = true;
        } catch (e) {
            console.log("Compressed Query Parameter Failed."); console.log(e); helicopter_model.Reset();

            if (oldplane) {
                window.history.replaceState(null, null, "/PlaneBuilder/index.html?json=" + qp);
                window.history.go();
            }
        }
    }
    if (acft_data && !loaded) {
        console.log("Used Saved Data");
        try {
            loaded = helicopter_model.fromJSON(JSON.parse(acft_data));
        } catch { console.log("Saved Data Failed."); helicopter_model.Reset(); }
    }

    helicopter_model.CalculateStats();
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
    const IDs = ["Era", "Cockpit", "Passengers", "Engines", "Frames", "Tail", "Wings", "Rotors", "Stabilizers", "ControlSurfaces", "Reinforcements", "Weapons", "Load", "Landing_Gear", "Accessories", "Optimization", "Stats", "Flight"];
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

var helicopter_model: Helicopter;
var helicopter_display: Helicopter_HTML;