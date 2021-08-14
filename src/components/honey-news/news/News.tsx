import {Component, Element, h, Host, Method, Prop, State} from "@stencil/core";
import {Logger} from "../../../shared/logger";
import {NewsOptions} from "./NewsOptions";
import {NewsLoader} from "./NewsLoader";
import {getFeedsSingleObserver, Post} from "../../../fetch-es6.worker";
import {from, Subscription} from "rxjs";
import {PipeOperators} from "../../../shared/PipeOperators";

@Component({
  tag: "honey-template-feed",
  styleUrl: "News.css",
  assetsDirs: ['assets'],
  shadow: true
})
export class News {

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

  /**
   * Hilfsklasse zum Laden der Daten
   */
  @Prop({mutable: true}) feedLoader: NewsLoader;

  @State() feeds: Post[] = [];
  feedsSubscription: Subscription;

  lastUpdate: Date = null;

  @State() options: NewsOptions = {
    disabledHostClass: "honey-template-feed-disabled",
    enabledHostClass: "honey-template-feed-enabled",
    disabledTitleText: "Noch keine News verfügbar",
    titleText: "Aktuelle News aus den Feeds",
    ariaLabel: "Neuigkeiten der abonierten Feeds",
  };

  /**
   * enable console logging
   */
  @Prop() verbose: boolean = false;

  public connectedCallback() {
    // States initialisieren
    this.ident = this.hostElement.id ? this.hostElement.id : Math.random().toString(36).substring(7);
    this.initialHostClass = this.hostElement.getAttribute("class") || null;
    this.createTitleText = !this.hostElement.title;
    this.createAriaLabel = !this.hostElement["aria-label"];
    this.taborder = this.hostElement.getAttribute("tabindex") ? (this.hostElement.tabIndex + "") : "0";
    this.initialisiereUrls();
    // Properties auswerten
    this.feedsSubscription = this.subscribeFeeds();
    Logger.toggleLogging(this.verbose);
  }

  public async componentWillLoad() {
    this.singleLoadFeeds();
  }

  public disconnectedCallback() {
    this.feedsSubscription.unsubscribe();
  }

  public singleLoadFeeds(): void {
    from(getFeedsSingleObserver(this.feedLoader.getFeedURLs(), false))
      .subscribe({
        next: (posts: Post[]) => {
          this.lastUpdate = this.lastUpdate || posts[0].exaktdate;
          this.feeds = [...posts]
        }
      });
  }

  public subscribeFeeds(): Subscription {
    return this.feedLoader.getFeedsPeriodicObserver()
      .subscribe({
        next: (posts: Post[]) => {
          this.lastUpdate = this.lastUpdate || posts[0].exaktdate;
          this.feeds = [...posts]
        }
      });
  }


  protected initialisiereUrls() {
    const predefinedURLs: string[] = [
      "https://www.presseportal.de/rss/presseportal.rss2",
      "https://www.tagesschau.de/xml/atom/",
      "https://www.zdf.de/rss/zdf/nachrichten",
      "https://kenfm.de/feed/",
      "https://dev.to/feed/",
      "https://media.ccc.de/c/wikidatacon2019/podcast/webm-hq.xml",
      "https://media.ccc.de/updates.rdf",
      "https://www.deutschlandfunk.de/die-nachrichten.353.de.rss",
      "https://rss.dw.com/xml/rss-de-all",
      "http://newsfeed.zeit.de",
      "http://www.stern.de/feed/standard/all",
      "https://www.spiegel.de/international/index.rss",
      "https://rss.golem.de/rss.php",
      "https://www.heise.de/rss/heise.rdf",
      "https://codepen.io/spark/feed",
      "https://www.hongkiat.com/blog/feed/",
      "https://www.tagesspiegel.de/contentexport/feed/home"
    ];
    from(predefinedURLs).subscribe((url) => this.feedLoader.addFeedUrl(url));
  }


  /**
   * Update honey-template options
   * @param options : NewsOptions plain object to set the options
   */
  @Method()
  public async updateOptions(options: NewsOptions) {
    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        this.options[prop] = options[prop];
      }
    }
    this.options = {...this.options};
  }


  protected hasNoFeeds(): boolean {
    return (!this.feeds || this.feeds.length < 1);
  }

  protected createNewTitleText(): string {
    if (this.hasNoFeeds()) {
      return this.options.disabledTitleText;
    } else {
      return this.options.titleText;
    }
  }

  protected getTitleText(): string {
    if (this.createTitleText) {
      return this.createNewTitleText();
    } else {
      return this.hostElement.title;
    }
  }

  protected createNewAltText(): string {
    return this.options.ariaLabel;
  }

  protected getAltText(): string {
    if (this.createAriaLabel) {
      return this.createNewAltText();
    } else {
      return this.hostElement.getAttribute("aria-label");
    }
  }

  protected getHostClass(): string {
    let hostClass = this.initialHostClass;
    if (this.hasNoFeeds()) {
      return hostClass + " " + this.options.disabledHostClass;
    } else {
      return hostClass + " " + this.options.enabledHostClass;
    }
  }

  getPostLink(item): string {
    if (typeof item.link === "string") {
      return item.link;
    }
    if (typeof (item.link.href == "string")) {
      return item.link.href;
    }
    return null
  }


  lastHour: Date = null;

  getUeberschrift(post: Post) {
    this.lastHour = this.lastHour || post.exaktdate;
    const hour: Date = post.exaktdate;
    if (PipeOperators.compareDates(this.lastUpdate, post.exaktdate) < 0) {
      this.lastUpdate = post.exaktdate;
    }
    if (hour.getUTCHours() != this.lastHour.getUTCHours()) {
      this.lastHour = hour;
      return <h2>{post.exaktdate.toLocaleDateString() + " " + this.lastHour.getHours()} Uhr</h2>;
    } else {
      return;
    }
  }

  getPostEntry(post: Post) {
    return ([
        <div class="card">
          <div class="card-body">
            <div class="card-title">{post.pubdate}</div>
            <div class="card-subtitle">{post.feedtitle}</div>
            <div class="card-text"><a href={this.getPostLink(post.item)} target="_blank">{post.item.title}</a></div>
          </div>
        </div>
      ]
    );
  }

  getNeuesteMeldung() {
    if (this.lastUpdate) {
      return (
        <h1>
          <div>Neueste Meldung</div>
          <div>{this.lastUpdate?.toLocaleDateString() + "  " + this.lastUpdate?.toLocaleTimeString()}</div>
        </h1>
      );
    }
  }

  public render() {
    Logger.debugMessage('##RENDER##');
    return (
      <Host
        title={this.getTitleText()}
        alt={this.getAltText()}
        tabindex={this.hasNoFeeds() ? -1 : this.taborder}
        disabled={this.hasNoFeeds()}
      >
        {
          this.getNeuesteMeldung()
        }
        {/*<div>*/}
          {this.feeds.map((post) => [
              this.getUeberschrift(post),
              this.getPostEntry(post)
            ]
          )}
        {/*</div>*/}
      </Host>
    );
  }
}
