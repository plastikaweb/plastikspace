/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX idx_orders_user_created ON orders (user, created DESC)",
      "CREATE INDEX idx_orders_store_status_created ON orders (tenant, status, created DESC)",
      "CREATE INDEX `idx_orders_store_delivery` ON `orders` (\n  `tenant`,\n  `deliveryMethod`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX idx_orders_user_created ON orders (user, created DESC)",
      "CREATE INDEX idx_orders_store_status_created ON orders (tenant, status, created DESC)",
      "CREATE INDEX `idx_orders_store_delivery` ON `tenants` (\n  `tenant`,\n  `deliveryMethod`\n)"
    ]
  }, collection)

  return app.save(collection)
})
