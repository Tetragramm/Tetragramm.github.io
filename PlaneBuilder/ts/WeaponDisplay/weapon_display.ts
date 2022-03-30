import { lu, localization } from "../impl/Localization.js";
import { CreateTD, CreateTH } from "../disp/Tools.js";

const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");

    var jsons = ['/PlaneBuilder/strings.json', '/PlaneBuilder/weapons.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(
            resp => {
                var string_JSON = resp[0];
                var weapon_JSON = resp[1];

                //Strings bit
                localization.LoadLanguages(string_JSON);
                if (lang) {
                    localization.SetCurrentLanguage(lang);
                } else if (window.localStorage.language) {
                    localization.SetCurrentLanguage(window.localStorage.language);
                }
                var tbl = document.getElementById("table_weap") as HTMLTableElement;

                let weapon_list = [];
                for (let elem of weapon_JSON["weapons"]) {
                    var weap = {
                        name: elem["name"],
                        abrv: elem["abrv"],
                        era: elem["era"],
                        size: elem["size"] as number,
                        damage: elem["damage"] as number,
                        hits: elem["hits"] as number,
                        ammo: elem["ammo"] as number,
                        ap: elem["ap"] as number,
                        jam: elem["jam"],
                        reload: elem["reload"] as number,
                        rapid: elem["rapid"] as boolean,
                        synched: elem["synched"] as boolean,
                        shells: elem["shells"] as boolean,
                        can_action: elem["can_action"] as boolean,
                        can_projectile: elem["can_projectile"] as boolean,
                        deflection: elem["deflection"] as number,
                        cost: elem["cost"] as number,
                        mass: elem["mass"] as number,
                        drag: elem["drag"] as number,
                        warn: elem["warning"],
                    };
                    weapon_list.push(weap)
                }

                var era2numHh = (era: string): number => {
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
                var pred = (a, b): number => {
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
                    CreateTD(row, tags)
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
            });
}
window.onload = init;
