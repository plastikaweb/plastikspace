/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
    collection.fields.addAt(
      18,
      new Field({
        hidden: false,
        id: 'json1843675174',
        maxSize: 0,
        name: 'description',
        presentable: false,
        required: false,
        system: false,
        type: 'json',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // remove field
    collection.fields.removeById('json1843675174');

    return app.save(collection);
  }
);
