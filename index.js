var eejs = require('ep_etherpad-lite/node/eejs/');
var settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  checked_state = 'checked';
  if (settings.ep_author_hover){
    if (settings.ep_author_hover.disabledByDefault == true){
      checked_state = '';
    }
  }
  args.content = args.content + eejs.require('ep_author_hover/templates/settings.ejs', {checked : checked_state});
  return cb();
}
