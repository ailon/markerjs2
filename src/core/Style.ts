import { IStyleSettings } from './IStyleSettings';

/**
 * Simple utility CSS-in-JS implementation.
 */
export class Style {
  /**
   * Prefix used for all internally created CSS classes.
   */
  public static CLASS_PREFIX = '__markerjs2_';

  private static classes: StyleClass[] = [];
  private static rules: StyleRule[] = [];
  private static styleSheet?: HTMLStyleElement;

  /**
   * For cases when you need to add the stylesheet to anything
   * other than document.head (default), set this property
   * befor calling `MarkerArea.show()`.
   * 
   * Example: here we set the rendering/placement root (targetRoot)
   * to the `shadowRoot` of a web componet and set `styleSheetRoot`
   * to the same value as well.
   * 
   * ```javascript
   * const markerArea = new markerjs2.MarkerArea(target);
   * markerArea.targetRoot = this.shadowRoot;
   * markerjs2.Style.styleSheetRoot = this.shadowRoot;
   * markerArea.show();
   * ```
   * 
   * Known issue/limitation:
   * you can't use marker.js 2 in both main and Shadow DOM
   * on the same page.
   */
  public static styleSheetRoot: HTMLElement;

  /**
   * Returns default UI styles.
   */
  public static get defaultSettings(): IStyleSettings {
    return {
      canvasBackgroundColor: '#ffffff',
      toolbarBackgroundColor: '#111111',
      toolbarBackgroundHoverColor: '#333333',
      toolbarColor: '#eeeeee',
      toolbarHeight: 40,
      toolboxBackgroundColor: '#2a2a2a',
      toolboxColor: '#eeeeee',
      toolboxAccentColor: '#3080c3',
      undoButtonVisible: true,
      redoButtonVisible: false
    }
  }

  /**
   * Holds current UI styles.
   */
  public static settings: IStyleSettings = Style.defaultSettings;

  /**
   * Returns global fade-in animation class name.
   */
  public static get fadeInAnimationClassName(): string {
    return `${Style.CLASS_PREFIX}fade_in`;
  }
  /**
   * Returns global fade-out animation class name.
   */
  public static get fadeOutAnimationClassName(): string {
    return `${Style.CLASS_PREFIX}fade_out`;
  }

  /**
   * Adds a CSS class declaration.
   * @param styleClass - class to add.
   */
  public static addClass(styleClass: StyleClass): StyleClass {
    if (Style.styleSheet === undefined) {
      Style.addStyleSheet();
    }
    Style.classes.push(styleClass);
    Style.styleSheet.sheet.addRule('.' + styleClass.name, styleClass.style);
    return styleClass;
  }

  /**
   * Add arbitrary CSS rule
   * @param styleRule - CSS rule to add.
   */
  public static addRule(styleRule: StyleRule): void {
    if (Style.styleSheet === undefined) {
      Style.addStyleSheet();
    }
    Style.rules.push(styleRule);
    Style.styleSheet.sheet.addRule(styleRule.selector, styleRule.style);
  }

  private static addStyleSheet() {
    Style.styleSheet = document.createElement('style');
    (Style.styleSheetRoot ?? document.head).appendChild(Style.styleSheet);

    // add global rules
    Style.addRule(new StyleRule(`.${Style.CLASS_PREFIX} h3`, 'font-family: sans-serif'));

    // Style.addRule(new StyleRule(`@keyframes ${Style.CLASS_PREFIX}_fade_in_animation_frames`, `
    //     from {
    //       opacity: 0;
    //     }
    //     to {
    //       opacity: 1;
    //     }
    // `));
    // Style.addRule(new StyleRule(`@keyframes ${Style.CLASS_PREFIX}_fade_out_animation_frames`, `
    //     from {
    //       opacity: 1;
    //     }
    //     to {
    //       opacity: 0;
    //     }
    // `));

    Style.addClass(new StyleClass('fade_in', `
      animation-duration: 0.3s;
      animation-name: ${Style.CLASS_PREFIX}_fade_in_animation_frames;
    `));
    Style.addClass(new StyleClass('fade_out', `
      animation-duration: 0.3s;
      animation-name: ${Style.CLASS_PREFIX}_fade_out_animation_frames;
    `));
  }

  public static removeStyleSheet(): void {
    if (Style.styleSheet) {
      (Style.styleSheetRoot ?? document.head).removeChild(Style.styleSheet);
      Style.styleSheet = undefined;
    }
  }
}

/**
 * Represents an arbitrary CSS rule.
 */
export class StyleRule {
  /**
   * CSS selector.
   */
  public selector: string;
  /**
   * Style declaration for the rule.
   */
  public style: string;
  /**
   * Creates an arbitrary CSS rule using the selector and style rules.
   * @param selector - CSS selector
   * @param style - styles to apply
   */
  constructor(selector: string, style: string) {
    this.selector = selector;
    this.style = style; 
  }
}

/**
 * Represents a CSS class.
 */
export class StyleClass {
  /**
   * CSS style rules for the class.
   */
  public style: string;
  
  private _localName: string;
  /**
   * Returns fully qualified CSS class name.
   */
  public get name(): string {
    return `${Style.CLASS_PREFIX}${this._localName}`;
  }

  /**
   * Creates a CSS class declaration based on supplied (local) name and style rules.
   * @param name - local CSS class name (will be prefixed with the marker.js prefix).
   * @param style - style declarations.
   */
  constructor(name: string, style: string) {
    this._localName = name;
    this.style = style; 
  }
}
