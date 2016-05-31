'use strict';

// src\services\EveFleet\hooks\eveFleetValidation.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const errors = require('feathers-errors')

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    if(!/^http/.test(hook.data.crest || '') || !/./.test(hook.data.name || ''))
      throw new errors.BadRequest('Fleet data invalid.')
  }
}