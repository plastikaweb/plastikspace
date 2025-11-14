/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
    collection.fields.addAt(
      17,
      new Field({
        hidden: false,
        id: 'number670597680',
        max: null,
        min: 0,
        name: 'reviewsCount',
        onlyInt: true,
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

    // remove field
    collection.fields.removeById('number670597680');

    return app.save(collection);
  }
);
