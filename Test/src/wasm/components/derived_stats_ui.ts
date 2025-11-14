/**
 * Derived Stats UI Component
 *
 * Displays calculated aircraft performance statistics including speeds, handling,
 * mass variations, weapons, warnings, and more.
 * Based on Test/src/disp/Derived.ts
 *
 * Note: This component does NOT use blinking animations as per user requirements.
 */

import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import { createCollapsibleSection } from '../dom_utils';

/**
 * Derived Stats UI Component - displays calculated aircraft performance
 */
export class DerivedStatsUI extends BaseComponentUI {
    // Name input
    private nameInput: HTMLInputElement | undefined;

    // Top row cells
    private costCell: HTMLTableCellElement | undefined;
    private upkeepCell: HTMLTableCellElement | undefined;
    private versionCell: HTMLTableCellElement | undefined;

    // Mass variation cells - Empty
    private tsEmpty: HTMLTableCellElement | undefined;
    private ssEmpty: HTMLTableCellElement | undefined;
    private handEmpty: HTMLTableCellElement | undefined;
    private boostEmpty: HTMLTableCellElement | undefined;
    private rocEmpty: HTMLTableCellElement | undefined;

    // Mass variation cells - Half
    private tsHalf: HTMLTableCellElement | undefined;
    private ssHalf: HTMLTableCellElement | undefined;
    private handHalf: HTMLTableCellElement | undefined;
    private boostHalf: HTMLTableCellElement | undefined;
    private rocHalf: HTMLTableCellElement | undefined;

    // Mass variation cells - Full
    private tsFull: HTMLTableCellElement | undefined;
    private ssFull: HTMLTableCellElement | undefined;
    private handFull: HTMLTableCellElement | undefined;
    private boostFull: HTMLTableCellElement | undefined;
    private rocFull: HTMLTableCellElement | undefined;

    // Mass variation cells - Half with Bombs
    private tsHalfwB: HTMLTableCellElement | undefined;
    private ssHalfwB: HTMLTableCellElement | undefined;
    private handHalfwB: HTMLTableCellElement | undefined;
    private boostHalfwB: HTMLTableCellElement | undefined;
    private rocHalfwB: HTMLTableCellElement | undefined;

    // Mass variation cells - Full with Bombs
    private tsFullwB: HTMLTableCellElement | undefined;
    private ssFullwB: HTMLTableCellElement | undefined;
    private handFullwB: HTMLTableCellElement | undefined;
    private boostFullwB: HTMLTableCellElement | undefined;
    private rocFullwB: HTMLTableCellElement | undefined;

    // Bomb rows (conditionally shown)
    private bombRow1: HTMLTableRowElement | undefined;
    private bombRow2: HTMLTableRowElement | undefined;
    private fullRow: HTMLTableRowElement | undefined;

    // Other stat cells
    private vitalComponents: HTMLTableCellElement | undefined;
    private dropoffCell: HTMLTableCellElement | undefined;
    private stabilityCell: HTMLTableCellElement | undefined;
    private reliabilityCell: HTMLTableCellElement | undefined;
    private flightstressCell: HTMLTableCellElement | undefined;
    private overspeedCell: HTMLTableCellElement | undefined;
    private elossCell: HTMLTableCellElement | undefined;
    private toughnessCell: HTMLTableCellElement | undefined;
    private visibilityCell: HTMLTableCellElement | undefined;
    private electricCell: HTMLTableCellElement | undefined;
    private turnbleedLabel: HTMLTableCellElement | undefined;
    private turnbleedCell: HTMLTableCellElement | undefined;
    private mxstrainCell: HTMLTableCellElement | undefined;
    private attackCell: HTMLTableCellElement | undefined;
    private maxfuelCell: HTMLTableCellElement | undefined;
    private landingCell: HTMLTableCellElement | undefined;
    private escapeCell: HTMLTableCellElement | undefined;
    private communicationsCell: HTMLTableCellElement | undefined;
    private crewCell: HTMLTableCellElement | undefined;
    private maxaltCell: HTMLTableCellElement | undefined;
    private crashsafetyCell: HTMLTableCellElement | undefined;
    private flammableCell: HTMLTableCellElement | undefined;
    private weaponCell: HTMLTableCellElement | undefined;
    private warningCell: HTMLTableCellElement | undefined;
    private descCell: HTMLTableCellElement | undefined;

