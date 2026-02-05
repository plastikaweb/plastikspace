/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category,\n    c.name as name,\n    c.normalizedName as normalizedName,\n    c.color as color,\n    cg.name as groupName,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN category_groups cg ON cg.id = c.`group`\nLEFT JOIN products p ON p.category = c.id AND p.`inStock` = TRUE\nGROUP BY \n    c.id, \n    p.tenant, \n    cg.name, \n    c.name, \n    c.normalizedName, \n    c.color;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_037i")

  // remove field
  collection.fields.removeById("_clone_B0Oa")

  // remove field
  collection.fields.removeById("_clone_1EOA")

  // remove field
  collection.fields.removeById("_clone_kDbl")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_SkBq",
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
    "id": "_clone_3LEL",
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
    "id": "_clone_RKcG",
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
    "hidden": false,
    "id": "_clone_L8v4",
    "maxSize": 0,
    "name": "groupName",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "_clone_lRNh",
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
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) as id, \n    c.id as category,\n    c.name as name,\n   c.normalizedName as normalizedName,\n  c.color as color,\n    p.tenant as tenant,\n    COUNT(p.id) as totalProducts\nFROM product_categories c\nLEFT JOIN products p ON p.category = c.id AND p.`inStock` = TRUE\nGROUP BY c.id, p.tenant;"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_037i",
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
    "id": "_clone_B0Oa",
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
    "id": "_clone_1EOA",
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
    "id": "_clone_kDbl",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_SkBq")

  // remove field
  collection.fields.removeById("_clone_3LEL")

  // remove field
  collection.fields.removeById("_clone_RKcG")

  // remove field
  collection.fields.removeById("_clone_L8v4")

  // remove field
  collection.fields.removeById("_clone_lRNh")

  return app.save(collection)
})
