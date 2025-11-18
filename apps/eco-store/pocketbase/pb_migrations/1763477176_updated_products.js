/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)',
          'CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`category`)',
          'CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`inStock`)',
          'CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `inStock`,\n  `category`\n)',
        ],
      },
      collection
    );

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
        name: 'category',
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
  }
);
