/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        createRule: '',
        indexes: [
          'CREATE UNIQUE INDEX `idx_j7rfGWRKW8` ON `products` (`name`)',
          'CREATE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)',
          'CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`categoryId`)',
          'CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`isAvailable`)',
          'CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `isAvailable`,\n  `categoryId`\n)',
        ],
        updateRule: '',
      },
      collection
    );

    // update field
    collection.fields.addAt(
      13,
      new Field({
        hidden: false,
        id: 'number946921979',
        max: null,
        min: 0,
        name: 'unitBase',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

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
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        createRule: null,
        indexes: [],
        updateRule: null,
      },
      collection
    );

    // update field
    collection.fields.addAt(
      13,
      new Field({
        hidden: false,
        id: 'number946921979',
        max: null,
        min: null,
        name: 'unitBase',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    // update field
    collection.fields.addAt(
      14,
      new Field({
        hidden: false,
        id: 'select1947879603',
        maxSelect: 1,
        name: 'unitType',
        presentable: false,
        required: false,
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
