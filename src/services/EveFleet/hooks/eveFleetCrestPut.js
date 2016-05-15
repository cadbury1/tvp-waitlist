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
    return new Promise((fulfill, reject) => {
      var auth = {
        user: hook.data.user,
        scope: "fleetRead fleetWrite"
      }
      hook.app.service('EveAuths').find({ query: Object.assign({}, auth, { store: { $exists: true }}) }).then(eveAuth => {
        if (!eveAuth.data[0]) {
          hook.app.service('EveAuths').create(auth)
            .catch(reject)
            .then(eveAuth => {
              reject(Object.assign(new errors.NotAuthenticated(), { redirect: eveAuth.ssoLink }))
            })
        } else {
          var data = {}
          if (typeof hook.data.isFreeMove !== 'undefined')
            data.isFreeMove = hook.data.isFreeMove
          if (typeof hook.data.motd !== 'undefined')
            data.motd = hook.data.motd
          
          var store = {}
          store['auth ' + hook.data.crest] = eveAuth.data[0].store
          
          var href = Href.forEveCrest(
            hook.data.crest,
            Buffer.from(hook.app.get('eveAppClientId') + ':' + hook.app.get('eveAppSecretKey')).toString('base64'),
            store
          );
          href.put(data, fulfill)
        }
      })
    })
  };
};
