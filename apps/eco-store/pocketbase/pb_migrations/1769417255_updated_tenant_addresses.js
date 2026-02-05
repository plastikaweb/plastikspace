/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "json3363059152",
    "maxSize": 0,
    "name": "slots",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // remove field
  collection.fields.removeById("json3363059152")

  return app.save(collection)
})
