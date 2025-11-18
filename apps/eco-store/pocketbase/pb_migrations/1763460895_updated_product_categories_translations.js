/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1661841540');

    // update field
    collection.fields.addAt(
      1,
      new Field({
        cascadeDelete: true,
        collectionId: 'pbc_3411954233',
        hidden: false,
        id: 'relation3194553341',
        maxSelect: 1,
        minSelect: 0,
        name: 'product_category',
        presentable: false,
        required: true,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1661841540');

    // update field
    collection.fields.addAt(
      1,
      new Field({
        cascadeDelete: true,
        collectionId: 'pbc_3411954233',
        hidden: false,
        id: 'relation3194553341',
        maxSelect: 1,
        minSelect: 0,
        name: 'product_category_id',
        presentable: false,
        required: true,
        system: false,
        type: 'relation',
      })
    );

    return app.save(collection);
  }
);
