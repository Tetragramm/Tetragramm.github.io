import { Vehicle } from "../impl/Vehicle";
import { StringFmt } from "../string/index";

export class Cards {
    private dash_canvas: HTMLCanvasElement;
    private dash_image: HTMLImageElement;

    constructor() {
        this.dash_canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        this.dash_canvas.width = 1754;
        this.dash_canvas.height = 1240;
        this.dash_image = document.getElementById("dash_img") as HTMLImageElement;
        this.dash_image.width = 1754;
        this.dash_image.height = 1240;
    }

    public SaveDash(veh: Vehicle) {
        var context = this.dash_canvas.getContext("2d");

        let final_stats = veh.CalculateStats();

        context.clearRect(0, 0, this.dash_canvas.width, this.dash_canvas.height);
        context.textAlign = "center";

        context.drawImage(this.dash_image, 0, 0);
        context.font = "70px Balthazar";
        context.fillText(final_stats.fuel.toString(), 486, 550, 100);
        context.fillText(final_stats.handling.toString(), 655, 220, 100);
        if (final_stats.walker_torque) {
            context.fillText(StringFmt.Format("+{0}/{1}", final_stats.walker_torque, final_stats.torque), 850, 220, 100);
        } else {
            context.fillText(final_stats.torque.toString(), 850, 220, 100);
        }
        context.fillText(final_stats.stress.toString(), 655, 390, 100);
        context.fillText(final_stats.integrity.toString(), 850, 390, 100);
        context.fillText(final_stats.reliability.toString(), 305, 855, 100);
        context.fillText(veh.GetArmourFront().toString(), 1080, 185, 100);
        context.fillText(veh.GetArmourSide().toString(), 990, 290, 100);
        context.fillText(veh.GetArmourSide().toString(), 1170, 245, 100);
        context.fillText(veh.GetArmourRear().toString(), 1080, 365, 100);
        context.fillText(veh.GetArmourRear().toString(), 1170, 335, 100);
        context.fillText(final_stats.safety.toString(), 1570, 1065, 100);


        context.font = "35px Balthazar";
        context.textAlign = "center";
        let idx = 0;
        for (let c of veh.GetCrewList()) {
            if (idx < 8) {
                context.textAlign = "left";
                context.fillText(c.name_txt, 590, 600 + 55 * idx, 212);
                context.textAlign = "center";
                if (c.enclosed) {
                    if (c.sealed) {
                        context.fillText("Sealed", 845, 600 + 55 * idx, 100);
                    } else {
                        context.fillText("Closed", 845, 600 + 55 * idx, 100);
                    }
                } else {
                    context.fillText("Exposed", 845, 600 + 55 * idx, 100);
                }
                context.fillText((c.GetVisibility() ?? "-").toString(), 935, 600 + 55 * idx, 100);
                context.fillText((c.GetEscape() ?? "-").toString(), 1015, 600 + 55 * idx, 100);
                let notes = [];
                if (c.enclosed && c.cupola) {
                    notes.push("Hatch");
                }
                if (c.WeaponString() != "")
                    notes.push(c.WeaponString());

                context.textAlign = "left";
                context.fillText(StringFmt.Join(", ", notes), 1065, 600 + 55 * idx, 575);
                context.textAlign = "center";
                idx++;
                for (let lidx = 0; lidx < c.loaders.length; lidx++) {
                    let l = c.loaders[lidx];
                    context.textAlign = "left";
                    context.fillText("Loader", 590, 600 + 55 * idx, 212);
                    context.textAlign = "center";
                    if (l.enclosed) {
                        if (l.sealed) {
                            context.fillText("Sealed", 845, 600 + 55 * idx, 100);
                        } else {
                            context.fillText("Closed", 845, 600 + 55 * idx, 100);
                        }
                    } else {
                        context.fillText("Exposed", 845, 600 + 55 * idx, 100);
                    }
                    context.fillText((c.GetVisibility(lidx) ?? "-").toString(), 935, 600 + 55 * idx, 100);
                    context.fillText((c.GetEscape(lidx) ?? "-").toString(), 1015, 600 + 55 * idx, 100);
                    let notes = [];
                    if (l.enclosed && l.cupola) {
                        notes.push("Hatch");
                    }

                    context.textAlign = "left";
                    context.fillText(StringFmt.Join(", ", notes), 1065, 600 + 55 * idx, 575);
                    context.textAlign = "center";
                    idx++;
                }

            }
        }

        //Todo: Real name
        this.download("Test Name" + "_Dashboard", this.dash_canvas);
    }

    private download(filename: string, canvas: HTMLCanvasElement) {
        var lnk = document.createElement('a') as HTMLAnchorElement;
        lnk.download = filename + ".png";
        lnk.href = canvas.toDataURL("image/png");
        /// send event
        lnk.click();
    }
}