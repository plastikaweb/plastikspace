/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as categoryId,\n    c.name as name,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id AND p.`inStock` = TRUE\nGROUP BY c.id, p.tenant;"
  }, collection)

  // remove field
  collection.fields.removeById("relation306617826")

  // remove field
  collection.fields.removeById("_clone_Gq2P")

  // remove field
  collection.fields.removeById("_clone_p1rk")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3411954233",
    "hidden": false,
    "id": "relation2620853105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "categoryId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_3CAD",
    "maxSize": 0,
    "name": "name",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "_clone_WPdh",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category_id,\n    c.name as category_name,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id\nGROUP BY c.id, p.tenant;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
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
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_Gq2P",
    "maxSize": 0,
    "name": "category_name",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "_clone_p1rk",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation2620853105")

  // remove field
  collection.fields.removeById("_clone_3CAD")

  // remove field
  collection.fields.removeById("_clone_WPdh")

  return app.save(collection)
})
