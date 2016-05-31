'use strict';

const DECODE = 'https://crest-tq.eveonline.com/decode/'

const errors = require('feathers-errors')
const Href = require('../../lib/eveCrest/Href').Href
const Auth = require('../../lib/eveCrest/Auth').Auth
const AuthError = require('../../lib/eveCrest/Auth').AuthError

module.exports = function(app) {
  var userService = app.service('users')
  var authService = app.service('EveAuths')
  var charService = app.service('chars')
  
  return function(req, res, next) {
    if(!req.query.code || !req.query.state) {
      next(new errors.BadRequest('EVE Single Sign-On Code and/or State parameters have not been provided.'))
      return
    }
    
    authService.find({query: {state: req.query.state}})
      .catch(next)
      .then(entries => {
        if (!entries.data[0]) {
          next(new errors.BadRequest('No matching entry of EVE Single Sign-On State found in database.'))
          return
        }
        
        // every error after this line would be programming error, user is not interessted in those
        res.write('<script>close()</script>')
        
        var entry = entries.data[0]
        
        // Invalidate state to prevent double usage
        authService.patch(entry._id, {
          state: null,
          userId: null
        })

        var userProm = userService.get(entry.userId)

        var store = {}
        var href
        var crestProm = new Promise(fulfill => {
          href = Href.forEveCrest(
            DECODE,
            Buffer.from(app.get('eveAppClientId') + ':' + app.get('eveAppSecretKey')).toString('base64'),
            store
          )
          // Using the auth code get token for eve crest
          href.auth.useAuthorizationCode(req.query.code, () => {
            href.get(() => {
              href.character.get(() => {
                // Get eve character details, do we know this eve character alraedy?
                charService.find({ query: { name: href.character.name }})
                  .then(fulfill)
              })
            })
          })
        })

        Promise.all([userProm, crestProm])
          .then(results => {
            var user = results[0]
            var chars = results[1]
            
            if(!chars.data || !chars.data[0]) {
              // Eve character unknown
              
              if (!user.charGroup) {
                // New Eve char and website user has no charGroup
                // Assign default charGroup
                user.charGroup = user._id
                userService.patch(user._id, { charGroup: user.charGroup })
              }
              
              // Register new Eve character  
              charService.create({
                  name: href.character.name,
                avatar: href.character.portrait['32x32'].href,
                 group: user.charGroup
              })
                .then(saveTokenAndCharIdForEveAuth)
            } else {
              // Eve character already known
              var char = chars.data[0]
              
              if (!user.charGroup)
                // Website user opens this char group...
                userService.patch(user._id, { charGroup: char.group })
              else
                // Eve character switches to current website user's char group...
                // TODO Account sharing is prohibited by CCP EVE EULA
                charService.patch(char._id, { group: user.charGroup })

              saveTokenAndCharIdForEveAuth(char)
            }
          })

        function saveTokenAndCharIdForEveAuth(char) {
          // Got token for eve crest, saving them
          authService.patch(entry._id, {
            store: store['auth ' + DECODE],
            charId: char._id
          })
        }
      })
  }
};