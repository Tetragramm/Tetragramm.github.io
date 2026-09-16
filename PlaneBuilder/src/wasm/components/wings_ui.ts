/**
 * Wings UI Component
 *
 * Displays the Wings section using UIBindings from Rust
 * Complex UI with variable-length wing arrays and extensive stats
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';
import {
    createRulesLink,
    createSelectElement,
    updateSelectElement,
    createCollapsibleSection,
    StatDisplayConfig,
    createFlexCheckbox,
    createFlexNumberInput,
    createMobileOptionItem,
    createMobileSelect,
    createMobileCheckbox,
    createMobileNumberInput,
    Updatable,
    dualSelect,
    dualStats,
    dualSelectBareInto,
    dualNumberInto,
    dualCheckboxInto,
} from '../dom_utils';

// Stats configuration for wings
const WINGS_STATS: StatDisplayConfig[] = [
    { key: 'wingarea', label: 'Stat Wing Area', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
];

/** A dual checkbox with a custom (non-flex-container-o) desktop node. */
interface GlobalCheckbox extends Updatable {
    desktop: HTMLElement;
    mobile: HTMLElement;
}

export class WingsUI extends BaseComponentUI {
    // Dual controls (desktop + mobile) built in rebuildFull, refreshed in updateValues.
    private controls: Updatable[] = [];
    private showWings: boolean;

    // Structural counts captured at build time. updateValues() compares the live
    // wing-array lengths against these to decide whether a control-by-control fast
    // update is valid or a full rebuild is required (wings added/removed).
    private fullWingCount = 0;
    private miniWingCount = 0;

    protected shouldUpdate(): boolean {
        // Null-safe: BaseComponentUI's constructor triggers the first render()
        // (hence shouldUpdate) before this subclass's field initializer runs.
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
        this.fullWingCount = 0;
        this.miniWingCount = 0;
        this.pendingFullDesktop = [];
        this.pendingMiniDesktop = [];
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) {
            console.error('[WingsUI] rebuildFull: Bridge not available');
            return;
        }

        const bindings = bridge.getWingsBindings();
        const aircraftType = bridge.getAircraftType();

        // Capture structural counts so updateValues() can detect add/remove.
        this.fullWingCount = bindings.full_wings.length;
        this.miniWingCount = bindings.mini_wings.length;

