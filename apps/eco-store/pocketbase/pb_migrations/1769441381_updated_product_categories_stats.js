/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "listRule": "tenant = @request.query.tenant"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_Unh8")

  // remove field
  collection.fields.removeById("_clone_Vzs8")

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_316426720")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "_clone_Unh8",
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
    "id": "_clone_Vzs8",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_Gq2P")

  // remove field
  collection.fields.removeById("_clone_p1rk")

  return app.save(collection)
})
