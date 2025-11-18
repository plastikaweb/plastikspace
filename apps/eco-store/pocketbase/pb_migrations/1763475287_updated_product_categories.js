/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // remove field
    collection.fields.removeById('text1843675174');

    // add field
    collection.fields.addAt(
      6,
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
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // add field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1843675174',
        max: 0,
        min: 0,
        name: 'description',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text',
      })
    );

    // remove field
    collection.fields.removeById('json1579384326');

    return app.save(collection);
  }
);
