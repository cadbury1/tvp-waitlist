'use strict';

// src\services\message\hooks\messageFromResolve.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function (hook) {
    // Replace the user's _id property with its email
    return hook.app.service('users').get(hook.result.messageFrom).then(function (user) {
      hook.result.messageFrom = user.email
    })
  }
};
