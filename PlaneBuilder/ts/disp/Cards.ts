import { StringFmt } from "../string/index.js";
import { lu } from "../impl/Localization.js";

export enum ENGINE_TEXT {
    SINGLE,
    PUSHER,
    PULLER,
};
export class Cards {
    private dash_canvas: HTMLCanvasElement;
    private dash_image: HTMLImageElement;
    private weap_canvas: HTMLCanvasElement;
    private weap_image: HTMLImageElement;
    private eng_canvas: HTMLCanvasElement;
    private eng_image: HTMLImageElement;
    private rad_canvas: HTMLCanvasElement;
    private rad_image: HTMLImageElement;
    private npc_canvas: HTMLCanvasElement;
    private npc_image: HTMLImageElement;

    public name: string;

    public acft_data: {
        full_bomb_boost: number,
        half_bomb_boost: number,
        full_boost: number,
        half_boost: number,
        empty_boost: number,
        full_bomb_hand: number,
        half_bomb_hand: number,
        full_hand: number,
        half_hand: number,
        empty_hand: number,
        full_bomb_climb: number,
        half_bomb_climb: number,
        full_climb: number,
        half_climb: number,
        empty_climb: number,
        full_bomb_stall: number,
        half_bomb_stall: number,
        full_stall: number,
        half_stall: number,
        empty_stall: number,
        full_bomb_speed: number,
        half_bomb_speed: number,
        full_speed: number,
        half_speed: number,
        empty_speed: number,
        fuel: number,
        dropoff: number,
        ordinance: string[],
        escape: number,
        crash: number,
        visibility: number,
        energy_loss: number,
        turn_bleed: number,
        stability: number,
        stress: number,
        toughness: number,
        max_strain: number,
        vital_parts: string[],
        armour: number[],
        warnings: { source: string, warning: string }[],
    }

    public weap_data: {
        type: string,
        abrv: string,
        ammo: number,
        ap: number,
        jam: string,
        hits: number[],
        damage: number[],
        tags: string[],
        reload: number,
        gyrojet: boolean,
    }

    public eng_data: {
        reliability: string,
        min_IAF: number,
        altitude: number,
        overspeed: number,
        radiator: number,
        notes: string[],
    }

    public rad_data: {
        mount_type: string,
        coolant_type: string,
    }

    public lowest_overspeed: number;
    public all_weapons: any[];

    constructor() {
        this.dash_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.dash_canvas.width = 1122;
        this.dash_canvas.height = 786;
        this.dash_image = document.getElementById("dash_img") as HTMLImageElement;
        this.dash_image.width = 1122;
        this.dash_image.height = 786;
        // this.dash_image.src = './Cards/Dashboard.png';

        this.weap_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.weap_canvas.width = 483;
        this.weap_canvas.height = 291;
        this.weap_image = document.getElementById("weap_img") as HTMLImageElement;
        this.weap_image.width = 483;
        this.weap_image.height = 291;
        // this.weap_image.src = './Cards/Weapon.png';

        this.eng_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.eng_canvas.width = 600;
        this.eng_canvas.height = 360;
        this.eng_image = document.getElementById("eng_img") as HTMLImageElement;
        this.eng_image.width = 600;
        this.eng_image.height = 360;
        // this.eng_image.src = './Cards/Engine.png';

        this.rad_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.rad_canvas.width = 479;
        this.rad_canvas.height = 290;
        this.rad_image = document.getElementById("rad_img") as HTMLImageElement;
        this.rad_image.width = 479;
        this.rad_image.height = 290;
        // this.rad_image.src = './Cards/Radiator.png';

        this.npc_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.npc_canvas.width = 482;
        this.npc_canvas.height = 290;
        this.npc_image = document.getElementById("npc_img") as HTMLImageElement;
        this.npc_image.width = 482;
        this.npc_image.height = 290;
        // this.npc_image.src = './Cards/NPC.png';

        this.acft_data = {
            full_bomb_boost: 0,
            half_bomb_boost: 0,
            full_boost: 0,
            half_boost: 0,
            empty_boost: 0,
            full_bomb_hand: 0,
            half_bomb_hand: 0,
            full_hand: 0,
            half_hand: 0,
            empty_hand: 0,
            full_bomb_climb: 0,
            half_bomb_climb: 0,
            full_climb: 0,
            half_climb: 0,
            empty_climb: 0,
            full_bomb_stall: 0,
            half_bomb_stall: 0,
            full_stall: 0,
            half_stall: 0,
            empty_stall: 0,
            full_bomb_speed: 0,
            half_bomb_speed: 0,
            full_speed: 0,
            half_speed: 0,
            empty_speed: 0,
            fuel: 0,
            dropoff: 0,
            ordinance: [""],
            escape: 0,
            crash: 0,
            visibility: 0,
            energy_loss: 0,
            turn_bleed: 0,
            stability: 0,
            stress: 0,
            toughness: 0,
            max_strain: 0,
            vital_parts: [""],
            armour: [],
            warnings: [{ source: "", warning: "" }],
        }

        this.weap_data = {
            type: "",
            abrv: "",
            ammo: 0,
            ap: 0,
            jam: "",
            hits: [],
            damage: [],
            tags: [],
            reload: 0,
            gyrojet: false,
        }

        this.eng_data = {
            reliability: "0",
            min_IAF: 0,
            altitude: 0,
            overspeed: 0,
            radiator: 0,
            notes: [],
        };

        this.rad_data = {
            mount_type: "",
            coolant_type: "",
        }
    }

