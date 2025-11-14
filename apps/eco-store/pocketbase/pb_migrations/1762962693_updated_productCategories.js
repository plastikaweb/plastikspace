/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        viewRule: '@request.auth.record.clientId = clientId || clientId = @collection.clients.id\n',
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
        viewRule: '@request.auth.record.clientId = clientId\n',
      },
      collection
    );

    return app.save(collection);
  }
);
