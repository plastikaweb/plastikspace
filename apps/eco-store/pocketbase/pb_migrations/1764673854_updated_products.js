/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      18,
      new Field({
        hidden: false,
        id: 'number2709200336',
        max: null,
        min: null,
        name: 'minQuantity',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    // update field
    collection.fields.addAt(
      19,
      new Field({
        hidden: false,
        id: 'number2641765001',
        max: null,
        min: null,
        name: 'maxQuantity',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      18,
      new Field({
        hidden: false,
        id: 'number2709200336',
        max: null,
        min: null,
        name: 'min',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    // update field
    collection.fields.addAt(
      19,
      new Field({
        hidden: false,
        id: 'number2641765001',
        max: null,
        min: null,
        name: 'max',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    return app.save(collection);
  }
);
