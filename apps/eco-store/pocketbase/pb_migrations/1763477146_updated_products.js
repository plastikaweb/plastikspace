/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // remove field
    collection.fields.removeById('text2528667032');

    // update field
    collection.fields.addAt(
      9,
      new Field({
        cascadeDelete: true,
        collectionId: 'pbc_3411954233',
        hidden: false,
        id: 'relation2620853105',
        maxSelect: 1,
        minSelect: 0,
        name: 'categoryId',
        presentable: false,
        required: true,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
    collection.fields.addAt(
      11,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text2528667032',
        max: 0,
        min: 0,
        name: 'categoryName',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text',
      })
    );

    // update field
    collection.fields.addAt(
      9,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_3411954233',
        hidden: false,
        id: 'relation2620853105',
        maxSelect: 1,
        minSelect: 0,
        name: 'categoryId',
        presentable: false,
        required: false,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  }
);
