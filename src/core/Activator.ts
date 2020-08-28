export class Activator {
  public static key: string;
  public static get isLicensed(): boolean {
    // NOTE:
    // before removing or modifying this please consider supporting marker.js
    // by visiting https://markerjs.com/ for details
    // thank you!
    if (Activator.key) {
      return true;
    } else {
      return false;
    }
  }
}