    private showBombs: boolean = false;

    protected shouldUpdate(): boolean {
        return this.nameInput !== undefined;
    }

    protected clearCache(): void {
        this.nameInput = undefined;
        this.costCell = undefined;
        this.upkeepCell = undefined;
        this.versionCell = undefined;
        this.tsEmpty = undefined;
        this.ssEmpty = undefined;
        this.handEmpty = undefined;
        this.boostEmpty = undefined;
        this.rocEmpty = undefined;
        this.tsHalf = undefined;
        this.ssHalf = undefined;
        this.handHalf = undefined;
        this.boostHalf = undefined;
        this.rocHalf = undefined;
        this.tsFull = undefined;
        this.ssFull = undefined;
        this.handFull = undefined;
        this.boostFull = undefined;
        this.rocFull = undefined;
        this.tsHalfwB = undefined;
        this.ssHalfwB = undefined;
        this.handHalfwB = undefined;
        this.boostHalfwB = undefined;
        this.rocHalfwB = undefined;
        this.tsFullwB = undefined;
        this.ssFullwB = undefined;
        this.handFullwB = undefined;
        this.boostFullwB = undefined;
        this.rocFullwB = undefined;
        this.bombRow1 = undefined;
        this.bombRow2 = undefined;
        this.fullRow = undefined;
        this.vitalComponents = undefined;
        this.dropoffCell = undefined;
        this.stabilityCell = undefined;
        this.reliabilityCell = undefined;
        this.flightstressCell = undefined;
        this.overspeedCell = undefined;
        this.elossCell = undefined;
        this.toughnessCell = undefined;
        this.visibilityCell = undefined;
        this.electricCell = undefined;
        this.turnbleedLabel = undefined;
        this.turnbleedCell = undefined;
        this.mxstrainCell = undefined;
        this.attackCell = undefined;
        this.maxfuelCell = undefined;
        this.landingCell = undefined;
        this.escapeCell = undefined;
        this.communicationsCell = undefined;
        this.crewCell = undefined;
        this.maxaltCell = undefined;
        this.crashsafetyCell = undefined;
        this.flammableCell = undefined;
        this.weaponCell = undefined;
        this.warningCell = undefined;
        this.descCell = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Create table
        const table = document.createElement('table');
        table.id = 'tbl_derived';

        // Row 0: Name, Cost, Upkeep, Era Report
        const row0 = table.insertRow();
        const nameCell = row0.insertCell();
        nameCell.colSpan = 2;
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.defaultValue = bridge.getName();
        this.nameInput.onchange = () => {
            bridge.setName(this.nameInput.value);
        };
        nameCell.appendChild(this.nameInput);

        const th1 = document.createElement('th');
        th1.textContent = localization.translate('Stat Cost');
        row0.appendChild(th1);
        this.costCell = row0.insertCell();

        const th2 = document.createElement('th');
        th2.textContent = localization.translate('Stat Upkeep');
        row0.appendChild(th2);
        this.upkeepCell = row0.insertCell();

        const th3 = document.createElement('th');
        th3.textContent = localization.translate('Derived Era Report');
        row0.appendChild(th3);
        this.versionCell = row0.insertCell();

        // Row 1: Mass Variations Header
        const row1 = table.insertRow();
        this.createTH(row1, 'Derived Mass Variations');
        this.createTH(row1, 'Derived Boost');
        this.createTH(row1, 'Derived Handling');
        this.createTH(row1, 'Derived Rate of Climb');
        this.createTH(row1, 'Derived Stall Speed');
        this.createTH(row1, 'Derived Top Speed');
        const vitalTH = this.createTH(row1, 'Derived Vital Components');
        vitalTH.colSpan = 2;

        // Bomb Row 2: Full Fuel with Bombs (conditionally shown)
        this.bombRow2 = table.insertRow();
        this.createTH(this.bombRow2, 'Derived Full Fuel with Bombs');
        this.boostFullwB = this.bombRow2.insertCell();
        this.handFullwB = this.bombRow2.insertCell();
        this.rocFullwB = this.bombRow2.insertCell();
        this.ssFullwB = this.bombRow2.insertCell();
        this.tsFullwB = this.bombRow2.insertCell();
        this.vitalComponents = this.bombRow2.insertCell();
        this.vitalComponents.rowSpan = 3;
        this.vitalComponents.colSpan = 2;

        // Bomb Row 1: Half Fuel with Bombs (conditionally shown)
        this.bombRow1 = table.insertRow();
        this.createTH(this.bombRow1, 'Derived Half Fuel with Bombs');
        this.boostHalfwB = this.bombRow1.insertCell();
        this.handHalfwB = this.bombRow1.insertCell();
        this.rocHalfwB = this.bombRow1.insertCell();
        this.ssHalfwB = this.bombRow1.insertCell();
        this.tsHalfwB = this.bombRow1.insertCell();

        // Full Row: Full Fuel
        this.fullRow = table.insertRow();
        this.createTH(this.fullRow, 'Derived Full Fuel');
        this.boostFull = this.fullRow.insertCell();
        this.handFull = this.fullRow.insertCell();
        this.rocFull = this.fullRow.insertCell();
        this.ssFull = this.fullRow.insertCell();
        this.tsFull = this.fullRow.insertCell();

        // Half Row: Half Fuel
        const halfRow = table.insertRow();
        this.createTH(halfRow, 'Derived Half Fuel');
        this.boostHalf = halfRow.insertCell();
        this.handHalf = halfRow.insertCell();
        this.rocHalf = halfRow.insertCell();
        this.ssHalf = halfRow.insertCell();
        this.tsHalf = halfRow.insertCell();

        // Empty Row: Empty Fuel
        const emptyRow = table.insertRow();
        this.createTH(emptyRow, 'Derived Empty Fuel');
        this.boostEmpty = emptyRow.insertCell();
        this.handEmpty = emptyRow.insertCell();
        this.rocEmpty = emptyRow.insertCell();
        this.ssEmpty = emptyRow.insertCell();
        this.tsEmpty = emptyRow.insertCell();

        // Row 7: Category Headers
        const row7 = table.insertRow();
        const propTH = this.createTH(row7, 'Derived Propulsion');
        propTH.colSpan = 2;
        const aeroTH = this.createTH(row7, 'Derived Aerodynamics');
        aeroTH.colSpan = 2;
        const survTH = this.createTH(row7, 'Derived Survivability');
        survTH.colSpan = 2;
        const crewTH = this.createTH(row7, 'Derived Crew Members');
        crewTH.colSpan = 2;

        // Row 8: First stat row
        const row8 = table.insertRow();
        this.createTH(row8, 'Derived Dropoff');
        this.dropoffCell = row8.insertCell();
        this.createTH(row8, 'Derived Stability');
        this.stabilityCell = row8.insertCell();
        this.createTH(row8, 'Derived Crash Safety');
        this.crashsafetyCell = row8.insertCell();
        this.createTH(row8, 'Derived Crew/Passengers');
        this.crewCell = row8.insertCell();

        // Row 9: Second stat row
        const row9 = table.insertRow();
        this.createTH(row9, 'Derived Overspeed');
        this.overspeedCell = row9.insertCell();
        this.createTH(row9, 'Derived Energy Loss');
        this.elossCell = row9.insertCell();
        this.createTH(row9, 'Stat Toughness');
        this.toughnessCell = row9.insertCell();
        this.createTH(row9, 'Stat Visibility');
        this.visibilityCell = row9.insertCell();

        // Row 10: Third stat row
        const row10 = table.insertRow();
        this.createTH(row10, 'Derived Fuel Uses');
        this.maxfuelCell = row10.insertCell();
        this.turnbleedLabel = this.createTH(row10, 'Derived Turn Bleed');
        this.turnbleedCell = row10.insertCell();
        this.createTH(row10, 'Stat Max Strain');
        this.mxstrainCell = row10.insertCell();
        this.createTH(row10, 'Derived Attack Modifier');
        this.attackCell = row10.insertCell();

        // Row 11: Fourth stat row
        const row11 = table.insertRow();
        this.createTH(row11, 'Stat Reliability');
        this.reliabilityCell = row11.insertCell();
        this.createTH(row11, 'Derived Landing Gear');
        this.landingCell = row11.insertCell();
        this.createTH(row11, 'Derived Communications');
        this.communicationsCell = row11.insertCell();
        this.createTH(row11, 'Derived Escape');
        this.escapeCell = row11.insertCell();

        // Row 12: Fifth stat row
        const row12 = table.insertRow();
        this.createTH(row12, 'Derived Ideal Engine Altitude');
        this.maxaltCell = row12.insertCell();
        this.createTH(row12, 'Derived Is Flammable Question');
        this.flammableCell = row12.insertCell();
        this.descCell = row12.insertCell();
        this.descCell.colSpan = 2;
        this.createTH(row12, 'Stat Flight Stress');
        this.flightstressCell = row12.insertCell();

        // Weapons and Electrics row
        const headRow = table.insertRow();
        const bodyRow = table.insertRow();

        const weaponHead = this.createTH(headRow, 'Derived Weapon Systems');
        weaponHead.colSpan = 6;
        this.weaponCell = bodyRow.insertCell();
        this.weaponCell.colSpan = 6;

        const electricHead = this.createTH(headRow, 'Derived Electrics');
        electricHead.colSpan = 2;
        this.electricCell = bodyRow.insertCell();
        this.electricCell.colSpan = 2;
        this.electricCell.rowSpan = 3;

        // Warnings row
        const warningHead = this.createTH(table.insertRow(), 'Derived Special Rules');
        warningHead.colSpan = 6;
        this.warningCell = table.insertRow().insertCell();
        this.warningCell.colSpan = 6;

        contentDiv.appendChild(table);

        // Create collapsible section
        const sectionTitle = localization.translate('Aircraft Derived Statistics');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Expanded by default
        );

