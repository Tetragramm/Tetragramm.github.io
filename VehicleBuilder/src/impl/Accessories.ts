import { Stats, WARNING_COLOR } from "./Stats";

export class Accessories {
    public extra_armour: boolean;
    public wooden_armour: boolean;
    public cruise_control: boolean;
    public intercom: boolean;
    public wireless: boolean;
    public temp_control: boolean;
    public gas_filters: boolean;
    public dozer_blades: boolean;
    public wire_cutters: boolean;
    public clockwerk_missile: boolean;
    public smokescreen: boolean;
    public camouflage: boolean;
    public steering_trailer: boolean;
    public is_enclosed: boolean;

    public GetEscapeMod() {
        let mod = 0;
        if (this.wooden_armour)
            mod -= 1;
        return mod;
    }

    public CalcStats(enclosed: boolean, stats: Stats): Stats {
        this.is_enclosed = enclosed;
        if (this.extra_armour) {
            stats.safety *= 2;
            stats.reliability -= 1;
        }
        if (this.wooden_armour) {
            stats.warnings.push({ source: "Wooden Spaced Armour", warning: "Disadvantage to attacks with Tank Breakers.", color: WARNING_COLOR.WHITE });
        }
        if (this.cruise_control) {
            stats.cost += 6;
            stats.warnings.push({
                source: "Cruise Control", warning: "Works like a programmable autopilot, able toexecute a series of orders. Cannot React.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.intercom) {
            stats.cost += 3;
            stats.warnings.push({
                source: "Crew Intercom", warning: "+2 to Peek/Peer Out for all positions, so long as at least two are manned.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.wireless) {
            stats.cost += 4;
            stats.warnings.push({
                source: "Wireless Set", warning: "Adds a wireless set to a seat chosen now. Operating the radio takes both hands and distracts from normal tasks.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.is_enclosed) {
            if (this.temp_control) {//TODO: Only when enclosed
                stats.cost += 4;
                stats.warnings.push({
                    source: "Temperature Control", warning: "Until a hatch is open, treat the temperature in the vehicle as one band lower or higher as desired.", color: WARNING_COLOR.WHITE
                });
            }
            if (this.gas_filters) {
                stats.cost += 5;
                stats.reliability -= 1;
                stats.warnings.push({
                    source: "Gas Filters", warning: "When all hatches are closed and the engine is running, is immune to poison gas.", color: WARNING_COLOR.WHITE
                });
            }
        } else {
            this.temp_control = false;
            this.gas_filters = false;
        }
        if (this.dozer_blades) {
            stats.cost += 3;
            stats.warnings.push({
                source: "Dozer Blades", warning: "Mark 1 RPM to raise/lower. When lowered, reduce Max Speed to 2, use your Front Armour against mines, and gain double bonus from Gunning the Engine for Cross Obstacle. Can be used to create berms for cover in a few minutes.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.wire_cutters) {
            stats.cost += 2;
            stats.warnings.push({
                source: "Wire Cutters", warning: "Clears any barbed wire the vehicle passes through, leaving no danger to following troops.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.clockwerk_missile) {
            stats.cost += 5;
            stats.warnings.push({
                source: "Clockwerk Missile Rail", warning: "Disposable. Reloads 5þ each.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.smokescreen) {
            stats.cost += 4;
            stats.warnings.push({
                source: "Smokescreen Launcher", warning: "Hold 1 per mission. Spend the hold to spread a smokescreen(page 136), covering everything within Close range of the front of the vehicle.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.camouflage) {
            stats.cost += 2;
            stats.warnings.push({
                source: "Camouflage", warning: "While stationary with the engine off in your chosen biome, the vehicle cannot be seen or attacked by aircraft unless they come down to treetop height.", color: WARNING_COLOR.WHITE
            });
        }
        if (this.steering_trailer) {
            stats.cost += 6;
            stats.warnings.push({
                source: "Steering Trailer", warning: "At Speed 2 or less, +5 Handling, +2 Torque. You may negate an 11-15 on Cross Obstacle by cutting the trailer loose and leaving it behind.", color: WARNING_COLOR.WHITE
            });
        }
        return stats;
    }
}