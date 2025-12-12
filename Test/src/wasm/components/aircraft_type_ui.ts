/**
 * Aircraft Type UI Component
 *
 * Displays the Aircraft Type selector (Airplane, Autogyro, Ornithopter variants)
 * Note: Helicopter is typically hidden from selection (used for the Helicopter builder)
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createSelectElement,
    updateSelectElement,
    generateUniqueId,
    createMobileOptionItem,
    createMobileSelect
} from '../dom_utils';

// Aircraft type enum values (matching Rust AircraftType)
export const AIRCRAFT_TYPE = {
    AIRPLANE: 0,
    HELICOPTER: 1,
    AUTOGYRO: 2,
    ORNITHOPTER_BASIC: 3,
    ORNITHOPTER_FLUTTER: 4,
    ORNITHOPTER_BUZZER: 5
};

// Types that are available for selection (excluding Helicopter)
const SELECTABLE_TYPES = [
    AIRCRAFT_TYPE.AIRPLANE,
    AIRCRAFT_TYPE.AUTOGYRO,
    AIRCRAFT_TYPE.ORNITHOPTER_BASIC,
    AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER,
    AIRCRAFT_TYPE.ORNITHOPTER_BUZZER
];

// Cache interface for type safety
interface AircraftTypeCache {
    select: HTMLSelectElement;
}

export class AircraftTypeUI extends BaseComponentUI {
    private cache: AircraftTypeCache;
    private includeHelicopter: boolean = false;

    constructor(
        getBridge: () => AircraftBridge | null,
        containerId: string,
        onUpdateFunc?: () => void,
        includeHelicopter: boolean = false
    ) {
        // Set helicopter flag before super call (which triggers initial render)
        // We need a workaround since super() must be called first
        super(getBridge, containerId, onUpdateFunc);
        this.includeHelicopter = includeHelicopter;
        // Re-render with correct helicopter setting
        if (includeHelicopter) {
            this.render(true);
        }
    }

    protected shouldUpdate(): boolean {
        return this.cache !== undefined;
    }

    protected clearCache(): void {
        this.cache = undefined;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const currentType = bridge.getAircraftType();
        const typeNames = bridge.getAircraftTypeNames();

        // Build options for the select
        const selectableTypes = this.includeHelicopter
            ? [AIRCRAFT_TYPE.AIRPLANE, AIRCRAFT_TYPE.HELICOPTER, AIRCRAFT_TYPE.AUTOGYRO,
            AIRCRAFT_TYPE.ORNITHOPTER_BASIC, AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER, AIRCRAFT_TYPE.ORNITHOPTER_BUZZER]
            : SELECTABLE_TYPES;

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create wrapper span
        const span = document.createElement('span');

        // Create label
        const label = document.createElement('label');
        const selectId = generateUniqueId('aircraft_type');
        label.htmlFor = selectId;
        label.textContent = localization.translate('Aircraft Type Section Title') + ': ';
        label.style.marginLeft = '0.25em';
        label.style.marginRight = '0.5em';
        span.appendChild(label);

        // Create select element
        const select = document.createElement('select');
        select.id = selectId;

        // Map current type to selectable index
        let selectedSelectableIndex = 0;
        selectableTypes.forEach((typeValue, idx) => {
            const option = document.createElement('option');
            option.value = typeValue.toString();
            option.textContent = typeNames[typeValue] || `Type ${typeValue}`;
            if (typeValue === currentType) {
                option.selected = true;
                selectedSelectableIndex = idx;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            const newType = parseInt(select.value);
            bridge.setAircraftType(newType);
            this.onUpdate();
        });

        span.appendChild(select);
        desktopDiv.appendChild(span);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        const typeItem = createMobileOptionItem(
            localization.translate('Aircraft Type Section Title'),
            mobileDiv
        );

        // Create binding for mobile select
        const selectBinding = {
            name: localization.translate('Aircraft Type Section Title'),
            options: selectableTypes.map(typeValue => ({
                name: typeNames[typeValue] || `Type ${typeValue}`,
                enabled: true
            })),
            selected: selectedSelectableIndex,
            enabled: true
        };

        createMobileSelect(
            selectBinding,
            typeItem.content,
            (selectedIndex) => {
                const newType = selectableTypes[selectedIndex];
                bridge.setAircraftType(newType);
                this.onUpdate();
            }
        );

        contentWrapper.appendChild(mobileDiv);
        this.container.appendChild(contentWrapper);

        // Cache elements
        this.cache = { select };

        console.log('[AircraftTypeUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const currentType = bridge.getAircraftType();

        // Update select to match current type
        if (this.cache.select) {
            this.cache.select.value = currentType.toString();
        }
    }

    /**
     * Get the current aircraft type
     */
    getCurrentType(): number {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return AIRCRAFT_TYPE.AIRPLANE;
        return bridge.getAircraftType();
    }

    /**
     * Check if current aircraft type is an ornithopter variant
     */
    isOrnithopter(): boolean {
        const type = this.getCurrentType();
        return type === AIRCRAFT_TYPE.ORNITHOPTER_BASIC ||
            type === AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER ||
            type === AIRCRAFT_TYPE.ORNITHOPTER_BUZZER;
    }

    /**
     * Check if current aircraft type is autogyro
     */
    isAutogyro(): boolean {
        return this.getCurrentType() === AIRCRAFT_TYPE.AUTOGYRO;
    }

    /**
     * Check if current aircraft type is helicopter
     */
    isHelicopter(): boolean {
        return this.getCurrentType() === AIRCRAFT_TYPE.HELICOPTER;
    }

    /**
     * Check if current aircraft type uses rotors (autogyro or helicopter)
     */
    usesRotors(): boolean {
        return this.isAutogyro() || this.isHelicopter();
    }
}
