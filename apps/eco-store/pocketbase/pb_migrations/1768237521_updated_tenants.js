/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select2698072953",
    "maxSelect": 3,
    "name": "languages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ca",
      "es",
      "en"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // remove field
  collection.fields.removeById("select2698072953")

  return app.save(collection)
})
