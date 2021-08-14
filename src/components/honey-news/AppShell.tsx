import {Component, Element, h, Host, Prop, State, Watch} from "@stencil/core";
import {Logger} from "../../shared/logger";
import {AppShellOptions} from "./AppShellOptions";
import {Subscription} from "rxjs";
import {router} from "./routing/SimpleRouter";
import {NewsLoader} from "./news/NewsLoader";
import {News} from "./news/News";
import {About} from "./snippets/About";

@Component({
  tag: "honey-template",
  styleUrl: "AppShell.css",
  assetsDirs: ['assets'],
  shadow: true
})
export class AppShell {

  /**
   * Host Element
   */
  @Element() hostElement: HTMLElement;


  /**
   * Id des Host Elements, falls nicht verfügbar wird diese generiert
   */
  ident: string;

  /**
   * initiale class from host tag
   */
  initialHostClass: string;

  /**
   * true wenn das Tag ohne alt Attribute deklariert wurde
   */
  createAriaLabel: boolean = false;

  /**
   * true wenn das Tag ohne title Attribut deklariert wurde
   */
  createTitleText: boolean = false;

  /**
   * initial computed taborder
   */
  taborder: string = "0";


  //
  // Routing
  //

  /**
   * base of remote site
   */
  @Prop({reflect: true, attribute: "site-basepath"}) siteBasePath;
  /**
   * base of local site
   */
  @Prop({reflect: true, attribute: "local-basepath"}) localBasePath;
  routerSubscription: Subscription = null;
  @State() route: string = "";


  @State() options: AppShellOptions = {
    disabledHostClass: "honey-template-disabled",
    enabledHostClass: "honey-template",
    disabledTitleText: "News Reader nicht verfügbar",
    titleText: "News Reader",
    ariaLabel: "Neuigkeiten der abonierten Feeds",
  };

  /**
   * enable console logging
   */
  @Prop() verbose: boolean = false;

  /**
   * Shared State of AppShell
   */
  feedLoader: NewsLoader = new NewsLoader([]);


  /**
   * News reader Komponente
   */
    // @ts-ignore
  @Prop({mutable: true}) newsFeed: HTMLHoneyNewsFeedElement;

  @Watch("newsFeed")
  newsWatcher(newValue: HTMLHoneyNewsFeedElement, oldValue: HTMLHoneyNewsFeedElement) {
    oldValue = oldValue;
    if (newValue) {
      if (this.newsFeed) {
        this.newsFeed.feedLoader = this.feedLoader;
      }
    }
  }


  /**
   * Feeds Administration Komponente
   */
    // @ts-ignore
  @Prop({mutable: true}) feedAdministration: HTMLHoneyNewsFeedsElement;

  @Watch("feedAdministration")
  feedWatcher(newValue: News, oldValue: News) {
    oldValue = oldValue;
    if (newValue) {
      if (this.feedAdministration) {
        this.feedAdministration.feedLoader = this.feedLoader;
      }
    }
  }


  public connectedCallback() {
    // attribute initialisieren wenn defaults notwendig
    this.localBasePath = this.hostElement.getAttribute("local-basepath") || "/";
    this.siteBasePath = this.hostElement.getAttribute("site-basepath") || "/";
    /// base initialisieren
    const curLocation:string = window.location.origin;
    const isLocal:boolean = curLocation.startsWith("http://localhost") || curLocation.startsWith("https://localhost");
    const basePath = isLocal? this.localBasePath:this.siteBasePath;
    router.setRoutenPrefix(basePath);
    // route initialisieren
    if (basePath === "/") {
      this.route = window.location.pathname;
    }else{
      this.route = window.location.pathname.replace(basePath, "");
    }

    this.ident = this.hostElement.id ? this.hostElement.id : Math.random().toString(36).substring(7);
    this.initialHostClass = this.hostElement.getAttribute("class") || null;
    this.createTitleText = !this.hostElement.title;
    this.createAriaLabel = !this.hostElement["aria-label"];
    this.taborder = this.hostElement.getAttribute("tabindex") ? (this.hostElement.tabIndex + "") : "0";
    this.routerSubscription = router.getRouteListener().subscribe((route: string) => {
        this.route = route;
      },
      (error) => {
        console.error(error);
      },
      () => {
        console.info("Router Subject' complete");
      });
    // Properties auswerten
    Logger.toggleLogging(this.verbose);
  }

  public disconnectedCallback() {
    this.routerSubscription.unsubscribe();
  }

  protected createNewTitleText(): string {
    // if (this.) {
    //   return this.options.disabledTitleText;
    // } else {
    return this.options.titleText;
    // }
  }

  protected getTitleText(): string {
    if (this.createTitleText) {
      return this.createNewTitleText();
    } else {
      return this.hostElement.title;
    }
  }

  protected getAriaLabel(): string {
    if (this.createAriaLabel) {
      return this.options.ariaLabel;
    } else {
      return this.hostElement.getAttribute("aria-label");
    }
  }

  protected getHostClass(): string {
    let hostClass = this.initialHostClass;
    // if (this.hasNoFeeds()) {
    //   return hostClass + " " + this.options.disabledHostClass;
    // } else {
    //   return hostClass + " " + this.options.enabledHostClass;
    // }
    return hostClass;
  }


  public render() {
    Logger.debugMessage('##RENDER##');

    return (
      <Host
        title={this.getTitleText()}
        aria-label={this.getAriaLabel()}
        // tabindex={this.hasNoFeeds() ? -1 : this.taborder}
        // class={this.getHostClass()}
        // disabled={this.hasNoFeeds()}
        class="paper"
      >

        <honey-template-header/>

        {!this.route || this.route === "/" || this.route === "/index.html" || this.route === "/news" ? <honey-template-feed ref={(el) => {
          // @ts-ignore
          this.newsFeed = el as HTMLHoneyNewsFeedElement
        }}/> : null}
        {this.route === "/feeds" ? <honey-template-feeds ref={(el) => {
          // @ts-ignore
          this.feedAdministration = el as HTMLHoneyNewsFeedsElement
        }
        }/> : null}
        {this.route === "/statistic" ? <honey-template-statistic/> : null}
        {this.route === "/about" ? <About/> : null}

      </Host>
    );
  }
}
