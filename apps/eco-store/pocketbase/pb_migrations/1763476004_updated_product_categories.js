/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_jJcNH78j9b` ON `product_categories` (`normalizedName`)',
        ],
      },
      collection
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        indexes: ['CREATE INDEX `idx_jJcNH78j9b` ON `product_categories` (`normalizedName`)'],
      },
      collection
    );

    return app.save(collection);
  }
);
