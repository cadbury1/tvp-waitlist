'use strict';

const assert = require('assert');
const eveAuthCreateSsoLink = require('../../../../src\services\EveAuth\hooks\eveAuthCreateSsoLink.js');

describe('EveAuth eveAuthCreateSsoLink hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    eveAuthCreateSsoLink()(mockHook);

    assert.ok(mockHook.eveAuthCreateSsoLink);
  });
});
