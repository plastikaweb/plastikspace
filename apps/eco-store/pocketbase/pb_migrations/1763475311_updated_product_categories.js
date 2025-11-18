/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // add field
    collection.fields.addAt(
      7,
      new Field({
        hidden: false,
        id: 'json1843675174',
        maxSize: 0,
        name: 'description',
        presentable: false,
        required: true,
        system: false,
        type: 'json',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // remove field
    collection.fields.removeById('json1843675174');

    return app.save(collection);
  }
);