        this.container.appendChild(this.sectionElement);

        this.updateValues();

        console.log('[DerivedStatsUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const stats = bridge.getStats();
        const derivedStats = bridge.getDerivedStats();

        // Update name (only if different to preserve cursor position)
        // Name is not updated from bridge in the TypeScript version

        // Update cost and upkeep
        if (this.costCell) {
            this.costCell.textContent = stats.cost.toString() + 'þ ';
            // Add used price if aircraft has damage/wear
            if (!bridge.getUsedIsDefault()) {
                this.costCell.textContent += ' (' + Math.floor(1.0e-6 + stats.cost / 2).toString() + 'þ ' + localization.translate('Price Word Used') + ')';
            }
        }
        if (this.upkeepCell) {
            this.upkeepCell.textContent = stats.upkeep.toString() + 'þ';
        }

        // Update mass variation cells - Empty (all zeros in TypeScript version)
        if (this.tsEmpty) this.tsEmpty.textContent = '0';
        if (this.ssEmpty) this.ssEmpty.textContent = derivedStats.stall_speed_empty.toString();
        if (this.handEmpty) this.handEmpty.textContent = derivedStats.handling_empty.toString();
        if (this.boostEmpty) this.boostEmpty.textContent = '0';
        if (this.rocEmpty) this.rocEmpty.textContent = '0';

        // Update mass variation cells - Half
        if (this.tsHalf) {
            this.tsHalf.textContent = Math.floor(1.0e-6 + (derivedStats.max_speed_empty + derivedStats.max_speed_full) / 2).toString();
        }
        if (this.ssHalf) {
            this.ssHalf.textContent = Math.floor(1.0e-6 + (derivedStats.stall_speed_empty + derivedStats.stall_speed_full) / 2).toString();
        }
        if (this.handHalf) {
            this.handHalf.textContent = Math.floor(1.0e-6 + (derivedStats.handling_empty + derivedStats.handling_full) / 2).toString();
        }
        if (this.boostHalf) {
            this.boostHalf.textContent = Math.floor(1.0e-6 + (derivedStats.boost_empty + derivedStats.boost_full) / 2).toString();
        }
        if (this.rocHalf) {
            this.rocHalf.textContent = Math.floor(1.0e-6 + (derivedStats.rate_of_climb_empty + derivedStats.rate_of_climb_full) / 2).toString();
        }

        // Update mass variation cells - Full
        if (this.tsFull) {
            this.tsFull.textContent = Math.floor(1.0e-6 + derivedStats.max_speed_full).toString();
        }
        if (this.ssFull) {
            this.ssFull.textContent = derivedStats.stall_speed_full.toString();
        }
        if (this.handFull) {
            this.handFull.textContent = derivedStats.handling_full.toString();
        }
        if (this.boostFull) {
            this.boostFull.textContent = derivedStats.boost_full.toString();
        }
        if (this.rocFull) {
            this.rocFull.textContent = derivedStats.rate_of_climb_full.toString();
        }

        // Handle bomb rows (show/hide based on bomb mass)
        if (stats.bomb_mass > 0 || this.showBombs) {
            if (this.bombRow1) this.bombRow1.hidden = false;
            if (this.bombRow2) this.bombRow2.hidden = false;
            if (this.vitalComponents && this.bombRow2) {
                this.bombRow2.appendChild(this.vitalComponents);
                this.vitalComponents.rowSpan = 5;
            }

            // Update mass variation cells - Half with Bombs
            if (this.tsHalfwB) {
                this.tsHalfwB.textContent = Math.floor(1.0e-6 + (derivedStats.max_speed_empty + derivedStats.max_speed_w_bombs) / 2).toString();
            }
            if (this.ssHalfwB) {
                this.ssHalfwB.textContent = Math.floor(1.0e-6 + (derivedStats.stall_speed_empty + derivedStats.stall_speed_full_w_bombs) / 2).toString();
            }
            if (this.handHalfwB) {
                this.handHalfwB.textContent = Math.floor(1.0e-6 + (derivedStats.handling_empty + derivedStats.handling_full_w_bombs) / 2).toString();
            }
            if (this.boostHalfwB) {
                this.boostHalfwB.textContent = Math.floor(1.0e-6 + (derivedStats.boost_empty + derivedStats.boost_full_w_bombs) / 2).toString();
            }
            if (this.rocHalfwB) {
                this.rocHalfwB.textContent = Math.floor(1.0e-6 + (derivedStats.rate_of_climb_empty + derivedStats.rate_of_climb_w_bombs) / 2).toString();
            }

            // Update mass variation cells - Full with Bombs
            if (this.tsFullwB) {
                this.tsFullwB.textContent = Math.floor(1.0e-6 + derivedStats.max_speed_w_bombs).toString();
            }
            if (this.ssFullwB) {
                this.ssFullwB.textContent = derivedStats.stall_speed_full_w_bombs.toString();
            }
            if (this.handFullwB) {
                this.handFullwB.textContent = derivedStats.handling_full_w_bombs.toString();
            }
            if (this.boostFullwB) {
                this.boostFullwB.textContent = derivedStats.boost_full_w_bombs.toString();
            }
            if (this.rocFullwB) {
                this.rocFullwB.textContent = derivedStats.rate_of_climb_w_bombs.toString();
            }

            // Update turn bleed label and value
            if (this.turnbleedLabel) {
                this.turnbleedLabel.textContent = localization.translate('Derived Turn Bleed wB');
            }
            if (this.turnbleedCell) {
                this.turnbleedCell.textContent = `${derivedStats.turn_bleed} (${derivedStats.turn_bleed_w_bombs})`;
            }
        } else {
            if (this.bombRow1) this.bombRow1.hidden = true;
            if (this.bombRow2) this.bombRow2.hidden = true;
            if (this.vitalComponents && this.fullRow) {
                this.fullRow.appendChild(this.vitalComponents);
                this.vitalComponents.rowSpan = 3;
            }

            // Update turn bleed label and value
            if (this.turnbleedLabel) {
                this.turnbleedLabel.textContent = localization.translate('Derived Turn Bleed');
            }
            if (this.turnbleedCell) {
                this.turnbleedCell.textContent = derivedStats.turn_bleed.toString();
            }
        }

        // Update other stat cells
        if (this.dropoffCell) this.dropoffCell.textContent = derivedStats.dropoff.toString();
        if (this.overspeedCell) this.overspeedCell.textContent = derivedStats.overspeed.toString();
        if (this.maxfuelCell) {
            this.maxfuelCell.textContent = (Math.floor(1.0e-6 + derivedStats.fuel_uses * 10) / 10).toString();
        }
        if (this.flammableCell) {
            if (bridge.getIsFlammable()) {
                this.flammableCell.textContent = localization.translate('Yes');
            } else {
                this.flammableCell.textContent = localization.translate('No');
            }
        }

        if (this.stabilityCell) this.stabilityCell.textContent = derivedStats.stability.toString();
        if (this.elossCell) this.elossCell.textContent = derivedStats.energy_loss.toString();
        if (this.landingCell) {
            this.landingCell.textContent = bridge.getGearName();
        }
        if (this.maxaltCell) {
            const minAlt = bridge.getMinAltitude();
            const maxAlt = bridge.getMaxAltitude();
            this.maxaltCell.textContent = minAlt.toString() + '-' + maxAlt.toString();
        }

        if (this.reliabilityCell) {
            const reliabilityList = bridge.getReliabilityList();
            this.reliabilityCell.textContent = reliabilityList.join(', ');
        }
        if (this.toughnessCell) this.toughnessCell.textContent = derivedStats.toughness.toString();
        if (this.mxstrainCell) this.mxstrainCell.textContent = derivedStats.max_strain.toString();
        if (this.escapeCell) {
            const escapeList = bridge.getEscapeList();
            this.escapeCell.textContent = escapeList.join(', ');
        }
        if (this.crashsafetyCell) this.crashsafetyCell.textContent = stats.crashsafety.toString();

        if (this.crewCell) {
            const cockpitCount = bridge.getCockpitsCount();
            const passengerCount = bridge.getPassengersCount();
            this.crewCell.textContent = cockpitCount.toString() + '/' + passengerCount.toString();
        }
        if (this.flightstressCell) {
            // Format stress list similar to TypeScript Stress2Str function
            const stressList = bridge.getStressList();
            let str = '';
            for (let i = 0; i < stressList.length - 1; i++) {
                if (stressList[i][0] !== stressList[i][1]) {
                    str += stressList[i][0].toString() + '(' + stressList[i][1].toString() + '), ';
                } else {
                    str += stressList[i][0].toString() + ', ';
                }
            }
            if (stressList.length > 0) {
                const i = stressList.length - 1;
                if (stressList[i][0] !== stressList[i][1]) {
                    str += stressList[i][0].toString() + '(' + stressList[i][1].toString() + ')';
                } else {
                    str += stressList[i][0].toString();
                }
            }
            this.flightstressCell.textContent = str;
        }
        if (this.visibilityCell) {
            const visibilityList = bridge.getVisibilityList();
            this.visibilityCell.textContent = visibilityList.join(', ');
        }
        if (this.attackCell) {
            const attackList = bridge.getAttackList();
            this.attackCell.textContent = attackList.join(', ');
        }
        if (this.communicationsCell) {
            this.communicationsCell.textContent = bridge.getCommunicationName();
        }

        // Update electrics
        if (this.electricCell) {
            this.electricCell.innerHTML = '';
            const electrics = bridge.getElectrics();

            if (electrics.storage > 0) {
                const batteryDiv = document.createElement('div');
                batteryDiv.style.display = 'flex';
                batteryDiv.style.justifyContent = 'space-between';

                const label = document.createElement('span');
                label.textContent = localization.translate('Derived Battery');
                batteryDiv.appendChild(label);

                const value = document.createElement('span');
                value.textContent = electrics.storage.toString();
                batteryDiv.appendChild(value);

                this.electricCell.appendChild(batteryDiv);
            }

            for (const equip of electrics.equipment) {
                const equipDiv = document.createElement('div');
                equipDiv.style.display = 'flex';
                equipDiv.style.justifyContent = 'space-between';

                const label = document.createElement('span');
                label.textContent = equip.source;
                label.style.marginRight = '0.5em';
                equipDiv.appendChild(label);

                const value = document.createElement('span');
                value.textContent = equip.charge;
                equipDiv.appendChild(value);

                this.electricCell.appendChild(equipDiv);
            }
        }

        // Update vital components
        if (this.vitalComponents) {
            let vital = '';
            const vlist = bridge.vitalComponentList();
            for (const v of vlist) {
                vital += v + '<br/>';
            }
            this.vitalComponents.innerHTML = vital;
        }

        // Update weapons
        if (this.weaponCell) {
            let weaphtml = '';
            const bombs = bridge.getBombCount();
            const rockets = bridge.getRocketCount();
            let internal = bridge.getInternalBombCount();

            // Display bombs
            if (bombs > 0) {
                const int_bomb = Math.min(bombs, internal);
                const ext_bomb = Math.max(0, bombs - int_bomb);
                if (int_bomb > 0) {
                    weaphtml += localization.translate(' Bomb Mass Internally.').replace('%{A}', int_bomb.toString());
                }
                if (ext_bomb > 0) {
                    weaphtml += localization.translate(' Bomb Mass Externally.').replace('%{A}', ext_bomb.toString());
                }
                if (int_bomb > 0) {
                    const mib = Math.min(int_bomb, bridge.getMaxBombSize());
                    weaphtml += localization.translate('Largest Internal Bomb').replace('%{A}', mib.toString());
                }
                internal -= int_bomb;
                weaphtml += '<br/>';
            }

            // Display rockets
            if (rockets > 0) {
                const int_rock = Math.min(rockets, internal);
                const ext_rock = Math.max(0, rockets - int_rock);
                if (int_rock > 0) {
                    weaphtml += localization.translate(' Rocket Mass Internally.').replace('%{A}', int_rock.toString());
                }
                if (ext_rock > 0) {
                    weaphtml += localization.translate(' Rocket Mass Externally.').replace('%{A}', ext_rock.toString());
                }
                weaphtml += '<br/>';
            }

            // Display weapon sets
            const weaponSetsCount = bridge.getWeaponSetsCount();
            for (let i = 0; i < weaponSetsCount; i++) {
                const ws = bridge.getWeaponSystemDisplayInfo(i);
                weaphtml += ws + '<br/>';
            }

            this.weaponCell.innerHTML = weaphtml;
        }

        // Update warnings
        if (this.warningCell) {
            let warnhtml = '';
            if (stats.warnings && stats.warnings.length > 0) {
                // Sort warnings by level (White=0, Yellow=1, Red=2)
                const levelToNum = (level: string): number => {
                    if (level === 'Red') return 2;
                    if (level === 'Yellow') return 1;
                    return 0; // White
                };

                const sortedWarnings = [...stats.warnings].sort((a: any, b: any) => {
                    return levelToNum(a.level) - levelToNum(b.level);
                });

                for (const w of sortedWarnings) {
                    let color = 'var(--inp_txt_color)';
                    if (w.level === 'Red') {
                        color = '#FF0000';
                    } else if (w.level === 'Yellow') {
                        color = '#FFFF00';
                    }
                    // White uses default color

                    warnhtml += `<div style="color:${color};">${w.name}:  ${w.warning}</div>`;
                }
            }
            this.warningCell.innerHTML = warnhtml;
        }

        // Update description
        if (this.descCell) {
            const description = this.buildAircraftDescription();
            this.descCell.textContent = description;
        }

        // Update era display with hover and coloration
        if (this.versionCell && stats.eras) {
            this.updateEraDisplay(stats.eras);
        }
    }

