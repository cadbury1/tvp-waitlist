'use strict';

// src\services\EveAuth\hooks\eveAuthCreateSsoLink.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    // on EveAuth.Create return only the SSO link
    hook.result = {
      ssoLink: 'https://login.eveonline.com/oauth/authorize/'                       +
        '?response_type=' + 'code'                                                  +
        '&redirect_uri='  + encodeURIComponent(hook.app.get('eveAppCallbackUrl')  ) +
        '&client_id='     + encodeURIComponent(hook.app.get('eveAppClientId')     ) +
        '&scope='         + encodeURIComponent((hook.result.scope || []).join(',')) +
        '&state='         + encodeURIComponent(hook.result.state                  )
    }
  };
};
