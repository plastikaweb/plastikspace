/// <reference path="../pb_data/types.d.ts" />
migrate(
  app => {
    const collection = new Collection({
      createRule: null,
      deleteRule: null,
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text',
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1997877400',
          max: 10,
          min: 2,
          name: 'code',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text',
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text1579384326',
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text',
        },
        {
          hidden: false,
          id: 'bool458715613',
          name: 'is_active',
          presentable: false,
          required: false,
          system: false,
          type: 'bool',
        },
        {
          hidden: false,
          id: 'number4113142680',
          max: null,
          min: null,
          name: 'order',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number',
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate',
        },
        {
          hidden: false,
          id: 'autodate3332085495',
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate',
        },
      ],
      id: 'pbc_3304764897',
      indexes: ['CREATE UNIQUE INDEX `idx_UvWnDvVydE` ON `languages` (`code`)'],
      listRule: null,
      name: 'languages',
      system: false,
      type: 'base',
      updateRule: null,
      viewRule: null,
    });

    return app.save(collection);
  },
  app => {
    const collection = app.findCollectionByNameOrId('pbc_3304764897');

    return app.delete(collection);
  }
);
