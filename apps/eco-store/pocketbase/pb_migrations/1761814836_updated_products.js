/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      14,
      new Field({
        hidden: false,
        id: 'select1947879603',
        maxSelect: 1,
        name: 'unitType',
        presentable: false,
        required: true,
        system: false,
        type: 'select',
        values: [
          'unitWithFixedWeight',
          'unit',
          'weight',
          'unitWithFixedVolume',
          'unitWithVariableWeight',
          'unitWithVariableVolume',
        ],
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      14,
      new Field({
        hidden: false,
        id: 'select1947879603',
        maxSelect: 1,
        name: 'unitType',
        presentable: false,
        required: true,
        system: false,
        type: 'select',
        values: [
          'unitWithFixedWeight',
          'unit',
          'weight',
          'unitWithFixedVolume',
          'unitWithVariableWeight',
        ],
      })
    );

    return app.save(collection);
  }
);
