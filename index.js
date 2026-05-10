'use strict';

const {template} = require('ep_plugin_helpers');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_mySettings = template('ep_author_hover/templates/settings.ejs', {
  vars: () => ({
    checked: settings.ep_author_hover &&
        settings.ep_author_hover.disabledByDefault === true
      ? '' : 'checked',
  }),
});
