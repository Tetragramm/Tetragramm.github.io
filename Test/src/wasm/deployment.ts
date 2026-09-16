/**
 * Deployment awareness: which copy of the builder is this page served from?
 *
 * The site hosts several copies of the same code side by side:
 *   /PlaneBuilder/  the primary builder
 *   /Test/          a verbatim copy used for public testing
 *   /Helicopter/    the helicopter pages, which load their bundles and shared
 *                   assets from ../Test/ and share Test's localStorage data
 *
 * Rather than editing paths and localStorage keys every time PlaneBuilder/ is
 * copied to Test/, everything that depends on the copy is derived here from
 * the page URL. That keeps the two folders identical (see README, "Testing
 * branch conventions").
 */

/** Folder the primary builder is served from. */
export const PRIMARY_DIR = 'PlaneBuilder';
/** Folder the Helicopter pages are served from. */
export const HELICOPTER_DIR = 'Helicopter';
/**
 * Builder copy the Helicopter pages are bound to: they load their bundles and
 * Rules/Engine Builder links from ../<HELICOPTER_HOST_DIR>/, redirect there
 * when a non-helicopter aircraft is loaded, and share its engine lists and
 * custom parts. Keep in sync with Helicopter/src, Helicopter/*.html and the
 * helicopter entries in webpack.config.js.
 */
export const HELICOPTER_HOST_DIR = 'Test';

/**
 * Name of the folder this page is served from, e.g. "PlaneBuilder", "Test" or
 * "Helicopter". Every builder page (index/hangar/engine) sits directly inside
 * its folder, so this is the path segment before the file name.
 */
export function pageDir(): string {
    const segments = window.location.pathname.split('/');
    // "/Test/index.html" -> ["", "Test", "index.html"]; "/Test/" -> ["", "Test", ""]
    return segments.length >= 2 ? segments[segments.length - 2] : '';
}

/** True when running on one of the Helicopter pages. */
export function isHelicopterPage(): boolean {
    return pageDir() === HELICOPTER_DIR;
}

/**
 * localStorage key prefix for data shared with the builder: the active
 * aircraft, hangars, custom engine lists and custom parts.
 *
 * The primary builder uses bare keys ("aircraft", "hangar_names", ...) so it
 * keeps reading everything users saved with earlier versions. Any other copy
 * (/Test/, or a feature branch served from its own folder) is namespaced by
 * its lower-cased folder name ("test.aircraft") so it can never clobber live
 * data. The Helicopter pages use the prefix of the copy they are bound to
 * (their own aircraft/hangars are namespaced separately, see Helicopter/src).
 */
export function storagePrefix(): string {
    let dir = pageDir();
    if (dir === HELICOPTER_DIR) {
        dir = HELICOPTER_HOST_DIR;
    }
    return dir === PRIMARY_DIR ? '' : dir.toLowerCase() + '.';
}

/** Full localStorage key for a shared item: storagePrefix() + name. */
export function storageKey(name: string): string {
    return storagePrefix() + name;
}
