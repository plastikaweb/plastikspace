/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)",
      "CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`category`)",
      "CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`inStock`)",
      "CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `inStock`,\n  `category`\n)",
      "CREATE INDEX `idx_fvmRWqAszA` ON `products` (`updated`)",
      "CREATE INDEX `idx_2hW78iTVPU` ON `products` (`normalizedName`)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": 0,
    "name": "price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_UZDWsRJbL1` ON `products` (`normalizedName`)",
      "CREATE INDEX `idx_QMLIKjBVN7` ON `products` (`category`)",
      "CREATE INDEX `idx_pcuqdsjzwH` ON `products` (`inStock`)",
      "CREATE INDEX `idx_pe3oncnQUn` ON `products` (\n  `inStock`,\n  `category`\n)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": null,
    "name": "price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
