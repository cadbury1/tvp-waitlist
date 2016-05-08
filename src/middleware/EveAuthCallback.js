'use strict';

const errors = require('feathers-errors')
const Href = require('../../lib/eveCrest/Href').Href
const Auth = require('../../lib/eveCrest/Auth').Auth

module.exports = function(app) {
  return function(req, res, next) {
    if(!req.query.code || !req.query.state) {
      next(new errors.BadRequest('EVE Single Sign-On Code and/or State parameters have not been provided.'))
      return
    }
    
    app.service('EveAuths').find({ query: { state: req.query.state }})
      .catch(error => next(error))
      .then(entries => {
        if (!entries.data || !entries.data[0]) {
          next(new errors.BadRequest('No matching entry of EVE Single Sign-On State found in database.'))
          return
        }

        var entry = entries.data[0]
        
        // Invalidate state to prevent double usage
        app.service('EveAuths').patch(entry._id, { state: null })
          .catch(error => next(error))
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
                next(new errors.Unavailable('EVE CREST API: Unable to find authentication entry point at ' + href.href))
                return
              }

              // Setup authentication for the CREST
              // access_token is used with this endpoint
              href.auth = new Auth()
              href.auth.loc = href
              // Setup endpoint to EVE Single sign-on
              // authorization_code or refresh_token is given to this endpoint
              // In return a new access_token for CREST is provided
              href.auth.request_auth = new Href()
              href.auth.request_auth.href = href.authEndpoint.href
              // Setup authentication for EVE Single sign-on
              // basic username and password is used to authenticate with this endpoint
              href.auth.request_auth.auth = new Auth()
              href.auth.request_auth.auth.loc = href.auth.request_auth
              // 3rd party applications are registered on https://developers.eveonline.com/
              // user and password belong to this application
              href.auth.request_auth.auth.type = 'Basic'
              href.auth.request_auth.auth.token = SECRET
              href.auth.useAuthorizationCode(req.query.code, function () {
                app.service('EveAuths').patch(entry._id, {
                  type: this.type,
                  token: this.token,
                  expire: this.expire,
                  refresh_token: this.refresh_token
                })
                  .catch(error => next(error))
                  .then(() => {
                    res.redirect('/EveFleet.html')
                  })
              }.bind(href.auth))
            })
          })
    })
  }
};