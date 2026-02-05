/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3411954233")

  // remove field
  collection.fields.removeById("number2497001948")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3411954233")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2497001948",
    "max": null,
    "min": 0,
    "name": "productCount",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
