/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text73334810",
    "max": 0,
    "min": 0,
    "name": "normalizedName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

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

  // add field
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

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool1260321794",
    "name": "active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2442875294")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("text73334810")

  // remove field
  collection.fields.removeById("select2698072953")

  // remove field
  collection.fields.removeById("file3834550803")

  // remove field
  collection.fields.removeById("bool1260321794")

  return app.save(collection)
})
