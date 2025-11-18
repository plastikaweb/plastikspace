/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.record.clientId = client',
        deleteRule: '@request.auth.record.clientId = client',
        updateRule: '@request.auth.record.clientId = client',
      },
      collection
    );

    // add field
    collection.fields.addAt(
      6,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_2442875294',
        hidden: false,
        id: 'relation3343123541',
        maxSelect: 1,
        minSelect: 0,
        name: 'client',
        presentable: false,
        required: true,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: '',
        deleteRule: '',
        updateRule: '',
      },
      collection
    );

    // remove field
    collection.fields.removeById('relation3343123541');

    return app.save(collection);
  }
);
