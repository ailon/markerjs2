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
    toolbarHeight: 40
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