    public SaveDash() {
        var context = this.dash_canvas.getContext("2d");

        context.clearRect(0, 0, this.dash_canvas.width, this.dash_canvas.height);
        context.textAlign = "center";

        context.drawImage(this.dash_image, 0, 0);
        context.font = "35px Balthazar";
        context.fillText(this.acft_data.full_bomb_boost.toString(), 493, 94, 80);
        context.fillText(this.acft_data.full_bomb_hand.toString(), 493 + 1 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_climb.toString(), 493 + 2 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_stall.toString(), 493 + 3 * 62, 94, 80);
        context.fillText(this.acft_data.full_bomb_speed.toString(), 493 + 4 * 62, 94, 80);

        context.fillText(this.acft_data.half_bomb_boost.toString(), 493, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_hand.toString(), 493 + 1 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_climb.toString(), 493 + 2 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_stall.toString(), 493 + 3 * 62, 94 + 40, 80);
        context.fillText(this.acft_data.half_bomb_speed.toString(), 493 + 4 * 62, 94 + 40, 80);

        context.fillText(this.acft_data.full_boost.toString(), 493, 94 + 80, 80);
        context.fillText(this.acft_data.full_hand.toString(), 493 + 1 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_climb.toString(), 493 + 2 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_stall.toString(), 493 + 3 * 62, 94 + 80, 80);
        context.fillText(this.acft_data.full_speed.toString(), 493 + 4 * 62, 94 + 80, 80);

        context.fillText(this.acft_data.half_boost.toString(), 493, 94 + 120, 80);
        context.fillText(this.acft_data.half_hand.toString(), 493 + 1 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_climb.toString(), 493 + 2 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_stall.toString(), 493 + 3 * 62, 94 + 120, 80);
        context.fillText(this.acft_data.half_speed.toString(), 493 + 4 * 62, 94 + 120, 80);

        context.fillText("0", 493, 94 + 160, 80);
        context.fillText(this.acft_data.empty_hand.toString(), 493 + 1 * 62, 94 + 160, 80);
        context.fillText("0", 493 + 2 * 62, 94 + 160, 80);
        context.fillText(this.acft_data.empty_stall.toString(), 493 + 3 * 62, 94 + 160, 80);
        context.fillText("0", 493 + 4 * 62, 94 + 160, 80);

        context.fillText(Math.floor(this.acft_data.fuel).toString(), 417, 310, 35);

        context.fillText(this.acft_data.dropoff.toString(), 1048, 375, 35);

        context.fillText(this.acft_data.escape.toString(), 85, 640, 35);
        context.fillText(this.acft_data.crash.toString(), 85, 720, 35);

        context.fillText(this.acft_data.visibility.toString(), 135, 460, 35);
        context.fillText(this.acft_data.stability.toString(), 135, 550, 35);
        context.fillText(this.acft_data.energy_loss.toString(), 70, 505, 35);
        context.fillText(this.acft_data.turn_bleed.toString(), 195, 505, 35);

        context.fillText(this.acft_data.stress.toString(), 285, 495, 35);

        context.fillText(this.acft_data.toughness.toString(), 250, 645, 35);
        context.fillText(this.acft_data.max_strain.toString(), 250, 720, 35);

        context.font = "20px Balthazar";
        context.textAlign = "left";

        var rows = Math.min(this.acft_data.ordinance.length, 2);
        var cols = Math.ceil(-1.0e-6 + this.acft_data.ordinance.length / rows);
        var idx = 0;
        for (let r = 0; r < rows; r++) {
            let ypx = 612 + 27 * r;
            let str = "";
            for (let c = 0; c < cols; c++) {
                if (idx < this.acft_data.ordinance.length) {
                    if (c != 0) {
                        str += ", ";
                    }
                    str += this.acft_data.ordinance[idx];
                }
                idx++;
            }
            context.fillText(str, 335, ypx, 370);
        }

        var rows = Math.min(this.acft_data.vital_parts.length, 5);
        var cols = Math.ceil(-1.0e-6 + this.acft_data.vital_parts.length / rows);
        var idx = 0;
        for (let r = 0; r < rows; r++) {
            let ypx = 392 + 27 * r;
            let str = "";
            for (let c = 0; c < cols; c++) {
                if (idx < this.acft_data.vital_parts.length) {
                    if (c != 0) {
                        str += ", ";
                    }
                    str += this.acft_data.vital_parts[idx];
                }
                idx++;
            }
            context.fillText(str, 335, ypx, 370);
        }

        var str = "";
        for (let r = 0; r < this.acft_data.armour.length; ++r) {
            let AP = r + 1;
            if (this.acft_data.armour[r] > 0) {
                if (str != "")
                    str += ", ";
                else
                    str += lu("Armour") + " ";
                str += AP.toString() + "/+" + (11 - this.acft_data.armour[r]).toString();
            }
        }
        context.fillText(str, 335, 558, 375);


        context.font = "14px Balthazar";
        var max_idx = 6;
        var idx = 1;
        for (let r = 0; r < this.acft_data.warnings.length; ++r) {
            if (this.acft_data.warnings[r].source == lu("Armour"))
                continue;
            let str = this.acft_data.warnings[r].source + ": " + this.acft_data.warnings[r].warning;
            if (idx == max_idx && this.acft_data.warnings.length > r + 1) {
                context.fillText(lu("Cards Too Many Warnings Warning"), 335, 673 + idx * 14, 370);
            } else if (idx > max_idx) {

            } else {
                context.fillText(str, 335, 673 + idx * 14, 370);
            }
            idx++;
        }
        this.download(this.name + "_Dashboard", this.dash_canvas);
    }

