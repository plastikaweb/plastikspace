/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)',
          'CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`categoryId`)',
          'CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`inStock`)',
          'CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `inStock`,\n  `categoryId`\n)',
        ],
      },
      collection
    );

    // remove field
    collection.fields.removeById('text1579384326');

    // remove field
    collection.fields.removeById('text1843675174');

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_j7rfGWRKW8` ON `products` (`name`)',
          'CREATE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)',
          'CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`categoryId`)',
          'CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`inStock`)',
          'CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `inStock`,\n  `categoryId`\n)',
        ],
      },
      collection
    );

    // add field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text1579384326',
        max: 0,
        min: 0,
        name: 'name',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      })
    );

    // add field
    collection.fields.addAt(
      17,
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

    return app.save(collection);
  }
);
