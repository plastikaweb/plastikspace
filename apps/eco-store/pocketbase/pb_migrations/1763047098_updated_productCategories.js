/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        listRule: '',
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
        listRule: '@request.auth.record.clientId = clientId || clientId = @collection.clients.id',
      },
      collection
    );

    return app.save(collection);
  }
);