    public SaveWeapon(weapon_num: number) {
        weapon_num++;
        var context = this.weap_canvas.getContext("2d");

        context.clearRect(0, 0, this.weap_canvas.width, this.weap_canvas.height);
        context.textAlign = "center";

        context.drawImage(this.weap_image, 0, 0);

        context.font = "25px Balthazar";
        context.fillText(this.weap_data.type, 150, 112, 215);

        context.font = "15px Balthazar";
        var ammo = "";
        if (this.weap_data.reload > 0) {
            ammo += lu("Cards Gun String Reload",
                (this.weap_data.ammo / this.weap_data.reload).toString(),
                this.weap_data.reload.toString());
            this.weap_data.tags.push(lu("Weapon Tag Reload", this.weap_data.reload.toString()));
        } else {
            ammo += lu("Cards Gun String No Reload", this.weap_data.ammo);
        }
        context.fillText(ammo, 95, 158, 105);
        context.fillText(this.weap_data.ap.toString(), 172, 158, 23);
        context.fillText(this.weap_data.jam, 230, 158, 65);

        context.fillText(this.weap_data.hits[0].toString(), 157, 208, 80);
        context.fillText(this.weap_data.hits[1].toString(), 157 + 80, 208, 80);
        context.fillText(this.weap_data.hits[2].toString(), 157 + 160, 208, 80);
        context.fillText(this.weap_data.hits[3].toString(), 157 + 240, 208, 80);

        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[0])).toString(), 157, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[1])).toString(), 157 + 80, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[2])).toString(), 157 + 160, 208 + 23, 80);
        context.fillText((Math.floor(1.0e-6 + this.weap_data.damage[3])).toString(), 157 + 240, 208 + 23, 80);

        context.textAlign = "left";
        context.fillText(this.weap_data.tags[0], 90, 256, 350);
        var tags = "";
        for (let i = 1; i < this.weap_data.tags.length; i++) {
            if (i != 1)
                tags += ", ";
            tags += this.weap_data.tags[i];
        }
        context.fillText(tags, 90, 276, 350);

        this.download(this.name + "_Weapon_" + weapon_num.toString(), this.weap_canvas);
    }


    public SaveEngine(engine_num: number, text: ENGINE_TEXT = ENGINE_TEXT.SINGLE) {
        engine_num++;
        var context = this.eng_canvas.getContext("2d");

        context.clearRect(0, 0, this.eng_canvas.width, this.eng_canvas.height);
        context.drawImage(this.eng_image, 0, 0);


        context.textAlign = "center";
        context.font = "18px Balthazar";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.eng_data.reliability, 235, 75, 110);
        var alt_string = this.eng_data.min_IAF.toString() + "-" + (this.eng_data.min_IAF + this.eng_data.altitude).toString();
        context.fillText(alt_string, 347, 75, 110);
        context.fillText(this.eng_data.overspeed.toString(), 480, 75, 110);

        var note_str = "";
        for (let i = 0; i < this.eng_data.notes.length; i++) {
            if (i != 0)
                note_str += ", ";
            note_str += this.eng_data.notes[i];
        }
        context.fillText(note_str, 365, 105, 306);

        if (this.eng_data.radiator >= 0) {
            context.fillText(lu("Cards Uses Radiator", this.eng_data.radiator + 1), 109, 340, 270);
        }

        context.textAlign = "right";
        context.font = "30px Balthazar";
        context.fillStyle = "#fff";
        context.strokeStyle = "#fff";
        context.fillText("#" + engine_num.toString(), 37, 67, 35);

        switch (text) {
            case ENGINE_TEXT.SINGLE:
                this.download(this.name + "_Engine_" + engine_num.toString(), this.eng_canvas);
                break;
            case ENGINE_TEXT.PUSHER:
                this.download(this.name + "_Engine_" + engine_num.toString() + "_Pusher", this.eng_canvas);
                break;
            case ENGINE_TEXT.PULLER:
                this.download(this.name + "_Engine_" + engine_num.toString() + "_Puller", this.eng_canvas);
                break;
        }
    }

    public SaveRadiator(radiator_num: number) {
        radiator_num++;
        var context = this.rad_canvas.getContext("2d");

        context.clearRect(0, 0, this.rad_canvas.width, this.rad_canvas.height);
        context.drawImage(this.rad_image, 0, 0);

        context.textAlign = "center";
        context.font = "25px Balthazar";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.rad_data.mount_type, 162, 141, 230);
        context.fillText(this.rad_data.coolant_type, 162, 217, 230);

        context.textAlign = "right";
        context.font = "25px Balthazar";
        context.fillStyle = "#fff";
        context.strokeStyle = "#fff";
        context.fillText("#" + radiator_num.toString(), 37, 56, 35);

        this.download(this.name + "_Radiator_" + radiator_num.toString(), this.rad_canvas);
    }

    public SaveNPC() {
        var context = this.npc_canvas.getContext("2d");
        context.clearRect(0, 0, this.npc_canvas.width, this.npc_canvas.height);
        context.drawImage(this.npc_image, 0, 0);
        context.font = "20px Balthazar";
        context.textAlign = "center";
        context.fillStyle = "#000";
        context.strokeStyle = "#000";
        context.fillText(this.name, 100, 100, 145);
        context.fillText("" + this.lowest_overspeed, 70, 158, 40);
        context.fillText("" + this.acft_data.full_speed, 126, 158, 40);
        var combat_speed = this.acft_data.full_speed - this.acft_data.turn_bleed - Math.floor(1.0e-6 + 0.1 * this.acft_data.full_speed);
        context.fillText("" + combat_speed, 187, 158, 40);
        context.fillText("" + this.acft_data.full_stall, 245, 158, 40);

        var structure = this.acft_data.toughness + this.acft_data.max_strain;
        context.fillText("" + structure, 70, 236, 40);
        context.fillText("" + this.acft_data.full_hand, 123, 236, 40);

        var wep;
        if (this.all_weapons[0]) {
            wep = this.all_weapons[0];
            context.font = "12px Avenir";
            context.fillText(wep.abrv, 232, 71, 91);
            context.font = "20px Balthazar";
            var hits = StringFmt.Join("/",
                [wep.hits[0],
                wep.hits[1],
                wep.hits[2],
                wep.hits[3]]);
            var dam = StringFmt.Join("/",
                [Math.floor(1.0e-6 + wep.damage[0]),
                Math.floor(1.0e-6 + wep.damage[1]),
                Math.floor(1.0e-6 + wep.damage[2]),
                Math.floor(1.0e-6 + wep.damage[3])]);
            context.fillText(hits, 320, 71, 80);
            context.fillText(dam, 401, 71, 80);
        }

        if (this.all_weapons[1]) {
            wep = this.all_weapons[1];
            context.font = "12px Avenir";
            context.fillText(wep.abrv, 232, 103, 91);
            context.font = "20px Balthazar";
            var hits = StringFmt.Join("/",
                [wep.hits[0],
                wep.hits[1],
                wep.hits[2],
                wep.hits[3]]);
            var dam = StringFmt.Join("/",
                [Math.floor(1.0e-6 + wep.damage[0]),
                Math.floor(1.0e-6 + wep.damage[1]),
                Math.floor(1.0e-6 + wep.damage[2]),
                Math.floor(1.0e-6 + wep.damage[3])]);
            context.fillText(hits, 320, 103, 80);
            context.fillText(dam, 401, 103, 80);
        }

        this.download(this.name + "_NPC", this.npc_canvas);
    }

    private download(filename: string, canvas: HTMLCanvasElement) {

        var lnk = document.createElement('a') as HTMLAnchorElement;

        lnk.download = filename + ".png";
        lnk.href = canvas.toDataURL();

        if (document.createEvent) {
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false, false,
                false, false, 0, null);

            /// send event            
            lnk.dispatchEvent(e);
        }
    }
}