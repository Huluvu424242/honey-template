# honey-template

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute        | Description                     | Type                        | Default     |
| -------------------- | ---------------- | ------------------------------- | --------------------------- | ----------- |
| `feedAdministration` | --               | Feeds Administration Komponente | `HTMLHoneyNewsFeedsElement` | `undefined` |
| `localBasePath`      | `local-basepath` | base of local site              | `any`                       | `undefined` |
| `newsFeed`           | --               | News reader Komponente          | `HTMLHoneyNewsFeedElement`  | `undefined` |
| `siteBasePath`       | `site-basepath`  | base of remote site             | `any`                       | `undefined` |
| `verbose`            | `verbose`        | enable console logging          | `boolean`                   | `false`     |


## Dependencies

### Depends on

- [honey-template-header](header)
- [honey-template-feed](news)
- [honey-template-feeds](feeds)
- [honey-template-statistic](statistic)

### Graph
```mermaid
graph TD;
  honey-template --> honey-template-header
  honey-template --> honey-template-feed
  honey-template --> honey-template-feeds
  honey-template --> honey-template-statistic
  style honey-template fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)* by Huluvu424242
