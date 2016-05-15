'use strict';

// src\services\EveAuth\hooks\eveAuthGenerateState.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    if (!hook.data.user)
      hook.data.user = hook.params.user._id

    return hook.app.service('EveAuths').find({ query: hook.data }).then(auths => {
      auths.data.forEach(auth => {
        hook.app.service('EveAuths').remove(auth._id)
      })
      
      hook.data.state = '' + Math.random()
    });
  };
};
