'use strict';

const assert = require('assert');
const eveAuthGenerateState = require('../../../../src\services\EveAuth\hooks\eveAuthGenerateState.js');

describe('EveAuth eveAuthGenerateState hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    eveAuthGenerateState()(mockHook);

    assert.ok(mockHook.eveAuthGenerateState);
  });
});
