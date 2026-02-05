/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category,\n    c.name as name,\n   c.normalizedName as normalizedName,\n  c.color as color,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id AND p.`inStock` = TRUE\nGROUP BY c.id, p.tenant;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_njPQ")

  // remove field
  collection.fields.removeById("_clone_xYgO")

  // remove field
  collection.fields.removeById("_clone_Gutz")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_b7WZ",
    "maxSize": 0,
    "name": "name",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_D0RH",
    "max": 0,
    "min": 0,
    "name": "normalizedName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_atnR",
    "max": 0,
    "min": 0,
    "name": "color",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "_clone_PM7J",
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
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category,\n    c.name as name,\n   c.normalizedName as normalizedName,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id AND p.`inStock` = TRUE\nGROUP BY c.id, p.tenant;"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_njPQ",
    "maxSize": 0,
    "name": "name",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_xYgO",
    "max": 0,
    "min": 0,
    "name": "normalizedName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "_clone_Gutz",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_b7WZ")

  // remove field
  collection.fields.removeById("_clone_D0RH")

  // remove field
  collection.fields.removeById("_clone_atnR")

  // remove field
  collection.fields.removeById("_clone_PM7J")

  return app.save(collection)
})
