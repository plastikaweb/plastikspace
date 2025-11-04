/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.record.clientId = @request.body.clientId\n',
        deleteRule: '@request.auth.record.clientId = clientId\n',
        updateRule: '@request.auth.record.clientId = clientId\n',
        viewRule: '@request.auth.record.clientId = clientId\n',
      },
      collection
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: null,
        deleteRule: null,
        updateRule: null,
        viewRule: null,
      },
      collection
    );

    return app.save(collection);
  }
);
