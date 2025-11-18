/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // add field
    collection.fields.addAt(
      7,
      new Field({
        hidden: false,
        id: 'json4063447360',
        maxSize: 0,
        name: 'names',
        presentable: false,
        required: false,
        system: false,
        type: 'json',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // remove field
    collection.fields.removeById('json4063447360');

    return app.save(collection);
  }
);
