# Introduction

## What's Sherry?

**Sherry** (['ʃerɪ], Spanish: Jerez \[xeˈɾeθ\], Chinese: 雪莉) is a fortified wine made from white grapes that are grown near the city of Jerez de la Frontera in Andalusia, Spain.




SAO helps you kick start a new project either by using existing "[generators](https://github.com/saojs/awesome-sao)" or the ones you made on your own.

## Why not use Yeoman?

[Yeoman](http://yeoman.io/) is great except that writing a Yeoman generator is time-consuming, I created SAO to simplify the way we write and use generators.

## A Quick Look

Here we have a SAO generator which is used to create a new node module, it's published on npm as [sao-nm](https://npm.im/sao-nm) and also available on GitHub at [http://github.com/saojs/sao-nm](http://github.com/saojs/sao-nm):

```bash
sao nm my-node-module
```

By running this command, SAO will try to find a cached version of `sao-nm` or download from npm if it's not yet cached. Then SAO will generate a new project at `my-node-modules` folder according to the `saofile.js` in the generator.

Since it's also on GitHub, you can use the generator from there too:

```bash
sao saojs/sao-nm my-node-module
```
