#!/usr/bin/env node

'use strict';

var program = require('commander');
var request = require('request');
var URL = require('url');
var languages = require('./languages');

var defaultSource = process.env.JA_GTC_SOURCE
var defaultTarget = process.env.JA_GTC_TARGET
if (defaultSource === undefined) defaultSource = 'en'
if (defaultTarget === undefined) defaultTarget = 'es'

/* Supported languages: https://cloud.google.com/translate/v2/translate-reference#supported_languages */

/* This function creates the URL to get the translation from Google's server
(source: https://ctrlq.org/code/19909-google-translate-api) */
function createTranslatorURL(sourceLang, targetLang, sourceText) {
  return URL.format({
    protocol: 'https:',
    hostname: 'translate.googleapis.com',
    pathname: '/translate_a/single',
    query: {
      client: 'gtx',
      ie: 'UTF-8',
      oe: 'UTF-8',
      sl: sourceLang,
      tl: targetLang,
      dt: 't',
      // dj: 1, // For more detailed JSON response
      q: sourceText,
    }
  });
}

/* Commander configuration */
program
  .version('1.0.1')
  .usage('[options] <text ...>')
  .option('-a, --auto', 'Auto-detect source language')
  /* TODO: Create defaults and let users change them [auto, source, target] */
  .option('-d, --details', 'View details')
  .option('-l, --list', 'List all available languages')
  .option('-s, --source [language]', 'Source language [en]', new RegExp(languages.getLanguagesCodesRegex(), 'i'), defaultSource)
  .option('-t, --target [language]', 'Target language [es]', new RegExp(languages.getLanguagesCodesRegex(), 'i'), defaultTarget)
  .on('--help', function () {
    console.log('  Examples:\n');
    console.log("     $ translate 'I want to translate this text'");
    console.log("     $ translate -s es -t en 'Quiero traducir este texto'");
    console.log("     $ translate -s en -t es I want to translate this text");
    console.log("     $ translate -a 'Au revoir' -d");
  })
  .parse(process.argv);

/* This option shows all languages (code and name) */
if (program.list) {
  console.log(languages.getLanguagesList());
  process.exit(0);
}

var sourceText = '';

var runTranslation = function() {
  var sourceLang = (program.auto) ? 'auto' : program.source;
  var targetLang = program.target;

  var targetURL = createTranslatorURL(sourceLang, targetLang, sourceText);

};

/* Let's translate! */
if (program.args.length === 0) {
  // console.log('❗️ Cannot translate an empty text❗️');
  // process.exit(1);
  process.stdin.resume();
  process.stdin.on('data', function(buf) { sourceText += buf.toString(); });
  process.stdin.on('end', function() {
    runTranslation();
});
} else {
  /* I prefer typing 'All the text inside simple quotes' but it's possible to use separated words */
  sourceText = (program.args.length > 1)  ? program.args.join(' ') : program.args[0];
  runTranslation();
}
