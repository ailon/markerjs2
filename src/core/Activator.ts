export class Activator {
  private static key: string;

  public static addKey(key: string): void {
    Activator.key = key;
  }

  public static get isLicensed(): boolean {
    // NOTE:
    // before removing or modifying this please consider supporting marker.js
    // by visiting https://markerjs.com/ for details
    // thank you!
    if (Activator.key) {
      const keyRegex = new RegExp(/^MJS2-[A-Z][0-9]{3}-[A-Z][0-9]{3}-[0-9]{4}$/, 'i');
      return keyRegex.test(Activator.key);
    } else {
      return false;
    }
  }
}
