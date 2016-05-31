'use strict';

// Add any common hooks you want to share across services in here.
// 
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

exports.log = function(options) {
  if (!options)
    options = {}

  return function(hook) {
    var now = new Date()
    if (options.service) {
      if (!hook.id && !hook.data)
          hook.app.logger.debug('[%d:%d.%d] %s.%s()', now.getHours(), now.getMinutes(), now.getSeconds(), options.service, hook.method)
      else if (!hook.id && hook.data)
          hook.app.logger.debug('[%d:%d.%d] %s.%s(%s)', now.getHours(), now.getMinutes(), now.getSeconds(), options.service, hook.method, hook.data)
      else if (hook.id && !hook.data)
        hook.app.logger.debug('[%d:%d.%d] %s.%s(%s)', now.getHours(), now.getMinutes(), now.getSeconds(), options.service, hook.method, hook.id)
      else if (hook.id && hook.data)
        hook.app.logger.debug('[%d:%d.%d] %s.%s(%s, %s)', now.getHours(), now.getMinutes(), now.getSeconds(), options.service, hook.method, hook.id, hook.data)
    } else
      console.log(hook)
  };
};
