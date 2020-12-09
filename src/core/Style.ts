import { IStyleSettings } from './IStyleSettings';

export class Style {
  public static CLASS_PREFIX = '__markerjs2_';

  private static classes: StyleClass[] = [];
  private static rules: StyleRule[] = [];
  private static styleSheet?: HTMLStyleElement;

  public static settings: IStyleSettings = {
    toolbarBackgroundColor: '#111111',
    toolbarBackgroundHoverColor: '#333333',
    toolbarColor: '#eeeeee',
    toolbarHeight: 40,
    toolboxBackgroundColor: '#2a2a2a',
    toolboxColor: '#eeeeee',
    toolboxAccentColor: '#3080c3'
  }

  public static get fadeInAnimationClassName(): string {
    return `${Style.CLASS_PREFIX}fade_in`;
  }
  public static get fadeOutAnimationClassName(): string {
    return `${Style.CLASS_PREFIX}fade_out`;
  }

  public static addClass(styleClass: StyleClass): StyleClass {
    if (Style.styleSheet === undefined) {
      Style.addStyleSheet();
    }
    Style.classes.push(styleClass);
    Style.styleSheet.sheet.addRule('.' + styleClass.name, styleClass.style);
    return styleClass;
  }

  public static addRule(styleRule: StyleRule): void {
    if (Style.styleSheet === undefined) {
      Style.addStyleSheet();
    }
    Style.rules.push(styleRule);
    Style.styleSheet.sheet.addRule(styleRule.selector, styleRule.style);
  }

  private static addStyleSheet() {
    Style.styleSheet = document.createElement('style');
    document.head.appendChild(Style.styleSheet);

    // add global rules
    Style.addRule(new StyleRule(`.${Style.CLASS_PREFIX} h3`, 'font-family: sans-serif'));

    Style.addRule(new StyleRule(`@keyframes ${Style.CLASS_PREFIX}_fade_in_animation_frames`, `
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
    `));
    Style.addRule(new StyleRule(`@keyframes ${Style.CLASS_PREFIX}_fade_out_animation_frames`, `
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
    `));

    Style.addClass(new StyleClass('fade_in', `
      animation-duration: 0.3s;
      animation-name: ${Style.CLASS_PREFIX}_fade_in_animation_frames;
    `));
    Style.addClass(new StyleClass('fade_out', `
      animation-duration: 0.3s;
      animation-name: ${Style.CLASS_PREFIX}_fade_out_animation_frames;
    `));
  }
}

export class StyleRule {
  public selector: string;
  public style: string;
  constructor(selector: string, style: string) {
    this.selector = selector;
    this.style = style; 
  }
}

export class StyleClass {
  public style: string;
  
  private _localName: string;
  public get name(): string {
    return `${Style.CLASS_PREFIX}${this._localName}`;
  }

  constructor(name: string, style: string) {
    this._localName = name;
    this.style = style; 
  }
}