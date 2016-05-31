'use strict';

// src\services\EveFleet\hooks\eveFleetCrestPut.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const errors = require('feathers-errors')

const Promise = require('promise')

const Href = require('../../../../lib/eveCrest/Href').Href
const AuthError = require('../../../../lib/eveCrest/Auth').AuthError

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    var authService = hook.app.service('EveAuths')
    
    return new Promise((fulfill, reject) => {
      authService.find({ query: {
        charId: hook.data.star,
         scope: 'fleetRead fleetWrite',
         store: { $exists: true }
      }}).then(eveAuth => {
        if (!eveAuth.data[0]) {
          authService.create({ scope: 'fleetRead fleetWrite' }).then(eveAuth => {
            reject(Object.assign(new errors.NotAuthenticated(), { redirect: eveAuth.ssoLink }))
          })
            
          return
        }

        var data = {}
        if (typeof hook.data.isFreeMove !== 'undefined')
          data.isFreeMove = hook.data.isFreeMove
        if (typeof hook.data.motd !== 'undefined')
          data.motd = hook.data.motd

        var store = {}
        store['auth ' + hook.data.crest] = eveAuth.data[0].store

        Href.forEveCrest(
          hook.data.crest,
          Buffer.from(hook.app.get('eveAppClientId') + ':' + hook.app.get('eveAppSecretKey')).toString('base64'),
          store
        ).put(data, error => {
          if (error)
            reject(Object.assign(new errors.GeneralError('From CREST: ' + error.message), {crest: error}))
          else
            fulfill()
        })
      })
    })
  };
};
