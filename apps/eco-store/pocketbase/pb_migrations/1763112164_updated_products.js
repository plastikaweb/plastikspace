/// <reference path="../pb_data/types.d.ts" />
migrate(
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

    // remove field
    collection.fields.removeById('number2683508278');

    // update field
    collection.fields.addAt(
      2,
      new Field({
        hidden: false,
        id: 'bool2618758466',
        name: 'inStock',
        presentable: false,
        required: false,
        system: false,
        type: 'bool',
      })
    );

    // update field
    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: 'number1261852256',
        max: null,
        min: 0,
        name: 'stock',
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

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_j7rfGWRKW8` ON `products` (`name`)',
          'CREATE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)',
          'CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`categoryId`)',
          'CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`isAvailable`)',
          'CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `isAvailable`,\n  `categoryId`\n)',
        ],
      },
      collection
    );

    // add field
    collection.fields.addAt(
      18,
      new Field({
        hidden: false,
        id: 'number2683508278',
        max: null,
        min: 0,
        name: 'quantity',
        onlyInt: false,
        presentable: false,
        required: false,
        system: false,
        type: 'number',
      })
    );

    // update field
    collection.fields.addAt(
      2,
      new Field({
        hidden: false,
        id: 'bool2618758466',
        name: 'isAvailable',
        presentable: false,
        required: false,
        system: false,
        type: 'bool',
      })
    );

    // update field
    collection.fields.addAt(
      4,
      new Field({
        hidden: false,
        id: 'number1261852256',
        max: null,
        min: null,
        name: 'stock',
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
