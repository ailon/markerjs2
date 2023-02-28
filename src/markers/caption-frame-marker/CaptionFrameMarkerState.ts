import { RectangleMarkerState } from "../RectangleMarkerState";

/**
 * Represents state of a CaptionFrameMarker,
 */
export interface CaptionFrameMarkerState extends RectangleMarkerState {
  /**
   * Text color.
   */
  textColor: string;
  /**
   * Caption text font family.
   */
  fontFamily: string;
  /**
   * Caption text font size.
   */
  fontSize: string;
  /**
   * Caption text
   */
  labelText: string;
}