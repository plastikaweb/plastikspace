/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // add field
    collection.fields.addAt(
      7,
      new Field({
        cascadeDelete: true,
        collectionId: 'pbc_2445876889',
        hidden: false,
        id: 'relation1841317061',
        maxSelect: 1,
        minSelect: 0,
        name: 'group',
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

    // remove field
    collection.fields.removeById('relation1841317061');

    return app.save(collection);
  }
);