    /**
     * Update era display with tooltip and color coding
     */
    private updateEraDisplay(eras: Array<{ name: string; era: string }>): void {
        // Clear existing content
        while (this.versionCell!.children.length > 0) {
            this.versionCell!.removeChild(this.versionCell!.children[0]);
        }
        this.versionCell!.className = 'tooltip';

        // Create tooltip div
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltiptext';

        const headerP = document.createElement('p');
        headerP.textContent = localization.translate('Derived Problematic Parts');
        tooltipDiv.appendChild(headerP);

        // Get aircraft era
        const aircraftEra = this.getBridge().getEraText();
        const aircraftEraNum = this.eraToNum(aircraftEra);

        // Calculate era break and list problematic parts
        let eraBreak = 0;
        let hasProblematicParts = false;

        for (const part of eras) {
            const partEraNum = this.eraToNum(part.era);
            console.log("Era Break? " + part.name + "  " + part.era + "  " + partEraNum + " " + aircraftEraNum);
            if (partEraNum > aircraftEraNum) {
                eraBreak += partEraNum - aircraftEraNum;
                hasProblematicParts = true;

                const partP = document.createElement('p');
                partP.textContent = `${part.name}: ${part.era}`;
                tooltipDiv.appendChild(partP);
            }
        }

        if (!hasProblematicParts) {
            const noneP = document.createElement('p');
            noneP.textContent = localization.translate('None');
            tooltipDiv.appendChild(noneP);
        }

        // Create era text element with color coding
        const eraP = document.createElement('p');
        eraP.textContent = localization.translate(aircraftEra);

        if (eraBreak === 0) {
            eraP.className = 'green';
        } else if (eraBreak > 2) {
            eraP.className = 'red';
        } else {
            eraP.className = 'yellow';
        }

        this.versionCell!.appendChild(eraP);
        this.versionCell!.appendChild(tooltipDiv);
    }

