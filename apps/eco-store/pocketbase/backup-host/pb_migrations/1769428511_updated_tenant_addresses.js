/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // update collection data
  unmarshal({
    "listRule": "tenant.id = @request.auth.tenant"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2442875294",
    "hidden": false,
    "id": "relation1314505826",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tenant",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  // remove field
  collection.fields.removeById("relation1314505826")

  return app.save(collection)
})
