/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
    collection.fields.addAt(
      17,
      new Field({
        hidden: false,
        id: 'json1579384326',
        maxSize: 0,
        name: 'name',
        presentable: false,
        required: true,
        system: false,
        type: 'json',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // remove field
    collection.fields.removeById('json1579384326');

    return app.save(collection);
  }
);
