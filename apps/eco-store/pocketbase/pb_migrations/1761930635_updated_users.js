/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // add field
    collection.fields.addAt(
      8,
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
  },
  app => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_');

    // remove field
    collection.fields.removeById('text3927763390');

    return app.save(collection);
  }
);
