/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1661841540');

    // update field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text3571151285',
        max: 10,
        min: 2,
        name: 'language_code',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text',
      })
    );

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_1661841540');

    // update field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text3571151285',
        max: 10,
        min: 0,
        name: 'language',
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
