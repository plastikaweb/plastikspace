/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file3834550803",
    "maxSelect": 1,
    "maxSize": 2621440,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/bmp",
      "image/avif",
      "image/bpg"
    ],
    "name": "logo",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "40x40",
      "150x150",
      "300x300"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file3834550803",
    "maxSelect": 1,
    "maxSize": 2621440,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/bmp",
      "image/avif",
      "image/bpg"
    ],
    "name": "logo",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "30x30",
      "50x50",
      "100x100",
      "300x300"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
