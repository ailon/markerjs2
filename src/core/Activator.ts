/**
 * Manages commercial marker.js 2 licenses.
 */
export class Activator {
  private static key: string;

  /**
   * Add a license key
   * @param key license key sent to you after purchase.
   */
  public static addKey(key: string): void {
    Activator.key = key;
  }

  /**
   * Returns true if the copy of marker.js is commercially licensed.
   */
  public static get isLicensed(): boolean {
    // NOTE:
    // before removing or modifying this please consider supporting marker.js
    // by visiting https://markerjs.com/ for details
    // thank you!
    if (Activator.key) {
      const keyRegex = new RegExp(
        /^MJS2-[A-Z][0-9]{3}-[A-Z][0-9]{3}-[0-9]{4}$/,
        'i'
      );
      return keyRegex.test(Activator.key);
    } else {
      return false;
    }
  }
}
