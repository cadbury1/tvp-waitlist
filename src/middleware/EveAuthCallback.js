'use strict';

const Href = require('eveCrest/Href').Href
const Auth = require('eveCrest/Auth').Auth

module.exports = function(app) {
  return function(req, res, next) {
    if(!req.query.code || !req.query.state) {
      next(new app.errors.BadRequest('EVE Single Sign-On Code and/or State parameters have not been provided.'))
      return
    }
    
    app.service('EveAuth').find({ query: { state: req.query.state }})
      .then(entries => {
        if (!entries.data || !entries.data[0]) {
          next(new app.errors.BadRequest('No matching entry of EVE Single Sign-On State found in database.'))
          return
        }

        var entry = entries.data[0]
        
        // Invalidate state to prevent double usage
        app.service('EveAuth').patch(entry.id, { state: null })
          .then(entry => {
            // Setup root container for any CREST activity
            var href = new Href()
            //   Set root container as a reference to itself
            href.root_href = href
            //   Setup CREST entry point URL
            href.href = 'https://crest-tq.eveonline.com/'
            //    Start first test request
            href.get(function () {
              // Check if request finished successfully
              // https://crest-tq.eveonline.com/authEndpoint/ will link to EVE Single sign-on service and is expected to be always there
              if (!href.authEndpoint) {
                next(new app.errors.Unavailable('EVE CREST API: Unable to find authentication entry point at ' + href.href))
                return
              }

              // Setup access_token authentication for the CREST URL
              href.auth = new Auth()
              href.auth.loc = href
              // Setup refresh_token authentication for the EVE Single sign-on
              href.auth.request_auth = new Href()
              href.auth.request_auth.href = href.authEndpoint.href
              href.auth.request_auth.auth = new Auth()
              href.auth.request_auth.auth.loc = href.auth.request_auth
              href.auth.request_auth.auth.type = 'Basic'
              href.auth.request_auth.auth.token = SECRET
              href.auth.authorization_code = req.query.code
              href.auth.useAuthorizationCode(function () {
                app.service('users').patch(user.id, {
                  type: href.auth.type,
                  token: href.auth.token,
                  expire: href.auth.expire,
                  refresh_token: href.auth.refresh_token
                })
              })
            })
          })
    })
  }
};