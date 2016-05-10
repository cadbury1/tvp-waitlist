'use strict';

const assert = require('assert');
const eveFleetValidation = require('../../../../src\services\EveFleet\hooks\eveFleetValidation.js');

describe('EveFleet eveFleetValidation hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    eveFleetValidation()(mockHook);

    assert.ok(mockHook.eveFleetValidation);
  });
});
