'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_mySettings = (hookName, args, cb) => {
  let checkedState = 'checked';
  if (settings.ep_author_hover) {
    if (settings.ep_author_hover.disabledByDefault === true) {
      checkedState = '';
    }
  }
  args.content += eejs.require('ep_author_hover/templates/settings.ejs', {checked: checkedState});
  return cb();
};
