/// <reference path="../disp/Tools.ts" />

const init = () => {

    loadJSON('/PlaneBuilder/weapons.json', (weapon_resp) => {
        var weapon_json = JSON.parse(weapon_resp);

        var tbl = document.getElementById("table_weap") as HTMLTableElement;
        for (let weap of weapon_json["weapons"]) {
            var row = tbl.insertRow();
            CreateTD(row, weap["name"]);
            CreateTD(row, weap["abrv"]);
            CreateTD(row, weap["era"]);
            CreateTD(row, weap["cost"]);
            CreateTD(row, weap["mass"]);
            CreateTD(row, weap["drag"]);
            CreateTD(row, weap["hits"]);
            CreateTD(row, weap["damage"]);
            CreateTD(row, weap["ap"]);
            CreateTD(row, weap["ammo"]);
            CreateTD(row, weap["reload"]);
            CreateTD(row, weap["jam"]);
            switch (weap["size"] as number) {
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
            if (weap["rapid"] as boolean)
                tags += "Rapid-Fire ";
            if (weap["manual"] as boolean)
                tags += "Manual ";
            if (weap["shells"] as boolean)
                tags += "Shell-Firing ";
            if (!(weap["synched"] as boolean))
                tags += "Open-Bolt ";
            CreateTD(row, tags)
            var deflection = (weap["deflection"] as number);
            if (deflection < 0)
                CreateTD(row, "Yes, " + deflection);
            else
                CreateTD(row, "No");

            if (weap["warning"])
                CreateTD(row, weap["warning"]);
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
var enable_anim = false;