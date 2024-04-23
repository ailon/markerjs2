import { IStyleSettings } from './IStyleSettings';

/**
 * @see {@link StyleManager}
 * @deprecated use instance level `styles` instead.
 */
export class Style {
  /**
   * @see {@link StyleManager}
   * @deprecated use instance level `styles.styleSheetRoot` instead.
   */
  public static styleSheetRoot: HTMLElement;
}

/**
 * Simple utility CSS-in-JS implementation.
 */
export class StyleManager {
  /**
   * Prefix used for all internally created CSS classes.
   */
  private _classNamePrefixBase = '__markerjs2_';

  /**
   * Static CSS class name used for the wrapper element.
   */
  public get classNamePrefixBase(): string {
    return this._classNamePrefixBase;
  }

  private _classNamePrefix: string;
  /**
   * Prefix used for all internally created CSS classes.
   */
  public get classNamePrefix(): string {
    return this._classNamePrefix;
  }

  private classes: StyleClass[] = [];
  private rules: StyleRule[] = [];
  private styleSheet?: HTMLStyleElement;

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
   * markerArea.styles.styleSheetRoot = this.shadowRoot;
   * markerArea.show();
   * ```
   *
   */
  public styleSheetRoot: HTMLElement;

  /**
   * Returns default UI styles.
   */
  public get defaultSettings(): IStyleSettings {
    return {
      canvasBackgroundColor: '#ffffff',
      toolbarBackgroundColor: '#111111',
      toolbarBackgroundHoverColor: '#333333',
      toolbarColor: '#eeeeee',
      toolbarHeight: 40,
      // toolboxBackgroundColor: '#2a2a2a',
      toolboxColor: '#eeeeee',
      toolboxAccentColor: '#3080c3',
      undoButtonVisible: true,
      redoButtonVisible: false,
      zoomButtonVisible: false,
      zoomOutButtonVisible: false,
      clearButtonVisible: false,
      resultButtonBlockVisible: true,
      logoPosition: 'left'
    };
  }

  /**
   * Holds current UI styles.
   */
  public settings: IStyleSettings = this.defaultSettings;

  /**
   * Returns global fade-in animation class name.
   */
  public get fadeInAnimationClassName(): string {
    return `${this.classNamePrefix}fade_in`;
  }
  /**
   * Returns global fade-out animation class name.
   */
  public get fadeOutAnimationClassName(): string {
    return `${this.classNamePrefix}fade_out`;
  }

  /**
   * Initializes a new style manager.
   * @param instanceNo - instance id.
   */
  constructor(instanceNo: number) {
    this._classNamePrefix = `${this._classNamePrefixBase}_${instanceNo}_`;
  }

  /**
   * Adds a CSS class declaration.
   * @param styleClass - class to add.
   */
  public addClass(styleClass: StyleClass): StyleClass {
    if (this.styleSheet === undefined) {
      this.addStyleSheet();
    }
    styleClass.name = `${this.classNamePrefix}${styleClass.localName}`;
    this.classes.push(styleClass);
    this.styleSheet.sheet.insertRule(
      `.${styleClass.name} {${styleClass.style}}`,
      this.styleSheet.sheet.cssRules.length
    );
    return styleClass;
  }

  /**
   * Add arbitrary CSS rule
   * @param styleRule - CSS rule to add.
   */
  public addRule(styleRule: StyleRule): void {
    if (this.styleSheet === undefined) {
      this.addStyleSheet();
    }
    this.rules.push(styleRule);
    this.styleSheet.sheet.insertRule(
      `${styleRule.selector} {${styleRule.style}}`,
      this.styleSheet.sheet.cssRules.length
    );
  }

  private addStyleSheet() {
    this.styleSheet = document.createElement('style');
    (this.styleSheetRoot ?? document.head).appendChild(this.styleSheet);

    // add global rules
    this.addRule(
      new StyleRule(`.${this.classNamePrefix} h3`, 'font-family: sans-serif')
    );

    this.addRule(
      new StyleRule(
        `@keyframes ${this.classNamePrefix}_fade_in_animation_frames`,
        `
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
    `
      )
    );
    this.addRule(
      new StyleRule(
        `@keyframes ${this.classNamePrefix}_fade_out_animation_frames`,
        `
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
    `
      )
    );

    this.addClass(
      new StyleClass(
        'fade_in',
        `
      animation-duration: 0.3s;
      animation-name: ${this.classNamePrefix}_fade_in_animation_frames;
    `
      )
    );
    this.addClass(
      new StyleClass(
        'fade_out',
        `
      animation-duration: 0.3s;
      animation-name: ${this.classNamePrefix}_fade_out_animation_frames;
    `
      )
    );
  }

  public removeStyleSheet(): void {
    if (this.styleSheet) {
      (this.styleSheetRoot ?? document.head).removeChild(this.styleSheet);
      this.styleSheet = undefined;
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

  /**
   * Class name without the global prefix.
   */
  public localName: string;

  /**
   * Fully qualified CSS class name.
   */
  public name: string;

  /**
   * Creates a CSS class declaration based on supplied (local) name and style rules.
   * @param name - local CSS class name (will be prefixed with the marker.js prefix).
   * @param style - style declarations.
   */
  constructor(name: string, style: string) {
    this.localName = name;
    this.style = style;
  }
}