    /**
     * Convert era string to numeric value for comparison
     * Matches TypeScript era2numHl function
     */
    private eraToNum(era: string): number {
        switch (era) {
            case localization.translate('Pioneer'): return 0;
            case localization.translate('WWI'): return 1;
            case localization.translate('Roaring 20s'): return 2;
            case localization.translate('Coming Storm'): return 3;
            case localization.translate('WWII'): return 4;
            case localization.translate('Last Hurrah'): return 5;
            case localization.translate('Himmilgard'): return -1;
            default: return 0;
        }
    }

    /**
     * Build aircraft description based on wing and frame configuration
     */
    private buildAircraftDescription(): string {
        let description = '';
        const num_wings = this.getBridge().getWingCount();

        // Describe wing configuration
        if (num_wings === 1) {
            const deck = this.getBridge().getWingDeck(0);
            if (deck !== null && deck !== undefined) {
                // WING_DECK: PARASOL=0, SHOULDER=1, MID=2, LOW=3, GEAR=4
                if (deck < 2) {
                    description += 'High-Wing Monoplane ';
                } else if (deck === 2) {
                    description += 'Mid-Wing Monoplane ';
                } else {
                    description += 'Low-Wing Monoplane ';
                }
            }
        } else {
            const sesqui = this.getBridge().getWingsSesquiplane();
            if (sesqui && sesqui.is) {
                if (num_wings === 2) {
                    description += 'Sesquiplane ';
                } else if (num_wings === 3) {
                    description += 'Sestertiplane ';
                } else {
                    description += 'Sesqui-' + this.wingPrefix(num_wings);
                }
            } else if (this.getBridge().getWingsTandem()) {
                if (num_wings === 2 && this.getBridge().getWingsClosed()) {
                    description += 'Annular Monoplane ';
                } else {
                    description += 'Tandem ' + this.wingPrefix(num_wings);
                }
            } else {
                description += this.wingPrefix(num_wings);
            }
        }

        // Describe airframe type
        if (this.getBridge().getFramesFlyingWing()) {
            description += 'Flying Wing ';
        } else if (this.getBridge().getFramesCanFlyingWing()) {
            description += 'Lifting Body ';
        } else if (num_wings === 0) {
            description += 'Falling Rock ';
        }

        return description;
    }

