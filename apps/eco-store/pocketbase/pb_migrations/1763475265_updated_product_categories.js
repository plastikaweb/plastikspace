/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        indexes: ['CREATE INDEX `idx_jJcNH78j9b` ON `product_categories` (`normalizedName`)'],
      },
      collection
    );

    // remove field
    collection.fields.removeById('text1579384326');

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3411954233');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE UNIQUE INDEX `idx_TunC6gkCiK` ON `product_categories` (`name`)',
          'CREATE INDEX `idx_jJcNH78j9b` ON `product_categories` (`normalizedName`)',
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
        min: 1,
        name: 'name',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      })
    );

    return app.save(collection);
  }
);
