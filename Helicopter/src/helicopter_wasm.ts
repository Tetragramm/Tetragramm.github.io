/**
 * Helicopter Builder Entry Point (WASM Version)
 *
 * This is the main entry point for the WASM-powered Helicopter Builder.
 */

import { helicopterApp } from './wasm/helicopter_init';
import { scrollToFragment } from '../../Test/src/scroll/scroll';

// Initialize collapsible sections
function initCollapsibles(): void {
    const collapsibles = document.getElementsByClassName('collapsible');
    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener('click', function(this: HTMLElement) {
            const active = this.classList.toggle('active');
            let content = this.nextElementSibling;
            // Skip the h4 element if present (rules link)
            if (content && content.tagName === 'H4') {
                content = content.nextElementSibling;
            }
            if (content instanceof HTMLElement) {
                if (!active) {
                    content.style.maxHeight = '0px';
                } else {
                    content.style.maxHeight = 'inherit';
                }
            }
        });
    }
}

// Debounce helper for scroll handling
function debounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
    let timeout: number | undefined;
    return ((...args: any[]) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => callback(...args), delay);
    }) as T;
}

// Update URL hash based on scroll position
let currentHash = '';
function updateScrollHash(): void {
    const IDs = [
        'Era', 'Cockpit', 'Passengers', 'Engines', 'Frames', 'Rotors',
        'Stabilizers', 'Reinforcements', 'Weapons', 'Load', 'Landing_Gear',
        'Accessories', 'Optimization', 'Stats', 'Flight'
    ];

    let newHash = '';
    const offset = window.pageYOffset;

    for (const id of IDs) {
        const element = document.getElementById(id);
        if (element && element.offsetTop !== 0) {
            if (offset > element.offsetTop) {
                newHash = id;
            } else {
                break;
            }
        }
    }

    if (currentHash !== newHash) {
        currentHash = newHash;
        window.history.replaceState(null, '', 'index.html#' + newHash);
    }
}

// Main initialization
async function init(): Promise<void> {
    console.log('[HelicopterBuilder] Starting initialization...');

    // Initialize WASM application
    await helicopterApp.initialize();

    // Initialize collapsible sections
    initCollapsibles();

    // Setup scroll handling
    window.addEventListener('load', () => {
        scrollToFragment();
        setTimeout(() => {
            window.onscroll = debounce(updateScrollHash, 250);
        }, 1000);
    });

    console.log('[HelicopterBuilder] Initialization complete');
}

// Start initialization when DOM is ready
window.addEventListener('DOMContentLoaded', init);
