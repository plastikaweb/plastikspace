/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // remove field
  collection.fields.removeById("text2575139115")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "json2575139115",
    "maxSize": 0,
    "name": "instructions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1381829198")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2575139115",
    "max": 0,
    "min": 0,
    "name": "instructions",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("json2575139115")

  return app.save(collection)
})
