/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
    collection.fields.addAt(
      19,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_2442875294',
        hidden: false,
        id: 'relation3343123541',
        maxSelect: 1,
        minSelect: 0,
        name: 'client',
        presentable: false,
        required: false,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // remove field
    collection.fields.removeById('relation3343123541');

    return app.save(collection);
  }
);