        // --- Wing-level option controls (stagger / closed / swept) ---
        const staggerCtl = dualSelect(
            localization.translate('Wings Wing Stagger'),
            () => bridge.getWingsBindings().stagger,
            (selectedIndex) => {
                const updatedBindings = bridge.getWingsBindings();
                updatedBindings.stagger.selected = selectedIndex;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate(); // Full rebuild when stagger changes
            }
        );
        // Closed / Swept: original desktop placed the flex checkbox label+input
        // directly into a bare <span> (div1===div2===span), NOT a flex-container-o,
        // so dualCheckbox's wrapper would change the DOM. Build both nodes by hand
        // with a single shared handler (see buildGlobalCheckbox).
        const closedCtl = this.buildGlobalCheckbox(
            () => bridge.getWingsBindings().closed,
            (selected) => {
                const updatedBindings = bridge.getWingsBindings();
                updatedBindings.closed.selected = selected;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        const sweptCtl = this.buildGlobalCheckbox(
            () => bridge.getWingsBindings().swept,
            (selected) => {
                const updatedBindings = bridge.getWingsBindings();
                updatedBindings.swept.selected = selected;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // --- Stats block ---
        const statsCtl = dualStats(
            localization.translate('Wings Wing Stats'),
            () => bridge.getWingsStats(),
            WINGS_STATS
        );

        const contentWrapper = document.createElement('div');

        // ====================================================================
        // DESKTOP VERSION (unchanged layout)
        // ====================================================================
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';
        const desktopSection = this.createWingsSection(
            bindings, bridge, staggerCtl, closedCtl, sweptCtl, statsCtl
        );
        desktopDiv.appendChild(desktopSection);

        // ====================================================================
        // MOBILE VERSION
        // ====================================================================
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';
        this.createMobileWingsSection(
            bindings, mobileDiv, bridge, staggerCtl, closedCtl, sweptCtl, statsCtl
        );

        contentWrapper.appendChild(desktopDiv);
        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        this.sectionElement = createCollapsibleSection(
            localization.translate('Wings Section Title'),
            contentWrapper,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Wings');
        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

        this.container.appendChild(this.sectionElement);

        // Set initial visibility based on aircraft type
        this.updateVisibility(aircraftType);
    }

    /**
     * Create the complete Wings section (desktop layout)
     *
     * The stagger select uses each dual control's `.mobile` node only on mobile;
     * here we place the matching `.desktop` nodes exactly where the original
     * desktop DOM expected them (h4 controls + 3-column table).
     */
    private createWingsSection(
        bindings: any,
        bridge: AircraftBridge,
        staggerCtl: ReturnType<typeof dualSelect>,
        closedCtl: GlobalCheckbox,
        sweptCtl: GlobalCheckbox,
        statsCtl: ReturnType<typeof dualStats>
    ): HTMLElement {
        const contentDiv = document.createElement('div');

        // Global controls (h4 with stagger select and checkboxes)
        const controlsDiv = document.createElement('h4');

        // Stagger — wrap the dual select's desktop node in the original label span.
        const staggerSpan = document.createElement('span');
        const staggerLabel = document.createElement('label');
        staggerLabel.htmlFor = 'wing_stagger_wasm';
        staggerLabel.textContent = localization.translate('Wings Wing Stagger') + ': ';
        staggerSpan.appendChild(staggerLabel);
        staggerCtl.desktop.id = 'wing_stagger_wasm';
        staggerSpan.appendChild(staggerCtl.desktop);
        controlsDiv.appendChild(staggerSpan);

        // Closed / Swept — desktop nodes are bare spans holding label+checkbox
        // (div1 === div2 === span), exactly as the original built them.
        controlsDiv.appendChild(closedCtl.desktop);
        controlsDiv.appendChild(sweptCtl.desktop);

        contentDiv.appendChild(controlsDiv);

        // Wings table
        const table = document.createElement('table');
        table.id = 'wing_table';

        // Header row
        const headerRow = document.createElement('tr');
        const wingTypeHeader = document.createElement('th');
        wingTypeHeader.textContent = localization.translate('Wings Wing Type');
        headerRow.appendChild(wingTypeHeader);

        const wingOptionsHeader = document.createElement('th');
        wingOptionsHeader.textContent = localization.translate('Wings Wing Options');
        headerRow.appendChild(wingOptionsHeader);

        const wingStatsHeader = document.createElement('th');
        wingStatsHeader.textContent = localization.translate('Wings Wing Stats');
        headerRow.appendChild(wingStatsHeader);

        table.appendChild(headerRow);

        // Full Wings row
        const fullWingsLabelRow = document.createElement('tr');
        const fullWingsLabel = document.createElement('th');
        fullWingsLabel.textContent = localization.translate('Wings Full Wings');
        fullWingsLabelRow.appendChild(fullWingsLabel);
        table.appendChild(fullWingsLabelRow);

        // Mini Wings row
        const miniWingsLabelRow = document.createElement('tr');
        const miniWingsLabel = document.createElement('th');
        miniWingsLabel.textContent = localization.translate('Wings Miniature Wings');
        miniWingsLabelRow.appendChild(miniWingsLabel);
        table.appendChild(miniWingsLabelRow);

        const fullWingsOptionsCell = document.createElement('td');
        fullWingsLabelRow.appendChild(fullWingsOptionsCell);

        // Stats cell (spans both full + mini rows)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.rowSpan = 2;
        statsCell.appendChild(statsCtl.desktop);
        fullWingsLabelRow.appendChild(statsCell);

        // Mini wings data row
        const miniWingsOptionsCell = document.createElement('td');
        miniWingsLabelRow.appendChild(miniWingsOptionsCell);

        // Build full wing rows (desktop nodes placed here; mobile nodes built in
        // createMobileWingsSection so per-wing controls share one Updatable).
        for (let i = 0; i < bindings.full_wings.length; i++) {
            this.createFullWingRowDesktop(i, fullWingsOptionsCell, bridge);
        }

        // Add "add full wing" select
        const addFullWingSelect = createSelectElement(
            bindings.add_full_wing.deck,
            (selectedIndex) => {
                if (selectedIndex > 0) { // 0 is "No Wing"
                    const updatedBindings = bridge.getWingsBindings();
                    updatedBindings.add_full_wing.deck.selected = selectedIndex;
                    bridge.setWingsBindings(updatedBindings);
                    this.onUpdate(); // Full rebuild when adding wing
                }
            }
        );
        addFullWingSelect.disabled = !bindings.add_full_wing.can_add;
        fullWingsOptionsCell.appendChild(addFullWingSelect);
        this.controls.push({
            update: () => {
                updateSelectElement(addFullWingSelect, bridge.getWingsBindings().add_full_wing.deck);
                addFullWingSelect.disabled = !bridge.getWingsBindings().add_full_wing.can_add;
            }
        });

        // Build mini wing rows
        for (let i = 0; i < bindings.mini_wings.length; i++) {
            this.createMiniWingRowDesktop(i, miniWingsOptionsCell, bridge);
        }

        // Add "add mini wing" select
        const addMiniWingSelect = createSelectElement(
            bindings.add_mini_wing.deck,
            (selectedIndex) => {
                if (selectedIndex > 0) {
                    const updatedBindings = bridge.getWingsBindings();
                    updatedBindings.add_mini_wing.deck.selected = selectedIndex;
                    bridge.setWingsBindings(updatedBindings);
                    this.onUpdate();
                }
            }
        );
        addMiniWingSelect.disabled = !bindings.add_mini_wing.can_add;
        miniWingsOptionsCell.appendChild(addMiniWingSelect);
        this.controls.push({
            update: () => {
                updateSelectElement(addMiniWingSelect, bridge.getWingsBindings().add_mini_wing.deck);
                addMiniWingSelect.disabled = !bridge.getWingsBindings().add_mini_wing.can_add;
            }
        });

        contentDiv.appendChild(table);

        // The wing-level option controls and stats Updatables are pushed here so
        // updateValues() refreshes them along with the per-wing controls.
        this.controls.push(staggerCtl, closedCtl, sweptCtl, statsCtl);

        // Caller (rebuildFull) wraps this in the outer collapsible section and
        // adds the rules link — don't duplicate the wrapper here.
        return contentDiv;
    }

    /**
     * Build the DESKTOP nodes for a single full wing row (deck/skin bare selects +
     * area/span/gull/dihedral/anhedral in a shared inline options span). The matching
     * mobile nodes are created in createMobileWingRow; both share the Updatables
     * pushed onto this.controls (deck/skin/area/span/gull), plus the dihedral/anhedral
     * Updatables which carry the desktop-only dynamic max.
     */
    private createFullWingRowDesktop(
        index: number,
        optionsCell: HTMLTableCellElement,
        bridge: AircraftBridge
    ): void {
        // Wing span (deck select + skin select, bare)
        const wingSpan = document.createElement('span');

        // Deck / skin bare selects — created later when the mobile row is built so
        // each shares one Updatable. Here we just reserve the placement: the mobile
        // builder appends the desktop bare selects into wingSpan via the returned refs.
        this.pendingFullDesktop[index] = { wingSpan };

        // Options span holds area/span/gull/dihedral/anhedral inline (div1===div2===span).
        const optionsSpan = document.createElement('span');
        this.pendingFullDesktop[index].optionsSpan = optionsSpan;

        wingSpan.appendChild(optionsSpan);
        wingSpan.appendChild(document.createElement('br'));
        optionsCell.appendChild(wingSpan);
    }

    /**
     * Build the DESKTOP nodes for a single mini wing row (deck/skin bare selects +
     * area/span in a shared inline options span).
     */
    private createMiniWingRowDesktop(
        index: number,
        optionsCell: HTMLTableCellElement,
        bridge: AircraftBridge
    ): void {
        const wingSpan = document.createElement('span');
        this.pendingMiniDesktop[index] = { wingSpan };

        const optionsSpan = document.createElement('span');
        this.pendingMiniDesktop[index].optionsSpan = optionsSpan;

        wingSpan.appendChild(optionsSpan);
        wingSpan.appendChild(document.createElement('br'));
        optionsCell.appendChild(wingSpan);
    }

    // Desktop placement targets keyed by wing index, populated while building the
    // desktop table and consumed while building the mobile section so each control
    // is created once (desktop node + mobile node) with a single shared handler.
    private pendingFullDesktop: { wingSpan: HTMLElement; optionsSpan?: HTMLElement }[] = [];
    private pendingMiniDesktop: { wingSpan: HTMLElement; optionsSpan?: HTMLElement }[] = [];

    /**
     * Create mobile wings section (and finish wiring the per-wing dual controls,
     * placing their desktop nodes into the spans reserved by the desktop builder).
     */
    private createMobileWingsSection(
        bindings: any,
        parent: HTMLElement,
        bridge: AircraftBridge,
        staggerCtl: ReturnType<typeof dualSelect>,
        closedCtl: GlobalCheckbox,
        sweptCtl: GlobalCheckbox,
        statsCtl: ReturnType<typeof dualStats>
    ): void {
        // Global controls — original wrapped the mobile stagger select in a custom
        // labelled row, and put the closed/swept mobile checkboxes directly in the
        // option content. Reproduce that exact structure, hosting the dual controls'
        // mobile nodes' inner widgets.
        const globalItem = createMobileOptionItem(
            localization.translate('Wings Wing Options'),
            parent
        );

        // Stagger: labelled row containing the dual select's mobile <select>.
        const staggerRow = document.createElement('div');
        staggerRow.style.width = '100%';
        staggerRow.style.marginBottom = '0.5rem';
        const staggerLabel = document.createElement('span');
        staggerLabel.textContent = localization.translate('Wings Wing Stagger') + ': ';
        staggerRow.appendChild(staggerLabel);
        // Move the dual select's mobile <select> out of its option-item wrapper into
        // the labelled row so the DOM matches the original createMobileSelect output.
        const staggerMobileSelect = staggerCtl.mobile.querySelector('select');
        if (staggerMobileSelect) staggerRow.appendChild(staggerMobileSelect);
        globalItem.content.appendChild(staggerRow);

        // Closed / Swept: mobile nodes ARE the createMobileCheckbox labels; append
        // them directly into the global option content (matching the original).
        globalItem.content.appendChild(closedCtl.mobile);
        globalItem.content.appendChild(sweptCtl.mobile);

        // Full Wings section
        const fullWingsItem = createMobileOptionItem(
            localization.translate('Wings Full Wings'),
            parent
        );

        bindings.full_wings.forEach((_wing: any, i: number) => {
            this.createWingRow(i, 'full', fullWingsItem.content, bridge);
        });

        // Add wing button
        if (bindings.add_full_wing.can_add) {
            const wingDiv = document.createElement('div');
            wingDiv.className = 'mobile-frame-row';
            wingDiv.style.marginBottom = '0.5rem';

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'mobile-number-btn';
            addBtn.style.width = '100%';
            addBtn.style.marginTop = '0.5rem';
            addBtn.textContent = '+ ';
            addBtn.onclick = () => {
                const updatedBindings = bridge.getWingsBindings();
                updatedBindings.add_full_wing.deck.selected = 1; // First non-empty option
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            };
            wingDiv.appendChild(addBtn);
            fullWingsItem.content.appendChild(wingDiv);
        }

        // Mini Wings section
        const miniWingsItem = createMobileOptionItem(
            localization.translate('Wings Miniature Wings'),
            parent
        );

        bindings.mini_wings.forEach((_wing: any, i: number) => {
            this.createWingRow(i, 'mini', miniWingsItem.content, bridge);
        });

        // Add mini wing button
        if (bindings.add_mini_wing.can_add) {
            const wingDiv = document.createElement('div');
            wingDiv.className = 'mobile-frame-row';
            wingDiv.style.marginBottom = '0.5rem';

            const addMiniBtn = document.createElement('button');
            addMiniBtn.type = 'button';
            addMiniBtn.className = 'mobile-number-btn';
            addMiniBtn.style.width = '100%';
            addMiniBtn.style.marginTop = '0.5rem';
            addMiniBtn.textContent = '+ ';
            addMiniBtn.onclick = () => {
                const updatedBindings = bridge.getWingsBindings();
                updatedBindings.add_mini_wing.deck.selected = 1;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            };
            wingDiv.appendChild(addMiniBtn);
            miniWingsItem.content.appendChild(wingDiv);
        }

        // Stats — append the dual stats mobile grid into its own option item.
        const statsItem = createMobileOptionItem(
            localization.translate('Wings Wing Stats'),
            parent
        );
        const statsGrid = statsCtl.mobile.querySelector('.mobile-stats-grid');
        if (statsGrid) statsItem.content.appendChild(statsGrid);
    }

    /**
     * Build BOTH desktop and mobile nodes for one wing row, each control once with a
     * single shared handler. Desktop nodes are placed into the spans reserved by the
     * desktop builder; mobile nodes are built into the per-wing mobile-frame-row.
     */
    private createWingRow(
        index: number,
        type: 'full' | 'mini',
        parent: HTMLElement,
        bridge: AircraftBridge
    ): void {
        const desktop = type === 'full'
            ? this.pendingFullDesktop[index]
            : this.pendingMiniDesktop[index];
        const wingSpan = desktop.wingSpan;
        const optionsSpan = desktop.optionsSpan!;
        // Desktop "flex" container is the inline options span (div1===div2===span),
        // matching the original createFullWingRow/createMiniWingRow layout exactly.
        const optionsFlex = { div1: optionsSpan, div2: optionsSpan };

        const wingArray = (b: any) => type === 'full' ? b.full_wings : b.mini_wings;
        const getWing = () => wingArray(bridge.getWingsBindings())[index];

        // ===== Mobile per-wing frame =====
        const wingDiv = document.createElement('div');
        wingDiv.className = 'mobile-frame-row';
        wingDiv.style.marginBottom = '0.5rem';

        // Deck + skin selects: mobile share a deckRow; desktop are bare selects placed
        // directly into wingSpan (before the optionsSpan).
        const deckRow = document.createElement('div');
        deckRow.style.gap = '0.25rem';
        deckRow.style.marginBottom = '0.25rem';

        const deckCtl = dualSelectBareInto(
            deckRow,
            () => getWing().deck,
            (selectedIndex) => {
                const updatedBindings = bridge.getWingsBindings();
                wingArray(updatedBindings)[index].deck.selected = selectedIndex;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate(); // deck change may add/remove a wing
            }
        );
        const skinCtl = dualSelectBareInto(
            deckRow,
            () => getWing().skin,
            (selectedIndex) => {
                const updatedBindings = bridge.getWingsBindings();
                wingArray(updatedBindings)[index].skin.selected = selectedIndex;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        // Place the bare desktop selects into wingSpan before the options span.
        wingSpan.insertBefore(deckCtl.desktop, optionsSpan);
        wingSpan.insertBefore(skinCtl.desktop, optionsSpan);
        wingDiv.appendChild(deckRow);
        this.controls.push(deckCtl, skinCtl);

        // Area + span: mobile share an inputsRow; desktop go into the shared optionsSpan.
        const inputsRow = document.createElement('div');
        inputsRow.style.display = 'flex';
        inputsRow.style.gap = '0.25rem';
        inputsRow.style.flexWrap = 'wrap';

        const areaCtl = dualNumberInto(
            optionsFlex,
            inputsRow,
            () => ({ ...getWing().area, name: localization.translate('Wings Area') }),
            (value) => {
                const updatedBindings = bridge.getWingsBindings();
                wingArray(updatedBindings)[index].area.value = value;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            },
            type === 'full'
                ? { min: 3 }
                : { min: 1, max: 2 }
        );
        const spanCtl = dualNumberInto(
            optionsFlex,
            inputsRow,
            () => ({ ...getWing().span, name: localization.translate('Wings Span') }),
            (value) => {
                const updatedBindings = bridge.getWingsBindings();
                wingArray(updatedBindings)[index].span.value = value;
                bridge.setWingsBindings(updatedBindings);
                this.onUpdate();
            },
            { min: 1 }
        );
        wingDiv.appendChild(inputsRow);
        this.controls.push(areaCtl, spanCtl);

        // Full-wing-only options: gull checkbox + dihedral/anhedral inputs.
        if (type === 'full') {
            const optionsRow = document.createElement('div');
            optionsRow.style.display = 'flex';
            optionsRow.style.gap = '0.25rem';
            optionsRow.style.flexWrap = 'wrap';
            optionsRow.style.marginTop = '0.25rem';

            // Gull checkbox — desktop into optionsSpan, mobile into optionsRow.
            const gullCtl = dualCheckboxInto(
                optionsFlex,
                optionsRow,
                () => ({ ...getWing().gull, name: localization.translate('Wings Gull') }),
                (checked) => {
                    const updatedBindings = bridge.getWingsBindings();
                    updatedBindings.full_wings[index].gull.selected = checked;
                    bridge.setWingsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
            this.controls.push(gullCtl);

            // Dihedral / Anhedral: the desktop input carries a DYNAMIC max
            // (span - other - 1) that the mobile input must NOT have, so these can't
            // use dualNumberInto (it mirrors max onto both and doesn't refresh max).
            // Build both nodes by hand here with a single shared handler + Updatable.
            this.controls.push(this.buildDihedralLike(
                'dihedral', index, optionsFlex, optionsRow, bridge,
                localization.translate('Wings Dihedral'),
                (w) => (w.span.value - w.anhedral.value - 1).toString()
            ));
            this.controls.push(this.buildDihedralLike(
                'anhedral', index, optionsFlex, optionsRow, bridge,
                localization.translate('Wings Anhedral'),
                (w) => (w.span.value - w.dihedral.value - 1).toString()
            ));

            wingDiv.appendChild(optionsRow);
        }

        parent.appendChild(wingDiv);
    }

    /**
     * Build a dihedral/anhedral-style number control: desktop flex input (min 0 +
     * dynamic max recomputed on update) and mobile number input (min 0, no max),
     * sharing one handler. Returns an Updatable that refreshes value/enabled on both
     * and recomputes the desktop max — preserving the original byte-for-byte DOM.
     */
    private buildDihedralLike(
        field: 'dihedral' | 'anhedral',
        index: number,
        desktopFlex: { div1: HTMLElement; div2: HTMLElement },
        mobileParent: HTMLElement,
        bridge: AircraftBridge,
        label: string,
        computeMax: (wing: any) => string
    ): Updatable {
        const getWing = () => bridge.getWingsBindings().full_wings[index];
        const onChange = (value: number) => {
            const updatedBindings = bridge.getWingsBindings();
            updatedBindings.full_wings[index][field].value = value;
            bridge.setWingsBindings(updatedBindings);
            this.onUpdate();
        };

        const initial = { ...getWing()[field], name: label };
        const desktopInput = createFlexNumberInput(initial, desktopFlex, onChange);
        desktopInput.min = '0';
        desktopInput.max = computeMax(getWing());

        const { input: mobileInput } = createMobileNumberInput(
            { ...getWing()[field], name: label }, mobileParent, onChange, 0
        );

        return {
            update: () => {
                const w = getWing();
                desktopInput.valueAsNumber = w[field].value;
                desktopInput.disabled = !w[field].enabled;
                desktopInput.max = computeMax(w);
                mobileInput.valueAsNumber = w[field].value;
                mobileInput.disabled = !w[field].enabled;
            }
        };
    }

    /**
     * Build a global (stagger-row) checkbox as a dual control whose desktop node is
     * the original bare span (label+checkbox inline, div1===div2===span) and whose
     * mobile node is a createMobileCheckbox label. Single shared handler; the returned
     * Updatable refreshes checked/disabled on both. Used for Closed/Swept so the DOM
     * stays byte-identical (dualCheckbox would wrap the desktop in a flex-container-o).
     */
    private buildGlobalCheckbox(
        getBinding: () => any,
        onChange: (checked: boolean) => void
    ): GlobalCheckbox {
        // Desktop: bare span with the flex checkbox label+input placed inline.
        const span = document.createElement('span');
        const desktopCheckbox = createFlexCheckbox(
            getBinding(), { div1: span, div2: span }, onChange
        );

        // Mobile: createMobileCheckbox appends a labelled checkbox into a holder; the
        // holder's single child IS the .mobile-checkbox-label we hand back.
        const mobileHolder = document.createElement('div');
        const mobileCheckbox = createMobileCheckbox(getBinding(), mobileHolder, onChange);
        const mobileLabel = mobileHolder.firstElementChild as HTMLElement;

        return {
            desktop: span,
            mobile: mobileLabel,
            update: () => {
                const b = getBinding();
                desktopCheckbox.checked = b.selected;
                desktopCheckbox.disabled = !b.enabled;
                mobileCheckbox.checked = b.selected;
                mobileCheckbox.disabled = !b.enabled;
            },
        };
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;

        const bindings = bridge.getWingsBindings();
        const aircraftType = bridge.getAircraftType();

        // Update visibility first
        this.updateVisibility(aircraftType);

        // Structural-change detection: if wings were added/removed, the per-wing
        // control set is stale — force a full rebuild (preserves original behavior).
        if (bindings.full_wings.length !== this.fullWingCount ||
            bindings.mini_wings.length !== this.miniWingCount) {
            this.render(true);
            return;
        }

        // Refresh every dual control (wing-level options, per-wing controls, add
        // selects, and stats) from fresh bindings.
        this.controls.forEach(c => c.update());
    }

    /**
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        this.showWings = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showWings ? '' : 'none';
        }
    }

    public isVisible(): boolean {
        return this.showWings;
    }
}
