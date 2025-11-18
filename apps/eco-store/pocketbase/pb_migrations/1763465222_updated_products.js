/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        listRule: '',
        viewRule: '',
      },
      collection
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        listRule: '@request.auth.record.clientId = clientId',
        viewRule: '@request.auth.record.clientId = clientId',
      },
      collection
    );

    return app.save(collection);
  }
);
