var request = require('request');
var URL = require('url');
var languages = require('./languages');
var randomUseragent = require('random-useragent');

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

module.exports = async function translate({
  sourceLang,
  targetLang,
  sourceText,
  auto,
  details
}) {
  return new Promise(resolve => {
    const targetURL = createTranslatorURL(sourceLang, targetLang, sourceText);
    /* Performing the request */
    const ua = randomUseragent.getRandom()
    request({
        url: targetURL,
        headers: {
          'User-Agent': ua
        }
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          /* Outdated: JSON.parse() doesn't work (empty values in array)
          Retrieved results from Google's server:
          [[["Hola Mundo","Hello World",,,1]],,"en"]
          Parsed results (with language name):
          { targetText: 'Hola Mundo',
            sourceText: 'Hello World',
            isReliable: 1,
            sourceLang: { code: 'en', language: 'English' },
            targetLang: { code: 'es', language: 'Spanish' }
          } */
          /* JSON.parse works but we delete null fields */
          var Intermed = body.replace(/,null{1,}/g, '');
          var Values = JSON.parse(Intermed);
          var Sentences = Values[0];
          var results = {};
          var text = '';
          for (var i = 0; i < Sentences.length; i++) {
            var res = {
              targetText: Sentences[i][0],
              sourceText: Sentences[i][1],
              isReliable: Sentences[i][2],
              sourceLang: languages.getLanguage(Values[1]),
              targetLang: languages.getLanguage(targetLang)
            };
            results["sentence_" + String(i)] = res;
            text += res.targetText;
          }
          /* TODO: Check confidence when auto-detection is enabled to know if the translation is accurate. */
          if (auto) {
            results.confidence = Values[2];
          }
          /* Finally: Printing results */
          var textToPrint;
          if (details) {
            textToPrint = '[' + results.sentence_0.sourceLang.name + ' -> ' + results.sentence_0.targetLang.name + ']\n' + text;
          } else {
            textToPrint = text;
          }
          resolve(textToPrint)

        } else {
          /* Something went wrong */
          console.log('⚠️  Cannot translate now, an error occurred 🙁');
          console.log(response.statusCode)
          console.log(error)
          console.log(body)
          process.exit(1);
        }
      }
    )

  })
}
