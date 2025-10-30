/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text2462348188',
        max: 0,
        min: 0,
        name: 'provider',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_4092854851');

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text2462348188',
        max: 0,
        min: 0,
        name: 'provider',
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
