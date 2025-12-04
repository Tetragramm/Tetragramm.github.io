/**
 * Mobile Navigation Component
 *
 * Provides a sticky header for mobile devices with:
 * - Current section name (tap to show list of all sections)
 * - Navigation arrows (tap or swipe to go prev/next)
 * - Section dropdown list
 */

import { localization } from '../localization';

export interface MobileSectionConfig {
    id: string;           // DOM id of the section container
    labelKey: string;     // Localization key for the section name
    isVisible?: () => boolean; // Optional function to determine visibility
}

export class MobileNavigation {
    private container: HTMLElement;
    private currentIndex: number = 0;
    private sections: MobileSectionConfig[] = [];
    private titleElement: HTMLElement;
    private listElement: HTMLElement;
    private listVisible: boolean = false;
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private isSwiping: boolean = false;

    // Swipe configuration
    private readonly SWIPE_THRESHOLD = 50; // Minimum distance for swipe
    private readonly SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity for swipe

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container '${containerId}' not found`);
        }
        this.container = container;
        this.buildUI();
        this.setupTouchHandlers();

        // Listen for locale changes
        localization.onLocaleChange(() => this.updateTitle());
    }

    /**
     * Set the sections to navigate between
     */
    setSections(sections: MobileSectionConfig[]): void {
        this.sections = sections;
        this.updateList();
        this.updateTitle();
        this.showSection(0);
    }

    /**
     * Get visible sections (filtered by isVisible function)
     */
    private getVisibleSections(): MobileSectionConfig[] {
        return this.sections.filter(s => !s.isVisible || s.isVisible());
    }

    /**
     * Build the navigation UI
     */
    private buildUI(): void {
        this.container.className = 'mobile-nav';
        this.container.innerHTML = '';

        // Header with prev/title/next
        const header = document.createElement('div');
        header.className = 'mobile-nav-header';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'mobile-nav-prev';
        prevBtn.innerHTML = '&lt;';
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            this.navigatePrev();
        };
        header.appendChild(prevBtn);

        // Title (tap to show list)
        this.titleElement = document.createElement('div');
        this.titleElement.className = 'mobile-nav-title';
        this.titleElement.onclick = (e) => {
            e.stopPropagation();
            this.toggleList();
        };
        header.appendChild(this.titleElement);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'mobile-nav-next';
        nextBtn.innerHTML = '&gt;';
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            this.navigateNext();
        };
        header.appendChild(nextBtn);

        this.container.appendChild(header);

        // Section list (dropdown)
        this.listElement = document.createElement('div');
        this.listElement.className = 'mobile-nav-list';
        this.container.appendChild(this.listElement);

        // Close list when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target as Node)) {
                this.hideList();
            }
        });
    }

    /**
     * Setup touch handlers for swipe navigation
     */
    private setupTouchHandlers(): void {
        // Listen on document body for swipe gestures
        document.body.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isSwiping = false;
        }, { passive: true });

        document.body.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;

            const deltaX = e.touches[0].clientX - this.touchStartX;
            const deltaY = e.touches[0].clientY - this.touchStartY;

            // Only consider horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                this.isSwiping = true;
            }
        }, { passive: true });

        document.body.addEventListener('touchend', (e) => {
            if (!this.isSwiping) return;

            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchEndX - this.touchStartX;

            if (Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
                if (deltaX > 0) {
                    // Swipe right -> go to previous
                    this.navigatePrev();
                } else {
                    // Swipe left -> go to next
                    this.navigateNext();
                }
            }

            this.touchStartX = 0;
            this.touchStartY = 0;
            this.isSwiping = false;
        }, { passive: true });
    }

    /**
     * Update the section list
     */
    private updateList(): void {
        this.listElement.innerHTML = '';
        const visibleSections = this.getVisibleSections();

        visibleSections.forEach((section, index) => {
            const item = document.createElement('div');
            item.className = 'mobile-nav-list-item';
            if (index === this.currentIndex) {
                item.classList.add('active');
            }
            item.textContent = localization.translate(section.labelKey);
            item.onclick = (e) => {
                e.stopPropagation();
                this.showSection(index);
                this.hideList();
            };
            this.listElement.appendChild(item);
        });
    }

    /**
     * Update the title to show current section
     */
    private updateTitle(): void {
        const visibleSections = this.getVisibleSections();
        if (this.currentIndex < visibleSections.length) {
            const section = visibleSections[this.currentIndex];
            this.titleElement.textContent = localization.translate(section.labelKey);
        }
    }

    /**
     * Toggle the section list visibility
     */
    private toggleList(): void {
        if (this.listVisible) {
            this.hideList();
        } else {
            this.showList();
        }
    }

    /**
     * Show the section list
     */
    private showList(): void {
        this.updateList(); // Refresh in case visibility changed
        this.listElement.classList.add('show');
        this.listVisible = true;
    }

    /**
     * Hide the section list
     */
    private hideList(): void {
        this.listElement.classList.remove('show');
        this.listVisible = false;
    }

    /**
     * Navigate to previous section
     */
    navigatePrev(): void {
        const visibleSections = this.getVisibleSections();
        if (visibleSections.length === 0) return;

        const newIndex = this.currentIndex > 0
            ? this.currentIndex - 1
            : visibleSections.length - 1; // Wrap around
        this.showSection(newIndex);
    }

    /**
     * Navigate to next section
     */
    navigateNext(): void {
        const visibleSections = this.getVisibleSections();
        if (visibleSections.length === 0) return;

        const newIndex = this.currentIndex < visibleSections.length - 1
            ? this.currentIndex + 1
            : 0; // Wrap around
        this.showSection(newIndex);
    }

    /**
     * Show a specific section by index
     */
    showSection(index: number): void {
        const visibleSections = this.getVisibleSections();
        if (index < 0 || index >= visibleSections.length) return;

        // Hide all sections
        this.sections.forEach(section => {
            const elem = document.getElementById(section.id);
            if (elem) {
                elem.classList.remove('mobile-active-section');
            }
        });

        // Show the selected section
        const section = visibleSections[index];
        const elem = document.getElementById(section.id);
        if (elem) {
            elem.classList.add('mobile-active-section');
            // Scroll to top of section
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.currentIndex = index;
        this.updateTitle();
        this.updateList();
    }

    /**
     * Navigate to a section by its ID
     */
    navigateToSection(sectionId: string): void {
        const visibleSections = this.getVisibleSections();
        const index = visibleSections.findIndex(s => s.id === sectionId);
        if (index !== -1) {
            this.showSection(index);
        }
    }

    /**
     * Check if we're in mobile view
     */
    static isMobileView(): boolean {
        return window.innerWidth <= 768;
    }
}
