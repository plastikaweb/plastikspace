/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3411954233",
        "hidden": false,
        "id": "relation306617826",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "category_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_Unh8",
        "maxSize": 0,
        "name": "category_name",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2442875294",
        "hidden": false,
        "id": "_clone_Vzs8",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "tenant",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number3398989827",
        "max": null,
        "min": null,
        "name": "totalProducts",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_316426720",
    "indexes": [],
    "listRule": null,
    "name": "product_categories_stats",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category_id,\n    c.name as category_name,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id\nGROUP BY c.id, p.tenant;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720");

  return app.delete(collection);
})
