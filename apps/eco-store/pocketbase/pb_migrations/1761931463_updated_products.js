/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.record.clientId = @request.body.clientId\n',
        deleteRule: '@request.auth.record.clientId = clientId',
        listRule: '@request.auth.record.clientId = clientId',
        updateRule: '@request.auth.record.clientId = clientId',
        viewRule: '@request.auth.record.clientId = clientId',
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
        createRule: '',
        deleteRule: null,
        listRule: null,
        updateRule: '',
        viewRule: null,
      },
      collection
    );

    return app.save(collection);
  }
);