    /**
     * Get wing configuration prefix name (Monoplane, Biplane, etc.)
     */
    private wingPrefix(num_wings: number): string {
        switch (num_wings) {
            case 0: return '';
            case 1: return 'Monoplane ';
            case 2: return 'Biplane ';
            case 3: return 'Triplane ';
            case 4: return 'Quadruplane ';
            case 5: return 'Pentaplane ';
            case 6: return 'Hexaplane ';
            case 7: return 'Heptaplane ';
            case 8: return 'Octoplane ';
            case 9: return 'Nonaplane ';
            case 10: return 'Decaplane ';
            case 11: return 'Undecaplane ';
            case 12: return 'Duodecaplane ';
            case 13: return 'Tredecaplane ';
            case 14: return 'Quattuordecaplane ';
            case 15: return 'Quindecaplane ';
            case 16: return 'Sexdecaplane ';
            case 17: return 'Septendecaplane ';
            case 18: return 'Octodecaplane ';
            case 19: return 'Novendecaplane ';
            case 20: return 'Vigintiplane ';
            default: return 'Window Blinds ';
        }
    }

    /**
     * Helper to create a table header cell
     */
    private createTH(row: HTMLTableRowElement, translationKey: string): HTMLTableCellElement {
        const th = document.createElement('th');
        th.textContent = localization.translate(translationKey);
        row.appendChild(th);
        return th;
    }

    public setShowBombs(show: boolean): void {
        this.showBombs = show;
    }
}
