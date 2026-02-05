/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "json3217087507",
    "maxSize": 0,
    "name": "features",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1219621782",
    "hidden": false,
    "id": "relation1874629670",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

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
      "700x700"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("json3217087507")

  // remove field
  collection.fields.removeById("relation1874629670")

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
      "200x200",
      "250x250",
      "300x300"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
