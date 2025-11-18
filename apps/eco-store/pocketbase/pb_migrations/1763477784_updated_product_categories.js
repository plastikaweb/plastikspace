/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: '',
        deleteRule: '',
        updateRule: '',
        viewRule: '',
      },
      collection
    );

    // remove field
    collection.fields.removeById('text3927763390');

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.record.clientId = @request.body.clientId\n',
        deleteRule: '@request.auth.record.clientId = clientId\n',
        updateRule: '@request.auth.record.clientId = clientId\n',
        viewRule: '@request.auth.record.clientId = clientId || clientId = @collection.clients.id\n',
      },
      collection
    );

    // add field
    collection.fields.addAt(
      4,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text3927763390',
        max: 0,
        min: 0,
        name: 'clientId',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      })
    );

    return app.save(collection);
  }
);
