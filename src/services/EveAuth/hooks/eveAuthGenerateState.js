'use strict';

// src\services\EveAuth\hooks\eveAuthGenerateState.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.data.state = '' + Math.random()
    hook.data.user = hook.params.user._id
  };
};
