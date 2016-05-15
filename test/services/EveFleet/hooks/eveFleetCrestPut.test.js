'use strict';

const assert = require('assert');
const eveFleetCrestPut = require('../../../../src\services\EveFleet\hooks\eveFleetCrestPut.js');

describe('EveFleet eveFleetCrestPut hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    eveFleetCrestPut()(mockHook);

    assert.ok(mockHook.eveFleetCrestPut);
  });
});
