/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file3760176746",
    "maxSelect": 6,
    "maxSize": 5242880,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/avif"
    ],
    "name": "images",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [
      "150x150",
      "300x300",
      "660x660"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file3760176746",
    "maxSelect": 6,
    "maxSize": 5242880,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/avif"
    ],
    "name": "images",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [
      "150x150",
      "300x300",
      "620x620"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
