'use strict';

const {padToggle} = require('ep_plugin_helpers/pad-toggle-server');

// Parallel User Settings + Pad Wide Settings checkboxes for "Show Author on
// Hover". Helper owns markup, storage, broadcast, enforce, and i18n wiring.
const authorHoverToggle = padToggle({
  pluginName: 'ep_author_hover',
  settingId: 'author-hover',
  l10nId: 'ep_author_hover.showHoverLabel',
  defaultLabel: 'Show Author on Hover',
  defaultEnabled: true,
});

// Older settings.json used `ep_author_hover.disabledByDefault: true` to flip
// the checkbox off. Translate to the helper's `defaultEnabled` so existing
// installs keep their current behavior after the conversion.
exports.loadSettings = async (hookName, args) => {
  const ps = args && args.settings && args.settings.ep_author_hover;
  if (ps && typeof ps.defaultEnabled !== 'boolean' &&
      typeof ps.disabledByDefault === 'boolean') {
    ps.defaultEnabled = !ps.disabledByDefault;
  }
  return authorHoverToggle.loadSettings(hookName, args);
};

exports.clientVars = authorHoverToggle.clientVars;
exports.eejsBlock_mySettings = authorHoverToggle.eejsBlock_mySettings;
exports.eejsBlock_padSettings = authorHoverToggle.eejsBlock_padSettings;
