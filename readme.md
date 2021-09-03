[![Build Status](https://app.travis-ci.com/Huluvu424242/honey-template.svg?branch=master)](https://app.travis-ci.com/Huluvu424242/honey-template)
![Github CI](https://github.com/Huluvu424242/honey-template/workflows/Github%20CI/badge.svg)
[![npm](https://img.shields.io/npm/v/@huluvu424242/honey-template.svg)](https://www.npmjs.com/package/@huluvu424242/honey-template)
[![npm](https://img.shields.io/npm/dm/@huluvu424242/honey-template.svg)](https://www.npmjs.com/package/@huluvu424242/honey-template)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@huluvu424242/honey-template)
[![Donate with paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/huluvu424242)
![Keybase BTC](https://img.shields.io/keybase/btc/huluvu424242)
# honey-template 
This project contains web components to build an news feed reader at an web site.
(currently under development - unready and unstable)

## installation

npm install --save @huluvu424242/honey-template

## usage

```html
<script 
    type="module" 
    src='https://unpkg.com/@huluvu424242/honey-template@0.0.1/dist/honey-template/honey-template.js'>
</script>
```
To the [demo site](https://huluvu424242.github.io/honey-template/index.html)

[Vision of API (under construction)](src/components/honey-template/readme.md)

## demo

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="docs/index.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<body id="seite" style="display: block">

<h1>Nutzung der honey-template Komponente</h1>
<span class="wichtig">!!!</span> Das ist eine Demo Seite welche alle Feature der App zeigen soll - aus diesem Grund ist auch die Statistik eingeschaltet <span class="wichtig">!!!</span><br>
Es werden nur Daten zu den abgerufenen Feeds gespeichert (in memory) wie: url, anzahl der abfragen, anzahl valider responses<br>
Sollten Sie die Speicherung nicht wünschen - dann geben Sie bitte keinen neuen News ein.<br>
Vielen Dank für Ihr Verständnis. <br>
<hr>
<honey-template />

</body>
```
To the [live demo](https://huluvu424242.github.io/honey-template/index.html)

## become an supporter

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## releaselog

### vX.X.X unpublished

### v0.0.1 published at 2021-03-15

* [issue 1](https://github.com/Huluvu424242/honey-template/issues/1) setup project

## warranty

no warranty

## license

MIT License

## technology used

* [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)
* [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)


## browser support

### Custom Elements

* [Can I use with browsers?](https://caniuse.com/#feat=mdn-api_window_customelements)

### CSS Custom Properties

* [Can I use with browsers?](https://caniuse.com/#search=css%20custom%20properties)

