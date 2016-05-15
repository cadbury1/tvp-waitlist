'use strict';

const DECODE = 'https://crest-tq.eveonline.com/decode/'
const errors = require('feathers-errors')
const Href = require('../../lib/eveCrest/Href').Href
const Auth = require('../../lib/eveCrest/Auth').Auth
const AuthError = require('../../lib/eveCrest/Auth').AuthError

module.exports = function(app) {
  return function(req, res, next) {
    if(!req.query.code || !req.query.state) {
      next(new errors.BadRequest('EVE Single Sign-On Code and/or State parameters have not been provided.'))
      return
    }
    
    app.service('EveAuths').find({ query: { state: req.query.state }})
      .catch(next)
      .then(entries => {
        if (!entries.data || !entries.data[0]) {
          next(new errors.BadRequest('No matching entry of EVE Single Sign-On State found in database.'))
          return
        }

        var entry = entries.data[0]
        
        // Invalidate state to prevent double usage
        app.service('EveAuths').patch(entry._id, { state: null })
          .catch(next)
          .then(entry => {
            var store = {}
            
            var href = Href.forEveCrest(
              DECODE,
              Buffer.from(app.get('eveAppClientId') + ':' + app.get('eveAppSecretKey')).toString('base64'),
              store
            )
            
            href.auth.useAuthorizationCode(req.query.code, authCodeResult)
              
            function authCodeResult() {
              app.service('EveAuths').patch(entry._id, { store: store['auth ' + DECODE] })
                .catch(next)
                .then(() => {
                  href.get(() => {
                    href.character.get(() => {
                      app.service('users').patch(entry.user, {
                        EveAvatar: href.character.portrait['32x32'].href,
                        EveCharacter: href.character.name
                      })
                        .catch(next)
                        .then(() => {
                          res.redirect('/EveFleet.html')
                        })
                    })
                  })
                })
            }
          })
      })
  }
};