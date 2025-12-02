/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // add field
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

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // remove field
    collection.fields.removeById('number2709200336');

    return app.save(collection);
  }
);
