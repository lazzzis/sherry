const translate = require('translate-api');

module.exports = text => translate.getText(text, { from: 'zh-cn', to: 'en' })
