import { lu, localization } from "../impl/Localization.js";
import { CreateTD, CreateTH } from "../disp/Tools.js";
import * as weapon_JSON from "../weapons.json";
const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");
    //Strings bit
    if (lang) {
        localization.SetCurrentLanguage(lang);
    }
    else if (window.localStorage.language) {
        localization.SetCurrentLanguage(window.localStorage.language);
    }
    var tbl = document.getElementById("table_weap");
    let weapon_list = [];
    for (let elem of weapon_JSON["weapons"]) {
        var weap = {
            name: elem["name"],
            abrv: elem["abrv"],
            era: elem["era"],
            size: elem["size"],
            damage: elem["damage"],
            hits: elem["hits"],
            ammo: elem["ammo"],
            ap: elem["ap"],
            jam: elem["jam"],
            reload: elem["reload"],
            rapid: elem["rapid"],
            synched: elem["synched"],
            shells: elem["shells"],
            can_action: elem["can_action"],
            can_projectile: elem["can_projectile"],
            deflection: elem["deflection"],
            cost: elem["cost"],
            mass: elem["mass"],
            drag: elem["drag"],
            warn: elem["warning"],
        };
        weapon_list.push(weap);
    }
    var era2numHh = (era) => {
        switch (era) {
            case "Pioneer":
                return 0;
            case "WWI":
                return 1;
            case "Roaring 20s":
                return 2;
            case "Coming Storm":
                return 3;
            case "WWII":
                return 4;
            case "Last Hurrah":
                return 5;
            case "Himmilgard":
                return 6;
        }
    };
    var pred = (a, b) => {
        var cvt2num = (l, r) => {
            if (l < r)
                return -1;
            if (r < l)
                return 1;
            return 0;
        };
        if (a.size != b.size)
            return cvt2num(a.size, b.size);
        else if (a.era != b.era)
            return cvt2num(era2numHh(a.era), era2numHh(b.era));
        else if (a.damage != b.damage)
            return cvt2num(a.damage, b.damage);
        else
            return cvt2num(a.name, b.name);
    };
    weapon_list = weapon_list.sort(pred);
    for (let weap of weapon_list) {
        var row = tbl.insertRow();
        CreateTD(row, weap.name);
        CreateTD(row, weap.abrv);
        CreateTD(row, weap.era);
        CreateTD(row, weap.cost);
        CreateTD(row, weap.mass);
        CreateTD(row, weap.drag);
        CreateTD(row, weap.hits);
        CreateTD(row, weap.damage);
        CreateTD(row, weap.ap);
        CreateTD(row, weap.ammo);
        CreateTD(row, weap.reload);
        CreateTD(row, weap.jam);
        switch (weap.size) {
            case 1:
                CreateTD(row, "Tiny");
                break;
            case 2:
                CreateTD(row, "Light");
                break;
            case 4:
                CreateTD(row, "Medium");
                break;
            case 8:
                CreateTD(row, "Heavy");
                break;
            case 16:
                CreateTD(row, "Artillery");
                break;
        }
        var tags = "";
        if (weap.rapid)
            tags += "Rapid-Fire ";
        if (weap.Manual)
            tags += "Manual ";
        if (weap.shells)
            tags += "Shell-Firing ";
        if (!(weap.synched))
            tags += "Open-Bolt ";
        CreateTD(row, tags);
        var deflection = (weap.deflection);
        if (deflection < 0)
            CreateTD(row, "Yes, " + deflection);
        else
            CreateTD(row, "No");
        if (weap.warn)
            CreateTD(row, lu(weap.warn));
        else
            CreateTD(row, "");
    }
    var last_row = tbl.insertRow();
    CreateTH(last_row, "Name");
    CreateTH(last_row, "Abbreviation");
    CreateTH(last_row, "Era");
    CreateTH(last_row, "Cost");
    CreateTH(last_row, "Mass");
    CreateTH(last_row, "Drag");
    CreateTH(last_row, "Hits");
    CreateTH(last_row, "Damage");
    CreateTH(last_row, "AP");
    CreateTH(last_row, "Ammo");
    CreateTH(last_row, "Reload");
    CreateTH(last_row, "Jam");
    CreateTH(last_row, "Size");
    CreateTH(last_row, "Tags");
    CreateTH(last_row, "Awkward");
    CreateTH(last_row, "Notes");
};
window.onload = init;
