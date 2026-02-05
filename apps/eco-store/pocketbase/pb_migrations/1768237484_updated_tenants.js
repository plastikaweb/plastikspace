/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // remove field
  collection.fields.removeById("relation2698072953")

  // remove field
  collection.fields.removeById("file3834550803")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3304764897",
    "hidden": false,
    "id": "relation2698072953",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "languages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file3834550803",
    "maxSelect": 1,
    "maxSize": 2621440,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/vnd.mozilla.apng",
      "image/webp",
      "image/avif",
      "image/svg+xml"
    ],
    "name": "logo",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "30x30",
      "100x100",
      "300x300",
      "500x500"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
